/**
 * Eligibility Checker Module
 * 
 * Handles the eligibility checker functionality
 */

const EligibilityChecker = {
    /**
     * Initialize the eligibility checker
     */
    init: function() {
        // Get the eligibility form and button
        const eligibilityForm = document.getElementById('eligibilityForm');
        const checkEligibilityButton = document.getElementById('checkEligibilitySubmit');
        
        // Get the result boxes
        const eligibleResult = document.getElementById('eligibleResult');
        const notEligibleResult = document.getElementById('notEligibleResult');
        const maybeEligibleResult = document.getElementById('maybeEligibleResult');
        
        // Add event listener to the check eligibility button
        if (checkEligibilityButton) {
            checkEligibilityButton.addEventListener('click', () => {
                // Get the selected radio button
                const receivedRadios = document.getElementsByName('received');
                let receivedValue = '';
                
                for (const radio of receivedRadios) {
                    if (radio.checked) {
                        receivedValue = radio.value;
                        break;
                    }
                }
                
                // Hide all result boxes
                if (eligibleResult) eligibleResult.classList.remove('show');
                if (notEligibleResult) notEligibleResult.classList.remove('show');
                if (maybeEligibleResult) maybeEligibleResult.classList.remove('show');
                
                // Show the appropriate result box based on the selected value
                if (receivedValue === 'yes') {
                    // If they received the full payment, they're not eligible
                    if (notEligibleResult) {
                        notEligibleResult.classList.add('show');
                    }
                } else if (receivedValue === 'no') {
                    // If they didn't receive the payment, they're eligible
                    if (eligibleResult) {
                        eligibleResult.classList.add('show');
                    }
                } else if (receivedValue === 'partial') {
                    // If they received a partial payment, they might be eligible
                    if (maybeEligibleResult) {
                        maybeEligibleResult.classList.add('show');
                    }
                } else {
                    // If no option is selected, show an alert
                    alert('Please select an option to check your eligibility.');
                }
            });
        }
        
        // Add event listeners to the "Start Filing" buttons in the result boxes
        const startFilingButtons = [
            document.getElementById('startFilingFromEligible'),
            document.getElementById('startFilingFromMaybe')
        ];
        
        startFilingButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Navigate to the filing section
                    const fileNowSection = document.getElementById('file-now');
                    if (fileNowSection) {
                        fileNowSection.scrollIntoView({ behavior: 'smooth' });
                        
                        // Start the filing process
                        if (window.FilingSteps) {
                            window.FilingSteps.goToStep(1);
                        }
                    }
                });
            }
        });
        
        // Add event listener to the "Consult AI Tax Expert" button
        const askHelperButton = document.getElementById('askHelperButton');
        if (askHelperButton) {
            askHelperButton.addEventListener('click', () => {
                // Show a simple alert for now
                alert('The AI Tax Expert feature is coming soon!');
            });
        }
        
        console.log('Eligibility Checker initialized');
    }
};

// Export the module
window.EligibilityChecker = EligibilityChecker;

// Export as ES module
export default EligibilityChecker;
