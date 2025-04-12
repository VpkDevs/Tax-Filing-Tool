/**
 * Claim Process Tracker Module
 *
 * Provides a simple visual indicator of the user's progress through the tax filing process
 */

const ClaimProcessTracker = {
    /**
     * Initialize the claim process tracker
     */
    init: function() {
        // Get the claim process tracker element
        const tracker = document.getElementById('claimProcessTracker');
        if (!tracker) return;

        // Reset the tracker to the first step
        this.resetTracker();

        // Add event listener for progress updates
        document.addEventListener('progress-updated', (event) => {
            const { currentStep, totalSteps } = event.detail;
            this.updateProgress(currentStep, totalSteps);
        });

        console.log('Claim Process Tracker initialized');
    },

    /**
     * Reset the tracker to the first step
     */
    resetTracker: function() {
        const tracker = document.getElementById('claimProcessTracker');
        if (!tracker) return;

        // Get all checkboxes
        const checkboxes = tracker.querySelectorAll('input[type="checkbox"]');

        // Uncheck all checkboxes
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = index === 0; // Check only the first checkbox
        });

        // Update progress bar
        const progressBar = tracker.querySelector('.progress-bar-fill');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    },

    /**
     * Update progress
     * @param {number} currentStep - The current step
     * @param {number} totalSteps - The total number of steps
     */
    updateProgress: function(currentStep, totalSteps) {
        const tracker = document.getElementById('claimProcessTracker');
        if (!tracker) return;

        // Calculate progress percentage
        const progress = (currentStep / totalSteps) * 100;

        // Update progress bar
        const progressBar = tracker.querySelector('.progress-bar-fill');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update checkboxes
        const checkboxes = tracker.querySelectorAll('.process-checkbox');

        checkboxes.forEach((checkbox, index) => {
            // Check if this step should be checked based on current progress
            checkbox.checked = index < currentStep;
        });
    }
};

// Export the module
window.ClaimProcessTracker = ClaimProcessTracker;
