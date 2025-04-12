/**
 * Filing Steps Module
 *
 * Handles the navigation between filing steps and updates the progress indicators
 */

const FilingSteps = {
    currentStep: 1,
    totalSteps: 5,

    /**
     * Initialize the filing steps module
     */
    init: function() {
        // Get continue buttons
        const continueToStep2 = document.getElementById('continueToStep2');
        const continueToStep3 = document.getElementById('continueToStep3');
        const continueToStep4 = document.getElementById('continueToStep4');
        const continueToStep5 = document.getElementById('continueToStep5');

        // Get back buttons
        const backToStep1 = document.getElementById('backToStep1');
        const backToStep2 = document.getElementById('backToStep2');
        const backToStep3 = document.getElementById('backToStep3');
        const backToStep4 = document.getElementById('backToStep4');

        // Add event listeners to continue buttons
        if (continueToStep2) {
            continueToStep2.addEventListener('click', () => {
                this.goToStep(2);
            });
        }

        if (continueToStep3) {
            continueToStep3.addEventListener('click', () => {
                this.goToStep(3);
            });
        }

        if (continueToStep4) {
            continueToStep4.addEventListener('click', () => {
                this.goToStep(4);
            });
        }

        if (continueToStep5) {
            continueToStep5.addEventListener('click', () => {
                this.goToStep(5);
            });
        }

        // Add event listeners to back buttons
        if (backToStep1) {
            backToStep1.addEventListener('click', () => {
                this.goToStep(1);
            });
        }

        if (backToStep2) {
            backToStep2.addEventListener('click', () => {
                this.goToStep(2);
            });
        }

        if (backToStep3) {
            backToStep3.addEventListener('click', () => {
                this.goToStep(3);
            });
        }

        if (backToStep4) {
            backToStep4.addEventListener('click', () => {
                this.goToStep(4);
            });
        }

        // Add event listeners to all prev-step and next-step buttons
        const prevStepButtons = document.querySelectorAll('.prev-step');
        prevStepButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Find the current step and go to the previous one
                this.goToStep(this.currentStep - 1);
            });
        });

        const nextStepButtons = document.querySelectorAll('.next-step');
        nextStepButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Find the current step and go to the next one
                this.goToStep(this.currentStep + 1);
            });
        });

        // Add event listeners to "Start Filing" buttons
        const startFilingButtons = document.querySelectorAll('[id^="startFilingFrom"]');
        startFilingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToStep(1);

                // Scroll to filing section
                const fileNowSection = document.getElementById('file-now');
                if (fileNowSection) {
                    fileNowSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Add event listener to submit button
        const submitButton = document.getElementById('submitReturn');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                // Check if certification checkbox is checked
                const certifyCheckbox = document.getElementById('certify');
                if (certifyCheckbox && !certifyCheckbox.checked) {
                    alert('Please certify that all information provided is accurate before submitting.');
                    return;
                }

                // Hide all filing steps
                const filingSteps = document.querySelectorAll('.filing-step');
                filingSteps.forEach(step => {
                    step.classList.remove('active');
                });

                // Show success message
                const filingSuccess = document.getElementById('filingSuccess');
                if (filingSuccess) {
                    filingSuccess.style.display = 'block';

                    // Set current date as filing date
                    const filingDateElement = document.getElementById('filingDate');
                    if (filingDateElement) {
                        const today = new Date();
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        filingDateElement.textContent = today.toLocaleDateString('en-US', options);
                    }
                }

                // Update progress to 100%
                this.updateProgressBar(this.totalSteps);

                // Dispatch progress updated event
                const event = new CustomEvent('progress-updated', {
                    detail: {
                        currentStep: this.totalSteps,
                        totalSteps: this.totalSteps
                    }
                });

                document.dispatchEvent(event);
            });
        }

        // Load saved progress
        this.loadSavedProgress();

        console.log('Filing Steps initialized');
    },

    /**
     * Go to a specific step
     * @param {number} step - The step to go to
     */
    goToStep: function(step) {
        // Validate step
        if (step < 1 || step > this.totalSteps) {
            console.error(`Invalid step: ${step}`);
            return;
        }

        // Get all filing steps
        const filingSteps = document.querySelectorAll('.filing-step');

        // Hide all steps
        filingSteps.forEach(filingStep => {
            filingStep.classList.remove('active');
        });

        // Show the target step
        const targetStep = document.getElementById(`filingStep${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        // Update step indicators
        this.updateStepIndicators(step);

        // Update progress bar
        this.updateProgressBar(step);

        // Update current step
        this.currentStep = step;

        // Dispatch progress updated event
        const event = new CustomEvent('progress-updated', {
            detail: {
                currentStep: step,
                totalSteps: this.totalSteps
            }
        });

        document.dispatchEvent(event);

        // Save current step to localStorage
        if (window.DataStorage) {
            window.DataStorage.setItem('currentFilingStep', step);
        } else {
            localStorage.setItem('currentFilingStep', step);
        }
    },

    /**
     * Update step indicators
     * @param {number} currentStep - The current step
     */
    updateStepIndicators: function(currentStep) {
        // Get all step indicators
        const stepIndicators = document.querySelectorAll('.step-indicator');

        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            const step = index + 1;

            indicator.classList.remove('active', 'completed');

            if (step < currentStep) {
                indicator.classList.add('completed');
            } else if (step === currentStep) {
                indicator.classList.add('active');
            }
        });
    },

    /**
     * Update progress bar
     * @param {number} currentStep - The current step
     */
    updateProgressBar: function(currentStep) {
        // Calculate progress percentage
        const progress = ((currentStep - 1) / (this.totalSteps - 1)) * 100;

        // Update progress bar
        const progressBar = document.getElementById('filingProgressBar');
        const progressPercent = document.getElementById('progressPercent');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (progressPercent) {
            progressPercent.textContent = `${Math.round(progress)}%`;
        }
    },

    /**
     * Load saved progress
     */
    loadSavedProgress: function() {
        // Get saved step from localStorage
        let savedStep = 1;

        if (window.DataStorage) {
            savedStep = window.DataStorage.getItem('currentFilingStep') || 1;
        } else {
            const savedStepStr = localStorage.getItem('currentFilingStep');
            if (savedStepStr) {
                savedStep = parseInt(savedStepStr, 10);
            }
        }

        // Go to saved step
        this.goToStep(savedStep);
    }
};

// Export the module
window.FilingSteps = FilingSteps;

// Export as ES module
export default FilingSteps;
