/**
 * Tests for the auto-fill options functionality
 */

// Mock the modules
jest.mock('../../src/static/js/modules/walkthrough.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/forms.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/rebate-calculator.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/progress-tracker.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/document-analyzer.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/virtual-assistant.js', () => ({}), { virtual: true });

// Import the tax filing app
const taxFilingAppCode = `
  ${require('fs').readFileSync('./src/static/js/tax-filing-app.js', 'utf8')}
`;

describe('Auto-fill Options', () => {
  let TaxFilingApp;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new instance of TaxFilingApp for each test
    eval(taxFilingAppCode);
    TaxFilingApp = window.TaxFilingApp;
  });
  
  test('initAutoFillOptions should initialize auto-fill options', () => {
    // Mock the DOM elements
    const autoFillIRS = { addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } };
    const autoFillTaxReturn = { addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } };
    const autoFillManual = { addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } };
    
    document.getElementById.mockImplementation(id => {
      if (id === 'autoFillIRS') return autoFillIRS;
      if (id === 'autoFillTaxReturn') return autoFillTaxReturn;
      if (id === 'autoFillManual') return autoFillManual;
      return null;
    });
    
    document.querySelectorAll.mockImplementation(selector => {
      if (selector === '.auto-fill-option') {
        return [autoFillIRS, autoFillTaxReturn, autoFillManual];
      }
      return [];
    });
    
    document.head.appendChild = jest.fn();
    
    // Call the method
    TaxFilingApp.initAutoFillOptions();
    
    // Verify that event listeners were added
    expect(autoFillIRS.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(autoFillTaxReturn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(autoFillManual.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    
    // Verify that the style was added
    expect(document.head.appendChild).toHaveBeenCalled();
    
    // Test click handlers
    const irsClickHandler = autoFillIRS.addEventListener.mock.calls[0][1];
    const taxReturnClickHandler = autoFillTaxReturn.addEventListener.mock.calls[0][1];
    const manualClickHandler = autoFillManual.addEventListener.mock.calls[0][1];
    
    // Mock the showIRSConnectionModal and showTaxReturnUploadModal methods
    TaxFilingApp.showIRSConnectionModal = jest.fn();
    TaxFilingApp.showTaxReturnUploadModal = jest.fn();
    
    // Simulate clicks
    irsClickHandler();
    expect(TaxFilingApp.showIRSConnectionModal).toHaveBeenCalled();
    
    taxReturnClickHandler();
    expect(TaxFilingApp.showTaxReturnUploadModal).toHaveBeenCalled();
    
    manualClickHandler();
    expect(console.log).toHaveBeenCalledWith('Manual entry selected');
  });
  
  test('showIRSConnectionModal should create and display a modal', () => {
    // Mock document.body
    document.body = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      contains: jest.fn().mockReturnValue(true),
    };
    
    // Mock createElement to return elements with event listeners
    document.createElement.mockImplementation(tag => {
      const element = {
        className: '',
        innerHTML: '',
        addEventListener: jest.fn(),
        querySelectorAll: jest.fn().mockReturnValue([
          { addEventListener: jest.fn() }
        ]),
        querySelector: jest.fn().mockReturnValue({
          addEventListener: jest.fn(),
          innerHTML: '',
          disabled: false,
        }),
      };
      return element;
    });
    
    // Mock setTimeout
    jest.useFakeTimers();
    
    // Call the method
    TaxFilingApp.showIRSConnectionModal();
    
    // Verify that the modal was created and added to the body
    expect(document.body.appendChild).toHaveBeenCalled();
    
    // Get the modal element
    const modal = document.body.appendChild.mock.calls[0][0];
    
    // Verify that event listeners were added
    expect(modal.querySelectorAll).toHaveBeenCalledWith('.modal-close');
    expect(modal.querySelector).toHaveBeenCalledWith('#connectIRSBtn');
    
    // Test the connect button click handler
    const connectButton = modal.querySelector.mock.returnValue;
    const connectClickHandler = connectButton.addEventListener.mock.calls[0][1];
    
    // Mock showAutoFillSuccessMessage and autoFillFormFields
    TaxFilingApp.showAutoFillSuccessMessage = jest.fn();
    TaxFilingApp.autoFillFormFields = jest.fn();
    
    // Simulate click
    connectClickHandler();
    
    // Verify that the button was updated
    expect(connectButton.innerHTML).toContain('Connecting');
    expect(connectButton.disabled).toBe(true);
    
    // Fast-forward timers
    jest.runAllTimers();
    
    // Verify that the modal was removed and success message shown
    expect(document.body.removeChild).toHaveBeenCalledWith(modal);
    expect(TaxFilingApp.showAutoFillSuccessMessage).toHaveBeenCalledWith('IRS account');
    expect(TaxFilingApp.autoFillFormFields).toHaveBeenCalled();
  });
  
  test('showTaxReturnUploadModal should create and display a modal', () => {
    // Mock document.body
    document.body = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      contains: jest.fn().mockReturnValue(true),
    };
    
    // Mock createElement to return elements with event listeners
    document.createElement.mockImplementation(tag => {
      const element = {
        className: '',
        innerHTML: '',
        addEventListener: jest.fn(),
        querySelectorAll: jest.fn().mockReturnValue([
          { addEventListener: jest.fn() }
        ]),
        querySelector: jest.fn().mockImplementation(selector => {
          if (selector === '#taxReturnUploadBtn') {
            return { addEventListener: jest.fn() };
          }
          if (selector === '#taxReturnFileInput') {
            return { 
              addEventListener: jest.fn(),
              click: jest.fn(),
              files: [{ name: 'test.pdf' }]
            };
          }
          if (selector === '#taxReturnUploadArea') {
            return { innerHTML: '' };
          }
          return null;
        }),
      };
      return element;
    });
    
    // Mock setTimeout
    jest.useFakeTimers();
    
    // Call the method
    TaxFilingApp.showTaxReturnUploadModal();
    
    // Verify that the modal was created and added to the body
    expect(document.body.appendChild).toHaveBeenCalled();
    
    // Get the modal element
    const modal = document.body.appendChild.mock.calls[0][0];
    
    // Verify that event listeners were added
    expect(modal.querySelectorAll).toHaveBeenCalledWith('.modal-close');
    expect(modal.querySelector).toHaveBeenCalledWith('#taxReturnUploadBtn');
    expect(modal.querySelector).toHaveBeenCalledWith('#taxReturnFileInput');
    
    // Test the upload button click handler
    const uploadButton = modal.querySelector.mock.results[0].value;
    const fileInput = modal.querySelector.mock.results[1].value;
    const uploadClickHandler = uploadButton.addEventListener.mock.calls[0][1];
    
    // Simulate click
    uploadClickHandler();
    
    // Verify that the file input was clicked
    expect(fileInput.click).toHaveBeenCalled();
    
    // Test the file input change handler
    const fileChangeHandler = fileInput.addEventListener.mock.calls[0][1];
    
    // Mock showAutoFillSuccessMessage and autoFillFormFields
    TaxFilingApp.showAutoFillSuccessMessage = jest.fn();
    TaxFilingApp.autoFillFormFields = jest.fn();
    
    // Simulate change event
    fileChangeHandler();
    
    // Fast-forward timers
    jest.runAllTimers();
    
    // Verify that the modal was removed and success message shown
    expect(document.body.removeChild).toHaveBeenCalledWith(modal);
    expect(TaxFilingApp.showAutoFillSuccessMessage).toHaveBeenCalledWith('2020 tax return');
    expect(TaxFilingApp.autoFillFormFields).toHaveBeenCalled();
  });
  
  test('autoFillFormFields should fill form fields with sample data', () => {
    // Mock form fields
    const fullName = { value: '', dispatchEvent: jest.fn() };
    const ssn = { value: '', dispatchEvent: jest.fn() };
    const filingStatusTax = { value: '', dispatchEvent: jest.fn() };
    const phoneNumber = { value: '', dispatchEvent: jest.fn() };
    
    document.getElementById.mockImplementation(id => {
      if (id === 'fullName') return fullName;
      if (id === 'ssn') return ssn;
      if (id === 'filingStatusTax') return filingStatusTax;
      if (id === 'phoneNumber') return phoneNumber;
      return null;
    });
    
    // Call the method
    TaxFilingApp.autoFillFormFields();
    
    // Verify that form fields were filled
    expect(fullName.value).toBe('John Q. Taxpayer');
    expect(ssn.value).toBe('123-45-6789');
    expect(filingStatusTax.value).toBe('single');
    expect(phoneNumber.value).toBe('(555) 123-4567');
    
    // Verify that input events were dispatched
    expect(fullName.dispatchEvent).toHaveBeenCalled();
    expect(ssn.dispatchEvent).toHaveBeenCalled();
    expect(filingStatusTax.dispatchEvent).toHaveBeenCalled();
    expect(phoneNumber.dispatchEvent).toHaveBeenCalled();
  });
});
