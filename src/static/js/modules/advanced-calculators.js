/**
 * Advanced Financial Calculator Suite
 * Comprehensive financial calculators beyond basic tax filing
 * This positions us as a complete financial planning tool
 */

const AdvancedCalculators = (function() {
    // Calculator definitions with sophisticated algorithms
    const calculators = {
        retirement_planning: {
            name: 'Retirement Planning Calculator',
            description: 'Plan your retirement savings with advanced projections',
            icon: 'fas fa-piggy-bank',
            category: 'retirement',
            inputs: [
                { name: 'currentAge', label: 'Current Age', type: 'number', min: 18, max: 100 },
                { name: 'retirementAge', label: 'Retirement Age', type: 'number', min: 50, max: 100 },
                { name: 'currentSavings', label: 'Current Retirement Savings', type: 'currency' },
                { name: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency' },
                { name: 'employerMatch', label: 'Employer Match %', type: 'percentage' },
                { name: 'expectedReturn', label: 'Expected Annual Return %', type: 'percentage', default: 7 },
                { name: 'inflationRate', label: 'Expected Inflation %', type: 'percentage', default: 3 },
                { name: 'desiredIncome', label: 'Desired Annual Retirement Income', type: 'currency' }
            ],
            calculate: function(inputs) {
                const years = inputs.retirementAge - inputs.currentAge;
                const monthlyReturn = inputs.expectedReturn / 100 / 12;
                const months = years * 12;
                
                // Future value of current savings
                const futureCurrentSavings = inputs.currentSavings * Math.pow(1 + inputs.expectedReturn/100, years);
                
                // Future value of monthly contributions
                const totalMonthlyContrib = inputs.monthlyContribution * (1 + inputs.employerMatch/100);
                const futureContributions = totalMonthlyContrib * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;
                
                const totalSavings = futureCurrentSavings + futureContributions;
                
                // Safe withdrawal rate (4% rule adjusted for inflation)
                const safeWithdrawalRate = 0.04;
                const annualWithdrawal = totalSavings * safeWithdrawalRate;
                
                // Adjust for inflation
                const inflationAdjustedWithdrawal = annualWithdrawal / Math.pow(1 + inputs.inflationRate/100, years);
                
                return {
                    totalSavingsAtRetirement: totalSavings,
                    annualRetirementIncome: annualWithdrawal,
                    inflationAdjustedIncome: inflationAdjustedWithdrawal,
                    monthlyRetirementIncome: annualWithdrawal / 12,
                    shortfall: Math.max(0, inputs.desiredIncome - annualWithdrawal),
                    yearsToRetirement: years,
                    totalContributions: (inputs.currentSavings + (totalMonthlyContrib * months)),
                    growthFromReturns: totalSavings - (inputs.currentSavings + (totalMonthlyContrib * months))
                };
            }
        },
        
        mortgage_optimization: {
            name: 'Mortgage Optimization Calculator',
            description: 'Optimize your mortgage payments and compare scenarios',
            icon: 'fas fa-home',
            category: 'real_estate',
            inputs: [
                { name: 'homePrice', label: 'Home Price', type: 'currency' },
                { name: 'downPayment', label: 'Down Payment', type: 'currency' },
                { name: 'interestRate', label: 'Interest Rate %', type: 'percentage' },
                { name: 'loanTerm', label: 'Loan Term (years)', type: 'number', options: [15, 20, 25, 30] },
                { name: 'propertyTax', label: 'Annual Property Tax', type: 'currency' },
                { name: 'insurance', label: 'Annual Insurance', type: 'currency' },
                { name: 'pmi', label: 'PMI (if down payment < 20%)', type: 'currency' },
                { name: 'extraPayment', label: 'Extra Monthly Payment', type: 'currency' }
            ],
            calculate: function(inputs) {
                const loanAmount = inputs.homePrice - inputs.downPayment;
                const monthlyRate = inputs.interestRate / 100 / 12;
                const numPayments = inputs.loanTerm * 12;
                
                // Standard monthly payment (P&I)
                const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                 (Math.pow(1 + monthlyRate, numPayments) - 1);
                
                // Additional monthly costs
                const monthlyTax = inputs.propertyTax / 12;
                const monthlyInsurance = inputs.insurance / 12;
                const monthlyPMI = inputs.pmi / 12;
                
                const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
                
                // Calculate payoff with extra payments
                let balance = loanAmount;
                let totalInterest = 0;
                let month = 0;
                const actualPayment = monthlyPI + inputs.extraPayment;
                
                while (balance > 0 && month < numPayments) {
                    const interestPayment = balance * monthlyRate;
                    const principalPayment = Math.min(actualPayment - interestPayment, balance);
                    
                    balance -= principalPayment;
                    totalInterest += interestPayment;
                    month++;
                }
                
                const yearsToPayoff = month / 12;
                const totalPaid = loanAmount + totalInterest;
                
                // Without extra payments
                const standardTotalInterest = (monthlyPI * numPayments) - loanAmount;
                const interestSaved = standardTotalInterest - totalInterest;
                const timeSaved = (inputs.loanTerm * 12 - month) / 12;
                
                return {
                    loanAmount: loanAmount,
                    monthlyPrincipalInterest: monthlyPI,
                    monthlyTaxInsurance: monthlyTax + monthlyInsurance + monthlyPMI,
                    totalMonthlyPayment: totalMonthlyPayment + inputs.extraPayment,
                    totalInterestPaid: totalInterest,
                    totalAmountPaid: totalPaid,
                    yearsToPayoff: yearsToPayoff,
                    interestSaved: interestSaved,
                    timeSaved: timeSaved,
                    loanToValueRatio: (loanAmount / inputs.homePrice) * 100
                };
            }
        },
        
        investment_analyzer: {
            name: 'Investment Portfolio Analyzer',
            description: 'Analyze investment performance and optimize allocation',
            icon: 'fas fa-chart-line',
            category: 'investment',
            inputs: [
                { name: 'initialInvestment', label: 'Initial Investment', type: 'currency' },
                { name: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency' },
                { name: 'timeHorizon', label: 'Time Horizon (years)', type: 'number' },
                { name: 'stockAllocation', label: 'Stock Allocation %', type: 'percentage', default: 70 },
                { name: 'bondAllocation', label: 'Bond Allocation %', type: 'percentage', default: 30 },
                { name: 'riskTolerance', label: 'Risk Tolerance', type: 'select', options: ['Conservative', 'Moderate', 'Aggressive'] },
                { name: 'taxableAccount', label: 'Taxable Account %', type: 'percentage', default: 30 },
                { name: 'retirementAccount', label: 'Retirement Account %', type: 'percentage', default: 70 }
            ],
            calculate: function(inputs) {
                // Expected returns based on historical data
                const stockReturn = 0.10; // 10% historical average
                const bondReturn = 0.04; // 4% historical average
                
                // Portfolio expected return
                const portfolioReturn = (inputs.stockAllocation/100 * stockReturn) + 
                                      (inputs.bondAllocation/100 * bondReturn);
                
                // Calculate future value
                const months = inputs.timeHorizon * 12;
                const monthlyReturn = portfolioReturn / 12;
                
                // Future value of initial investment
                const futureInitial = inputs.initialInvestment * Math.pow(1 + portfolioReturn, inputs.timeHorizon);
                
                // Future value of monthly contributions
                const futureContributions = inputs.monthlyContribution * 
                    (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;
                
                const totalValue = futureInitial + futureContributions;
                const totalContributed = inputs.initialInvestment + (inputs.monthlyContribution * months);
                const totalGains = totalValue - totalContributed;
                
                // Risk analysis
                const riskMultipliers = { 'Conservative': 0.8, 'Moderate': 1.0, 'Aggressive': 1.3 };
                const riskAdjustedReturn = portfolioReturn * riskMultipliers[inputs.riskTolerance];
                
                // Tax efficiency analysis
                const taxablePortionGains = totalGains * (inputs.taxableAccount / 100);
                const estimatedTaxes = taxablePortionGains * 0.15; // Assume 15% capital gains tax
                
                return {
                    portfolioReturn: portfolioReturn,
                    projectedValue: totalValue,
                    totalContributed: totalContributed,
                    totalGains: totalGains,
                    riskAdjustedReturn: riskAdjustedReturn,
                    estimatedTaxes: estimatedTaxes,
                    netValue: totalValue - estimatedTaxes,
                    annualizedReturn: portfolioReturn,
                    volatilityEstimate: this.calculateVolatility(inputs.stockAllocation, inputs.riskTolerance)
                };
            },
            calculateVolatility: function(stockAllocation, riskTolerance) {
                const baseVolatility = (stockAllocation / 100) * 0.16 + ((100 - stockAllocation) / 100) * 0.04;
                const riskMultipliers = { 'Conservative': 0.8, 'Moderate': 1.0, 'Aggressive': 1.3 };
                return baseVolatility * riskMultipliers[riskTolerance];
            }
        },
        
        debt_optimizer: {
            name: 'Debt Payoff Optimizer',
            description: 'Optimize your debt payoff strategy',
            icon: 'fas fa-credit-card',
            category: 'debt',
            inputs: [
                { name: 'totalDebt', label: 'Total Debt Amount', type: 'currency' },
                { name: 'avgInterestRate', label: 'Average Interest Rate %', type: 'percentage' },
                { name: 'minPayment', label: 'Current Minimum Payment', type: 'currency' },
                { name: 'extraPayment', label: 'Extra Payment Available', type: 'currency' },
                { name: 'payoffMethod', label: 'Payoff Method', type: 'select', options: ['Avalanche', 'Snowball', 'Hybrid'] }
            ],
            calculate: function(inputs) {
                const monthlyRate = inputs.avgInterestRate / 100 / 12;
                const totalPayment = inputs.minPayment + inputs.extraPayment;
                
                // Calculate payoff time
                let balance = inputs.totalDebt;
                let months = 0;
                let totalInterest = 0;
                
                while (balance > 0 && months < 600) { // Max 50 years
                    const interestPayment = balance * monthlyRate;
                    const principalPayment = Math.min(totalPayment - interestPayment, balance);
                    
                    if (principalPayment <= 0) break; // Payment too low
                    
                    balance -= principalPayment;
                    totalInterest += interestPayment;
                    months++;
                }
                
                // Compare with minimum payments only
                let minBalance = inputs.totalDebt;
                let minMonths = 0;
                let minTotalInterest = 0;
                
                while (minBalance > 0 && minMonths < 600) {
                    const interestPayment = minBalance * monthlyRate;
                    const principalPayment = Math.min(inputs.minPayment - interestPayment, minBalance);
                    
                    if (principalPayment <= 0) break;
                    
                    minBalance -= principalPayment;
                    minTotalInterest += interestPayment;
                    minMonths++;
                }
                
                return {
                    payoffTime: months / 12,
                    totalInterestPaid: totalInterest,
                    totalAmountPaid: inputs.totalDebt + totalInterest,
                    monthlySavings: inputs.extraPayment,
                    interestSaved: minTotalInterest - totalInterest,
                    timeSaved: (minMonths - months) / 12,
                    debtFreeDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000),
                    minPaymentScenario: {
                        payoffTime: minMonths / 12,
                        totalInterest: minTotalInterest
                    }
                };
            }
        },
        
        college_savings: {
            name: '529 College Savings Calculator',
            description: 'Plan for education expenses with tax-advantaged savings',
            icon: 'fas fa-graduation-cap',
            category: 'education',
            inputs: [
                { name: 'childAge', label: 'Child\'s Current Age', type: 'number', min: 0, max: 17 },
                { name: 'currentSavings', label: 'Current 529 Balance', type: 'currency' },
                { name: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency' },
                { name: 'collegeCost', label: 'Current Annual College Cost', type: 'currency', default: 50000 },
                { name: 'inflationRate', label: 'Education Inflation Rate %', type: 'percentage', default: 5 },
                { name: 'expectedReturn', label: 'Expected Return %', type: 'percentage', default: 6 },
                { name: 'yearsInCollege', label: 'Years in College', type: 'number', default: 4 }
            ],
            calculate: function(inputs) {
                const yearsToCollege = 18 - inputs.childAge;
                const monthlyReturn = inputs.expectedReturn / 100 / 12;
                const months = yearsToCollege * 12;
                
                // Future value of current savings
                const futureCurrentSavings = inputs.currentSavings * 
                    Math.pow(1 + inputs.expectedReturn/100, yearsToCollege);
                
                // Future value of contributions
                const futureContributions = inputs.monthlyContribution * 
                    (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;
                
                const totalSavingsAtCollege = futureCurrentSavings + futureContributions;
                
                // Future college costs
                const futureAnnualCost = inputs.collegeCost * 
                    Math.pow(1 + inputs.inflationRate/100, yearsToCollege);
                
                const totalCollegeCost = futureAnnualCost * inputs.yearsInCollege;
                
                // Calculate funding percentage
                const fundingPercentage = Math.min((totalSavingsAtCollege / totalCollegeCost) * 100, 100);
                const shortfall = Math.max(0, totalCollegeCost - totalSavingsAtCollege);
                
                return {
                    totalSavingsAtCollege: totalSavingsAtCollege,
                    futureAnnualCost: futureAnnualCost,
                    totalCollegeCost: totalCollegeCost,
                    fundingPercentage: fundingPercentage,
                    shortfall: shortfall,
                    yearsToCollege: yearsToCollege,
                    recommendedMonthlyContribution: this.calculateRequiredContribution(
                        totalCollegeCost, inputs.currentSavings, months, monthlyReturn
                    )
                };
            },
            calculateRequiredContribution: function(targetAmount, currentSavings, months, monthlyReturn) {
                const futureCurrentSavings = currentSavings * Math.pow(1 + monthlyReturn * 12, months / 12);
                const remainingNeeded = targetAmount - futureCurrentSavings;
                
                if (remainingNeeded <= 0) return 0;
                
                // Calculate required monthly payment
                return remainingNeeded / ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
            }
        },
        
        tax_bracket_analyzer: {
            name: 'Tax Bracket Optimization',
            description: 'Analyze your tax bracket and optimization opportunities',
            icon: 'fas fa-percentage',
            category: 'tax',
            inputs: [
                { name: 'filingStatus', label: 'Filing Status', type: 'select', 
                  options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] },
                { name: 'grossIncome', label: 'Gross Income', type: 'currency' },
                { name: 'deductions', label: 'Itemized Deductions', type: 'currency' },
                { name: 'retirementContrib', label: '401k/403b Contributions', type: 'currency' },
                { name: 'hsaContrib', label: 'HSA Contributions', type: 'currency' },
                { name: 'dependents', label: 'Number of Dependents', type: 'number' }
            ],
            calculate: function(inputs) {
                // 2021 tax brackets (simplified)
                const brackets = {
                    'Single': [
                        { min: 0, max: 9950, rate: 0.10 },
                        { min: 9951, max: 40525, rate: 0.12 },
                        { min: 40526, max: 86375, rate: 0.22 },
                        { min: 86376, max: 164925, rate: 0.24 },
                        { min: 164926, max: 209425, rate: 0.32 },
                        { min: 209426, max: 523600, rate: 0.35 },
                        { min: 523601, max: Infinity, rate: 0.37 }
                    ],
                    'Married Filing Jointly': [
                        { min: 0, max: 19900, rate: 0.10 },
                        { min: 19901, max: 81050, rate: 0.12 },
                        { min: 81051, max: 172750, rate: 0.22 },
                        { min: 172751, max: 329850, rate: 0.24 },
                        { min: 329851, max: 418850, rate: 0.32 },
                        { min: 418851, max: 628300, rate: 0.35 },
                        { min: 628301, max: Infinity, rate: 0.37 }
                    ]
                };
                
                // Calculate AGI
                const standardDeduction = inputs.filingStatus === 'Married Filing Jointly' ? 25100 : 12550;
                const totalDeductions = Math.max(inputs.deductions, standardDeduction);
                const agi = inputs.grossIncome - inputs.retirementContrib - inputs.hsaContrib;
                const taxableIncome = Math.max(0, agi - totalDeductions);
                
                // Calculate tax
                const applicableBrackets = brackets[inputs.filingStatus] || brackets['Single'];
                let tax = 0;
                let marginalRate = 0;
                
                for (const bracket of applicableBrackets) {
                    if (taxableIncome > bracket.min) {
                        const taxableInThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
                        tax += taxableInThisBracket * bracket.rate;
                        marginalRate = bracket.rate;
                    }
                }
                
                // Child tax credit
                const childTaxCredit = Math.min(inputs.dependents * 2000, 2000 * 3); // Max 3 children for simplicity
                const finalTax = Math.max(0, tax - childTaxCredit);
                
                const effectiveRate = (finalTax / agi) * 100;
                
                return {
                    grossIncome: inputs.grossIncome,
                    adjustedGrossIncome: agi,
                    taxableIncome: taxableIncome,
                    federalTax: finalTax,
                    marginalTaxRate: marginalRate * 100,
                    effectiveTaxRate: effectiveRate,
                    childTaxCredit: childTaxCredit,
                    afterTaxIncome: inputs.grossIncome - finalTax,
                    optimizationOpportunities: this.findTaxOptimizations(inputs, marginalRate)
                };
            },
            findTaxOptimizations: function(inputs, marginalRate) {
                const opportunities = [];
                
                // 401k optimization
                const max401k = 19500; // 2021 limit
                const current401k = inputs.retirementContrib || 0;
                if (current401k < max401k) {
                    const additional401k = Math.min(5000, max401k - current401k);
                    opportunities.push({
                        type: 'Increase 401(k) Contributions',
                        amount: additional401k,
                        taxSavings: additional401k * marginalRate,
                        description: `Increase 401(k) by $${additional401k.toLocaleString()}`
                    });
                }
                
                // HSA optimization  
                const maxHSA = 3600; // 2021 individual limit
                const currentHSA = inputs.hsaContrib || 0;
                if (currentHSA < maxHSA) {
                    const additionalHSA = maxHSA - currentHSA;
                    opportunities.push({
                        type: 'Maximize HSA Contributions',
                        amount: additionalHSA,
                        taxSavings: additionalHSA * marginalRate,
                        description: `Increase HSA by $${additionalHSA.toLocaleString()}`
                    });
                }
                
                return opportunities;
            }
        }
    };
    
    // Private methods
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    function formatPercentage(rate) {
        return (rate * 100).toFixed(2) + '%';
    }
    
    // Public methods
    return {
        init: function() {
            console.log('Advanced Calculators initialized');
        },
        
        getCalculatorsList: function() {
            return Object.keys(calculators).map(key => ({
                key: key,
                name: calculators[key].name,
                description: calculators[key].description,
                icon: calculators[key].icon,
                category: calculators[key].category
            }));
        },
        
        renderCalculatorSelector: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const categories = [...new Set(Object.values(calculators).map(calc => calc.category))];
            
            container.innerHTML = `
                <div class="calculator-suite">
                    <div class="suite-header">
                        <h2>Advanced Financial Calculators</h2>
                        <p>Professional-grade financial planning tools</p>
                    </div>
                    
                    <div class="calculator-categories">
                        ${categories.map(category => `
                            <div class="category-section">
                                <h3 class="category-title">${this.formatCategoryName(category)}</h3>
                                <div class="calculators-grid">
                                    ${Object.keys(calculators)
                                        .filter(key => calculators[key].category === category)
                                        .map(key => `
                                            <div class="calculator-card" data-calculator="${key}">
                                                <div class="card-icon">
                                                    <i class="${calculators[key].icon}"></i>
                                                </div>
                                                <h4>${calculators[key].name}</h4>
                                                <p>${calculators[key].description}</p>
                                                <button class="btn btn-primary launch-calculator" data-calculator="${key}">
                                                    Launch Calculator
                                                </button>
                                            </div>
                                        `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Add event listeners
            container.querySelectorAll('.launch-calculator').forEach(button => {
                button.addEventListener('click', (e) => {
                    const calculatorKey = e.target.dataset.calculator;
                    this.launchCalculator(calculatorKey, containerId);
                });
            });
        },
        
        formatCategoryName: function(category) {
            return category.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        },
        
        launchCalculator: function(calculatorKey, containerId) {
            const calculator = calculators[calculatorKey];
            if (!calculator) return;
            
            const container = document.getElementById(containerId);
            container.innerHTML = this.renderCalculatorInterface(calculatorKey, calculator);
            
            // Add form handler
            const form = container.querySelector('.calculator-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCalculation(calculatorKey, form, container);
            });
            
            // Add back button handler
            const backButton = container.querySelector('.back-to-list');
            backButton.addEventListener('click', () => {
                this.renderCalculatorSelector(containerId);
            });
        },
        
        renderCalculatorInterface: function(key, calculator) {
            return `
                <div class="calculator-interface">
                    <div class="calculator-header">
                        <button class="btn btn-secondary back-to-list">
                            <i class="fas fa-arrow-left"></i> Back to Calculators
                        </button>
                        <div class="calculator-title">
                            <div class="title-icon">
                                <i class="${calculator.icon}"></i>
                            </div>
                            <div>
                                <h2>${calculator.name}</h2>
                                <p>${calculator.description}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="calculator-content">
                        <form class="calculator-form">
                            <div class="form-grid">
                                ${calculator.inputs.map(input => this.renderInput(input)).join('')}
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary btn-large">
                                    <i class="fas fa-calculator"></i> Calculate
                                </button>
                                <button type="reset" class="btn btn-secondary">
                                    <i class="fas fa-redo"></i> Reset
                                </button>
                            </div>
                        </form>
                        
                        <div class="calculation-results" style="display: none;">
                            <!-- Results will be populated here -->
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderInput: function(input) {
            const defaultValue = input.default || '';
            
            switch(input.type) {
                case 'currency':
                    return `
                        <div class="form-group">
                            <label for="${input.name}">${input.label}</label>
                            <div class="input-group">
                                <span class="input-prefix">$</span>
                                <input type="number" 
                                       id="${input.name}" 
                                       name="${input.name}" 
                                       class="form-control" 
                                       step="0.01" 
                                       min="0" 
                                       value="${defaultValue}">
                            </div>
                        </div>
                    `;
                    
                case 'percentage':
                    return `
                        <div class="form-group">
                            <label for="${input.name}">${input.label}</label>
                            <div class="input-group">
                                <input type="number" 
                                       id="${input.name}" 
                                       name="${input.name}" 
                                       class="form-control" 
                                       step="0.01" 
                                       min="0" 
                                       max="100" 
                                       value="${defaultValue}">
                                <span class="input-suffix">%</span>
                            </div>
                        </div>
                    `;
                    
                case 'select':
                    return `
                        <div class="form-group">
                            <label for="${input.name}">${input.label}</label>
                            <select id="${input.name}" name="${input.name}" class="form-control">
                                <option value="">Select an option</option>
                                ${input.options.map(option => `
                                    <option value="${option}">${option}</option>
                                `).join('')}
                            </select>
                        </div>
                    `;
                    
                default:
                    return `
                        <div class="form-group">
                            <label for="${input.name}">${input.label}</label>
                            <input type="${input.type}" 
                                   id="${input.name}" 
                                   name="${input.name}" 
                                   class="form-control" 
                                   ${input.min ? `min="${input.min}"` : ''}
                                   ${input.max ? `max="${input.max}"` : ''}
                                   value="${defaultValue}">
                        </div>
                    `;
            }
        },
        
        processCalculation: function(calculatorKey, form, container) {
            const calculator = calculators[calculatorKey];
            const formData = new FormData(form);
            const inputs = {};
            
            // Convert form data to proper types
            calculator.inputs.forEach(inputDef => {
                const value = formData.get(inputDef.name);
                if (value) {
                    if (inputDef.type === 'number' || inputDef.type === 'currency' || inputDef.type === 'percentage') {
                        inputs[inputDef.name] = parseFloat(value);
                    } else {
                        inputs[inputDef.name] = value;
                    }
                }
            });
            
            // Perform calculation
            const results = calculator.calculate(inputs);
            
            // Display results
            const resultsContainer = container.querySelector('.calculation-results');
            resultsContainer.innerHTML = this.renderResults(calculatorKey, results, inputs);
            resultsContainer.style.display = 'block';
            
            // Smooth scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        },
        
        renderResults: function(calculatorKey, results, inputs) {
            // Specific result rendering for each calculator type
            switch(calculatorKey) {
                case 'retirement_planning':
                    return this.renderRetirementResults(results, inputs);
                case 'mortgage_optimization':
                    return this.renderMortgageResults(results, inputs);
                case 'investment_analyzer':
                    return this.renderInvestmentResults(results, inputs);
                case 'debt_optimizer':
                    return this.renderDebtResults(results, inputs);
                case 'college_savings':
                    return this.renderCollegeResults(results, inputs);
                case 'tax_bracket_analyzer':
                    return this.renderTaxResults(results, inputs);
                default:
                    return '<p>Calculation complete</p>';
            }
        },
        
        renderRetirementResults: function(results, inputs) {
            return `
                <div class="results-header">
                    <h3>Your Retirement Plan Analysis</h3>
                </div>
                
                <div class="results-summary">
                    <div class="summary-card highlight">
                        <div class="summary-value">${formatCurrency(results.totalSavingsAtRetirement)}</div>
                        <div class="summary-label">Total Savings at Retirement</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${formatCurrency(results.monthlyRetirementIncome)}</div>
                        <div class="summary-label">Monthly Retirement Income</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${results.yearsToRetirement}</div>
                        <div class="summary-label">Years to Retirement</div>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="detail-section">
                        <h4>Savings Breakdown</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span>Total Contributions:</span>
                                <span>${formatCurrency(results.totalContributions)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Growth from Returns:</span>
                                <span>${formatCurrency(results.growthFromReturns)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Inflation-Adjusted Income:</span>
                                <span>${formatCurrency(results.inflationAdjustedIncome)}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${results.shortfall > 0 ? `
                        <div class="detail-section warning">
                            <h4>Retirement Income Gap</h4>
                            <p>You may have a shortfall of <strong>${formatCurrency(results.shortfall)}</strong> annually.</p>
                            <p>Consider increasing contributions or working longer to meet your retirement goals.</p>
                        </div>
                    ` : `
                        <div class="detail-section success">
                            <h4>Congratulations!</h4>
                            <p>You're on track to meet your retirement income goals.</p>
                        </div>
                    `}
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary save-scenario">Save This Scenario</button>
                    <button class="btn btn-secondary export-report">Export Report</button>
                </div>
            `;
        },
        
        renderMortgageResults: function(results, inputs) {
            return `
                <div class="results-header">
                    <h3>Mortgage Analysis Results</h3>
                </div>
                
                <div class="results-summary">
                    <div class="summary-card">
                        <div class="summary-value">${formatCurrency(results.totalMonthlyPayment)}</div>
                        <div class="summary-label">Total Monthly Payment</div>
                    </div>
                    <div class="summary-card highlight">
                        <div class="summary-value">${formatCurrency(results.interestSaved)}</div>
                        <div class="summary-label">Interest Saved</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${results.timeSaved.toFixed(1)} years</div>
                        <div class="summary-label">Time Saved</div>
                    </div>
                </div>
                
                <div class="results-chart">
                    <canvas id="mortgageChart" width="400" height="200"></canvas>
                </div>
                
                <div class="results-details">
                    <div class="detail-section">
                        <h4>Payment Breakdown</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span>Principal & Interest:</span>
                                <span>${formatCurrency(results.monthlyPrincipalInterest)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Tax & Insurance:</span>
                                <span>${formatCurrency(results.monthlyTaxInsurance)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Loan-to-Value Ratio:</span>
                                <span>${results.loanToValueRatio.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderInvestmentResults: function(results, inputs) {
            return `
                <div class="results-header">
                    <h3>Investment Portfolio Analysis</h3>
                </div>
                
                <div class="results-summary">
                    <div class="summary-card highlight">
                        <div class="summary-value">${formatCurrency(results.netValue)}</div>
                        <div class="summary-label">Projected Net Value</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${(results.annualizedReturn * 100).toFixed(1)}%</div>
                        <div class="summary-label">Expected Annual Return</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${(results.volatilityEstimate * 100).toFixed(1)}%</div>
                        <div class="summary-label">Portfolio Volatility</div>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="detail-section">
                        <h4>Portfolio Performance</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span>Total Contributed:</span>
                                <span>${formatCurrency(results.totalContributed)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Investment Gains:</span>
                                <span>${formatCurrency(results.totalGains)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Estimated Taxes:</span>
                                <span>${formatCurrency(results.estimatedTaxes)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderDebtResults: function(results, inputs) {
            return `
                <div class="results-header">
                    <h3>Debt Payoff Strategy</h3>
                </div>
                
                <div class="results-summary">
                    <div class="summary-card">
                        <div class="summary-value">${results.payoffTime.toFixed(1)} years</div>
                        <div class="summary-label">Time to Debt Free</div>
                    </div>
                    <div class="summary-card highlight">
                        <div class="summary-value">${formatCurrency(results.interestSaved)}</div>
                        <div class="summary-label">Interest Saved</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${results.debtFreeDate.toLocaleDateString()}</div>
                        <div class="summary-label">Debt Free Date</div>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="detail-section">
                        <h4>Payoff Comparison</h4>
                        <div class="comparison-table">
                            <div class="comparison-row header">
                                <span>Scenario</span>
                                <span>Payoff Time</span>
                                <span>Total Interest</span>
                                <span>Total Paid</span>
                            </div>
                            <div class="comparison-row">
                                <span>Minimum Payments</span>
                                <span>${results.minPaymentScenario.payoffTime.toFixed(1)} years</span>
                                <span>${formatCurrency(results.minPaymentScenario.totalInterest)}</span>
                                <span>${formatCurrency(inputs.totalDebt + results.minPaymentScenario.totalInterest)}</span>
                            </div>
                            <div class="comparison-row highlight">
                                <span>With Extra Payments</span>
                                <span>${results.payoffTime.toFixed(1)} years</span>
                                <span>${formatCurrency(results.totalInterestPaid)}</span>
                                <span>${formatCurrency(results.totalAmountPaid)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderCollegeResults: function(results, inputs) {
            return `
                <div class="results-header">
                    <h3>College Savings Plan Analysis</h3>
                </div>
                
                <div class="results-summary">
                    <div class="summary-card">
                        <div class="summary-value">${results.fundingPercentage.toFixed(0)}%</div>
                        <div class="summary-label">College Costs Covered</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${formatCurrency(results.totalSavingsAtCollege)}</div>
                        <div class="summary-label">529 Balance at College</div>
                    </div>
                    <div class="summary-card ${results.shortfall > 0 ? 'warning' : 'success'}">
                        <div class="summary-value">${formatCurrency(results.shortfall)}</div>
                        <div class="summary-label">Funding Shortfall</div>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="detail-section">
                        <h4>College Cost Projection</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span>Future Annual Cost:</span>
                                <span>${formatCurrency(results.futureAnnualCost)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Total 4-Year Cost:</span>
                                <span>${formatCurrency(results.totalCollegeCost)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Years to College:</span>
                                <span>${results.yearsToCollege}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${results.shortfall > 0 ? `
                        <div class="detail-section recommendation">
                            <h4>Recommendation</h4>
                            <p>To fully fund college expenses, consider increasing your monthly contribution to <strong>${formatCurrency(results.recommendedMonthlyContribution)}</strong>.</p>
                        </div>
                    ` : ''}
                </div>
            `;
        },
        
        renderTaxResults: function(results, inputs) {
            return `
                <div class="results-header">
                    <h3>Tax Analysis Results</h3>
                </div>
                
                <div class="results-summary">
                    <div class="summary-card">
                        <div class="summary-value">${results.marginalTaxRate.toFixed(1)}%</div>
                        <div class="summary-label">Marginal Tax Rate</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${results.effectiveTaxRate.toFixed(1)}%</div>
                        <div class="summary-label">Effective Tax Rate</div>
                    </div>
                    <div class="summary-card highlight">
                        <div class="summary-value">${formatCurrency(results.afterTaxIncome)}</div>
                        <div class="summary-label">After-Tax Income</div>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="detail-section">
                        <h4>Tax Breakdown</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span>Adjusted Gross Income:</span>
                                <span>${formatCurrency(results.adjustedGrossIncome)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Taxable Income:</span>
                                <span>${formatCurrency(results.taxableIncome)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Federal Tax:</span>
                                <span>${formatCurrency(results.federalTax)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Child Tax Credit:</span>
                                <span>${formatCurrency(results.childTaxCredit)}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${results.optimizationOpportunities.length > 0 ? `
                        <div class="detail-section optimization">
                            <h4>Tax Optimization Opportunities</h4>
                            ${results.optimizationOpportunities.map(opp => `
                                <div class="optimization-item">
                                    <h5>${opp.type}</h5>
                                    <p>${opp.description}</p>
                                    <div class="savings-highlight">
                                        Potential Tax Savings: <strong>${formatCurrency(opp.taxSavings)}</strong>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
    };
})();

// Export the module
export default AdvancedCalculators;