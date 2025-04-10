/**
 * Tax Filing Application
 * Main JavaScript file that integrates all modules
 */

// Import modules
import TaxWalkthrough from './modules/walkthrough.js';
import TaxForms from './modules/forms.js';
import RebateCalculator from './modules/rebate-calculator.js';
import ProgressTracker from './modules/progress-tracker.js';
import DocumentAnalyzer from './modules/document-analyzer.js';
import VirtualAssistant from './modules/virtual-assistant.js';

// Main application
const TaxFilingApp = (function() {
    // Private variables
    let currentFilingStep = 1;
    const totalFilingSteps = 5;
    let userFormData = {};

    // Private methods
    function updateProgressBar() {
        const progressPercentage = ((currentFilingStep - 1) / (totalFilingSteps - 1)) * 100;
        document.querySelector('.filing-progress-fill').style.width = `${progressPercentage}%`;
        document.querySelector('.filing-progress-text .current-step').textContent = currentFilingStep;
    }

    function validateStep(stepNumber) {
        let isValid = true;
        let firstInvalidField = null;

        switch(stepNumber) {
            case 1:
                // Validate personal information
                const fullName = document.getElementById('fullName');
                const ssn = document.getElementById('ssn');
                const filingStatus = document.getElementById('filingStatusTax');
                const phoneNumber = document.getElementById('phoneNumber');

                if (!fullName.value.trim()) {
                    showError(fullName, 'fullNameError', 'Please enter your full legal name');
                    isValid = false;
                    firstInvalidField = firstInvalidField || fullName;
                } else {
                    hideError(fullName, 'fullNameError');
                }

                // Simple SSN validation (XXX-XX-XXXX format)
                const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
                if (!ssnRegex.test(ssn.value.trim())) {
                    showError(ssn, 'ssnError', 'Please enter a valid 9-digit SSN (XXX-XX-XXXX)');
                    isValid = false;
                    firstInvalidField = firstInvalidField || ssn;
                } else {
                    hideError(ssn, 'ssnError');
                }

                if (!filingStatus.value) {
                    showError(filingStatus, 'filingStatusError', 'Please select your filing status');
                    isValid = false;
                    firstInvalidField = firstInvalidField || filingStatus;
                } else {
                    hideError(filingStatus, 'filingStatusError');
                }

                // Simple phone validation (XXX-XXX-XXXX format)
                const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
                if (!phoneRegex.test(phoneNumber.value.trim())) {
                    showError(phoneNumber, 'phoneNumberError', 'Please enter a valid phone number');
                    isValid = false;
                    firstInvalidField = firstInvalidField || phoneNumber;
                } else {
                    hideError(phoneNumber, 'phoneNumberError');
                }

                break;

            case 2:
                // Document upload validation
                // For this example, we'll just check if at least one document is selected
                const documentCheckboxes = document.querySelectorAll('.checklist-checkbox');
                let atLeastOneChecked = false;

                documentCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        atLeastOneChecked = true;
                    }
                });

                // For this demo, we'll make document upload optional
                isValid = true;
                break;

            case 3:
                // Review step - no validation needed
                isValid = true;
                break;

            case 4:
                // Payment information validation
                const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

                if (!paymentMethod) {
                    document.getElementById('paymentMethodError').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('paymentMethodError').style.display = 'none';

                    if (paymentMethod.value === 'directDeposit') {
                        const routingNumber = document.getElementById('routingNumber');
                        const accountNumber = document.getElementById('accountNumber');
                        const accountType = document.getElementById('accountType');

                        // Routing number validation (9 digits)
                        if (!/^\d{9}$/.test(routingNumber.value.trim())) {
                            showError(routingNumber, 'routingNumberError', 'Please enter a valid 9-digit routing number');
                            isValid = false;
                            firstInvalidField = firstInvalidField || routingNumber;
                        } else {
                            hideError(routingNumber, 'routingNumberError');
                        }

                        // Account number validation (between 4-17 digits)
                        if (!/^\d{4,17}$/.test(accountNumber.value.trim())) {
                            showError(accountNumber, 'accountNumberError', 'Please enter a valid account number (4-17 digits)');
                            isValid = false;
                            firstInvalidField = firstInvalidField || accountNumber;
                        } else {
                            hideError(accountNumber, 'accountNumberError');
                        }

                        if (!accountType.value) {
                            showError(accountType, 'accountTypeError', 'Please select an account type');
                            isValid = false;
                            firstInvalidField = firstInvalidField || accountType;
                        } else {
                            hideError(accountType, 'accountTypeError');
                        }
                    }
                }
                break;

            case 5:
                // Final submission - no validation needed
                isValid = true;
                break;
        }

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    function showError(inputElement, errorId, message) {
        inputElement.classList.add('error');
        inputElement.classList.remove('valid');
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function hideError(inputElement, errorId) {
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    function saveFormData() {
        // Save form data based on current step
        switch(currentFilingStep) {
            case 1:
                userFormData.personalInfo = {
                    fullName: document.getElementById('fullName').value,
                    ssn: document.getElementById('ssn').value,
                    filingStatus: document.getElementById('filingStatusTax').value,
                    phoneNumber: document.getElementById('phoneNumber').value
                };
                break;

            case 2:
                userFormData.documents = {
                    uploadedDocuments: Array.from(document.querySelectorAll('.file-item')).map(item => {
                        return item.querySelector('.file-info span').textContent;
                    }),
                    checkedDocuments: Array.from(document.querySelectorAll('.checklist-checkbox:checked')).map(checkbox => {
                        return checkbox.id;
                    })
                };
                break;

            case 3:
                // No data to save in review step
                break;

            case 4:
                const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

                userFormData.payment = {
                    method: paymentMethod ? paymentMethod.value : null
                };

                if (paymentMethod && paymentMethod.value === 'directDeposit') {
                    userFormData.payment.routingNumber = document.getElementById('routingNumber').value;
                    userFormData.payment.accountNumber = document.getElementById('accountNumber').value;
                    userFormData.payment.accountType = document.getElementById('accountType').value;
                }
                break;
        }

        // Save to session storage
        sessionStorage.setItem('taxFilingData', JSON.stringify(userFormData));
    }

    function loadFormData() {
        const savedData = sessionStorage.getItem('taxFilingData');
        if (savedData) {
            userFormData = JSON.parse(savedData);

            // Populate form fields with saved data
            if (userFormData.personalInfo) {
                document.getElementById('fullName').value = userFormData.personalInfo.fullName || '';
                document.getElementById('ssn').value = userFormData.personalInfo.ssn || '';
                document.getElementById('filingStatusTax').value = userFormData.personalInfo.filingStatus || '';
                document.getElementById('phoneNumber').value = userFormData.personalInfo.phoneNumber || '';
            }

            // Load payment information if available
            if (userFormData.payment) {
                const paymentMethod = userFormData.payment.method;
                if (paymentMethod) {
                    document.querySelector(`input[name="paymentMethod"][value="${paymentMethod}"]`).checked = true;

                    if (paymentMethod === 'directDeposit') {
                        document.getElementById('bankDetails').style.display = 'block';
                        document.getElementById('routingNumber').value = userFormData.payment.routingNumber || '';
                        document.getElementById('accountNumber').value = userFormData.payment.accountNumber || '';
                        document.getElementById('accountType').value = userFormData.payment.accountType || '';
                    }
                }
            }
        }
    }

    function updateSummary() {
        // Update the summary in Step 3 based on collected data
        if (userFormData.personalInfo) {
            document.querySelector('.summary-value:nth-of-type(1)').textContent = userFormData.personalInfo.filingStatus || 'Not provided';
        }

        // Load rebate calculation if available
        const rebateCalculation = sessionStorage.getItem('rebateCalculation');
        if (rebateCalculation) {
            const rebateData = JSON.parse(rebateCalculation);
            document.querySelector('.summary-item:nth-of-type(3) .summary-value').textContent = `$${rebateData.creditAmount.toFixed(2)}`;
        }
    }

    // Public methods
    return {
        init: function() {
            try {
                console.log('Initializing Tax Filing Application...');

                // Initialize progress tracker
                if (typeof ProgressTracker !== 'undefined') {
                    console.log('Initializing Progress Tracker...');
                    ProgressTracker.init(5); // 5 total steps in the filing process
                } else {
                    console.warn('Progress Tracker module not found.');
                }

                // Initialize walkthrough module
                if (typeof TaxWalkthrough !== 'undefined') {
                    const walkthroughContainer = document.getElementById('walkthrough-container');
                    if (walkthroughContainer) {
                        console.log('Initializing Tax Walkthrough...');
                        TaxWalkthrough.init('walkthrough-container');
                    } else {
                        console.warn('Walkthrough container not found.');
                    }
                } else {
                    console.warn('Tax Walkthrough module not found.');
                }

                // Initialize forms library
                if (typeof TaxForms !== 'undefined') {
                    const formsContainer = document.getElementById('forms-library-container');
                    if (formsContainer) {
                        console.log('Initializing Tax Forms Library...');
                        TaxForms.generateFormLibrary('forms-library-container');
                    } else {
                        console.warn('Forms library container not found.');
                    }
                } else {
                    console.warn('Tax Forms module not found.');
                }

                // Initialize rebate calculator
                if (typeof RebateCalculator !== 'undefined') {
                    const calculatorForm = document.getElementById('calculator-form');
                    const calculatorResult = document.getElementById('calculator-result');
                    if (calculatorForm && calculatorResult) {
                        console.log('Initializing Rebate Calculator...');
                        RebateCalculator.initCalculator('calculator-form', 'calculator-result');
                    } else {
                        console.warn('Calculator form or result container not found.');
                    }
                } else {
                    console.warn('Rebate Calculator module not found.');
                }

                // Initialize document analyzer for step 2
                if (typeof DocumentAnalyzer !== 'undefined') {
                    const uploadArea = document.getElementById('document-upload-area');
                    const previewArea = document.getElementById('document-preview-area');
                    if (uploadArea && previewArea) {
                        console.log('Initializing Document Analyzer...');
                        DocumentAnalyzer.initDocumentUploader('document-upload-area', 'document-preview-area', (result) => {
                            console.log('Document analyzed:', result);
                            // Store document data for use in the filing process
                            if (typeof ProgressTracker !== 'undefined') {
                                ProgressTracker.saveData('documentData', result);
                            }

                            // Show success message
                            try {
                                const successMessage = document.createElement('div');
                                successMessage.className = 'alert alert-success';
                                successMessage.innerHTML = `
                                    <div class="alert-icon"><i class="fas fa-check-circle"></i></div>
                                    <div class="alert-content">
                                        <h4 class="alert-title">Document Added Successfully</h4>
                                        <p>We've extracted the information from your ${result.documentName || 'document'} and added it to your return.</p>
                                    </div>
                                `;
                                document.getElementById('document-preview-area').appendChild(successMessage);
                            } catch (error) {
                                console.error('Error showing document success message:', error);
                            }
                        });
                    } else {
                        console.warn('Document upload or preview area not found.');
                    }
                } else {
                    console.warn('Document Analyzer module not found.');
                }

                // Initialize virtual assistant
                if (typeof VirtualAssistant !== 'undefined') {
                    const assistantContainer = document.getElementById('virtual-assistant-container');
                    if (assistantContainer) {
                        console.log('Initializing Virtual Assistant...');
                        VirtualAssistant.init('virtual-assistant-container');
                    } else {
                        console.warn('Virtual assistant container not found.');
                    }
                } else {
                    console.warn('Virtual Assistant module not found.');
                }

                // Add virtual assistant toggle button
                if (typeof VirtualAssistant !== 'undefined') {
                    try {
                        const assistantButton = document.createElement('button');
                        assistantButton.className = 'virtual-assistant-button';
                        assistantButton.innerHTML = '<i class="fas fa-headset"></i>';
                        assistantButton.setAttribute('aria-label', 'Get help from virtual assistant');
                        document.body.appendChild(assistantButton);

                        assistantButton.addEventListener('click', () => {
                            VirtualAssistant.toggle('virtual-assistant-container');
                        });
                    } catch (error) {
                        console.error('Error creating virtual assistant button:', error);
                    }
                }

                // Initialize filing steps navigation
                console.log('Initializing filing steps navigation...');
                this.initFilingSteps();

                // Initialize form input masks
                console.log('Initializing form input masks...');
                this.initInputMasks();

                // Initialize dark mode toggle
                console.log('Initializing dark mode toggle...');
                this.initDarkMode();

                // Initialize mobile menu
                console.log('Initializing mobile menu...');
                this.initMobileMenu();

                // Initialize accordion functionality
                console.log('Initializing accordion functionality...');
                this.initAccordion();

                // Initialize back to top button
                console.log('Initializing back to top button...');
                this.initBackToTop();

                // Initialize virtual helper
                console.log('Initializing virtual helper...');
                this.initVirtualHelper();

                // Load saved form data
                console.log('Loading saved form data...');
                loadFormData();

                // Add modern theme stylesheet
                try {
                    console.log('Adding modern theme stylesheet...');
                    const modernTheme = document.createElement('link');
                    modernTheme.rel = 'stylesheet';
                    modernTheme.href = './static/css/modern-theme.css';
                    document.head.appendChild(modernTheme);
                } catch (error) {
                    console.error('Error adding modern theme stylesheet:', error);
                }

                console.log('Tax Filing Application initialized successfully!');
            } catch (error) {
                console.error('Error initializing Tax Filing Application:', error);
            }
        },

        initFilingSteps: function() {
            try {
                const nextButtons = document.querySelectorAll('.next-step');
                const prevButtons = document.querySelectorAll('.prev-step');

                if (nextButtons.length === 0) {
                    console.warn('No next step buttons found.');
                }

                if (prevButtons.length === 0) {
                    console.warn('No previous step buttons found.');
                }

            // Next step buttons
            nextButtons.forEach(button => {
                button.addEventListener('click', () => {
                    if (validateStep(currentFilingStep)) {
                        saveFormData();

                        // Collect data for the current step
                        const stepData = this.collectStepData(currentFilingStep);

                        // Update progress tracker
                        ProgressTracker.advanceStep(stepData);

                        // Hide current step
                        document.getElementById(`filingStep${currentFilingStep}`).classList.remove('active');

                        // Show next step
                        currentFilingStep++;
                        document.getElementById(`filingStep${currentFilingStep}`).classList.add('active');

                        // Mark section as completed
                        ProgressTracker.completeSection(`step_${currentFilingStep - 1}`, stepData);

                        // If moving to review step, update summary
                        if (currentFilingStep === 3) {
                            updateSummary();
                        }

                        // Scroll to top of step
                        window.scrollTo({
                            top: document.querySelector('.filing-tool').offsetTop - 20,
                            behavior: 'smooth'
                        });

                        // Update estimated time remaining
                        this.updateTimeEstimates();
                    }
                });
            });

            // Previous step buttons
            prevButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Hide current step
                    document.getElementById(`filingStep${currentFilingStep}`).classList.remove('active');

                    // Show previous step
                    currentFilingStep--;
                    document.getElementById(`filingStep${currentFilingStep}`).classList.add('active');

                    // Update progress tracker
                    ProgressTracker.goToStep(currentFilingStep);

                    // Scroll to top of step
                    window.scrollTo({
                        top: document.querySelector('.filing-tool').offsetTop - 20,
                        behavior: 'smooth'
                    });

                    // Update estimated time remaining
                    this.updateTimeEstimates();
                });
            });

            // Step indicators
            document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const stepNumber = index + 1;

                    // Only allow clicking on completed steps or the next step
                    if (stepNumber <= currentFilingStep) {
                        // Hide current step
                        document.getElementById(`filingStep${currentFilingStep}`).classList.remove('active');

                        // Show selected step
                        currentFilingStep = stepNumber;
                        document.getElementById(`filingStep${currentFilingStep}`).classList.add('active');

                        // Update progress tracker
                        ProgressTracker.goToStep(currentFilingStep);

                        // If moving to review step, update summary
                        if (currentFilingStep === 3) {
                            updateSummary();
                        }

                        // Update estimated time remaining
                        this.updateTimeEstimates();
                    }
                });
            });

            // Payment method toggle
            document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    const bankDetails = document.getElementById('bankDetails');
                    if (this.value === 'directDeposit') {
                        bankDetails.style.display = 'block';
                    } else {
                        bankDetails.style.display = 'none';
                    }
                });
            });

            // Edit summary button
            document.getElementById('editSummary').addEventListener('click', (e) => {
                e.preventDefault();

                // Go back to step 1
                document.getElementById(`filingStep${currentFilingStep}`).classList.remove('active');
                currentFilingStep = 1;
                document.getElementById(`filingStep${currentFilingStep}`).classList.add('active');

                // Update progress tracker
                ProgressTracker.goToStep(currentFilingStep);

                // Update estimated time remaining
                this.updateTimeEstimates();
            });

            // Submit button
            document.getElementById('submitReturn').addEventListener('click', () => {
                // Collect data for the final step
                const stepData = this.collectStepData(currentFilingStep);

                // Mark section as completed
                ProgressTracker.completeSection(`step_${currentFilingStep}`, stepData);

                // Generate progress report
                const report = ProgressTracker.generateProgressReport();
                console.log('Filing completed:', report);

                // Show success message
                document.getElementById(`filingStep${currentFilingStep}`).classList.remove('active');
                document.getElementById('filingSuccess').style.display = 'block';

                // Update filing date
                const filingDateElement = document.getElementById('filingDate');
                if (filingDateElement) {
                    filingDateElement.textContent = new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }

                // Scroll to top
                window.scrollTo({
                    top: document.querySelector('.filing-tool').offsetTop - 20,
                    behavior: 'smooth'
                });

                // Clear session storage
                sessionStorage.removeItem('taxFilingData');
                sessionStorage.removeItem('rebateCalculation');

                // Reset progress tracker
                ProgressTracker.reset();
            });

            // Initialize time estimates
            this.updateTimeEstimates();

            console.log('Filing steps initialized successfully!');
            } catch (error) {
                console.error('Error initializing filing steps:', error);
            }
        },

        collectStepData: function(stepNumber) {
            const stepData = {};

            switch(stepNumber) {
                case 1: // Personal Information
                    stepData.fullName = document.getElementById('fullName')?.value || '';
                    stepData.ssn = document.getElementById('ssn')?.value || '';
                    stepData.filingStatus = document.getElementById('filingStatusTax')?.value || '';
                    stepData.phoneNumber = document.getElementById('phoneNumber')?.value || '';
                    break;

                case 2: // Documents
                    stepData.uploadedDocuments = Array.from(document.querySelectorAll('.file-item')).map(item => {
                        return item.querySelector('.file-info span')?.textContent || '';
                    });
                    stepData.checkedDocuments = Array.from(document.querySelectorAll('.checklist-checkbox:checked')).map(checkbox => {
                        return checkbox.id || '';
                    });
                    break;

                case 3: // Review
                    // No specific data to collect
                    break;

                case 4: // Payment Information
                    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
                    stepData.paymentMethod = paymentMethod?.value || '';

                    if (paymentMethod?.value === 'directDeposit') {
                        stepData.routingNumber = document.getElementById('routingNumber')?.value || '';
                        stepData.accountNumber = document.getElementById('accountNumber')?.value || '';
                        stepData.accountType = document.getElementById('accountType')?.value || '';
                    }
                    break;

                case 5: // Submit
                    stepData.certify = document.getElementById('certify')?.checked || false;
                    break;
            }

            return stepData;
        },

        updateTimeEstimates: function() {
            const progress = ProgressTracker.getProgress();

            // Update time remaining display
            const timeRemainingElement = document.getElementById('estimated-time-remaining');
            if (timeRemainingElement) {
                timeRemainingElement.textContent = progress.estimatedTimeRemaining;
            }

            // Update time spent display
            const timeSpentElement = document.getElementById('total-time-spent');
            if (timeSpentElement) {
                timeSpentElement.textContent = progress.timeSpent;
            }

            // Update progress percentage
            const progressPercentElement = document.getElementById('progress-percent');
            if (progressPercentElement) {
                progressPercentElement.textContent = `${progress.percent}%`;
            }
        },

        updateStepIndicators: function() {
            document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
                const stepNumber = index + 1;

                indicator.classList.remove('active', 'completed');

                if (stepNumber === currentFilingStep) {
                    indicator.classList.add('active');
                } else if (stepNumber < currentFilingStep) {
                    indicator.classList.add('completed');
                }
            });
        },

        initInputMasks: function() {
            // SSN mask (XXX-XX-XXXX)
            const ssnInput = document.getElementById('ssn');
            if (ssnInput) {
                // Set input type attributes for better mobile keyboards
                ssnInput.setAttribute('inputmode', 'numeric');
                ssnInput.setAttribute('pattern', '[0-9]*');

                // Add placeholder for mobile
                ssnInput.setAttribute('placeholder', 'XXX-XX-XXXX');

                ssnInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 9) {
                        value = value.slice(0, 9);
                    }

                    if (value.length >= 5) {
                        value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
                    } else if (value.length >= 3) {
                        value = value.slice(0, 3) + '-' + value.slice(3);
                    }

                    e.target.value = value;
                });

                // Add focus and blur events for mobile
                ssnInput.addEventListener('focus', function() {
                    // Add a class that can be styled
                    this.parentElement.classList.add('input-focused');
                });

                ssnInput.addEventListener('blur', function() {
                    this.parentElement.classList.remove('input-focused');
                });
            }

            // Phone number mask ((XXX) XXX-XXXX)
            const phoneInput = document.getElementById('phoneNumber');
            if (phoneInput) {
                // Set input type attributes for better mobile keyboards
                phoneInput.setAttribute('inputmode', 'tel');
                phoneInput.setAttribute('pattern', '[0-9]*');

                // Add placeholder for mobile
                phoneInput.setAttribute('placeholder', '(XXX) XXX-XXXX');

                phoneInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 10) {
                        value = value.slice(0, 10);
                    }

                    if (value.length >= 6) {
                        value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6);
                    } else if (value.length >= 3) {
                        value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
                    }

                    e.target.value = value;
                });

                // Add focus and blur events for mobile
                phoneInput.addEventListener('focus', function() {
                    this.parentElement.classList.add('input-focused');
                });

                phoneInput.addEventListener('blur', function() {
                    this.parentElement.classList.remove('input-focused');
                });
            }

            // Initialize all other inputs for mobile
            this.initMobileInputs();
        },

        // Initialize mobile-friendly inputs
        initMobileInputs: function() {
            // Email inputs
            const emailInputs = document.querySelectorAll('input[type="email"]');
            emailInputs.forEach(input => {
                input.setAttribute('inputmode', 'email');
                input.setAttribute('autocomplete', 'email');
            });

            // Number inputs
            const numberInputs = document.querySelectorAll('input[type="number"]');
            numberInputs.forEach(input => {
                input.setAttribute('inputmode', 'numeric');
                input.setAttribute('pattern', '[0-9]*');
            });

            // Add touch feedback to all inputs
            const allInputs = document.querySelectorAll('input, select, textarea');
            allInputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('input-focused');
                });

                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('input-focused');
                });
            });

            // Improve date inputs for mobile
            const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                // Some mobile browsers handle date inputs better with specific formats
                input.setAttribute('placeholder', 'MM/DD/YYYY');
            });
        },

        initDarkMode: function() {
            const modeToggle = document.querySelector('.mode-toggle');
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

            // Check for saved theme preference or use OS preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
                document.body.classList.add('dark-mode');
                modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }

            // Toggle dark mode
            modeToggle.addEventListener('click', () => {
                if (document.body.classList.contains('dark-mode')) {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                    modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                } else {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                    modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                }
            });
        },

        initMobileMenu: function() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const nav = document.querySelector('nav');

            if (mobileMenuBtn && nav) {
                mobileMenuBtn.addEventListener('click', () => {
                    nav.classList.toggle('active');
                    mobileMenuBtn.classList.toggle('active');
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (nav.classList.contains('active') &&
                        !nav.contains(e.target) &&
                        !mobileMenuBtn.contains(e.target)) {
                        nav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    }
                });
            }
        },

        initAccordion: function() {
            const accordionHeaders = document.querySelectorAll('.accordion-header');

            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;

                    // Toggle active class
                    header.classList.toggle('active');

                    // Toggle content visibility
                    if (header.classList.contains('active')) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        },

        initBackToTop: function() {
            const backToTopBtn = document.querySelector('.back-to-top');

            if (backToTopBtn) {
                // Show/hide button based on scroll position
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        backToTopBtn.classList.add('visible');
                    } else {
                        backToTopBtn.classList.remove('visible');
                    }
                });

                // Scroll to top when clicked
                backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        },

        initVirtualHelper: function() {
            const helperToggle = document.querySelector('.helper-toggle');
            const helperChat = document.querySelector('.helper-chat');
            const helperClose = document.querySelector('.helper-close');
            const helperInput = document.querySelector('.helper-input input');
            const helperSend = document.querySelector('.helper-input button');
            const helperMessages = document.querySelector('.helper-messages');

            if (helperToggle && helperChat) {
                // Toggle helper chat
                helperToggle.addEventListener('click', () => {
                    helperChat.classList.toggle('active');

                    // Add welcome message if first time opening
                    if (helperChat.classList.contains('active') && helperMessages.children.length === 0) {
                        this.addHelperMessage('Hello! I\'m your virtual tax assistant. How can I help you with your 2021 Recovery Rebate Credit filing today?', 'assistant');

                        // Add quick option buttons
                        const optionsContainer = document.createElement('div');
                        optionsContainer.className = 'helper-options';

                        const options = [
                            'What is the Recovery Rebate Credit?',
                            'How do I know if I\'m eligible?',
                            'What documents do I need?',
                            'How do I file for a prior year?'
                        ];

                        options.forEach(option => {
                            const button = document.createElement('button');
                            button.className = 'helper-option';
                            button.textContent = option;
                            button.addEventListener('click', () => {
                                this.addHelperMessage(option, 'user');
                                this.handleHelperResponse(option);
                            });

                            optionsContainer.appendChild(button);
                        });

                        helperMessages.appendChild(optionsContainer);
                    }
                });

                // Close helper chat
                helperClose.addEventListener('click', () => {
                    helperChat.classList.remove('active');
                });

                // Send message
                helperSend.addEventListener('click', () => {
                    const message = helperInput.value.trim();
                    if (message) {
                        this.addHelperMessage(message, 'user');
                        helperInput.value = '';

                        // Handle response
                        this.handleHelperResponse(message);
                    }
                });

                // Send message on Enter key
                helperInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        helperSend.click();
                    }
                });
            }
        },

        addHelperMessage: function(message, sender) {
            const helperMessages = document.querySelector('.helper-messages');

            const messageElement = document.createElement('div');
            messageElement.className = `helper-message ${sender}`;
            messageElement.textContent = message;

            helperMessages.appendChild(messageElement);

            // Scroll to bottom
            helperMessages.scrollTop = helperMessages.scrollHeight;
        },

        handleHelperResponse: function(message) {
            // Simple response logic based on keywords
            let response = '';

            if (message.toLowerCase().includes('rebate credit') || message.toLowerCase().includes('what is the recovery')) {
                response = 'The Recovery Rebate Credit is related to the third Economic Impact Payment (stimulus payment) issued in 2021. If you didn\'t receive the full amount you were eligible for, you can claim the difference as a credit on your 2021 tax return.';
            } else if (message.toLowerCase().includes('eligible')) {
                response = 'You may be eligible for the Recovery Rebate Credit if you didn\'t receive the full third stimulus payment you were entitled to. Eligibility depends on your income, filing status, and whether you were claimed as a dependent. Our calculator can help determine your eligibility.';
            } else if (message.toLowerCase().includes('documents') || message.toLowerCase().includes('what do i need')) {
                response = 'To file for the Recovery Rebate Credit, you\'ll need: your Social Security Number, filing status, information about dependents, your 2021 tax information, and any records of stimulus payments received (like IRS Letter 6475). Don\'t worry if you don\'t have everything - our tool can help you through the process.';
            } else if (message.toLowerCase().includes('prior year') || message.toLowerCase().includes('how do i file for')) {
                response = 'Filing for a prior tax year (2021) is similar to filing a current return, but there are some differences. You\'ll need to use 2021 tax forms, and you may need to file by mail. Our tool will guide you through the entire process step by step, explaining everything along the way.';
            } else {
                response = 'I\'m here to help with your 2021 Recovery Rebate Credit filing. You can ask me about eligibility, required documents, the filing process, or any other questions you have about claiming your stimulus payment.';
            }

            // Add a slight delay to make it feel more natural
            setTimeout(() => {
                this.addHelperMessage(response, 'assistant');
            }, 1000);
        }
    };
})();

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    TaxFilingApp.init();
});
