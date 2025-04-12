/**
 * Payment Methods Module
 * 
 * Handles payment method selection and bank details display
 */

const PaymentMethods = {
    /**
     * Initialize the payment methods module
     */
    init: function() {
        // Get payment method radio buttons
        const directDepositRadio = document.getElementById('directDeposit');
        const checkMailRadio = document.getElementById('checkMail');
        
        // Get bank details container
        const bankDetails = document.getElementById('bankDetails');
        
        // Add event listeners to payment method radio buttons
        if (directDepositRadio) {
            directDepositRadio.addEventListener('change', () => {
                if (directDepositRadio.checked && bankDetails) {
                    bankDetails.style.display = 'block';
                }
            });
        }
        
        if (checkMailRadio) {
            checkMailRadio.addEventListener('change', () => {
                if (checkMailRadio.checked && bankDetails) {
                    bankDetails.style.display = 'none';
                }
            });
        }
        
        console.log('Payment Methods initialized');
    }
};

// Export the module
window.PaymentMethods = PaymentMethods;

// Export as ES module
export default PaymentMethods;
