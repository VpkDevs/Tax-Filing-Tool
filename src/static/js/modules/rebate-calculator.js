/**
 * Recovery Rebate Credit Calculator Module
 * Calculates the Recovery Rebate Credit amount based on user inputs
 */

const RebateCalculator = (function() {
    // Private variables
    const MAX_SINGLE_INCOME = 80000;
    const MAX_HOH_INCOME = 120000;
    const MAX_JOINT_INCOME = 160000;
    const PHASE_OUT_SINGLE_START = 75000;
    const PHASE_OUT_HOH_START = 112500;
    const PHASE_OUT_JOINT_START = 150000;
    const PAYMENT_AMOUNT = 1400;
    
    // Private methods
    function calculatePhaseOut(income, filingStatus) {
        let phaseOutStart, phaseOutEnd;
        
        switch(filingStatus) {
            case 'single':
            case 'separate':
                phaseOutStart = PHASE_OUT_SINGLE_START;
                phaseOutEnd = MAX_SINGLE_INCOME;
                break;
            case 'head':
                phaseOutStart = PHASE_OUT_HOH_START;
                phaseOutEnd = MAX_HOH_INCOME;
                break;
            case 'joint':
            case 'widow':
                phaseOutStart = PHASE_OUT_JOINT_START;
                phaseOutEnd = MAX_JOINT_INCOME;
                break;
            default:
                return 0;
        }
        
        if (income <= phaseOutStart) {
            return 1; // Full payment
        } else if (income >= phaseOutEnd) {
            return 0; // No payment
        } else {
            // Partial payment based on phase-out
            const phaseOutRange = phaseOutEnd - phaseOutStart;
            const incomeOverStart = income - phaseOutStart;
            return 1 - (incomeOverStart / phaseOutRange);
        }
    }
    
    // Public methods
    return {
        // Calculate the Recovery Rebate Credit amount
        calculateRebateCredit: function(data) {
            const {
                filingStatus,
                adjustedGrossIncome,
                receivedPayment,
                receivedAmount,
                dependents
            } = data;
            
            // If they already received the full payment, no credit is due
            if (receivedPayment && receivedAmount === this.calculateMaxPayment(filingStatus, dependents)) {
                return {
                    eligibleAmount: 0,
                    maxPayment: this.calculateMaxPayment(filingStatus, dependents),
                    receivedAmount: receivedAmount,
                    creditAmount: 0,
                    eligible: false,
                    reason: "You already received the full payment you were eligible for."
                };
            }
            
            // Calculate phase-out percentage based on income and filing status
            const phaseOutPercentage = calculatePhaseOut(adjustedGrossIncome, filingStatus);
            
            // Calculate maximum payment amount
            const maxPayment = this.calculateMaxPayment(filingStatus, dependents);
            
            // Calculate eligible amount after phase-out
            const eligibleAmount = Math.round(maxPayment * phaseOutPercentage);
            
            // Calculate credit amount (eligible amount minus what was already received)
            const creditAmount = Math.max(0, eligibleAmount - (receivedPayment ? receivedAmount : 0));
            
            // Determine eligibility reason
            let reason = "";
            if (creditAmount > 0) {
                if (receivedPayment) {
                    reason = "You received a partial payment and are eligible for the remaining amount.";
                } else {
                    reason = "You did not receive a payment but are eligible based on your 2021 information.";
                }
            } else if (phaseOutPercentage === 0) {
                reason = "Your income exceeds the eligibility threshold for the Recovery Rebate Credit.";
            } else {
                reason = "You already received the full payment you were eligible for.";
            }
            
            return {
                eligibleAmount,
                maxPayment,
                receivedAmount: receivedPayment ? receivedAmount : 0,
                creditAmount,
                eligible: creditAmount > 0,
                reason
            };
        },
        
        // Calculate the maximum possible payment amount
        calculateMaxPayment: function(filingStatus, dependents) {
            let taxpayerCount = 0;
            
            switch(filingStatus) {
                case 'single':
                case 'head':
                case 'separate':
                    taxpayerCount = 1;
                    break;
                case 'joint':
                case 'widow':
                    taxpayerCount = 2;
                    break;
                default:
                    taxpayerCount = 1;
            }
            
            // Calculate total payment amount
            return PAYMENT_AMOUNT * (taxpayerCount + (dependents || 0));
        },
        
        // Generate an explanation of the calculation
        generateExplanation: function(result, data) {
            const {
                filingStatus,
                adjustedGrossIncome,
                receivedPayment,
                dependents
            } = data;
            
            let explanation = `<div class="calculation-explanation">`;
            
            // Step 1: Maximum payment amount
            explanation += `
                <div class="calculation-step">
                    <h4>Step 1: Determine Maximum Payment Amount</h4>
                    <p>The third Economic Impact Payment was $1,400 per eligible individual.</p>
                    <ul>
            `;
            
            if (filingStatus === 'joint') {
                explanation += `<li>Filing jointly: 2 x $1,400 = $2,800</li>`;
            } else {
                explanation += `<li>Filing as ${this.getFilingStatusText(filingStatus)}: 1 x $1,400 = $1,400</li>`;
            }
            
            if (dependents > 0) {
                explanation += `<li>${dependents} dependent(s): ${dependents} x $1,400 = $${dependents * 1400}</li>`;
            }
            
            explanation += `
                        <li><strong>Maximum possible payment: $${result.maxPayment}</strong></li>
                    </ul>
                </div>
            `;
            
            // Step 2: Income phase-out
            explanation += `
                <div class="calculation-step">
                    <h4>Step 2: Apply Income Phase-Out Rules</h4>
                    <p>The payment phases out for higher incomes:</p>
                    <ul>
                        <li>Your 2021 Adjusted Gross Income: $${adjustedGrossIncome}</li>
            `;
            
            let phaseOutStart, phaseOutEnd;
            switch(filingStatus) {
                case 'single':
                case 'separate':
                    phaseOutStart = PHASE_OUT_SINGLE_START;
                    phaseOutEnd = MAX_SINGLE_INCOME;
                    break;
                case 'head':
                    phaseOutStart = PHASE_OUT_HOH_START;
                    phaseOutEnd = MAX_HOH_INCOME;
                    break;
                case 'joint':
                case 'widow':
                    phaseOutStart = PHASE_OUT_JOINT_START;
                    phaseOutEnd = MAX_JOINT_INCOME;
                    break;
            }
            
            explanation += `<li>Phase-out begins at: $${phaseOutStart}</li>`;
            explanation += `<li>Payment fully phases out at: $${phaseOutEnd}</li>`;
            
            if (adjustedGrossIncome <= phaseOutStart) {
                explanation += `<li>Your income is below the phase-out threshold, so you're eligible for the full amount.</li>`;
            } else if (adjustedGrossIncome >= phaseOutEnd) {
                explanation += `<li>Your income exceeds the maximum threshold, so you're not eligible for a payment.</li>`;
            } else {
                const phaseOutRange = phaseOutEnd - phaseOutStart;
                const incomeOverStart = adjustedGrossIncome - phaseOutStart;
                const phaseOutPercentage = 1 - (incomeOverStart / phaseOutRange);
                const percentFormatted = Math.round(phaseOutPercentage * 100);
                
                explanation += `
                    <li>Your income is in the phase-out range.</li>
                    <li>Phase-out calculation: ${percentFormatted}% of maximum payment</li>
                    <li>$${result.maxPayment} x ${percentFormatted}% = $${result.eligibleAmount}</li>
                `;
            }
            
            explanation += `
                        <li><strong>Amount you're eligible for: $${result.eligibleAmount}</strong></li>
                    </ul>
                </div>
            `;
            
            // Step 3: Calculate credit
            explanation += `
                <div class="calculation-step">
                    <h4>Step 3: Calculate Recovery Rebate Credit</h4>
                    <ul>
                        <li>Amount you're eligible for: $${result.eligibleAmount}</li>
            `;
            
            if (receivedPayment) {
                explanation += `
                    <li>Amount you already received: $${result.receivedAmount}</li>
                    <li>Recovery Rebate Credit: $${result.eligibleAmount} - $${result.receivedAmount} = $${result.creditAmount}</li>
                `;
            } else {
                explanation += `
                    <li>Amount you already received: $0</li>
                    <li>Recovery Rebate Credit: $${result.eligibleAmount} - $0 = $${result.creditAmount}</li>
                `;
            }
            
            explanation += `
                        <li><strong>Your Recovery Rebate Credit: $${result.creditAmount}</strong></li>
                    </ul>
                </div>
            `;
            
            // Final result
            explanation += `
                <div class="calculation-result">
                    <h4>Final Result</h4>
                    <p>${result.reason}</p>
                    <p class="result-amount">Recovery Rebate Credit: <strong>$${result.creditAmount}</strong></p>
                    <p class="result-note">This amount will be entered on Line 30 of your 2021 Form 1040.</p>
                </div>
            `;
            
            explanation += `</div>`;
            
            return explanation;
        },
        
        // Get text representation of filing status
        getFilingStatusText: function(status) {
            switch(status) {
                case 'single': return 'Single';
                case 'joint': return 'Married Filing Jointly';
                case 'separate': return 'Married Filing Separately';
                case 'head': return 'Head of Household';
                case 'widow': return 'Qualifying Widow(er)';
                default: return status;
            }
        },
        
        // Initialize the calculator UI
        initCalculator: function(containerId, resultContainerId) {
            const container = document.getElementById(containerId);
            const resultContainer = document.getElementById(resultContainerId);
            
            if (!container || !resultContainer) return;
            
            // Add event listener to the form
            container.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const filingStatus = document.getElementById('filingStatus').value;
                const adjustedGrossIncome = parseFloat(document.getElementById('adjustedGrossIncome').value) || 0;
                const receivedPayment = document.getElementById('receivedPayment').value === 'yes';
                const receivedAmount = parseFloat(document.getElementById('receivedAmount').value) || 0;
                const dependents = parseInt(document.getElementById('dependents').value) || 0;
                
                // Calculate rebate credit
                const result = this.calculateRebateCredit({
                    filingStatus,
                    adjustedGrossIncome,
                    receivedPayment,
                    receivedAmount,
                    dependents
                });
                
                // Generate explanation
                const explanation = this.generateExplanation(result, {
                    filingStatus,
                    adjustedGrossIncome,
                    receivedPayment,
                    receivedAmount,
                    dependents
                });
                
                // Display result
                resultContainer.innerHTML = `
                    <div class="calculator-result ${result.eligible ? 'eligible' : 'not-eligible'}">
                        <div class="result-header">
                            <h3>Your Recovery Rebate Credit Result</h3>
                        </div>
                        <div class="result-body">
                            <div class="result-amount-box">
                                <div class="result-label">Your Recovery Rebate Credit:</div>
                                <div class="result-amount">$${result.creditAmount.toFixed(2)}</div>
                            </div>
                            <div class="result-message">
                                <p>${result.reason}</p>
                            </div>
                            ${explanation}
                        </div>
                        <div class="result-actions">
                            <button type="button" class="btn btn-primary" id="startFilingBtn">
                                <i class="fas fa-file-alt"></i> Start Filing to Claim Your Credit
                            </button>
                            <button type="button" class="btn btn-secondary" id="recalculateBtn">
                                <i class="fas fa-calculator"></i> Recalculate
                            </button>
                        </div>
                    </div>
                `;
                
                // Show result container
                resultContainer.style.display = 'block';
                
                // Scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth' });
                
                // Add event listeners to buttons
                document.getElementById('startFilingBtn').addEventListener('click', () => {
                    // Store calculation result for use in the filing process
                    sessionStorage.setItem('rebateCalculation', JSON.stringify(result));
                    
                    // Navigate to filing tool
                    document.querySelector('.calculator-section').style.display = 'none';
                    document.querySelector('.filing-tool').style.display = 'block';
                    document.getElementById('filingStep1').classList.add('active');
                });
                
                document.getElementById('recalculateBtn').addEventListener('click', () => {
                    resultContainer.style.display = 'none';
                    container.reset();
                });
            });
            
            // Show/hide received amount field based on selection
            document.getElementById('receivedPayment').addEventListener('change', function() {
                const receivedAmountGroup = document.getElementById('receivedAmountGroup');
                receivedAmountGroup.style.display = this.value === 'yes' ? 'block' : 'none';
                
                if (this.value === 'no') {
                    document.getElementById('receivedAmount').value = '0';
                }
            });
        }
    };
})();

// Export the module
export default RebateCalculator;
