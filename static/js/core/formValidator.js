/**
 * Form Validator Module
 *
 * Handles form validation for the Tax Filing Tool
 */

const FormValidator = {
    /**
     * Initialize form validation
     */
    init: function() {
        // Get all forms
        const forms = [
            document.getElementById('filingStep1'),
            document.getElementById('filingStep2'),
            document.getElementById('filingStep3'),
            document.getElementById('filingStep4'),
            document.getElementById('filingStep5'),
            document.getElementById('eligibilityForm')
        ].filter(form => form !== null);

        // Add submit event listeners to forms
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Clear any existing error summary
                this.clearErrorSummary(form);

                if (this.validateForm(form)) {
                    console.log('Form is valid, proceeding...');
                    this.onFormSubmit(form);
                } else {
                    console.log('Form validation failed');
                    this.showErrorSummary(form);
                }
            });

            // Add input event listeners to form fields
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.addEventListener('input', () => {
                    this.validateField(field);
                });

                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            });
        });

        console.log('Form validation initialized');
    },

    /**
     * Validate a form
     * @param {HTMLFormElement} form - The form to validate
     * @returns {boolean} - Whether the form is valid
     */
    validateForm: function(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    /**
     * Validate a field
     * @param {HTMLElement} field - The field to validate
     * @returns {boolean} - Whether the field is valid
     */
    validateField: function(field) {
        // Reset field state
        field.classList.remove('valid', 'invalid');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) errorElement.textContent = '';

        // Check if field is empty
        if (field.required && !field.value.trim()) {
            field.classList.add('invalid');
            if (errorElement) errorElement.textContent = 'This field is required';
            return false;
        }

        // Validate based on field name
        let isValid = true;

        switch (field.name) {
            case 'fullName':
                // Name should be at least 2 characters
                if (field.value.trim().length < 2) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Name should be at least 2 characters';
                }
                break;

            case 'ssn':
                // SSN should match format XXX-XX-XXXX
                const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
                if (!ssnRegex.test(field.value)) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'SSN must be in format XXX-XX-XXXX';
                }
                break;

            case 'email':
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Please enter a valid email address';
                }
                break;

            case 'phoneNumber':
                // Phone number validation (simple)
                const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
                if (!phoneRegex.test(field.value)) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Phone number must be in format (XXX) XXX-XXXX';
                }
                break;

            case 'filingStatus':
                // Filing status should be selected
                if (!field.value) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Please select a filing status';
                }
                break;

            case 'income':
                // Income should be a non-negative number
                if (parseFloat(field.value) < 0) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Income cannot be negative';
                }
                break;

            case 'dependents':
                // Dependents should be a non-negative integer
                if (parseFloat(field.value) < 0) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Number of dependents cannot be negative';
                } else if (!Number.isInteger(parseFloat(field.value))) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Number of dependents must be a whole number';
                }
                break;

            case 'dateOfBirth':
            case 'birthdate':
                // Date of birth should be in the past
                const birthDate = new Date(field.value);
                const today = new Date();
                if (birthDate > today) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'Date of birth cannot be in the future';
                }
                break;

            case 'zipCode':
                // ZIP code should be 5 digits
                const zipRegex = /^\d{5}$/;
                if (!zipRegex.test(field.value)) {
                    isValid = false;
                    if (errorElement) errorElement.textContent = 'ZIP code must be 5 digits';
                }
                break;
        }

        // Handle checkbox fields
        if (field.type === 'checkbox' && field.required && !field.checked) {
            isValid = false;
            if (errorElement) {
                if (field.name === 'termsAgreement') {
                    errorElement.textContent = 'You must agree to the terms and conditions';
                } else {
                    errorElement.textContent = 'This checkbox is required';
                }
            }
        }

        // Update field state
        if (isValid) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
        }

        return isValid;
    },

    /**
     * Format input as it's being typed
     * @param {HTMLElement} field - The field to format
     */
    formatInput: function(field) {
        switch (field.name) {
            case 'ssn':
                // Format SSN as XXX-XX-XXXX
                let value = field.value.replace(/\D/g, '');
                if (value.length > 9) value = value.slice(0, 9);

                if (value.length > 5) {
                    field.value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
                } else if (value.length > 3) {
                    field.value = `${value.slice(0, 3)}-${value.slice(3)}`;
                } else {
                    field.value = value;
                }
                break;

            case 'phoneNumber':
                // Format phone number as (XXX) XXX-XXXX
                value = field.value.replace(/\D/g, '');
                if (value.length > 10) value = value.slice(0, 10);

                if (value.length > 6) {
                    field.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                } else if (value.length > 3) {
                    field.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else if (value.length > 0) {
                    field.value = `(${value}`;
                } else {
                    field.value = value;
                }
                break;

            case 'income':
            case 'deductions':
                // Format currency as $X,XXX.XX
                value = field.value.replace(/[^\d.]/g, '');
                const parts = value.split('.');

                if (parts.length > 2) {
                    // More than one decimal point, keep only the first one
                    value = `${parts[0]}.${parts.slice(1).join('')}`;
                }

                if (parts.length > 1) {
                    // Limit to 2 decimal places
                    value = `${parts[0]}.${parts[1].slice(0, 2)}`;
                }

                // Add commas for thousands
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                field.value = parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
                break;
        }
    },

    /**
     * Show error summary at the top of the form
     * @param {HTMLFormElement} form - The form to show errors for
     */
    showErrorSummary: function(form) {
        // Get or create error summary element
        let errorSummary = form.querySelector('#error-summary');

        if (!errorSummary) {
            errorSummary = document.createElement('div');
            errorSummary.id = 'error-summary';
            errorSummary.className = 'error-summary';
            errorSummary.setAttribute('role', 'alert');
            errorSummary.setAttribute('aria-live', 'assertive');
            form.prepend(errorSummary);
        }

        // Get all error messages
        const errorMessages = [];
        const invalidFields = form.querySelectorAll('.invalid');

        invalidFields.forEach(field => {
            const label = field.parentElement.querySelector('label');
            const error = field.parentElement.querySelector('.error-message');

            if (label && error && error.textContent) {
                errorMessages.push({
                    field: label.textContent.replace(':', ''),
                    message: error.textContent
                });
            }
        });

        // Build error summary
        if (errorMessages.length > 0) {
            let html = '<h3>Please correct the following errors:</h3><ul>';

            errorMessages.forEach(error => {
                html += `<li><strong>${error.field}:</strong> ${error.message}</li>`;
            });

            html += '</ul>';
            errorSummary.innerHTML = html;
            errorSummary.style.display = 'block';

            // Scroll to error summary
            errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            errorSummary.style.display = 'none';
        }
    },

    /**
     * Clear error summary
     * @param {HTMLFormElement} form - The form to clear errors for
     */
    clearErrorSummary: function(form) {
        const errorSummary = form.querySelector('#error-summary');
        if (errorSummary) {
            errorSummary.style.display = 'none';
        }
    },

    /**
     * Handle form submission
     * @param {HTMLFormElement} form - The form that was submitted
     */
    onFormSubmit: function(form) {
        // Get form data
        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Save form data
        if (window.DataStorage) {
            const formId = form.id;
            const storageKey = `taxFilingData_${formId}`;

            window.DataStorage.setItem(storageKey, data);
        }

        // Dispatch form submitted event
        const event = new CustomEvent('form-submitted', {
            detail: {
                formId: form.id,
                data: data
            }
        });

        document.dispatchEvent(event);

        // If this is the last form, proceed to the next step
        if (form.dataset.lastForm === 'true') {
            this.proceedToNextStep();
        } else {
            // Show success message
            this.showSuccessMessage(form);
        }
    },

    /**
     * Show success message
     * @param {HTMLFormElement} form - The form to show success for
     */
    showSuccessMessage: function(form) {
        // Get or create success message element
        let successMessage = form.querySelector('.success-message');

        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.setAttribute('role', 'alert');
            form.appendChild(successMessage);
        }

        // Show success message
        successMessage.textContent = 'Form submitted successfully!';
        successMessage.style.display = 'block';

        // Hide success message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    },

    /**
     * Proceed to the next step in the filing process
     */
    proceedToNextStep: function() {
        // Get current step
        const currentStep = document.querySelector('.filing-step.active');

        if (currentStep) {
            // Hide current step
            currentStep.classList.remove('active');

            // Show next step
            const nextStep = currentStep.nextElementSibling;

            if (nextStep && nextStep.classList.contains('filing-step')) {
                nextStep.classList.add('active');

                // Scroll to next step
                nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Update progress
                const currentStepIndex = Array.from(document.querySelectorAll('.filing-step')).indexOf(nextStep) + 1;
                const totalSteps = document.querySelectorAll('.filing-step').length;

                // Dispatch progress updated event
                const event = new CustomEvent('progress-updated', {
                    detail: {
                        currentStep: currentStepIndex,
                        totalSteps: totalSteps
                    }
                });

                document.dispatchEvent(event);
            } else {
                // No more steps, show completion message
                this.showCompletionMessage();
            }
        }
    },

    /**
     * Show completion message
     */
    showCompletionMessage: function() {
        // Create completion message
        const completionMessage = document.createElement('div');
        completionMessage.className = 'completion-message';
        completionMessage.innerHTML = `
            <h2>Tax Filing Complete!</h2>
            <p>Your tax return has been submitted successfully.</p>
            <p>You will receive a confirmation email shortly.</p>
            <button id="viewSummaryBtn" class="btn btn-primary">View Summary</button>
        `;

        // Replace filing steps with completion message
        const filingSteps = document.querySelector('.filing-steps');
        if (filingSteps) {
            filingSteps.innerHTML = '';
            filingSteps.appendChild(completionMessage);
        }

        // Add event listener to view summary button
        const viewSummaryBtn = document.getElementById('viewSummaryBtn');
        if (viewSummaryBtn) {
            viewSummaryBtn.addEventListener('click', () => {
                window.location.href = 'summary.html';
            });
        }
    }
};

// Export the module
window.FormValidator = FormValidator;
