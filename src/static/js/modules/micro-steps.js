/**
 * Micro-Steps Module
 * Handles the micro-step navigation within each main filing step
 */

const MicroSteps = (function() {
    // Private variables
    let currentMicroStep = 1;
    const totalMicroSteps = 4; // Update this based on the number of micro-steps
    
    // Initialize the micro-steps module
    function init() {
        setupEventListeners();
        showMicroStep(1);
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Add click event listeners to micro-step indicators
        document.querySelectorAll('.micro-step').forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(this.id.replace('microStep', ''));
                showMicroStep(stepNumber);
            });
        });
        
        // Add event listeners to next/prev buttons within micro-steps
        document.querySelectorAll('.micro-step-next').forEach(button => {
            button.addEventListener('click', function() {
                nextMicroStep();
            });
        });
        
        document.querySelectorAll('.micro-step-prev').forEach(button => {
            button.addEventListener('click', function() {
                prevMicroStep();
            });
        });
    }
    
    // Show a specific micro-step
    function showMicroStep(stepNumber) {
        // Hide all micro-step content
        document.querySelectorAll('.micro-step-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show the selected micro-step content
        const targetContent = document.getElementById(`microStepContent${stepNumber}`);
        if (targetContent) {
            targetContent.style.display = 'block';
            
            // Add animation class
            targetContent.classList.add('animate-fade-in');
            setTimeout(() => {
                targetContent.classList.remove('animate-fade-in');
            }, 500);
        }
        
        // Update micro-step indicators
        document.querySelectorAll('.micro-step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum === stepNumber) {
                step.classList.add('active');
            } else if (stepNum < stepNumber) {
                step.classList.add('completed');
            }
        });
        
        // Update current micro-step
        currentMicroStep = stepNumber;
        
        // Show beginner tips based on the current micro-step
        showMicroStepTip(stepNumber);
    }
    
    // Navigate to the next micro-step
    function nextMicroStep() {
        if (currentMicroStep < totalMicroSteps) {
            showMicroStep(currentMicroStep + 1);
        } else {
            // Move to the next main step
            const nextStepBtn = document.querySelector('.next-step-btn');
            if (nextStepBtn) {
                nextStepBtn.click();
            }
        }
    }
    
    // Navigate to the previous micro-step
    function prevMicroStep() {
        if (currentMicroStep > 1) {
            showMicroStep(currentMicroStep - 1);
        }
    }
    
    // Show beginner tips for each micro-step
    function showMicroStepTip(stepNumber) {
        // Only show tips if user is in beginner mode
        if (localStorage.getItem('taxFilingMode') !== 'beginner') return;
        
        let tipMessage = '';
        
        switch(stepNumber) {
            case 1:
                tipMessage = 'Start with your basic personal information. This helps us identify you correctly.';
                break;
            case 2:
                tipMessage = 'We need your contact information to communicate with you about your tax return.';
                break;
            case 3:
                tipMessage = 'Your filing status affects your tax rates and eligibility for certain credits.';
                break;
            case 4:
                tipMessage = 'Dependents are people you support financially, like children or elderly relatives.';
                break;
        }
        
        if (tipMessage && typeof TaxWalkthrough !== 'undefined' && TaxWalkthrough.showBeginnerTip) {
            TaxWalkthrough.showBeginnerTip(tipMessage);
        }
    }
    
    // Public methods
    return {
        init: init,
        showMicroStep: showMicroStep,
        nextMicroStep: nextMicroStep,
        prevMicroStep: prevMicroStep
    };
})();

// Export the module
export default MicroSteps;
