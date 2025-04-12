/**
 * Tests for the claim process tracker functionality
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

describe('Claim Process Tracker', () => {
  let TaxFilingApp;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new instance of TaxFilingApp for each test
    eval(taxFilingAppCode);
    TaxFilingApp = window.TaxFilingApp;
  });
  
  test('initClaimProcessTracker should initialize the claim process tracker', () => {
    // Mock the DOM elements
    const statusSteps = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } }
    ];
    
    const claimProcessTracker = {
      querySelectorAll: jest.fn().mockReturnValue(statusSteps)
    };
    
    document.getElementById.mockImplementation(id => {
      if (id === 'claimProcessTracker') return claimProcessTracker;
      return null;
    });
    
    // Call the method
    TaxFilingApp.initClaimProcessTracker();
    
    // Verify that the tracker was reset to the first step
    statusSteps.forEach((step, index) => {
      expect(step.classList.remove).toHaveBeenCalledWith('active', 'completed');
      if (index === 0) {
        expect(step.classList.add).toHaveBeenCalledWith('active');
      }
    });
    
    // Verify that event listener was added
    expect(document.addEventListener).toHaveBeenCalledWith('progress-updated', expect.any(Function));
    
    // Test the progress-updated event handler
    const progressUpdatedHandler = document.addEventListener.mock.calls[0][1];
    
    // Mock updateClaimProcessTracker
    TaxFilingApp.updateClaimProcessTracker = jest.fn();
    
    // Simulate progress-updated event
    const event = { detail: { currentStep: 3, totalSteps: 5 } };
    progressUpdatedHandler(event);
    
    // Verify that updateClaimProcessTracker was called with the correct arguments
    expect(TaxFilingApp.updateClaimProcessTracker).toHaveBeenCalledWith(3, 5);
  });
  
  test('updateClaimProcessTracker should update the claim process tracker', () => {
    // Mock the DOM elements
    const statusSteps = [
      { 
        classList: { add: jest.fn(), remove: jest.fn() },
        querySelector: jest.fn().mockReturnValue({ innerHTML: '' })
      },
      { 
        classList: { add: jest.fn(), remove: jest.fn() },
        querySelector: jest.fn().mockReturnValue({ innerHTML: '' })
      },
      { 
        classList: { add: jest.fn(), remove: jest.fn() },
        querySelector: jest.fn().mockReturnValue({ innerHTML: '' })
      },
      { 
        classList: { add: jest.fn(), remove: jest.fn() },
        querySelector: jest.fn().mockReturnValue({ innerHTML: '' })
      },
      { 
        classList: { add: jest.fn(), remove: jest.fn() },
        querySelector: jest.fn().mockReturnValue({ innerHTML: '' })
      }
    ];
    
    const claimProcessTracker = {
      querySelectorAll: jest.fn().mockReturnValue(statusSteps)
    };
    
    document.getElementById.mockImplementation(id => {
      if (id === 'claimProcessTracker') return claimProcessTracker;
      return null;
    });
    
    // Call the method with currentStep = 3, totalSteps = 5
    // This should mark steps 1 and 2 as completed, step 3 as active
    TaxFilingApp.updateClaimProcessTracker(3, 5);
    
    // Verify that the tracker was updated correctly
    statusSteps.forEach((step, index) => {
      expect(step.classList.remove).toHaveBeenCalledWith('active', 'completed');
      
      if (index < 2) { // Steps 0 and 1 (first and second)
        expect(step.classList.add).toHaveBeenCalledWith('completed');
        const dot = step.querySelector.mock.results[0].value;
        expect(dot.innerHTML).toBe('<i class=\"fas fa-check\"></i>');
      } else if (index === 2) { // Step 2 (third)
        expect(step.classList.add).toHaveBeenCalledWith('active');
      }
    });
    
    // Call the method with currentStep = 5, totalSteps = 5
    // This should mark steps 1-4 as completed, step 5 as active
    jest.clearAllMocks();
    TaxFilingApp.updateClaimProcessTracker(5, 5);
    
    // Verify that the tracker was updated correctly
    statusSteps.forEach((step, index) => {
      expect(step.classList.remove).toHaveBeenCalledWith('active', 'completed');
      
      if (index < 4) { // Steps 0-3 (first through fourth)
        expect(step.classList.add).toHaveBeenCalledWith('completed');
        const dot = step.querySelector.mock.results[0].value;
        expect(dot.innerHTML).toBe('<i class=\"fas fa-check\"></i>');
      } else if (index === 4) { // Step 4 (fifth)
        expect(step.classList.add).toHaveBeenCalledWith('active');
      }
    });
  });
});
