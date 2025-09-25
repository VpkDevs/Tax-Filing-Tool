/**
 * Real-time Tax Calculation Engine
 * Provides instant tax calculations as users input data - similar to professional tax software
 */

const RealTimeTaxCalculator = (function() {
    // 2023 Tax Year Constants (expandable for multi-year support)
    const TAX_YEAR = 2023;
    const STANDARD_DEDUCTIONS = {
        'single': 13850,
        'joint': 27700,
        'separate': 13850,
        'head': 20800,
        'widow': 27700
    };

    const TAX_BRACKETS = {
        'single': [
            { min: 0, max: 11000, rate: 0.10 },
            { min: 11000, max: 44725, rate: 0.12 },
            { min: 44725, max: 95375, rate: 0.22 },
            { min: 95375, max: 182050, rate: 0.24 },
            { min: 182050, max: 231250, rate: 0.32 },
            { min: 231250, max: 578125, rate: 0.35 },
            { min: 578125, max: Infinity, rate: 0.37 }
        ],
        'joint': [
            { min: 0, max: 22000, rate: 0.10 },
            { min: 22000, max: 89450, rate: 0.12 },
            { min: 89450, max: 190750, rate: 0.22 },
            { min: 190750, max: 364200, rate: 0.24 },
            { min: 364200, max: 462500, rate: 0.32 },
            { min: 462500, max: 693750, rate: 0.35 },
            { min: 693750, max: Infinity, rate: 0.37 }
        ],
        'separate': [
            { min: 0, max: 11000, rate: 0.10 },
            { min: 11000, max: 44725, rate: 0.12 },
            { min: 44725, max: 95375, rate: 0.22 },
            { min: 95375, max: 182100, rate: 0.24 },
            { min: 182100, max: 231250, rate: 0.32 },
            { min: 231250, max: 346875, rate: 0.35 },
            { min: 346875, max: Infinity, rate: 0.37 }
        ],
        'head': [
            { min: 0, max: 15700, rate: 0.10 },
            { min: 15700, max: 59850, rate: 0.12 },
            { min: 59850, max: 95350, rate: 0.22 },
            { min: 95350, max: 182050, rate: 0.24 },
            { min: 182050, max: 231250, rate: 0.32 },
            { min: 231250, max: 578100, rate: 0.35 },
            { min: 578100, max: Infinity, rate: 0.37 }
        ],
        'widow': [
            { min: 0, max: 22000, rate: 0.10 },
            { min: 22000, max: 89450, rate: 0.12 },
            { min: 89450, max: 190750, rate: 0.22 },
            { min: 190750, max: 364200, rate: 0.24 },
            { min: 364200, max: 462500, rate: 0.32 },
            { min: 462500, max: 693750, rate: 0.35 },
            { min: 693750, max: Infinity, rate: 0.37 }
        ]
    };

    // Private variables for caching
    let calculationCache = new Map();
    let listeners = [];
    let currentTaxData = {
        wages: 0,
        filingStatus: 'single',
        dependents: 0,
        itemizedDeductions: 0,
        withholdings: 0,
        otherIncome: 0,
        adjustments: 0
    };

    // Private methods
    function calculateFederalTax(taxableIncome, filingStatus) {
        const cacheKey = `${taxableIncome}-${filingStatus}`;
        if (calculationCache.has(cacheKey)) {
            return calculationCache.get(cacheKey);
        }

        const brackets = TAX_BRACKETS[filingStatus] || TAX_BRACKETS['single'];
        let totalTax = 0;
        let remainingIncome = taxableIncome;

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;

            const taxableAtBracket = Math.min(remainingIncome, bracket.max - bracket.min);
            if (taxableAtBracket > 0) {
                totalTax += taxableAtBracket * bracket.rate;
                remainingIncome -= taxableAtBracket;
            }
        }

        const result = Math.round(totalTax);
        calculationCache.set(cacheKey, result);
        return result;
    }

    function calculateAGI(data) {
        return Math.max(0, data.wages + data.otherIncome - data.adjustments);
    }

    function calculateTaxableIncome(agi, filingStatus, dependents, itemizedDeductions) {
        const standardDeduction = STANDARD_DEDUCTIONS[filingStatus] || STANDARD_DEDUCTIONS['single'];
        const deduction = Math.max(standardDeduction, itemizedDeductions);
        return Math.max(0, agi - deduction);
    }

    function calculateChildTaxCredit(dependents, agi, filingStatus) {
        // Simplified Child Tax Credit calculation
        const phaseOutThresholds = {
            'joint': 400000,
            'separate': 200000,
            'single': 200000,
            'head': 200000,
            'widow': 400000
        };

        const creditAmount = Math.min(dependents, 3) * 2000; // Up to 3 children for full credit
        const threshold = phaseOutThresholds[filingStatus] || 200000;
        
        if (agi <= threshold) {
            return creditAmount;
        }

        const phaseOutReduction = Math.ceil((agi - threshold) / 1000) * 50;
        return Math.max(0, creditAmount - phaseOutReduction);
    }

    function calculateEITC(agi, filingStatus, dependents) {
        // Simplified Earned Income Tax Credit calculation
        const eicTables = {
            0: { maxCredit: 600, phaseInRate: 0.0765, phaseOutStart: 9800, phaseOutRate: 0.0765 },
            1: { maxCredit: 3995, phaseInRate: 0.34, phaseOutStart: 20330, phaseOutRate: 0.1598 },
            2: { maxCredit: 6604, phaseInRate: 0.40, phaseOutStart: 20330, phaseOutRate: 0.2106 },
            3: { maxCredit: 7430, phaseInRate: 0.45, phaseOutStart: 20330, phaseOutRate: 0.2106 }
        };

        const creditCount = Math.min(dependents, 3);
        const table = eicTables[creditCount];
        
        if (!table) return 0;

        // Adjust phase-out start for filing status
        let phaseOutStart = table.phaseOutStart;
        if (filingStatus === 'joint') {
            phaseOutStart += 6000; // Marriage bonus
        }

        if (agi <= phaseOutStart) {
            return Math.min(table.maxCredit, agi * table.phaseInRate);
        }

        const phaseOutReduction = (agi - phaseOutStart) * table.phaseOutRate;
        return Math.max(0, table.maxCredit - phaseOutReduction);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function notifyListeners(calculations) {
        listeners.forEach(listener => {
            try {
                listener(calculations);
            } catch (error) {
                console.error('Error in tax calculation listener:', error);
            }
        });
    }

    // Public API
    return {
        // Initialize the calculator
        init: function() {
            // Clear cache on initialization
            calculationCache.clear();
            console.log('Real-time Tax Calculator initialized');
        },

        // Update tax data and trigger recalculation
        updateData: function(updates) {
            Object.assign(currentTaxData, updates);
            this.recalculate();
        },

        // Perform complete tax calculation
        recalculate: function() {
            const data = currentTaxData;
            
            // Core calculations
            const agi = calculateAGI(data);
            const taxableIncome = calculateTaxableIncome(agi, data.filingStatus, data.dependents, data.itemizedDeductions);
            const federalTax = calculateFederalTax(taxableIncome, data.filingStatus);
            
            // Credits
            const childTaxCredit = calculateChildTaxCredit(data.dependents, agi, data.filingStatus);
            const eic = calculateEITC(agi, data.filingStatus, data.dependents);
            const totalCredits = childTaxCredit + eic;
            
            // Final calculations
            const taxAfterCredits = Math.max(0, federalTax - totalCredits);
            const refundOrOwe = data.withholdings - taxAfterCredits;
            
            const calculations = {
                agi: agi,
                taxableIncome: taxableIncome,
                federalTax: federalTax,
                childTaxCredit: childTaxCredit,
                eic: eic,
                totalCredits: totalCredits,
                taxAfterCredits: taxAfterCredits,
                withholdings: data.withholdings,
                refundOrOwe: refundOrOwe,
                effectiveRate: agi > 0 ? (taxAfterCredits / agi * 100) : 0,
                marginalRate: this.getMarginalRate(taxableIncome, data.filingStatus) * 100,
                formatted: {
                    agi: formatCurrency(agi),
                    taxableIncome: formatCurrency(taxableIncome),
                    federalTax: formatCurrency(federalTax),
                    childTaxCredit: formatCurrency(childTaxCredit),
                    eic: formatCurrency(eic),
                    totalCredits: formatCurrency(totalCredits),
                    taxAfterCredits: formatCurrency(taxAfterCredits),
                    withholdings: formatCurrency(data.withholdings),
                    refundOrOwe: formatCurrency(Math.abs(refundOrOwe)),
                    refundOrOweLabel: refundOrOwe >= 0 ? 'Refund' : 'Amount Owed'
                }
            };

            notifyListeners(calculations);
            return calculations;
        },

        // Get marginal tax rate for a given income
        getMarginalRate: function(taxableIncome, filingStatus) {
            const brackets = TAX_BRACKETS[filingStatus] || TAX_BRACKETS['single'];
            
            for (const bracket of brackets) {
                if (taxableIncome >= bracket.min && taxableIncome < bracket.max) {
                    return bracket.rate;
                }
            }
            
            return brackets[brackets.length - 1].rate; // Highest bracket
        },

        // Add listener for calculation updates
        addListener: function(listener) {
            if (typeof listener === 'function') {
                listeners.push(listener);
            }
        },

        // Remove listener
        removeListener: function(listener) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        },

        // Get current tax data
        getCurrentData: function() {
            return { ...currentTaxData };
        },

        // Advanced scenario calculations
        calculateScenario: function(scenarioData) {
            const originalData = { ...currentTaxData };
            Object.assign(currentTaxData, scenarioData);
            const result = this.recalculate();
            currentTaxData = originalData; // Restore original data
            return result;
        },

        // Tax optimization suggestions
        getOptimizationSuggestions: function() {
            const current = this.recalculate();
            const suggestions = [];

            // Check if itemizing would be beneficial
            const standardDeduction = STANDARD_DEDUCTIONS[currentTaxData.filingStatus];
            if (currentTaxData.itemizedDeductions > standardDeduction) {
                suggestions.push({
                    type: 'deduction',
                    title: 'Itemize Deductions',
                    description: `You could save ${formatCurrency(
                        (currentTaxData.itemizedDeductions - standardDeduction) * this.getMarginalRate(current.taxableIncome, currentTaxData.filingStatus)
                    )} by itemizing deductions instead of taking the standard deduction.`,
                    priority: 'high'
                });
            }

            // Check for additional child tax credit opportunity
            if (currentTaxData.dependents > 0 && current.eic === 0 && current.agi > 50000) {
                suggestions.push({
                    type: 'credit',
                    title: 'Consider Additional Child Tax Credit',
                    description: 'You may qualify for additional child-related tax benefits.',
                    priority: 'medium'
                });
            }

            return suggestions;
        },

        // Clear calculation cache
        clearCache: function() {
            calculationCache.clear();
        },

        // Export for testing
        _testing: {
            calculateFederalTax,
            calculateAGI,
            calculateTaxableIncome,
            TAX_BRACKETS,
            STANDARD_DEDUCTIONS
        }
    };
})();

// Export the module
export default RealTimeTaxCalculator;