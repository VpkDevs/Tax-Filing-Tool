/**
 * Tax Logic Module
 * 
 * Handles tax calculations for the Tax Filing Tool
 */

const TaxLogic = {
    /**
     * Initialize the tax logic module
     */
    init: function() {
        // Add event listeners to tax calculator elements
        const calculateTaxBtn = document.getElementById('calculate-tax');
        if (calculateTaxBtn) {
            calculateTaxBtn.addEventListener('click', this.handleCalculateTax.bind(this));
        }
        
        // Initialize input formatters
        this.initInputFormatters();
        
        console.log('Tax Logic initialized');
    },
    
    /**
     * Initialize input formatters for tax calculator inputs
     */
    initInputFormatters: function() {
        const incomeInput = document.getElementById('income');
        const deductionsInput = document.getElementById('deductions');
        
        if (incomeInput) {
            incomeInput.addEventListener('input', () => {
                this.formatCurrencyInput(incomeInput);
            });
        }
        
        if (deductionsInput) {
            deductionsInput.addEventListener('input', () => {
                this.formatCurrencyInput(deductionsInput);
            });
        }
    },
    
    /**
     * Format currency input
     * @param {HTMLInputElement} input - The input element to format
     */
    formatCurrencyInput: function(input) {
        // Remove non-numeric characters except decimal point
        let value = input.value.replace(/[^\d.]/g, '');
        
        // Handle decimal points
        const parts = value.split('.');
        if (parts.length > 2) {
            // More than one decimal point, keep only the first one
            value = `${parts[0]}.${parts.slice(1).join('')}`;
        }
        
        if (parts.length > 1) {
            // Limit to 2 decimal places
            value = `${parts[0]}.${parts[1].slice(0, 2)}`;
        }
        
        // Parse as number and format
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            input.value = numValue.toLocaleString('en-US', {
                minimumFractionDigits: parts.length > 1 ? 2 : 0,
                maximumFractionDigits: 2
            });
        } else {
            input.value = '';
        }
    },
    
    /**
     * Handle calculate tax button click
     */
    handleCalculateTax: function() {
        // Get input values
        const income = this.parseNumber(document.getElementById('income').value);
        const filingStatus = document.getElementById('filingStatus').value;
        const dependents = parseInt(document.getElementById('dependents').value) || 0;
        const itemizedDeductions = this.parseNumber(document.getElementById('deductions').value);
        
        // Calculate tax
        const taxableIncome = this.calculateTaxableIncome(income, filingStatus, dependents, itemizedDeductions);
        const taxLiability = this.calculateTaxLiability(taxableIncome, filingStatus);
        const effectiveTaxRate = this.calculateEffectiveTaxRate(income, taxLiability);
        const taxBreakdown = this.calculateTaxBreakdown(taxableIncome, filingStatus);
        
        // Update UI
        this.updateTaxResults(income, taxableIncome, taxLiability, effectiveTaxRate, filingStatus, dependents, itemizedDeductions);
        this.updateTaxBreakdown(taxBreakdown);
        
        // Save calculation to history
        this.saveCalculationToHistory(income, filingStatus, dependents, itemizedDeductions, taxableIncome, taxLiability, effectiveTaxRate);
    },
    
    /**
     * Parse number from formatted string
     * @param {string} value - The formatted string to parse
     * @returns {number} - The parsed number
     */
    parseNumber: function(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
    },
    
    /**
     * Get standard deduction based on filing status
     * @param {string} filingStatus - The filing status
     * @returns {number} - The standard deduction amount
     */
    getStandardDeduction: function(filingStatus) {
        switch (filingStatus) {
            case 'single':
                return 12950;
            case 'married':
                return 25900;
            case 'marriedSeparate':
                return 12950;
            case 'headOfHousehold':
                return 19400;
            case 'widow':
                return 25900;
            default:
                return 12950;
        }
    },
    
    /**
     * Get tax brackets based on filing status
     * @param {string} filingStatus - The filing status
     * @returns {Array} - The tax brackets
     */
    getTaxBrackets: function(filingStatus) {
        switch (filingStatus) {
            case 'single':
                return [
                    { rate: 0.10, min: 0, max: 10275 },
                    { rate: 0.12, min: 10275, max: 41775 },
                    { rate: 0.22, min: 41775, max: 89075 },
                    { rate: 0.24, min: 89075, max: 170050 },
                    { rate: 0.32, min: 170050, max: 215950 },
                    { rate: 0.35, min: 215950, max: 539900 },
                    { rate: 0.37, min: 539900, max: Infinity }
                ];
            case 'married':
                return [
                    { rate: 0.10, min: 0, max: 20550 },
                    { rate: 0.12, min: 20550, max: 83550 },
                    { rate: 0.22, min: 83550, max: 178150 },
                    { rate: 0.24, min: 178150, max: 340100 },
                    { rate: 0.32, min: 340100, max: 431900 },
                    { rate: 0.35, min: 431900, max: 647850 },
                    { rate: 0.37, min: 647850, max: Infinity }
                ];
            case 'marriedSeparate':
                return [
                    { rate: 0.10, min: 0, max: 10275 },
                    { rate: 0.12, min: 10275, max: 41775 },
                    { rate: 0.22, min: 41775, max: 89075 },
                    { rate: 0.24, min: 89075, max: 170050 },
                    { rate: 0.32, min: 170050, max: 215950 },
                    { rate: 0.35, min: 215950, max: 323925 },
                    { rate: 0.37, min: 323925, max: Infinity }
                ];
            case 'headOfHousehold':
                return [
                    { rate: 0.10, min: 0, max: 14650 },
                    { rate: 0.12, min: 14650, max: 55900 },
                    { rate: 0.22, min: 55900, max: 89050 },
                    { rate: 0.24, min: 89050, max: 170050 },
                    { rate: 0.32, min: 170050, max: 215950 },
                    { rate: 0.35, min: 215950, max: 539900 },
                    { rate: 0.37, min: 539900, max: Infinity }
                ];
            case 'widow':
                return [
                    { rate: 0.10, min: 0, max: 20550 },
                    { rate: 0.12, min: 20550, max: 83550 },
                    { rate: 0.22, min: 83550, max: 178150 },
                    { rate: 0.24, min: 178150, max: 340100 },
                    { rate: 0.32, min: 340100, max: 431900 },
                    { rate: 0.35, min: 431900, max: 647850 },
                    { rate: 0.37, min: 647850, max: Infinity }
                ];
            default:
                return this.getTaxBrackets('single');
        }
    },
    
    /**
     * Get dependent exemption amount
     * @param {number} dependents - The number of dependents
     * @returns {number} - The dependent exemption amount
     */
    getDependentExemption: function(dependents) {
        return dependents * 2000;
    },
    
    /**
     * Calculate taxable income
     * @param {number} grossIncome - The gross income
     * @param {string} filingStatus - The filing status
     * @param {number} dependents - The number of dependents
     * @param {number} itemizedDeductions - The itemized deductions
     * @returns {number} - The taxable income
     */
    calculateTaxableIncome: function(grossIncome, filingStatus, dependents, itemizedDeductions) {
        // Get standard deduction
        const standardDeduction = this.getStandardDeduction(filingStatus);
        
        // Get dependent exemption
        const dependentExemption = this.getDependentExemption(dependents);
        
        // Calculate adjusted gross income
        const adjustedGrossIncome = grossIncome - dependentExemption;
        
        // Use the larger of standard deduction or itemized deductions
        const deduction = Math.max(standardDeduction, itemizedDeductions);
        
        // Calculate taxable income
        const taxableIncome = Math.max(0, adjustedGrossIncome - deduction);
        
        return taxableIncome;
    },
    
    /**
     * Calculate tax liability
     * @param {number} taxableIncome - The taxable income
     * @param {string} filingStatus - The filing status
     * @returns {number} - The tax liability
     */
    calculateTaxLiability: function(taxableIncome, filingStatus) {
        // Get tax brackets
        const brackets = this.getTaxBrackets(filingStatus);
        
        // Calculate tax
        let tax = 0;
        
        for (let i = 0; i < brackets.length; i++) {
            const bracket = brackets[i];
            
            if (taxableIncome > bracket.min) {
                const taxableAmount = Math.min(taxableIncome, bracket.max) - bracket.min;
                tax += taxableAmount * bracket.rate;
            }
        }
        
        return tax;
    },
    
    /**
     * Calculate effective tax rate
     * @param {number} grossIncome - The gross income
     * @param {number} taxLiability - The tax liability
     * @returns {number} - The effective tax rate
     */
    calculateEffectiveTaxRate: function(grossIncome, taxLiability) {
        if (grossIncome === 0) return 0;
        return (taxLiability / grossIncome) * 100;
    },
    
    /**
     * Calculate tax breakdown by bracket
     * @param {number} taxableIncome - The taxable income
     * @param {string} filingStatus - The filing status
     * @returns {Array} - The tax breakdown
     */
    calculateTaxBreakdown: function(taxableIncome, filingStatus) {
        // Get tax brackets
        const brackets = this.getTaxBrackets(filingStatus);
        
        // Calculate tax breakdown
        const breakdown = [];
        
        for (let i = 0; i < brackets.length; i++) {
            const bracket = brackets[i];
            
            if (taxableIncome > bracket.min) {
                const taxableAmount = Math.min(taxableIncome, bracket.max) - bracket.min;
                const taxAmount = taxableAmount * bracket.rate;
                
                breakdown.push({
                    rate: bracket.rate,
                    income: taxableAmount,
                    amount: taxAmount
                });
            }
        }
        
        return breakdown;
    },
    
    /**
     * Update tax results in the UI
     * @param {number} grossIncome - The gross income
     * @param {number} taxableIncome - The taxable income
     * @param {number} taxLiability - The tax liability
     * @param {number} effectiveTaxRate - The effective tax rate
     * @param {string} filingStatus - The filing status
     * @param {number} dependents - The number of dependents
     * @param {number} itemizedDeductions - The itemized deductions
     */
    updateTaxResults: function(grossIncome, taxableIncome, taxLiability, effectiveTaxRate, filingStatus, dependents, itemizedDeductions) {
        // Format values
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Get standard deduction
        const standardDeduction = this.getStandardDeduction(filingStatus);
        
        // Get dependent exemption
        const dependentExemption = this.getDependentExemption(dependents);
        
        // Calculate adjusted gross income
        const adjustedGrossIncome = grossIncome - dependentExemption;
        
        // Update UI elements
        document.getElementById('gross-income').textContent = formatter.format(grossIncome);
        document.getElementById('adjusted-income').textContent = formatter.format(adjustedGrossIncome);
        document.getElementById('standard-deduction').textContent = formatter.format(standardDeduction);
        document.getElementById('itemized-deduction').textContent = formatter.format(itemizedDeductions);
        document.getElementById('taxable-income').textContent = formatter.format(taxableIncome);
        document.getElementById('tax-liability').textContent = formatter.format(taxLiability);
        document.getElementById('effective-tax-rate').textContent = `${effectiveTaxRate.toFixed(2)}%`;
    },
    
    /**
     * Update tax breakdown in the UI
     * @param {Array} breakdown - The tax breakdown
     */
    updateTaxBreakdown: function(breakdown) {
        // Get tax brackets element
        const taxBracketsElement = document.getElementById('tax-brackets');
        if (!taxBracketsElement) return;
        
        // Clear existing content
        taxBracketsElement.innerHTML = '';
        
        // Format values
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Create breakdown table
        const table = document.createElement('table');
        table.className = 'tax-bracket-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Tax Bracket</th>
                <th>Taxable Income</th>
                <th>Tax Amount</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        breakdown.forEach(bracket => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${(bracket.rate * 100).toFixed(0)}%</td>
                <td>${formatter.format(bracket.income)}</td>
                <td>${formatter.format(bracket.amount)}</td>
            `;
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        
        // Create table footer
        const tfoot = document.createElement('tfoot');
        const totalTax = breakdown.reduce((sum, bracket) => sum + bracket.amount, 0);
        
        tfoot.innerHTML = `
            <tr>
                <th>Total</th>
                <th></th>
                <th>${formatter.format(totalTax)}</th>
            </tr>
        `;
        
        table.appendChild(tfoot);
        
        // Add table to tax brackets element
        taxBracketsElement.appendChild(table);
    },
    
    /**
     * Save calculation to history
     * @param {number} grossIncome - The gross income
     * @param {string} filingStatus - The filing status
     * @param {number} dependents - The number of dependents
     * @param {number} itemizedDeductions - The itemized deductions
     * @param {number} taxableIncome - The taxable income
     * @param {number} taxLiability - The tax liability
     * @param {number} effectiveTaxRate - The effective tax rate
     */
    saveCalculationToHistory: function(grossIncome, filingStatus, dependents, itemizedDeductions, taxableIncome, taxLiability, effectiveTaxRate) {
        // Create calculation object
        const calculation = {
            timestamp: new Date().toISOString(),
            grossIncome: grossIncome,
            filingStatus: filingStatus,
            dependents: dependents,
            itemizedDeductions: itemizedDeductions,
            taxableIncome: taxableIncome,
            taxLiability: taxLiability,
            effectiveTaxRate: effectiveTaxRate
        };
        
        // Get existing history from localStorage
        let history = [];
        
        if (window.DataStorage) {
            history = window.DataStorage.getItem('taxCalculationHistory') || [];
        } else {
            const historyJson = localStorage.getItem('taxCalculationHistory');
            if (historyJson) {
                try {
                    history = JSON.parse(historyJson);
                } catch (error) {
                    console.error('Error parsing tax calculation history:', error);
                }
            }
        }
        
        // Add new calculation to history
        history.unshift(calculation);
        
        // Limit history to 10 items
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Save history to localStorage
        if (window.DataStorage) {
            window.DataStorage.setItem('taxCalculationHistory', history);
        } else {
            localStorage.setItem('taxCalculationHistory', JSON.stringify(history));
        }
    }
};

// Export the module
window.TaxLogic = TaxLogic;
