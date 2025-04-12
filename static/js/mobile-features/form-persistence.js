/**
 * Form persistence for mobile devices
 * Prevents data loss when connection drops or page refreshes
 */

function initFormPersistence() {
    // Check if we have storage access
    if (!window.localStorage) {
        console.warn('LocalStorage not available, form persistence disabled');
        return;
    }
    
    // Find all forms in the document
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Generate a unique ID for the form
        const formId = form.id || form.getAttribute('name') || `form-${Math.random().toString(36).substr(2, 9)}`;
        const storageKey = `form-data-${formId}`;
        
        // Restore saved form data if available
        restoreFormData(form, storageKey);
        
        // Save form data on input changes
        form.addEventListener('input', e => {
            if (e.target.name && !e.target.classList.contains('no-save')) {
                saveFormData(form, storageKey);
            }
        });
        
        // Save form data on change events (for selects, checkboxes, etc.)
        form.addEventListener('change', e => {
            if (e.target.name && !e.target.classList.contains('no-save')) {
                saveFormData(form, storageKey);
            }
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', () => {
            // Only clear if form is valid
            if (form.checkValidity()) {
                localStorage.removeItem(storageKey);
                
                // Also clear any step data if this is a multi-step form
                if (form.classList.contains('multi-step-form')) {
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith(`${storageKey}-step`)) {
                            localStorage.removeItem(key);
                        }
                    }
                }
            }
        });
        
        // Handle multi-step forms
        const nextButtons = form.querySelectorAll('.next-step');
        const prevButtons = form.querySelectorAll('.prev-step');
        
        // Save step data when moving to next step
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = button.closest('.filing-step, .form-step');
                if (currentStep) {
                    const stepNumber = currentStep.dataset.step || 
                                      currentStep.id.replace(/\D/g, '') || 
                                      Array.from(currentStep.parentNode.children).indexOf(currentStep);
                    
                    saveStepData(form, storageKey, stepNumber);
                }
            });
        });
        
        // Restore step data when moving back
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetStep = button.dataset.target || 
                                  button.getAttribute('href')?.replace('#', '') || 
                                  parseInt(button.closest('.filing-step, .form-step').dataset.step) - 1;
                
                if (targetStep) {
                    restoreStepData(form, storageKey, targetStep);
                }
            });
        });
    });
    
    /**
     * Save form data to localStorage
     */
    function saveFormData(form, storageKey) {
        const formData = {};
        
        // Collect data from form elements
        form.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.name && !input.classList.contains('no-save')) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    if (input.checked) {
                        formData[input.name] = input.value;
                    }
                } else if (input.type !== 'password') {
                    formData[input.name] = input.value;
                }
            }
        });
        
        // Save to localStorage
        try {
            localStorage.setItem(storageKey, JSON.stringify(formData));
            console.log('Form data saved:', formId);
            
            // Show save indicator
            showSaveIndicator('Form progress saved');
        } catch (e) {
            console.error('Error saving form data:', e);
        }
    }
    
    /**
     * Restore form data from localStorage
     */
    function restoreFormData(form, storageKey) {
        try {
            const savedData = localStorage.getItem(storageKey);
            
            if (savedData) {
                const formData = JSON.parse(savedData);
                
                // Populate form fields
                Object.keys(formData).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    
                    if (input) {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = (input.value === formData[key]);
                        } else {
                            input.value = formData[key];
                        }
                        
                        // Trigger change event to update any dependent fields
                        const event = new Event('change', { bubbles: true });
                        input.dispatchEvent(event);
                    }
                });
                
                console.log('Form data restored:', formId);
                showSaveIndicator('Form data restored');
            }
        } catch (e) {
            console.error('Error restoring form data:', e);
        }
    }
    
    /**
     * Save data for a specific step in a multi-step form
     */
    function saveStepData(form, storageKey, stepNumber) {
        const stepKey = `${storageKey}-step${stepNumber}`;
        const stepData = {};
        
        // Find the step container
        const stepContainer = form.querySelector(`.filing-step[data-step="${stepNumber}"], .form-step[data-step="${stepNumber}"], #filingStep${stepNumber}`);
        
        if (stepContainer) {
            // Collect data from form elements in this step
            stepContainer.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.name && !input.classList.contains('no-save')) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        if (input.checked) {
                            stepData[input.name] = input.value;
                        }
                    } else if (input.type !== 'password') {
                        stepData[input.name] = input.value;
                    }
                }
            });
            
            // Save to localStorage
            try {
                localStorage.setItem(stepKey, JSON.stringify(stepData));
                console.log(`Step ${stepNumber} data saved`);
            } catch (e) {
                console.error(`Error saving step ${stepNumber} data:`, e);
            }
        }
    }
    
    /**
     * Restore data for a specific step in a multi-step form
     */
    function restoreStepData(form, storageKey, stepNumber) {
        const stepKey = `${storageKey}-step${stepNumber}`;
        
        try {
            const savedData = localStorage.getItem(stepKey);
            
            if (savedData) {
                const stepData = JSON.parse(savedData);
                
                // Populate form fields for this step
                Object.keys(stepData).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    
                    if (input) {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = (input.value === stepData[key]);
                        } else {
                            input.value = stepData[key];
                        }
                        
                        // Trigger change event to update any dependent fields
                        const event = new Event('change', { bubbles: true });
                        input.dispatchEvent(event);
                    }
                });
                
                console.log(`Step ${stepNumber} data restored`);
            }
        } catch (e) {
            console.error(`Error restoring step ${stepNumber} data:`, e);
        }
    }
    
    /**
     * Show a save indicator message
     */
    function showSaveIndicator(message) {
        // Check if indicator already exists
        let indicator = document.querySelector('.form-save-indicator');
        
        if (!indicator) {
            // Create indicator element
            indicator = document.createElement('div');
            indicator.className = 'form-save-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 9999;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                pointer-events: none;
            `;
            document.body.appendChild(indicator);
        }
        
        // Update message and show
        indicator.textContent = message;
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateY(0)';
        
        // Hide after delay
        clearTimeout(indicator.timeout);
        indicator.timeout = setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(20px)';
        }, 2000);
    }
}

// Export the function
window.initFormPersistence = initFormPersistence;
