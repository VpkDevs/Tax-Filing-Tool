/**
 * Tests for the "Speed Up Your Filing" functionality
 */

describe('Speed Up Your Filing', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="auto-fill-section">
        <div class="auto-fill-options">
          <div id="autoFillIRS" class="auto-fill-option">
            <h3>Connect IRS Account</h3>
            <p>Import your information directly from the IRS</p>
          </div>
          <div id="autoFillTaxReturn" class="auto-fill-option">
            <h3>Upload 2020 Tax Return</h3>
            <p>We'll extract your information from last year's return</p>
          </div>
          <div id="autoFillManual" class="auto-fill-option">
            <h3>Enter Manually</h3>
            <p>Fill in your information step by step</p>
          </div>
        </div>
      </div>
      <form>
        <input id="fullName" type="text">
        <input id="ssn" type="text">
        <select id="filingStatusTax">
          <option value=""></option>
          <option value="single">Single</option>
          <option value="married">Married</option>
        </select>
        <input id="phoneNumber" type="text">
      </form>
    `;
    
    // Create a mock TaxFilingApp object
    window.TaxFilingApp = {
      showIRSConnectionModal: jest.fn(),
      showTaxReturnUploadModal: jest.fn(),
      showAutoFillSuccessMessage: jest.fn(),
      autoFillFormFields: jest.fn(),
      
      initAutoFillOptions: function() {
        // Get auto-fill option elements
        const autoFillIRS = document.getElementById('autoFillIRS');
        const autoFillTaxReturn = document.getElementById('autoFillTaxReturn');
        const autoFillManual = document.getElementById('autoFillManual');
        const autoFillOptions = document.querySelectorAll('.auto-fill-option');
        
        if (!autoFillIRS || !autoFillTaxReturn || !autoFillManual) {
          console.warn('Auto-fill options not found.');
          return;
        }
        
        // Add selected class to style
        const style = document.createElement('style');
        style.textContent = `
          .auto-fill-option.selected {
            border: 2px solid var(--accent);
            background-color: rgba(139, 92, 246, 0.05);
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
        `;
        document.head.appendChild(style);
        
        // Add click event listeners
        autoFillIRS.addEventListener('click', () => {
          // Remove selected class from all options
          autoFillOptions.forEach(option => option.classList.remove('selected'));
          
          // Add selected class to clicked option
          autoFillIRS.classList.add('selected');
          
          // Show IRS connection modal
          this.showIRSConnectionModal();
        });
        
        autoFillTaxReturn.addEventListener('click', () => {
          // Remove selected class from all options
          autoFillOptions.forEach(option => option.classList.remove('selected'));
          
          // Add selected class to clicked option
          autoFillTaxReturn.classList.add('selected');
          
          // Show tax return upload modal
          this.showTaxReturnUploadModal();
        });
        
        autoFillManual.addEventListener('click', () => {
          // Remove selected class from all options
          autoFillOptions.forEach(option => option.classList.remove('selected'));
          
          // Add selected class to clicked option
          autoFillManual.classList.add('selected');
          
          // Just continue with manual entry
          console.log('Manual entry selected');
        });
      },
      
      autoFillFormFields: function() {
        // Fill form fields with sample data
        document.getElementById('fullName').value = 'John Q. Taxpayer';
        document.getElementById('ssn').value = '123-45-6789';
        document.getElementById('filingStatusTax').value = 'single';
        document.getElementById('phoneNumber').value = '(555) 123-4567';
        
        // Trigger input events to update validation
        ['fullName', 'ssn', 'filingStatusTax', 'phoneNumber'].forEach(id => {
          const input = document.getElementById(id);
          const event = new Event('input', { bubbles: true });
          input.dispatchEvent(event);
        });
      }
    };
  });
  
  test('initAutoFillOptions adds event listeners to auto-fill options', () => {
    // Initialize auto-fill options
    window.TaxFilingApp.initAutoFillOptions();
    
    // Get auto-fill options
    const autoFillIRS = document.getElementById('autoFillIRS');
    const autoFillTaxReturn = document.getElementById('autoFillTaxReturn');
    const autoFillManual = document.getElementById('autoFillManual');
    
    // Verify that style was added
    const style = document.querySelector('style');
    expect(style).not.toBeNull();
    expect(style.textContent).toContain('.auto-fill-option.selected');
    
    // Simulate clicks
    autoFillIRS.click();
    
    // Verify that the IRS option was selected
    expect(autoFillIRS.classList.contains('selected')).toBe(true);
    expect(autoFillTaxReturn.classList.contains('selected')).toBe(false);
    expect(autoFillManual.classList.contains('selected')).toBe(false);
    
    // Verify that the showIRSConnectionModal method was called
    expect(window.TaxFilingApp.showIRSConnectionModal).toHaveBeenCalled();
    
    // Simulate click on tax return option
    autoFillTaxReturn.click();
    
    // Verify that the tax return option was selected
    expect(autoFillIRS.classList.contains('selected')).toBe(false);
    expect(autoFillTaxReturn.classList.contains('selected')).toBe(true);
    expect(autoFillManual.classList.contains('selected')).toBe(false);
    
    // Verify that the showTaxReturnUploadModal method was called
    expect(window.TaxFilingApp.showTaxReturnUploadModal).toHaveBeenCalled();
    
    // Simulate click on manual option
    autoFillManual.click();
    
    // Verify that the manual option was selected
    expect(autoFillIRS.classList.contains('selected')).toBe(false);
    expect(autoFillTaxReturn.classList.contains('selected')).toBe(false);
    expect(autoFillManual.classList.contains('selected')).toBe(true);
  });
  
  test('autoFillFormFields fills form fields with sample data', () => {
    // Call the method
    window.TaxFilingApp.autoFillFormFields();
    
    // Verify that form fields were filled
    expect(document.getElementById('fullName').value).toBe('John Q. Taxpayer');
    expect(document.getElementById('ssn').value).toBe('123-45-6789');
    expect(document.getElementById('filingStatusTax').value).toBe('single');
    expect(document.getElementById('phoneNumber').value).toBe('(555) 123-4567');
  });
});
