/**
 * Virtual Tax Assistant Module
 * Provides intelligent assistance for tax filing questions
 */

const VirtualAssistant = (function() {
    // Private variables
    const knowledgeBase = {
        // Recovery Rebate Credit information
        'rebate_credit': [
            {
                question: 'What is the Recovery Rebate Credit?',
                answer: `The Recovery Rebate Credit is related to the Economic Impact Payments (stimulus payments) issued during the COVID-19 pandemic. If you didn't receive the full third stimulus payment in 2021 that you were eligible for, you can claim the remaining amount as a Recovery Rebate Credit on your 2021 tax return.`
            },
            {
                question: 'How much was the third stimulus payment?',
                answer: `The third Economic Impact Payment issued in 2021 was up to $1,400 per eligible person ($2,800 for married couples filing jointly) plus $1,400 for each qualifying dependent.`
            },
            {
                question: 'Who is eligible for the Recovery Rebate Credit?',
                answer: `You may be eligible if:
                <ul>
                    <li>You didn't receive the third stimulus payment</li>
                    <li>You received less than the full amount you were eligible for</li>
                    <li>You had a new child in 2021</li>
                    <li>Your income decreased in 2021, making you eligible for more</li>
                </ul>
                Eligibility phases out for higher incomes. For single filers, the phase-out begins at $75,000 and ends at $80,000. For head of household, it begins at $112,500 and ends at $120,000. For married filing jointly, it begins at $150,000 and ends at $160,000.`
            },
            {
                question: 'How do I know if I received the third stimulus payment?',
                answer: `You can check if you received the third Economic Impact Payment and its amount through:
                <ul>
                    <li>Your IRS online account</li>
                    <li>IRS Letter 6475 (sent in early 2022)</li>
                    <li>Your bank statements from March-April 2021</li>
                </ul>
                If you're still unsure, our calculator can help determine if you're eligible for any additional amount.`
            },
            {
                question: 'Where do I claim the Recovery Rebate Credit on my tax return?',
                answer: `The Recovery Rebate Credit is claimed on Line 30 of your 2021 Form 1040 or Form 1040-SR.`
            }
        ],
        
        // Prior year filing information
        'prior_year_filing': [
            {
                question: 'How do I file a tax return for a previous year?',
                answer: `To file a 2021 tax return:
                <ol>
                    <li>Use the correct 2021 tax forms (not current year forms)</li>
                    <li>Complete the forms with your 2021 information</li>
                    <li>Print and sign the completed forms</li>
                    <li>Mail the forms to the appropriate IRS address</li>
                </ol>
                Our tool will guide you through this process and provide all the necessary forms.`
            },
            {
                question: 'Can I e-file a 2021 tax return in 2025?',
                answer: `Generally, you cannot e-file prior year returns after the e-file deadline has passed. For 2021 returns, you'll need to file by mail. Our tool will help you prepare the return and provide mailing instructions.`
            },
            {
                question: 'Is there a deadline for filing a 2021 tax return?',
                answer: `While the original deadline was April 18, 2022, you can still file a 2021 return to claim a refund for up to three years from the original due date. This means you have until April 18, 2025, to file and claim any refund you're owed for 2021.`
            },
            {
                question: 'What if I owe taxes for 2021?',
                answer: `If you owe taxes for 2021, you should file as soon as possible. The IRS charges penalties and interest on unpaid taxes, which continue to accrue from the original due date until the tax is paid in full.`
            }
        ],
        
        // Filing status information
        'filing_status': [
            {
                question: 'What filing status should I choose?',
                answer: `Your filing status depends on your situation as of December 31, 2021:
                <ul>
                    <li><strong>Single:</strong> If you were unmarried, divorced, or legally separated</li>
                    <li><strong>Married Filing Jointly:</strong> If you were married and both you and your spouse agree to file together</li>
                    <li><strong>Married Filing Separately:</strong> If you were married but want to be responsible only for your own tax</li>
                    <li><strong>Head of Household:</strong> If you were unmarried, paid more than half the cost of keeping up a home, and had a qualifying person living with you for more than half the year</li>
                    <li><strong>Qualifying Widow(er):</strong> If your spouse died in 2019 or 2020, you have a dependent child, and you paid more than half the cost of keeping up your home</li>
                </ul>
                Our tool can help determine the best filing status for your situation.`
            },
            {
                question: 'What is Head of Household status?',
                answer: `Head of Household status is for unmarried individuals who provide a home for certain other persons. To qualify:
                <ol>
                    <li>You must be unmarried or considered unmarried on December 31, 2021</li>
                    <li>You must have paid more than half the cost of keeping up a home for the year</li>
                    <li>A qualifying person must have lived with you in the home for more than half the year (except for temporary absences)</li>
                </ol>
                This status provides more favorable tax rates and a higher standard deduction than the Single filing status.`
            }
        ],
        
        // Document information
        'documents': [
            {
                question: 'What documents do I need to file my 2021 taxes?',
                answer: `For a 2021 tax return, you'll typically need:
                <ul>
                    <li>Personal information: Social Security numbers, birth dates for you, your spouse, and dependents</li>
                    <li>Income documents: W-2s, 1099s, unemployment compensation statements</li>
                    <li>Stimulus payment information: IRS Letter 6475 or records of payments received</li>
                    <li>Deduction information: Mortgage interest, charitable donations, medical expenses (if applicable)</li>
                    <li>Credit information: Child tax credit, education credits (if applicable)</li>
                    <li>Banking information: For direct deposit of refund</li>
                </ul>
                Our tool will help you identify which specific documents you need based on your situation.`
            },
            {
                question: 'What if I\'m missing some tax documents?',
                answer: `If you're missing tax documents for 2021:
                <ol>
                    <li>Contact the issuer (employer, bank, etc.) to request a copy</li>
                    <li>Access your IRS online account to view tax records</li>
                    <li>Request a wage and income transcript from the IRS</li>
                    <li>Use bank statements or pay stubs to estimate the information</li>
                </ol>
                For missing W-2s, you can also contact the Social Security Administration or complete Form 4852 (Substitute for Form W-2).`
            }
        ],
        
        // Refund information
        'refunds': [
            {
                question: 'How long will it take to get my refund for a 2021 tax return?',
                answer: `For a prior year return filed in 2025:
                <ul>
                    <li>Paper returns typically take 6-8 weeks to process, but can take longer for prior year returns</li>
                    <li>If you choose direct deposit for your refund, you'll receive it faster than a paper check</li>
                    <li>You can check the status of your refund using the "Where's My Refund?" tool on IRS.gov or the IRS2Go app</li>
                </ul>
                Note that processing times may be longer for prior year returns than for current year returns.`
            },
            {
                question: 'Is there a deadline to claim my 2021 refund?',
                answer: `Yes, you have three years from the original due date to file a return and claim a refund. For 2021 tax returns, the deadline is April 18, 2025. If you don't file by this date, you'll lose your refund.`
            }
        ],
        
        // General tax questions
        'general': [
            {
                question: 'What tax credits were available for 2021?',
                answer: `Key tax credits for 2021 included:
                <ul>
                    <li><strong>Recovery Rebate Credit:</strong> For the third stimulus payment</li>
                    <li><strong>Child Tax Credit:</strong> Enhanced for 2021 to up to $3,600 per child under 6 and $3,000 per child 6-17</li>
                    <li><strong>Earned Income Tax Credit:</strong> Expanded for 2021</li>
                    <li><strong>Child and Dependent Care Credit:</strong> Increased for 2021</li>
                    <li><strong>Education credits:</strong> American Opportunity Credit and Lifetime Learning Credit</li>
                </ul>
                Our tool focuses on the Recovery Rebate Credit but can help you identify if you might be eligible for other credits.`
            },
            {
                question: 'What was the standard deduction for 2021?',
                answer: `The standard deduction amounts for 2021 were:
                <ul>
                    <li>Single: $12,550</li>
                    <li>Married Filing Jointly: $25,100</li>
                    <li>Married Filing Separately: $12,550</li>
                    <li>Head of Household: $18,800</li>
                </ul>
                Taxpayers who were 65 or older or blind received an additional standard deduction amount.`
            }
        ]
    };
    
    // Common user intents and their mappings to knowledge base categories
    const intents = {
        'what is recovery rebate credit': 'rebate_credit',
        'recovery rebate': 'rebate_credit',
        'stimulus payment': 'rebate_credit',
        'third stimulus': 'rebate_credit',
        'economic impact payment': 'rebate_credit',
        'how much was stimulus': 'rebate_credit',
        'eligible for rebate': 'rebate_credit',
        'qualify for rebate': 'rebate_credit',
        'received stimulus': 'rebate_credit',
        'check stimulus': 'rebate_credit',
        'line 30': 'rebate_credit',
        
        'file previous year': 'prior_year_filing',
        'file 2021': 'prior_year_filing',
        'prior year': 'prior_year_filing',
        'old tax return': 'prior_year_filing',
        'late filing': 'prior_year_filing',
        'e-file 2021': 'prior_year_filing',
        'mail tax return': 'prior_year_filing',
        'deadline for 2021': 'prior_year_filing',
        'owe taxes 2021': 'prior_year_filing',
        
        'filing status': 'filing_status',
        'which status': 'filing_status',
        'head of household': 'filing_status',
        'married filing': 'filing_status',
        'single status': 'filing_status',
        'qualifying widow': 'filing_status',
        
        'documents needed': 'documents',
        'what documents': 'documents',
        'missing documents': 'documents',
        'missing w2': 'documents',
        'lost tax forms': 'documents',
        'need forms': 'documents',
        
        'when refund': 'refunds',
        'get my refund': 'refunds',
        'refund status': 'refunds',
        'refund deadline': 'refunds',
        'check refund': 'refunds',
        'direct deposit': 'refunds',
        
        'tax credits': 'general',
        'credits 2021': 'general',
        'child tax credit': 'general',
        'earned income': 'general',
        'standard deduction': 'general',
        'deduction amount': 'general'
    };
    
    // Greeting messages
    const greetings = [
        "Hello! I'm your virtual tax assistant. How can I help you with your 2021 Recovery Rebate Credit filing today?",
        "Hi there! I'm here to help with your 2021 tax filing questions. What can I assist you with?",
        "Welcome! I'm your tax filing assistant. How can I help you claim your Recovery Rebate Credit?",
        "Greetings! I'm here to make your 2021 tax filing easier. What questions do you have?"
    ];
    
    // Fallback messages
    const fallbacks = [
        "I'm not sure I understand your question. Could you rephrase it or ask about a specific topic like the Recovery Rebate Credit, filing status, or required documents?",
        "I don't have information on that specific topic. Would you like to know about the Recovery Rebate Credit, prior year filing, or document requirements instead?",
        "I'm still learning and don't have an answer for that. Can I help you with something related to the 2021 Recovery Rebate Credit or tax filing process?",
        "I'm not able to answer that question. Would you like me to explain how the Recovery Rebate Credit works or what documents you need for filing?"
    ];
    
    // Private methods
    function detectIntent(message) {
        const normalizedMessage = message.toLowerCase();
        
        // Check for direct matches in intents
        for (const [pattern, category] of Object.entries(intents)) {
            if (normalizedMessage.includes(pattern)) {
                return category;
            }
        }
        
        // If no direct match, try to find the best matching category
        let bestCategory = null;
        let highestScore = 0;
        
        for (const category in knowledgeBase) {
            const questions = knowledgeBase[category].map(item => item.question.toLowerCase());
            
            for (const question of questions) {
                const score = calculateSimilarity(normalizedMessage, question);
                if (score > highestScore && score > 0.3) { // Threshold for similarity
                    highestScore = score;
                    bestCategory = category;
                }
            }
        }
        
        return bestCategory || 'general';
    }
    
    function calculateSimilarity(str1, str2) {
        // Simple word overlap similarity
        const words1 = str1.split(/\s+/);
        const words2 = str2.split(/\s+/);
        
        const uniqueWords = new Set([...words1, ...words2]);
        let matchCount = 0;
        
        for (const word of words1) {
            if (words2.includes(word) && word.length > 2) { // Only count meaningful words
                matchCount++;
            }
        }
        
        return matchCount / uniqueWords.size;
    }
    
    function findBestResponse(category, message) {
        if (!knowledgeBase[category]) {
            return getRandomFallback();
        }
        
        const normalizedMessage = message.toLowerCase();
        let bestResponse = null;
        let highestScore = 0;
        
        for (const item of knowledgeBase[category]) {
            const score = calculateSimilarity(normalizedMessage, item.question.toLowerCase());
            if (score > highestScore) {
                highestScore = score;
                bestResponse = item.answer;
            }
        }
        
        // If no good match found, return the first answer in the category
        return bestResponse || knowledgeBase[category][0].answer;
    }
    
    function getRandomGreeting() {
        const index = Math.floor(Math.random() * greetings.length);
        return greetings[index];
    }
    
    function getRandomFallback() {
        const index = Math.floor(Math.random() * fallbacks.length);
        return fallbacks[index];
    }
    
    // Public methods
    return {
        init: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // Create assistant UI
            const assistantHtml = `
                <div class="assistant-container">
                    <div class="assistant-header">
                        <div class="assistant-avatar">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="assistant-info">
                            <h3>Tax Filing Assistant</h3>
                            <div class="assistant-status">
                                <span class="status-indicator"></span>
                                <span class="status-text">Online</span>
                            </div>
                        </div>
                        <button class="assistant-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="assistant-messages"></div>
                    <div class="assistant-input">
                        <input type="text" placeholder="Ask a question about tax filing...">
                        <button class="assistant-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="assistant-suggestions">
                        <button class="suggestion-btn">What is the Recovery Rebate Credit?</button>
                        <button class="suggestion-btn">How do I know if I'm eligible?</button>
                        <button class="suggestion-btn">What documents do I need?</button>
                        <button class="suggestion-btn">How do I file for a prior year?</button>
                    </div>
                </div>
            `;
            
            container.innerHTML = assistantHtml;
            
            // Get UI elements
            const messagesContainer = container.querySelector('.assistant-messages');
            const inputField = container.querySelector('.assistant-input input');
            const sendButton = container.querySelector('.assistant-send');
            const closeButton = container.querySelector('.assistant-close');
            const suggestionButtons = container.querySelectorAll('.suggestion-btn');
            
            // Add event listeners
            sendButton.addEventListener('click', () => {
                const message = inputField.value.trim();
                if (message) {
                    this.sendMessage(message, messagesContainer);
                    inputField.value = '';
                }
            });
            
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendButton.click();
                }
            });
            
            closeButton.addEventListener('click', () => {
                container.classList.remove('active');
            });
            
            suggestionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const message = button.textContent;
                    this.sendMessage(message, messagesContainer);
                });
            });
            
            // Send initial greeting
            this.addMessage(getRandomGreeting(), 'assistant', messagesContainer);
        },
        
        sendMessage: function(message, messagesContainer) {
            // Add user message to chat
            this.addMessage(message, 'user', messagesContainer);
            
            // Detect intent and find response
            const intent = detectIntent(message);
            const response = findBestResponse(intent, message);
            
            // Add typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message assistant typing';
            typingIndicator.innerHTML = `
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Simulate typing delay
            setTimeout(() => {
                // Remove typing indicator
                messagesContainer.removeChild(typingIndicator);
                
                // Add assistant response
                this.addMessage(response, 'assistant', messagesContainer);
                
                // Add follow-up suggestions based on intent
                this.addSuggestions(intent, messagesContainer);
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        },
        
        addMessage: function(content, sender, container) {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${sender}`;
            
            if (sender === 'assistant') {
                messageElement.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="message-content">${content}</div>
                `;
            } else {
                messageElement.innerHTML = `
                    <div class="message-content">${content}</div>
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                `;
            }
            
            container.appendChild(messageElement);
            container.scrollTop = container.scrollHeight;
        },
        
        addSuggestions: function(intent, container) {
            // Create follow-up suggestions based on the current intent
            const suggestionsElement = document.createElement('div');
            suggestionsElement.className = 'message-suggestions';
            
            let suggestions = [];
            
            switch (intent) {
                case 'rebate_credit':
                    suggestions = [
                        'How do I know if I received the third stimulus?',
                        'Where do I claim the Recovery Rebate Credit?',
                        'What if my income changed in 2021?'
                    ];
                    break;
                case 'prior_year_filing':
                    suggestions = [
                        'Is there a deadline for filing a 2021 return?',
                        'Can I e-file a 2021 return now?',
                        'What documents do I need for a prior year return?'
                    ];
                    break;
                case 'filing_status':
                    suggestions = [
                        'What is Head of Household status?',
                        'Should I file jointly or separately?',
                        'What was the standard deduction for 2021?'
                    ];
                    break;
                case 'documents':
                    suggestions = [
                        'What if I\'m missing my W-2?',
                        'Do I need Letter 6475?',
                        'What tax forms do I need for 2021?'
                    ];
                    break;
                case 'refunds':
                    suggestions = [
                        'How long will my refund take?',
                        'Is there a deadline to claim my refund?',
                        'How can I check my refund status?'
                    ];
                    break;
                default:
                    suggestions = [
                        'What is the Recovery Rebate Credit?',
                        'How do I file a prior year return?',
                        'What documents do I need?'
                    ];
            }
            
            suggestionsElement.innerHTML = `
                <div class="suggestions-label">Related Questions:</div>
                <div class="suggestions-buttons">
                    ${suggestions.map(suggestion => `
                        <button class="suggestion-btn">${suggestion}</button>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(suggestionsElement);
            container.scrollTop = container.scrollHeight;
            
            // Add event listeners to suggestion buttons
            const suggestionButtons = suggestionsElement.querySelectorAll('.suggestion-btn');
            suggestionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const message = button.textContent;
                    this.sendMessage(message, container);
                });
            });
        },
        
        toggle: function(containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.classList.toggle('active');
                
                // If activating, focus on input field
                if (container.classList.contains('active')) {
                    const inputField = container.querySelector('.assistant-input input');
                    if (inputField) {
                        setTimeout(() => {
                            inputField.focus();
                        }, 300);
                    }
                }
            }
        }
    };
})();

// Export the module
export default VirtualAssistant;
