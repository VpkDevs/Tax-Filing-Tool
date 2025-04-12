/**
 * Tests for the main tax filing app functionality
 */

// Mock the modules
jest.mock('../../src/static/js/modules/walkthrough.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/forms.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/rebate-calculator.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/progress-tracker.js', () => ({
  init: jest.fn()
}), { virtual: true });
jest.mock('../../src/static/js/modules/document-analyzer.js', () => ({}), { virtual: true });
jest.mock('../../src/static/js/modules/virtual-assistant.js', () => ({}), { virtual: true });

// Import the tax filing app
const taxFilingAppCode = `
  ${require('fs').readFileSync('./src/static/js/tax-filing-app.js', 'utf8')}
`;

describe('Tax Filing App', () => {
  let TaxFilingApp;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new instance of TaxFilingApp for each test
    eval(taxFilingAppCode);
    TaxFilingApp = window.TaxFilingApp;
    
    // Mock the methods
    TaxFilingApp.initAutoFillOptions = jest.fn();
    TaxFilingApp.initClaimProcessTracker = jest.fn();
    TaxFilingApp.initMobileMenu = jest.fn();
    TaxFilingApp.initHelperChat = jest.fn();
    TaxFilingApp.initThemeToggle = jest.fn();
    TaxFilingApp.initFilingSteps = jest.fn();
    TaxFilingApp.initCalculator = jest.fn();
    TaxFilingApp.initFormValidation = jest.fn();
    TaxFilingApp.initDocumentUpload = jest.fn();
    TaxFilingApp.initWalkthrough = jest.fn();
  });
  
  test('init should initialize all components', () => {
    // Call the method
    TaxFilingApp.init();
    
    // Verify that all initialization methods were called
    expect(TaxFilingApp.initAutoFillOptions).toHaveBeenCalled();
    expect(TaxFilingApp.initClaimProcessTracker).toHaveBeenCalled();
    
    // Verify that ProgressTracker.init was called
    const ProgressTracker = require('../../src/static/js/modules/progress-tracker.js');
    expect(ProgressTracker.init).toHaveBeenCalledWith(5);
  });
  
  test('init should handle errors gracefully', () => {
    // Make initAutoFillOptions throw an error
    TaxFilingApp.initAutoFillOptions.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // Call the method
    TaxFilingApp.init();
    
    // Verify that the error was logged
    expect(console.error).toHaveBeenCalled();
  });
  
  test('showAutoFillSuccessMessage should create and display a success message', () => {
    // Mock the DOM elements
    const autoFillSection = {
      appendChild: jest.fn(),
      contains: jest.fn().mockReturnValue(true),
      removeChild: jest.fn()
    };
    
    document.querySelector.mockImplementation(selector => {
      if (selector === '.auto-fill-section') return autoFillSection;
      return null;
    });
    
    // Mock createElement to return an element
    document.createElement.mockImplementation(tag => {
      return {
        className: '',
        innerHTML: ''
      };
    });
    
    // Mock setTimeout
    jest.useFakeTimers();
    
    // Call the method
    TaxFilingApp.showAutoFillSuccessMessage('IRS account');
    
    // Verify that the success message was created and added to the section
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(autoFillSection.appendChild).toHaveBeenCalled();
    
    // Fast-forward timers
    jest.runAllTimers();
    
    // Verify that the success message was removed after the timeout
    expect(autoFillSection.removeChild).toHaveBeenCalled();
  });
  
  test('handleHelperResponse should generate appropriate responses', () => {
    // Mock addHelperMessage
    TaxFilingApp.addHelperMessage = jest.fn();
    
    // Mock setTimeout
    jest.useFakeTimers();
    
    // Test different message types
    TaxFilingApp.handleHelperResponse('What is the recovery rebate credit?');
    jest.runAllTimers();
    expect(TaxFilingApp.addHelperMessage).toHaveBeenCalledWith(
      expect.stringContaining('Recovery Rebate Credit'),
      'assistant'
    );
    
    TaxFilingApp.handleHelperMessage('Am I eligible?');
    jest.runAllTimers();
    expect(TaxFilingApp.addHelperMessage).toHaveBeenCalledWith(
      expect.stringContaining('eligible'),
      'assistant'
    );
    
    TaxFilingApp.handleHelperResponse('What documents do I need?');
    jest.runAllTimers();
    expect(TaxFilingApp.addHelperMessage).toHaveBeenCalledWith(
      expect.stringContaining('Social Security Number'),
      'assistant'
    );
    
    TaxFilingApp.handleHelperResponse('How do I file for 2021?');
    jest.runAllTimers();
    expect(TaxFilingApp.addHelperMessage).toHaveBeenCalledWith(
      expect.stringContaining('prior tax year'),
      'assistant'
    );
    
    TaxFilingApp.handleHelperResponse('Hello');
    jest.runAllTimers();
    expect(TaxFilingApp.addHelperMessage).toHaveBeenCalledWith(
      expect.stringContaining('I\'m here to help'),
      'assistant'
    );
  });
});
