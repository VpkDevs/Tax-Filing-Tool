let memory = 0;
let calculationHistory = [];

// Fetch calculation history from the server
function fetchHistory(category = '') {
    const url = category ? `/api/history?category=${category}` : '/api/history';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            calculationHistory = data.history || [];
            displayHistory();
        })
        .catch(error => {
            console.error('Error fetching history:', error);
        });
}

// Display history in the UI
function displayHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (calculationHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'history-empty';
        emptyItem.textContent = 'No calculation history';
        historyList.appendChild(emptyItem);
        return;
    }

    calculationHistory.forEach(item => {
        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';

        const expression = document.createElement('div');
        expression.className = 'history-expression';
        expression.textContent = item.expression;

        const result = document.createElement('div');
        result.className = 'history-result';
        result.textContent = item.result;

        const category = document.createElement('span');
        category.className = 'history-category';
        category.textContent = item.category;

        const timestamp = document.createElement('span');
        timestamp.className = 'history-timestamp';
        const date = new Date(item.timestamp);
        timestamp.textContent = date.toLocaleString();

        const useButton = document.createElement('button');
        useButton.className = 'history-use-btn';
        useButton.textContent = 'Use';
        useButton.onclick = () => {
            document.getElementById('expression').value = item.expression;
        };

        historyItem.appendChild(expression);
        historyItem.appendChild(result);
        historyItem.appendChild(category);
        historyItem.appendChild(timestamp);
        historyItem.appendChild(useButton);

        historyList.appendChild(historyItem);
    });
}

function appendNumber(num) {
    const expression = document.getElementById('expression');
    expression.value += num;
}

function insertOperator(op) {
    const expression = document.getElementById('expression');
    expression.value += op;
}

function insertFunction(func) {
    const expression = document.getElementById('expression');
    expression.value += `${func}(`;
}

function insertConstant(constant) {
    const expression = document.getElementById('expression');
    expression.value += constant;
}

function clearDisplay() {
    document.getElementById('expression').value = '';
    document.getElementById('result').innerText = '';
}

function clearEntry() {
    const expression = document.getElementById('expression');
    expression.value = expression.value.slice(0, -1);
}

function backspace() {
    const expression = document.getElementById('expression');
    expression.value = expression.value.slice(0, -1);
}

function memoryOperation(op) {
    const result = document.getElementById('result');
    const currentValue = parseFloat(result.innerText) || 0;

    switch(op) {
        case 'MC':
            memory = 0;
            break;
        case 'MR':
            document.getElementById('expression').value = memory;
            break;
        case 'M+':
            memory += currentValue;
            break;
        case 'M-':
            memory -= currentValue;
            break;
    }
}

function addToHistory(expression, result) {
    history.unshift({ expression, result });
    if (history.length > 10) history.pop();

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = history.map(item =>
        `<li>${item.expression} = ${item.result}</li>`
    ).join('');
}

// Add new helper functions
function formatArray(arr) {
    return '[' + arr.join(', ') + ']';
}

function getSelectedText() {
    const expression = document.getElementById('expression');
    return expression.value.substring(expression.selectionStart, expression.selectionEnd);
}

async function calculate() {
    let expression = document.getElementById('expression').value;
    const resultDisplay = document.getElementById('result');

    // Handle array inputs
    if (expression.includes('[')) {
        expression = expression.replace(/\[([\d\s,]+)\]/g, (match, contents) => {
            return `[${parseArrayInput(contents)}]`;
        });
    }

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expression })
        });

        const data = await response.json();

        if (data.error) {
            resultDisplay.innerText = 'Error';
            return;
        }

        resultDisplay.innerText = data.result;
        addToHistory(expression, data.result);

    } catch (error) {
        resultDisplay.innerText = 'Error';
        console.error('Calculation error:', error);
    }
}

// Add new feature to handle array inputs
function parseArrayInput(input) {
    return input.split(',').map(x => parseFloat(x.trim()));
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/[0-9.]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '^'].includes(key)) {
        insertOperator(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    }

    // Add array input support
    if (event.key === '[') {
        event.preventDefault();
        appendNumber('[');
    } else if (event.key === ']') {
        event.preventDefault();
        appendNumber(']');
    } else if (event.key === ',') {
        event.preventDefault();
        appendNumber(', ');
    }
});

// Add tooltip and guide system
const calculatorGuides = {
    compound_interest: {
        title: 'Compound Interest',
        levels: {
            basic: {
                description: 'Money grows by earning interest on previously earned interest',
                formula: 'P(1 + r/n)^(nt)',
                example: 'compound_interest(1000, 0.05, 1)',
                explanation: 'Invest $1,000 for 1 year at 5% interest',
                useCase: 'Savings accounts, investments'
            },
            intermediate: {
                description: 'Your money grows faster because you earn interest not just on your initial investment, but also on all the interest you've previously earned',
                formula: {
                    breakdown: [
                        'P = Your starting money (Principal)',
                        'r = Interest rate (as decimal)',
                        'n = Times per year interest is added',
                        't = Number of years'
                    ],
                    visual: 'graph_compound_vs_simple'
                },
                examples: [
                    {
                        scenario: 'Monthly Savings',
                        setup: 'compound_interest(1000, 0.05, 5, 12)',
                        explanation: '$1,000 saved with 5% interest, compounded monthly for 5 years',
                        result: '$1,283.36'
                    },
                    {
                        scenario: 'Daily vs Annual',
                        comparison: {
                            daily: 'compound_interest(1000, 0.05, 1, 365)',
                            annual: 'compound_interest(1000, 0.05, 1, 1)',
                            difference: 'See how daily compounding earns slightly more!'
                        }
                    }
                ],
                commonMistakes: [
                    'Forgetting to convert percentage to decimal',
                    'Mixing up compounding frequency'
                ]
            },
            advanced: {
                conceptBreakdown: {
                    title: "Let's Break This Down Like You're Five",
                    analogy: {
                        setup: "Imagine you have a magical apple tree",
                        explanation: [
                            "1. You start with one apple tree (your principal)",
                            "2. Each apple tree makes new baby trees (interest)",
                            "3. These new trees ALSO make baby trees (compound effect)",
                            "4. The more trees you have, the more new trees you get (exponential growth)"
                        ],
                        visual: 'tree_growth_animation'
                    }
                },
                detailedExample: {
                    scenario: "Sarah's College Fund",
                    initial: "$1,000 birthday money",
                    timeline: [
                        { year: 0, amount: 1000, explanation: "Starting amount" },
                        { year: 1, amount: 1051.16, explanation: "First year: Interest earned on initial $1,000" },
                        { year: 2, amount: 1105.06, explanation: "Second year: Interest earned on $1,051.16" },
                        // ... more years
                    ],
                    visual: 'sarah_fund_growth_chart'
                },
                interactiveDemo: {
                    type: 'slider_demo',
                    variables: [
                        {
                            name: 'Principal',
                            range: [100, 10000],
                            defaultValue: 1000
                        },
                        {
                            name: 'Interest Rate',
                            range: [0.01, 0.20],
                            defaultValue: 0.05
                        },
                        {
                            name: 'Years',
                            range: [1, 30],
                            defaultValue: 5
                        }
                    ]
                },
                terminology: {
                    principal: "The initial amount you start with (your seed money)",
                    interest_rate: "The percentage your money grows by (like a growth speed)",
                    compounding_frequency: "How often the interest is added to your principal (like harvesting seasons)",
                    APR: "Annual Percentage Rate - the basic interest rate for one year",
                    APY: "Annual Percentage Yield - what you actually earn after compounding"
                },
                realWorldApplications: [
                    {
                        scenario: "Retirement Savings",
                        example: "Starting at age 25 with $5,000...",
                        calculation: "compound_interest(5000, 0.07, 40, 12)"
                    },
                    {
                        scenario: "Student Loan Debt",
                        example: "Borrowing $20,000 at 6.8%...",
                        calculation: "compound_interest(20000, 0.068, 10, 12)"
                    }
                ],
                commonQuestions: [
                    {
                        q: "Why does more frequent compounding earn more money?",
                        a: "Think of it like planting trees. The sooner you plant new trees, the sooner they can produce their own seeds..."
                    },
                    // ... more Q&A
                ]
            }
        }
    },
    roi: {
        title: 'Return on Investment (ROI)',
        description: 'Measures the profitability of an investment',
        formula: '((Gain - Cost) / Cost) × 100',
        parameters: {
            gain: 'Total value after investment',
            cost: 'Initial investment amount'
        },
        example: 'roi(1500, 1000)',
        useCase: 'Use for: Evaluating investment performance, comparing investment options',
        tip: 'Higher ROI doesn't always mean better - consider risk and time period'
    },
    // Add entries for all financial functions...
};

function showGuide(functionName, level = 'basic') {
    const guide = calculatorGuides[functionName];
    if (!guide) return;

    const modal = document.createElement('div');
    modal.className = 'guide-modal';

    const content = guide.levels[level];

    modal.innerHTML = `
        <div class="guide-content level-${level}">
            <div class="guide-header">
                <h2>${guide.title}</h2>
                <div class="level-selector">
                    <button class="${level === 'basic' ? 'active' : ''}"
                            onclick="showGuide('${functionName}', 'basic')">
                        Basic
                    </button>
                    <button class="${level === 'intermediate' ? 'active' : ''}"
                            onclick="showGuide('${functionName}', 'intermediate')">
                        Tell Me More
                    </button>
                    <button class="${level === 'advanced' ? 'active' : ''}"
                            onclick="showGuide('${functionName}', 'advanced')">
                        Help Me Really Understand This
                    </button>
                </div>
            </div>

            ${renderContent(content, level)}

            <button class="close-guide" onclick="this.parentElement.parentElement.remove()">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

function renderContent(content, level) {
    switch(level) {
        case 'basic':
            return `
                <div class="basic-explanation">
                    <p>${content.description}</p>
                    <div class="quick-example">
                        <code>${content.example}</code>
                        <p>${content.explanation}</p>
                    </div>
                </div>
            `;

        case 'intermediate':
            return `
                <div class="intermediate-explanation">
                    <p>${content.description}</p>
                    <div class="formula-breakdown">
                        ${content.formula.breakdown.map(line => `<div>${line}</div>`).join('')}
                    </div>
                    <div class="examples-section">
                        ${content.examples.map(ex => renderExample(ex)).join('')}
                    </div>
                    <div class="mistakes-section">
                        <h4>Common Mistakes to Avoid</h4>
                        <ul>
                            ${content.commonMistakes.map(mistake => `<li>${mistake}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

        case 'advanced':
            return `
                <div class="advanced-explanation">
                    <div class="analogy-section">
                        <h3>${content.conceptBreakdown.title}</h3>
                        <div class="analogy">
                            <p>${content.conceptBreakdown.analogy.setup}</p>
                            <ul>
                                ${content.conceptBreakdown.analogy.explanation
                                    .map(step => `<li>${step}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="interactive-section">
                        ${renderInteractiveDemo(content.interactiveDemo)}
                    </div>

                    <div class="terminology-section">
                        <h3>Terms You Should Know</h3>
                        ${Object.entries(content.terminology)
                            .map(([term, def]) => `
                                <div class="term">
                                    <strong>${term}:</strong> ${def}
                                </div>
                            `).join('')}
                    </div>

                    <div class="real-world-section">
                        <h3>Real World Examples</h3>
                        ${content.realWorldApplications
                            .map(app => renderRealWorldExample(app)).join('')}
                    </div>
                </div>
            `;
    }
}

function insertExample(example) {
    document.getElementById('expression').value = example;
}

// Enhance existing calculator buttons with guides
document.addEventListener('DOMContentLoaded', () => {
    const finButtons = document.querySelectorAll('.fin-btn');
    finButtons.forEach(button => {
        const functionName = button.getAttribute('onclick')
            .match(/insertFunction\('(.+)'\)/)[1];

        // Add help icon and tooltip
        const helpIcon = document.createElement('span');
        helpIcon.innerHTML = ' ℹ️';
        helpIcon.className = 'help-icon';
        helpIcon.onclick = (e) => {
            e.stopPropagation();
            showGuide(functionName);
        };
        button.appendChild(helpIcon);
    });
});

// Tab functionality
function openTab(evt, tabName) {
    // Hide all tab content
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    // Remove active class from all tab buttons
    const tabButtons = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
    }

    // Show the selected tab and add active class to the button
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

// Guided calculator functionality
function showGuidedCalculator(calculatorId) {
    const modal = document.getElementById('guided-calculator-modal');
    const title = document.getElementById('guided-calculator-title');
    const content = document.getElementById('guided-calculator-content');
    const stepIndicator = document.getElementById('step-indicator');

    // Set calculator title based on ID
    title.textContent = formatCalculatorTitle(calculatorId);

    // Load calculator content
    const calculatorContent = getCalculatorContent(calculatorId);
    content.innerHTML = calculatorContent.steps[0];

    // Set up step navigation
    let currentStep = 0;
    const totalSteps = calculatorContent.steps.length;
    stepIndicator.textContent = `Step ${currentStep + 1} of ${totalSteps}`;

    // Set up navigation buttons
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const calculateBtn = document.getElementById('calculate-result');
    const saveBtn = document.getElementById('save-to-expression');

    prevBtn.disabled = currentStep === 0;
    nextBtn.disabled = currentStep === totalSteps - 1;
    calculateBtn.disabled = currentStep !== totalSteps - 1;

    // Navigation event handlers
    prevBtn.onclick = () => {
        if (currentStep > 0) {
            currentStep--;
            content.innerHTML = calculatorContent.steps[currentStep];
            stepIndicator.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
            prevBtn.disabled = currentStep === 0;
            nextBtn.disabled = false;
            calculateBtn.disabled = true;
        }
    };

    nextBtn.onclick = () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            content.innerHTML = calculatorContent.steps[currentStep];
            stepIndicator.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
            prevBtn.disabled = false;
            nextBtn.disabled = currentStep === totalSteps - 1;
            calculateBtn.disabled = currentStep !== totalSteps - 1;
        }
    };

    // Calculate button handler
    calculateBtn.onclick = () => {
        // Get input values from form
        const inputs = {};
        const formElements = content.querySelectorAll('input, select');
        formElements.forEach(element => {
            inputs[element.id] = element.value;
        });

        // Calculate result using the appropriate function
        const result = calculatorContent.calculate(inputs);

        // Display result
        const resultElement = document.createElement('div');
        resultElement.className = 'calculator-result';
        resultElement.innerHTML = formatResult(result);
        content.appendChild(resultElement);

        // Enable save button
        saveBtn.disabled = false;
        saveBtn.onclick = () => {
            // Format result as expression
            const expression = document.getElementById('expression');
            expression.value += formatResultAsExpression(result, calculatorId);
            closeModal();
        };
    };

    // Close button handler
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.onclick = closeModal;

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Show modal
    modal.style.display = 'block';

    function closeModal() {
        modal.style.display = 'none';
    }
}

function formatCalculatorTitle(id) {
    // Convert kebab-case to Title Case
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatResult(result) {
    // Format result object as HTML
    if (typeof result === 'number') {
        return `<h4>Result</h4><p class="result-value">${result.toFixed(2)}</p>`;
    }

    let html = '<h4>Results</h4><div class="result-table">';
    for (const [key, value] of Object.entries(result)) {
        const formattedKey = key.replace(/_/g, ' ');
        const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
        html += `<div class="result-row"><span>${formattedKey}:</span><span>${formattedValue}</span></div>`;
    }
    html += '</div>';
    return html;
}

function formatResultAsExpression(result, calculatorId) {
    // Format result as calculator expression
    if (typeof result === 'number') {
        return result.toString();
    }

    // For complex results, return the most relevant value
    switch (calculatorId) {
        case 'loan-payment':
            return result.monthly_payment.toString();
        case 'investment-goal':
            return result.required_investment.toString();
        case 'retirement-savings-goal':
            return result.required_savings.toString();
        default:
            // Try to find a total or final value
            for (const key of ['total', 'result', 'value', 'amount']) {
                if (result[key]) {
                    return result[key].toString();
                }
            }
            // Return the first numeric value
            for (const value of Object.values(result)) {
                if (typeof value === 'number') {
                    return value.toString();
                }
            }
            return '0';
    }
}

function getCalculatorContent(calculatorId) {
    // Return calculator content based on ID
    const calculators = {
        'loan-payment': {
            steps: [
                `<div class="calculator-step">
                    <h4>Loan Details</h4>
                    <div class="input-group">
                        <label for="loan-amount">Loan Amount ($)</label>
                        <input type="number" id="loan-amount" value="100000">
                    </div>
                    <div class="input-group">
                        <label for="loan-rate">Interest Rate (%)</label>
                        <input type="number" id="loan-rate" value="4.5" step="0.1">
                    </div>
                    <div class="input-group">
                        <label for="loan-term">Loan Term (years)</label>
                        <input type="number" id="loan-term" value="30">
                    </div>
                </div>`,
                `<div class="calculator-step">
                    <h4>Additional Options</h4>
                    <div class="input-group">
                        <label for="extra-payment">Extra Monthly Payment ($)</label>
                        <input type="number" id="extra-payment" value="0">
                    </div>
                    <div class="input-group">
                        <label for="payment-frequency">Payment Frequency</label>
                        <select id="payment-frequency">
                            <option value="12">Monthly</option>
                            <option value="26">Bi-weekly</option>
                            <option value="52">Weekly</option>
                        </select>
                    </div>
                </div>`
            ],
            calculate: (inputs) => {
                const principal = parseFloat(inputs['loan-amount']);
                const rate = parseFloat(inputs['loan-rate']) / 100;
                const years = parseFloat(inputs['loan-term']);
                const extraPayment = parseFloat(inputs['extra-payment']);
                const frequency = parseInt(inputs['payment-frequency']);

                // Calculate monthly payment
                const monthlyRate = rate / 12;
                const totalPayments = years * 12;
                const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);

                // Calculate with extra payments
                let balance = principal;
                let months = 0;
                let totalInterest = 0;

                while (balance > 0 && months < totalPayments) {
                    months++;
                    const interestPayment = balance * monthlyRate;
                    totalInterest += interestPayment;

                    let principalPayment = monthlyPayment - interestPayment;
                    if (months % (12 / frequency) === 0) {
                        principalPayment += extraPayment;
                    }

                    if (principalPayment > balance) {
                        principalPayment = balance;
                    }

                    balance -= principalPayment;
                }

                return {
                    monthly_payment: monthlyPayment,
                    total_payments: months,
                    total_interest: totalInterest,
                    total_cost: principal + totalInterest,
                    years_saved: (totalPayments - months) / 12
                };
            }
        },
        // Add more calculators here
    };

    // Return the requested calculator or a default one
    return calculators[calculatorId] || {
        steps: [
            `<div class="calculator-step">
                <h4>Coming Soon</h4>
                <p>This calculator is under development. Please check back later.</p>
            </div>`
        ],
        calculate: () => ({ message: 'Calculator not implemented yet' })
    };
}

// Add to history function
function addToHistory(expression, result) {
    const historyList = document.getElementById('history-list');
    const historyItem = document.createElement('li');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-expression">${expression}</div>
        <div class="history-result">${result}</div>
        <button class="history-use" onclick="useHistoryItem('${expression}')">Use</button>
    `;
    historyList.prepend(historyItem);

    // Limit history to 10 items
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }

    // Save history to local storage
    history.push({ expression, result });
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Use history item
function useHistoryItem(expression) {
    document.getElementById('expression').value = expression;
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    // Set initial focus on desktop only
    if (window.innerWidth > 768) {
        document.getElementById('expression').focus();
    }

    // Load history from local storage
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        history.forEach(item => {
            addToHistory(item.expression, item.result);
        });
    }

    // Set up tab functionality
    const defaultTab = document.querySelector('.tab-btn.active');
    if (defaultTab) {
        const tabName = defaultTab.getAttribute('onclick').match(/openTab\(event, '(.+)'\)/)[1];
        document.getElementById(tabName).style.display = 'block';
    }

    // Add touch-friendly event handlers
    setupTouchEvents();

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Adjust UI for new orientation
        setTimeout(() => {
            adjustUIForOrientation();
        }, 300); // Small delay to allow orientation to complete
    });

    // Initial orientation adjustment
    adjustUIForOrientation();
});

// Setup touch-friendly events
function setupTouchEvents() {
    // Add touch feedback to buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.classList.add('touch-active');
        });

        button.addEventListener('touchend', () => {
            button.classList.remove('touch-active');
        });

        button.addEventListener('touchcancel', () => {
            button.classList.remove('touch-active');
        });
    });

    // Add swipe functionality for tab navigation
    const tabContent = document.querySelectorAll('.tab-content');
    let touchStartX = 0;
    let touchEndX = 0;

    tabContent.forEach(content => {
        content.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        content.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    });

    function handleSwipe() {
        const swipeThreshold = 100; // Minimum distance for swipe
        const currentTab = document.querySelector('.tab-content[style="display: block;"]');
        if (!currentTab) return;

        const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
        const currentTabIndex = tabButtons.findIndex(btn => {
            const tabName = btn.getAttribute('onclick').match(/openTab\(event, '(.+)'\)/)[1];
            return tabName === currentTab.id;
        });

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next tab
            if (currentTabIndex < tabButtons.length - 1) {
                const nextTab = tabButtons[currentTabIndex + 1];
                const event = new Event('click');
                nextTab.dispatchEvent(event);
            }
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous tab
            if (currentTabIndex > 0) {
                const prevTab = tabButtons[currentTabIndex - 1];
                const event = new Event('click');
                prevTab.dispatchEvent(event);
            }
        }
    }
}

// Adjust UI based on orientation
function adjustUIForOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const calculator = document.querySelector('.calculator');

    if (isLandscape && window.innerWidth < 768) {
        // Landscape mode on mobile - optimize layout
        calculator.classList.add('landscape-mode');
    } else {
        calculator.classList.remove('landscape-mode');
    }
}





