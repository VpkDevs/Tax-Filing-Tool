/**
 * Recovery Rebate Credit Calculator Module
 *
 * Calculates the Recovery Rebate Credit amount based on user inputs
 */

const RebateCalculator = {
    // Constants
    MAX_SINGLE_INCOME: 80000,
    MAX_HOH_INCOME: 120000,
    MAX_JOINT_INCOME: 160000,
    PHASE_OUT_SINGLE_START: 75000,
    PHASE_OUT_HOH_START: 112500,
    PHASE_OUT_JOINT_START: 150000,
    PAYMENT_AMOUNT: 1400,

    /**
     * Initialize the calculator
     */
    init: function() {
        // Get form and result container
        const form = document.getElementById('calculator-form');
        const resultContainer = document.getElementById('calculator-result');

        // Get received payment select
        const receivedPaymentSelect = document.getElementById('receivedPayment');
        const receivedAmountGroup = document.getElementById('receivedAmountGroup');

        // Add event listener to received payment select
        if (receivedPaymentSelect) {
            receivedPaymentSelect.addEventListener('change', () => {
                if (receivedPaymentSelect.value === 'yes') {
                    receivedAmountGroup.style.display = 'block';
                } else {
                    receivedAmountGroup.style.display = 'none';
                }
            });
        }

        // Add event listener to form
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Get form values
                const filingStatus = document.getElementById('filingStatus').value;
                const adjustedGrossIncome = parseFloat(document.getElementById('adjustedGrossIncome').value) || 0;
                const dependents = parseInt(document.getElementById('dependents').value) || 0;
                const receivedPayment = document.getElementById('receivedPayment').value === 'yes';
                const receivedAmount = receivedPayment ? parseFloat(document.getElementById('receivedAmount').value) || 0 : 0;

                // Validate form
                if (!filingStatus) {
                    alert('Please select your filing status');
                    return;
                }

                if (isNaN(adjustedGrossIncome)) {
                    alert('Please enter a valid adjusted gross income');
                    return;
                }

                if (receivedPayment && isNaN(receivedAmount)) {
                    alert('Please enter a valid received amount');
                    return;
                }

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

                    // Navigate to filing section
                    const fileNowSection = document.getElementById('file-now');
                    if (fileNowSection) {
                        fileNowSection.scrollIntoView({ behavior: 'smooth' });

                        // Start filing process
                        if (window.FilingSteps) {
                            window.FilingSteps.goToStep(1);
                        }
                    }
                });

                document.getElementById('recalculateBtn').addEventListener('click', () => {
                    // Reset form
                    form.reset();

                    // Hide result container
                    resultContainer.style.display = 'none';

                    // Hide received amount group
                    receivedAmountGroup.style.display = 'none';

                    // Scroll to form
                    form.scrollIntoView({ behavior: 'smooth' });
                });
            });
        }

        console.log('Rebate Calculator initialized');
    },

    /**
     * Calculate the Recovery Rebate Credit amount
     * @param {Object} data - The data to calculate the credit from
     * @returns {Object} - The calculation result
     */
    calculateRebateCredit: function(data) {
        const {
            filingStatus,
            adjustedGrossIncome,
            receivedPayment,
            receivedAmount,
            dependents
        } = data;

        // Calculate maximum payment amount
        const maxPayment = this.calculateMaxPayment(filingStatus, dependents);

        // If they already received the full payment, no credit is due
        if (receivedPayment && receivedAmount >= maxPayment) {
            return {
                eligibleAmount: maxPayment,
                maxPayment: maxPayment,
                receivedAmount: receivedAmount,
                creditAmount: 0,
                eligible: false,
                reason: "You already received the full payment you were eligible for."
            };
        }

        // Calculate phase-out percentage based on income and filing status
        const phaseOutPercentage = this.calculatePhaseOut(adjustedGrossIncome, filingStatus);

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

    /**
     * Calculate the phase-out percentage based on income and filing status
     * @param {number} income - The adjusted gross income
     * @param {string} filingStatus - The filing status
     * @returns {number} - The phase-out percentage (0-1)
     */
    calculatePhaseOut: function(income, filingStatus) {
        let phaseOutStart, maxIncome;

        // Set phase-out start and max income based on filing status
        switch (filingStatus) {
            case 'single':
            case 'separate':
                phaseOutStart = this.PHASE_OUT_SINGLE_START;
                maxIncome = this.MAX_SINGLE_INCOME;
                break;
            case 'head':
                phaseOutStart = this.PHASE_OUT_HOH_START;
                maxIncome = this.MAX_HOH_INCOME;
                break;
            case 'joint':
            case 'widow':
                phaseOutStart = this.PHASE_OUT_JOINT_START;
                maxIncome = this.MAX_JOINT_INCOME;
                break;
            default:
                phaseOutStart = this.PHASE_OUT_SINGLE_START;
                maxIncome = this.MAX_SINGLE_INCOME;
        }

        // Calculate phase-out percentage
        if (income <= phaseOutStart) {
            return 1; // Full payment
        } else if (income >= maxIncome) {
            return 0; // No payment
        } else {
            // Partial payment (linear phase-out)
            const phaseOutRange = maxIncome - phaseOutStart;
            const incomeOverStart = income - phaseOutStart;
            return 1 - (incomeOverStart / phaseOutRange);
        }
    },

    /**
     * Calculate the maximum payment amount based on filing status and dependents
     * @param {string} filingStatus - The filing status
     * @param {number} dependents - The number of dependents
     * @returns {number} - The maximum payment amount
     */
    calculateMaxPayment: function(filingStatus, dependents) {
        // Calculate base payment based on filing status
        let basePayment = 0;

        if (filingStatus === 'joint' || filingStatus === 'widow') {
            basePayment = this.PAYMENT_AMOUNT * 2; // Two adults
        } else {
            basePayment = this.PAYMENT_AMOUNT; // One adult
        }

        // Add payment for dependents
        const dependentPayment = this.PAYMENT_AMOUNT * dependents;

        return basePayment + dependentPayment;
    },

    /**
     * Get the filing status text
     * @param {string} filingStatus - The filing status code
     * @returns {string} - The filing status text
     */
    getFilingStatusText: function(filingStatus) {
        switch (filingStatus) {
            case 'single':
                return 'Single';
            case 'head':
                return 'Head of Household';
            case 'joint':
                return 'Married Filing Jointly';
            case 'separate':
                return 'Married Filing Separately';
            case 'widow':
                return 'Qualifying Widow(er)';
            default:
                return filingStatus;
        }
    },

    /**
     * Generate an explanation of the calculation
     * @param {Object} result - The calculation result
     * @param {Object} data - The data used for calculation
     * @returns {string} - The HTML explanation
     */
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

        if (filingStatus === 'joint' || filingStatus === 'widow') {
            explanation += `<li>Filing as ${this.getFilingStatusText(filingStatus)}: 2 x $1,400 = $2,800</li>`;
        } else {
            explanation += `<li>Filing as ${this.getFilingStatusText(filingStatus)}: 1 x $1,400 = $1,400</li>`;
        }

        if (dependents > 0) {
            explanation += `<li>${dependents} dependent(s): ${dependents} x $1,400 = $${(dependents * this.PAYMENT_AMOUNT).toFixed(2)}</li>`;
        }

        explanation += `<li>Maximum payment amount: $${result.maxPayment.toFixed(2)}</li>`;
        explanation += `</ul></div>`;

        // Step 2: Income phase-out
        explanation += `
            <div class="calculation-step">
                <h4>Step 2: Apply Income Phase-Out</h4>
                <p>The Recovery Rebate Credit phases out for higher incomes.</p>
        `;

        let phaseOutStart, maxIncome;

        switch (filingStatus) {
            case 'single':
            case 'separate':
                phaseOutStart = this.PHASE_OUT_SINGLE_START;
                maxIncome = this.MAX_SINGLE_INCOME;
                break;
            case 'head':
                phaseOutStart = this.PHASE_OUT_HOH_START;
                maxIncome = this.MAX_HOH_INCOME;
                break;
            case 'joint':
            case 'widow':
                phaseOutStart = this.PHASE_OUT_JOINT_START;
                maxIncome = this.MAX_JOINT_INCOME;
                break;
            default:
                phaseOutStart = this.PHASE_OUT_SINGLE_START;
                maxIncome = this.MAX_SINGLE_INCOME;
        }

        explanation += `<p>For ${this.getFilingStatusText(filingStatus)}, the phase-out begins at $${phaseOutStart.toLocaleString()} and completes at $${maxIncome.toLocaleString()}.</p>`;

        if (adjustedGrossIncome <= phaseOutStart) {
            explanation += `<p>Your income ($${adjustedGrossIncome.toLocaleString()}) is below the phase-out threshold, so you're eligible for the full amount.</p>`;
        } else if (adjustedGrossIncome >= maxIncome) {
            explanation += `<p>Your income ($${adjustedGrossIncome.toLocaleString()}) exceeds the maximum threshold, so you're not eligible for the credit.</p>`;
        } else {
            const phaseOutRange = maxIncome - phaseOutStart;
            const incomeOverStart = adjustedGrossIncome - phaseOutStart;
            const phaseOutPercentage = 1 - (incomeOverStart / phaseOutRange);

            explanation += `
                <p>Your income ($${adjustedGrossIncome.toLocaleString()}) is in the phase-out range:</p>
                <ul>
                    <li>Amount over threshold: $${incomeOverStart.toLocaleString()}</li>
                    <li>Phase-out range: $${phaseOutRange.toLocaleString()}</li>
                    <li>Phase-out percentage: ${Math.round(phaseOutPercentage * 100)}%</li>
                    <li>Eligible amount after phase-out: $${result.maxPayment.toFixed(2)} x ${Math.round(phaseOutPercentage * 100)}% = $${result.eligibleAmount.toFixed(2)}</li>
                </ul>
            `;
        }

        explanation += `</div>`;

        // Step 3: Subtract received amount
        explanation += `
            <div class="calculation-step">
                <h4>Step 3: Subtract Amount Already Received</h4>
        `;

        if (receivedPayment) {
            explanation += `
                <p>You indicated that you received $${result.receivedAmount.toFixed(2)} from the third stimulus payment.</p>
                <p>Recovery Rebate Credit = Eligible Amount - Amount Already Received</p>
                <p>$${result.eligibleAmount.toFixed(2)} - $${result.receivedAmount.toFixed(2)} = $${result.creditAmount.toFixed(2)}</p>
            `;
        } else {
            explanation += `
                <p>You indicated that you did not receive the third stimulus payment.</p>
                <p>Recovery Rebate Credit = Eligible Amount = $${result.eligibleAmount.toFixed(2)}</p>
            `;
        }

        explanation += `</div>`;

        // Final result
        explanation += `
            <div class="calculation-step">
                <h4>Final Result</h4>
                <p>Based on the information you provided, you are ${result.eligible ? 'eligible' : 'not eligible'} for a Recovery Rebate Credit of $${result.creditAmount.toFixed(2)}.</p>
            </div>
        `;

        explanation += `</div>`;

        return explanation;
    }
};

// Export the module
window.RebateCalculator = RebateCalculator;

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    RebateCalculator.init();
});
