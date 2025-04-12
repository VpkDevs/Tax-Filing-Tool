/**
 * Auto-Fill Module
 *
 * Handles auto-filling forms with user information from various sources
 */

const AutoFill = {
    selectedOption: null,

    /**
     * Initialize the auto-fill module
     */
    init: function() {
        // Get auto-fill options
        const autoFillIRS = document.getElementById('autoFillIRS');
        const autoFillTaxReturn = document.getElementById('autoFillTaxReturn');
        const autoFillManual = document.getElementById('autoFillManual');

        // Get modals
        const irsConnectionModal = document.getElementById('irsConnectionModal');
        const taxReturnUploadModal = document.getElementById('taxReturnUploadModal');
        const autoFillSuccessModal = document.getElementById('autoFillSuccessModal');

        // Add event listeners to auto-fill options
        if (autoFillIRS) {
            autoFillIRS.addEventListener('click', () => {
                this.selectOption(autoFillIRS);
                this.showIRSConnectionModal();
            });
        }

        if (autoFillTaxReturn) {
            autoFillTaxReturn.addEventListener('click', () => {
                this.selectOption(autoFillTaxReturn);
                this.showTaxReturnUploadModal();
            });
        }

        if (autoFillManual) {
            autoFillManual.addEventListener('click', () => {
                this.selectOption(autoFillManual);
                // No modal needed for manual option
            });
        }

        // Add event listeners to modals
        if (irsConnectionModal) {
            // Close button
            const irsCloseBtn = irsConnectionModal.querySelector('.close-modal');
            if (irsCloseBtn) {
                irsCloseBtn.addEventListener('click', () => {
                    irsConnectionModal.style.display = 'none';
                });
            }

            // Form submission
            const irsConnectionForm = document.getElementById('irsConnectionForm');
            if (irsConnectionForm) {
                irsConnectionForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.connectToIRS();
                });
            }
        }

        if (taxReturnUploadModal) {
            // Close button
            const taxReturnCloseBtn = taxReturnUploadModal.querySelector('.close-modal');
            if (taxReturnCloseBtn) {
                taxReturnCloseBtn.addEventListener('click', () => {
                    taxReturnUploadModal.style.display = 'none';
                });
            }

            // File input
            const taxReturnFileInput = document.getElementById('taxReturnFileInput');
            if (taxReturnFileInput) {
                taxReturnFileInput.addEventListener('change', (e) => {
                    this.handleFileSelection(e);
                });
            }

            // Upload area
            const taxReturnUploadArea = document.getElementById('taxReturnUploadArea');
            if (taxReturnUploadArea) {
                taxReturnUploadArea.addEventListener('click', () => {
                    taxReturnFileInput.click();
                });

                taxReturnUploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    taxReturnUploadArea.classList.add('dragover');
                });

                taxReturnUploadArea.addEventListener('dragleave', () => {
                    taxReturnUploadArea.classList.remove('dragover');
                });

                taxReturnUploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    taxReturnUploadArea.classList.remove('dragover');

                    if (e.dataTransfer.files.length > 0) {
                        taxReturnFileInput.files = e.dataTransfer.files;
                        this.handleFileSelection({ target: taxReturnFileInput });
                    }
                });
            }

            // Upload button
            const uploadTaxReturnBtn = document.getElementById('uploadTaxReturnBtn');
            if (uploadTaxReturnBtn) {
                uploadTaxReturnBtn.addEventListener('click', () => {
                    this.uploadTaxReturn();
                });
            }
        }

        if (autoFillSuccessModal) {
            // Close button
            const successCloseBtn = autoFillSuccessModal.querySelector('.close-modal');
            if (successCloseBtn) {
                successCloseBtn.addEventListener('click', () => {
                    autoFillSuccessModal.style.display = 'none';
                });
            }

            // Continue button
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    autoFillSuccessModal.style.display = 'none';
                    // Proceed to next step
                    this.proceedToNextStep();
                });
            }
        }

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === irsConnectionModal) {
                irsConnectionModal.style.display = 'none';
            }

            if (e.target === taxReturnUploadModal) {
                taxReturnUploadModal.style.display = 'none';
            }

            if (e.target === autoFillSuccessModal) {
                autoFillSuccessModal.style.display = 'none';
            }
        });

        console.log('Auto-Fill initialized');
    },

    /**
     * Select an auto-fill option
     * @param {HTMLElement} option - The selected option
     */
    selectOption: function(option) {
        // Remove selected class from all options
        const options = document.querySelectorAll('.auto-fill-option');
        options.forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selected class to the clicked option
        option.classList.add('selected');

        // Store the selected option
        this.selectedOption = option.id;
    },

    /**
     * Show IRS connection modal
     */
    showIRSConnectionModal: function() {
        const modal = document.getElementById('irsConnectionModal');
        if (modal) {
            modal.style.display = 'block';
        }
    },

    /**
     * Show tax return upload modal
     */
    showTaxReturnUploadModal: function() {
        const modal = document.getElementById('taxReturnUploadModal');
        if (modal) {
            modal.style.display = 'block';
        }
    },

    /**
     * Connect to IRS
     */
    connectToIRS: function() {
        // Get form values
        const username = document.getElementById('irsUsername')?.value || '';
        const password = document.getElementById('irsPassword')?.value || '';

        // Validate inputs
        if (!username || !password) {
            this.showErrorMessage('irsConnectionForm', 'Please enter both username and password');
            return;
        }

        // Show loading state
        this.showLoading('irsConnectionForm');

        // In a real application, this would make an API call to the IRS
        // For demonstration purposes, we'll simulate an API call
        try {
            setTimeout(() => {
                try {
                    // Simulate successful response for demo purposes
                    const mockData = {
                        fullName: 'John Q. Taxpayer',
                        ssn: '123-45-6789',
                        dateOfBirth: '1980-01-15',
                        filingStatus: 'single',
                        address: '123 Main St',
                        city: 'Anytown',
                        state: 'CA',
                        zipCode: '12345',
                        email: 'john@example.com',
                        phoneNumber: '(555) 123-4567'
                    };

                    // Auto-fill form with data
                    this.autoFillForm(mockData);

                    // Hide loading state
                    this.hideLoading('irsConnectionForm');

                    // Hide IRS connection modal
                    const modal = document.getElementById('irsConnectionModal');
                    if (modal) {
                        modal.style.display = 'none';
                    }

                    // Show success modal
                    this.showSuccessModal();
                } catch (error) {
                    console.error('Error in IRS connection:', error);

                    // Hide loading state
                    this.hideLoading('irsConnectionForm');

                    // Show error message
                    this.showErrorMessage('irsConnectionForm', 'An error occurred while connecting to the IRS. Please try again.');
                }
            }, 2000); // Simulate API delay
        } catch (error) {
            console.error('Error initiating IRS connection:', error);

            // Hide loading state
            this.hideLoading('irsConnectionForm');

            // Show error message
            this.showErrorMessage('irsConnectionForm', 'An error occurred while connecting to the IRS. Please try again.');
        }
    },

    /**
     * Handle file selection
     * @param {Event} e - The change event
     */
    handleFileSelection: function(e) {
        const fileInput = e.target;
        const uploadArea = document.getElementById('taxReturnUploadArea');

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Check file type
            if (file.type !== 'application/pdf') {
                this.showErrorMessage('taxReturnUploadArea', 'Please upload a PDF file');
                return;
            }

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.showErrorMessage('taxReturnUploadArea', 'File size exceeds 10MB limit');
                return;
            }

            // Update upload area
            if (uploadArea) {
                uploadArea.querySelector('p').textContent = `Selected file: ${file.name}`;
                uploadArea.classList.add('file-selected');
            }
        }
    },

    /**
     * Upload tax return
     */
    uploadTaxReturn: function() {
        const fileInput = document.getElementById('taxReturnFileInput');

        if (!fileInput || fileInput.files.length === 0) {
            this.showErrorMessage('taxReturnUploadArea', 'Please select a file to upload');
            return;
        }

        const file = fileInput.files[0];

        // Show loading state
        this.showLoading('taxReturnUploadModal');

        try {
            // Process the PDF file
            this.processTaxReturnPDF(file)
                .then(data => {
                    try {
                        // Auto-fill form with data
                        this.autoFillForm(data);

                        // Hide loading state
                        this.hideLoading('taxReturnUploadModal');

                        // Hide tax return upload modal
                        const modal = document.getElementById('taxReturnUploadModal');
                        if (modal) {
                            modal.style.display = 'none';
                        }

                        // Show success modal
                        this.showSuccessModal();
                    } catch (error) {
                        console.error('Error processing tax return data:', error);

                        // Hide loading state
                        this.hideLoading('taxReturnUploadModal');

                        // Show error message
                        this.showErrorMessage('taxReturnUploadArea', 'An error occurred while processing your tax return. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error processing tax return PDF:', error);

                    // Hide loading state
                    this.hideLoading('taxReturnUploadModal');

                    // Show error message
                    this.showErrorMessage('taxReturnUploadArea', error.message || 'An error occurred while processing your tax return. Please try again.');
                });
        } catch (error) {
            console.error('Error initiating tax return upload:', error);

            // Hide loading state
            this.hideLoading('taxReturnUploadModal');

            // Show error message
            this.showErrorMessage('taxReturnUploadArea', 'An error occurred while uploading your tax return. Please try again.');
        }
    },

    /**
     * Process tax return PDF
     * @param {File} file - The PDF file to process
     * @returns {Promise} - Promise that resolves with extracted data
     */
    processTaxReturnPDF: function(file) {
        return new Promise((resolve, reject) => {
            // In a real application, this would use a PDF parsing library
            // For demonstration purposes, we'll simulate PDF processing
            setTimeout(() => {
                // Simulate extracted data
                const data = {
                    fullName: 'Jane P. Taxpayer',
                    ssn: '987-65-4321',
                    dateOfBirth: '1985-05-20',
                    filingStatus: 'married',
                    address: '456 Oak Ave',
                    city: 'Somewhere',
                    state: 'NY',
                    zipCode: '54321',
                    email: 'jane@example.com',
                    phoneNumber: '(555) 987-6543'
                };

                resolve(data);
            }, 2000); // Simulate processing delay
        });
    },

    /**
     * Auto-fill form with data
     * @param {Object} data - The data to fill the form with
     */
    autoFillForm: function(data) {
        // Validate and format data
        const validatedData = this.validateAndFormatData(data);

        // Get form fields - use optional chaining to handle missing fields
        const fields = {
            fullName: document.getElementById('fullName'),
            ssn: document.getElementById('ssn'),
            dateOfBirth: document.getElementById('dateOfBirth'),
            filingStatus: document.getElementById('filingStatusTax'), // Updated ID to match HTML
            address: document.getElementById('address'),
            city: document.getElementById('city'),
            state: document.getElementById('state'),
            zipCode: document.getElementById('zipCode'),
            email: document.getElementById('email'),
            phoneNumber: document.getElementById('phoneNumber')
        };

        // Fill form fields
        for (const field in fields) {
            if (fields[field] && validatedData[field]) {
                fields[field].value = validatedData[field];

                // Trigger input event to validate field
                try {
                    const event = new Event('input', { bubbles: true });
                    fields[field].dispatchEvent(event);
                } catch (error) {
                    console.error(`Error triggering input event for ${field}:`, error);
                }
            }
        }

        console.log('Form auto-filled with data:', validatedData);

        // Save data to localStorage
        this.saveDataToLocalStorage(validatedData);
    },

    /**
     * Validate and format data
     * @param {Object} data - The data to validate and format
     * @returns {Object} - The validated and formatted data
     */
    validateAndFormatData: function(data) {
        const validatedData = { ...data };

        // Format SSN
        if (validatedData.ssn) {
            // Remove non-numeric characters
            const ssnDigits = validatedData.ssn.replace(/\D/g, '');

            // Format as XXX-XX-XXXX
            if (ssnDigits.length === 9) {
                validatedData.ssn = `${ssnDigits.slice(0, 3)}-${ssnDigits.slice(3, 5)}-${ssnDigits.slice(5)}`;
            }
        }

        // Format phone number
        if (validatedData.phoneNumber) {
            // Remove non-numeric characters
            const phoneDigits = validatedData.phoneNumber.replace(/\D/g, '');

            // Format as (XXX) XXX-XXXX
            if (phoneDigits.length === 10) {
                validatedData.phoneNumber = `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
            }
        }

        return validatedData;
    },

    /**
     * Save data to localStorage
     * @param {Object} data - The data to save
     */
    saveDataToLocalStorage: function(data) {
        // Create storage object
        const storageData = {
            personalInfo: data,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        if (window.DataStorage) {
            window.DataStorage.setItem('taxFilingData', storageData);
        } else {
            localStorage.setItem('taxFilingData', JSON.stringify(storageData));
        }
    },

    /**
     * Show success modal
     */
    showSuccessModal: function() {
        const modal = document.getElementById('autoFillSuccessModal');
        if (modal) {
            // Check if any fields are invalid
            const invalidFields = document.querySelectorAll('.invalid');

            if (invalidFields.length > 0) {
                // Update message to indicate some fields may be invalid
                const message = modal.querySelector('p');
                if (message) {
                    message.textContent = 'Your information has been imported, but some information may be incomplete or invalid. Please review and make any necessary changes.';
                }
            } else {
                // Standard success message
                const message = modal.querySelector('p');
                if (message) {
                    message.textContent = 'Your information has been imported successfully. Please review and make any necessary changes.';
                }
            }

            modal.style.display = 'block';
        }
    },

    /**
     * Show loading state
     * @param {string} containerId - The ID of the container to show loading in
     */
    showLoading: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create loading element if it doesn't exist
        let loading = container.querySelector('.loading');

        if (!loading) {
            loading = document.createElement('div');
            loading.className = 'loading';
            loading.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
            container.appendChild(loading);
        }

        loading.style.display = 'flex';
    },

    /**
     * Hide loading state
     * @param {string} containerId - The ID of the container to hide loading in
     */
    hideLoading: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const loading = container.querySelector('.loading');
        if (loading) {
            loading.style.display = 'none';
        }
    },

    /**
     * Show error message
     * @param {string} containerId - The ID of the container to show error in
     * @param {string} message - The error message
     */
    showErrorMessage: function(containerId, message) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create error element if it doesn't exist
        let error = container.querySelector('.error-message');

        if (!error) {
            error = document.createElement('div');
            error.className = 'error-message';
            container.appendChild(error);
        }

        error.textContent = message;
        error.style.display = 'block';

        // Hide error after 5 seconds
        setTimeout(() => {
            error.style.display = 'none';
        }, 5000);
    },

    /**
     * Proceed to next step
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
            }
        }
    }
};

// Export the module
window.AutoFill = AutoFill;
