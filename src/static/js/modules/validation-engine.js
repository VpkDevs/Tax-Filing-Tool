/**
 * Advanced Error Detection and Validation System
 * Professional-grade validation with intelligent error detection and suggestions
 */

const ValidationEngine = (function() {
    // Validation rules and patterns
    const VALIDATION_RULES = {
        ssn: {
            pattern: /^(\d{3}-?\d{2}-?\d{4}|\d{9})$/,
            message: 'Social Security Number must be in XXX-XX-XXXX format',
            severity: 'error'
        },
        ein: {
            pattern: /^(\d{2}-?\d{7}|\d{9})$/,
            message: 'Employer Identification Number must be in XX-XXXXXXX format',
            severity: 'error'
        },
        phone: {
            pattern: /^(\+1-?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/,
            message: 'Phone number must be in (XXX) XXX-XXXX format',
            severity: 'error'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
            severity: 'error'
        },
        currency: {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: 'Amount must be a valid currency value (e.g., 1234.56)',
            severity: 'error'
        },
        percentage: {
            pattern: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
            message: 'Percentage must be between 0 and 100',
            severity: 'error'
        },
        zipcode: {
            pattern: /^\d{5}(-\d{4})?$/,
            message: 'ZIP code must be in XXXXX or XXXXX-XXXX format',
            severity: 'error'
        },
        bankRouting: {
            pattern: /^\d{9}$/,
            message: 'Routing number must be exactly 9 digits',
            severity: 'error',
            custom: validateRoutingNumber
        },
        bankAccount: {
            pattern: /^\d{4,17}$/,
            message: 'Account number must be 4-17 digits',
            severity: 'error'
        }
    };

    // Business logic validation rules
    const BUSINESS_RULES = {
        // Income validation
        'wages-vs-withholding': {
            check: (data) => {
                const wages = parseFloat(data.wages || 0);
                const withholding = parseFloat(data.federalTaxWithheld || 0);
                return withholding <= wages * 0.5; // Withholding shouldn't exceed 50% of wages
            },
            message: 'Federal tax withheld seems unusually high compared to wages',
            severity: 'warning',
            suggestion: 'Please verify the federal tax withholding amount from your W-2'
        },
        
        // Deduction validation
        'charitable-deduction': {
            check: (data) => {
                const agi = parseFloat(data.agi || 0);
                const charitable = parseFloat(data.charitableDeductions || 0);
                return charitable <= agi * 0.6; // Charitable deductions limit
            },
            message: 'Charitable deductions exceed IRS limits',
            severity: 'error',
            suggestion: 'Charitable deductions are limited to 60% of AGI for cash contributions'
        },

        // Dependent validation
        'dependent-age': {
            check: (data) => {
                if (!data.dependents) return true;
                return data.dependents.every(dep => {
                    const age = calculateAge(dep.birthDate);
                    return age >= 0 && age <= 150;
                });
            },
            message: 'One or more dependent ages are invalid',
            severity: 'error',
            suggestion: 'Please verify birth dates for all dependents'
        },

        // Filing status validation
        'joint-filing-consistency': {
            check: (data) => {
                if (data.filingStatus === 'joint') {
                    return data.spouseSSN && data.spouseSSN.length > 0;
                }
                return true;
            },
            message: 'Spouse SSN is required for joint filing',
            severity: 'error',
            suggestion: 'Enter your spouse\'s Social Security Number for joint filing'
        }
    };

    // Real-time validation state
    let validationState = {
        errors: new Map(),
        warnings: new Map(),
        suggestions: new Map(),
        listeners: []
    };

    // Private methods
    function validateRoutingNumber(routing) {
        // ABA routing number checksum validation
        const digits = routing.toString().split('').map(Number);
        if (digits.length !== 9) return false;
        
        const checksum = (3 * (digits[0] + digits[3] + digits[6]) +
                         7 * (digits[1] + digits[4] + digits[7]) +
                         (digits[2] + digits[5] + digits[8])) % 10;
        
        return checksum === 0;
    }

    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    function validateField(fieldName, value, rules = {}) {
        const results = {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: []
        };

        // Skip validation for empty optional fields
        if (!value && !rules.required) {
            return results;
        }

        // Required field validation
        if (rules.required && (!value || value.toString().trim() === '')) {
            results.errors.push({
                type: 'required',
                message: `${fieldName} is required`,
                severity: 'error'
            });
            results.isValid = false;
        }

        // Pattern validation
        if (value && rules.type && VALIDATION_RULES[rules.type]) {
            const rule = VALIDATION_RULES[rules.type];
            
            if (rule.pattern && !rule.pattern.test(value.toString())) {
                results.errors.push({
                    type: 'pattern',
                    message: rule.message,
                    severity: rule.severity
                });
                results.isValid = false;
            }

            // Custom validation function
            if (rule.custom && !rule.custom(value)) {
                results.errors.push({
                    type: 'custom',
                    message: rule.message,
                    severity: rule.severity
                });
                results.isValid = false;
            }
        }

        // Range validation
        if (value && rules.min !== undefined && parseFloat(value) < rules.min) {
            results.errors.push({
                type: 'min',
                message: `${fieldName} must be at least ${rules.min}`,
                severity: 'error'
            });
            results.isValid = false;
        }

        if (value && rules.max !== undefined && parseFloat(value) > rules.max) {
            results.errors.push({
                type: 'max',
                message: `${fieldName} cannot exceed ${rules.max}`,
                severity: 'error'
            });
            results.isValid = false;
        }

        // Length validation
        if (value && rules.minLength && value.toString().length < rules.minLength) {
            results.warnings.push({
                type: 'minLength',
                message: `${fieldName} should be at least ${rules.minLength} characters`,
                severity: 'warning'
            });
        }

        if (value && rules.maxLength && value.toString().length > rules.maxLength) {
            results.errors.push({
                type: 'maxLength',
                message: `${fieldName} cannot exceed ${rules.maxLength} characters`,
                severity: 'error'
            });
            results.isValid = false;
        }

        return results;
    }

    function validateBusinessRules(formData) {
        const results = {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: []
        };

        for (const [ruleName, rule] of Object.entries(BUSINESS_RULES)) {
            try {
                if (!rule.check(formData)) {
                    const issue = {
                        type: 'business',
                        rule: ruleName,
                        message: rule.message,
                        severity: rule.severity,
                        suggestion: rule.suggestion
                    };

                    if (rule.severity === 'error') {
                        results.errors.push(issue);
                        results.isValid = false;
                    } else if (rule.severity === 'warning') {
                        results.warnings.push(issue);
                    }

                    if (rule.suggestion) {
                        results.suggestions.push({
                            type: 'improvement',
                            message: rule.suggestion,
                            related: ruleName
                        });
                    }
                }
            } catch (error) {
                console.error(`Error validating business rule ${ruleName}:`, error);
            }
        }

        return results;
    }

    function showValidationMessage(element, message, type = 'error') {
        hideValidationMessage(element);

        const messageEl = document.createElement('div');
        messageEl.className = `validation-message validation-${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        element.parentNode.insertBefore(messageEl, element.nextSibling);
        element.classList.add(`validation-${type}`);

        // Auto-hide warnings after 5 seconds
        if (type === 'warning') {
            setTimeout(() => hideValidationMessage(element), 5000);
        }
    }

    function hideValidationMessage(element) {
        const existingMessage = element.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        element.classList.remove('validation-error', 'validation-warning', 'validation-success');
    }

    function notifyListeners(validationResults) {
        validationState.listeners.forEach(listener => {
            try {
                listener(validationResults);
            } catch (error) {
                console.error('Error in validation listener:', error);
            }
        });
    }

    // Public API
    return {
        // Initialize the validation engine
        init: function() {
            this.addValidationStyles();
            console.log('Validation Engine initialized');
        },

        // Validate a single field
        validateField: function(element, rules = {}) {
            const fieldName = element.getAttribute('data-label') || element.name || element.id;
            const value = element.value;
            
            const result = validateField(fieldName, value, rules);
            
            // Update UI
            hideValidationMessage(element);
            
            if (!result.isValid && result.errors.length > 0) {
                showValidationMessage(element, result.errors[0].message, 'error');
            } else if (result.warnings.length > 0) {
                showValidationMessage(element, result.warnings[0].message, 'warning');
            } else if (value) {
                element.classList.add('validation-success');
            }

            return result;
        },

        // Validate entire form
        validateForm: function(formElement, options = {}) {
            const formData = new FormData(formElement);
            const dataObj = Object.fromEntries(formData.entries());
            
            let overallValid = true;
            const allResults = {
                fieldValidation: {},
                businessValidation: null,
                summary: {
                    totalErrors: 0,
                    totalWarnings: 0,
                    totalSuggestions: 0
                }
            };

            // Validate individual fields
            const fields = formElement.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                const rules = this.getFieldRules(field);
                const result = this.validateField(field, rules);
                
                allResults.fieldValidation[field.name || field.id] = result;
                
                if (!result.isValid) {
                    overallValid = false;
                }
                
                allResults.summary.totalErrors += result.errors.length;
                allResults.summary.totalWarnings += result.warnings.length;
            });

            // Validate business rules
            if (options.includeBusinessRules !== false) {
                const businessResult = validateBusinessRules(dataObj);
                allResults.businessValidation = businessResult;
                
                if (!businessResult.isValid) {
                    overallValid = false;
                }
                
                allResults.summary.totalErrors += businessResult.errors.length;
                allResults.summary.totalWarnings += businessResult.warnings.length;
                allResults.summary.totalSuggestions += businessResult.suggestions.length;
            }

            allResults.isValid = overallValid;

            // Show form-level summary if there are issues
            if (!overallValid || allResults.summary.totalWarnings > 0) {
                this.showFormSummary(formElement, allResults);
            } else {
                this.hideFormSummary(formElement);
            }

            notifyListeners(allResults);
            return allResults;
        },

        // Get validation rules for a field based on its attributes
        getFieldRules: function(field) {
            const rules = {};
            
            // Required validation
            if (field.hasAttribute('required') || field.hasAttribute('data-required')) {
                rules.required = true;
            }

            // Type-based validation
            const type = field.getAttribute('data-validate') || field.type;
            if (type && VALIDATION_RULES[type]) {
                rules.type = type;
            }

            // Range validation
            if (field.hasAttribute('min')) {
                rules.min = parseFloat(field.getAttribute('min'));
            }
            if (field.hasAttribute('max')) {
                rules.max = parseFloat(field.getAttribute('max'));
            }

            // Length validation
            if (field.hasAttribute('minlength')) {
                rules.minLength = parseInt(field.getAttribute('minlength'));
            }
            if (field.hasAttribute('maxlength')) {
                rules.maxLength = parseInt(field.getAttribute('maxlength'));
            }

            return rules;
        },

        // Show form validation summary
        showFormSummary: function(formElement, results) {
            this.hideFormSummary(formElement);

            const summary = document.createElement('div');
            summary.className = 'validation-summary';
            summary.innerHTML = `
                <div class="validation-summary-header">
                    <i class="fas fa-${results.isValid ? 'exclamation-triangle' : 'times-circle'}"></i>
                    <h4>${results.isValid ? 'Attention Required' : 'Please Fix These Issues'}</h4>
                </div>
                <div class="validation-summary-content">
                    ${results.summary.totalErrors > 0 ? `<p><strong>${results.summary.totalErrors}</strong> error${results.summary.totalErrors !== 1 ? 's' : ''} must be fixed</p>` : ''}
                    ${results.summary.totalWarnings > 0 ? `<p><strong>${results.summary.totalWarnings}</strong> warning${results.summary.totalWarnings !== 1 ? 's' : ''} to review</p>` : ''}
                    ${results.summary.totalSuggestions > 0 ? `<p><strong>${results.summary.totalSuggestions}</strong> suggestion${results.summary.totalSuggestions !== 1 ? 's' : ''} to optimize your return</p>` : ''}
                </div>
            `;

            formElement.insertBefore(summary, formElement.firstChild);
        },

        // Hide form validation summary
        hideFormSummary: function(formElement) {
            const existingSummary = formElement.querySelector('.validation-summary');
            if (existingSummary) {
                existingSummary.remove();
            }
        },

        // Real-time validation setup
        enableRealTimeValidation: function(formElement) {
            const fields = formElement.querySelectorAll('input, select, textarea');
            
            fields.forEach(field => {
                let timeout;
                
                const validateWithDelay = () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        const rules = this.getFieldRules(field);
                        this.validateField(field, rules);
                    }, 300); // Debounce validation
                };

                field.addEventListener('input', validateWithDelay);
                field.addEventListener('blur', () => {
                    clearTimeout(timeout);
                    const rules = this.getFieldRules(field);
                    this.validateField(field, rules);
                });
            });
        },

        // Add validation listener
        addListener: function(listener) {
            if (typeof listener === 'function') {
                validationState.listeners.push(listener);
            }
        },

        // Remove validation listener
        removeListener: function(listener) {
            const index = validationState.listeners.indexOf(listener);
            if (index > -1) {
                validationState.listeners.splice(index, 1);
            }
        },

        // Add CSS styles for validation
        addValidationStyles: function() {
            const styles = `
                .validation-error {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
                }

                .validation-warning {
                    border-color: #f59e0b !important;
                    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1) !important;
                }

                .validation-success {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
                }

                .validation-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.25rem;
                    padding: 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    animation: slideInDown 0.3s ease-out;
                }

                .validation-message.validation-error {
                    background-color: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }

                .validation-message.validation-warning {
                    background-color: #fffbeb;
                    color: #d97706;
                    border: 1px solid #fed7aa;
                }

                .validation-summary {
                    background: linear-gradient(135deg, #fee2e2, #fef2f2);
                    border: 1px solid #fca5a5;
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    animation: slideInDown 0.3s ease-out;
                }

                .validation-summary-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #dc2626;
                    margin-bottom: 0.5rem;
                }

                .validation-summary-header h4 {
                    margin: 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }

                .validation-summary-content p {
                    margin: 0.25rem 0;
                    color: #7f1d1d;
                }

                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        },

        // Get current validation state
        getValidationState: function() {
            return { ...validationState };
        }
    };
})();

// Export the module
export default ValidationEngine;