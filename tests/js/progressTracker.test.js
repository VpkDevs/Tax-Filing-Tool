/**
 * Tests for the progress tracker module
 */

// Mock the DOM elements
document.querySelector = jest.fn().mockImplementation(selector => {
  if (selector === '.filing-progress-fill') {
    return { style: { width: '' } };
  }
  if (selector === '.filing-progress-text .current-step') {
    return { textContent: '' };
  }
  if (selector === '.filing-progress-text .total-steps') {
    return { textContent: '' };
  }
  return null;
});

// Create a mock event
const mockEvent = new Event('progress-updated');
document.dispatchEvent = jest.fn();

// Import the progress tracker module
const progressTrackerCode = `
  window.ProgressTracker = {
    totalSteps: 0,
    currentStep: 0,
    
    init: function(total) {
      this.totalSteps = total || 5;
      this.currentStep = 1;
      this.updateUI();
      
      // Add event listeners for next/prev buttons
      const nextButtons = document.querySelectorAll('.next-step');
      const prevButtons = document.querySelectorAll('.prev-step');
      
      nextButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.nextStep();
        });
      });
      
      prevButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.prevStep();
        });
      });
      
      console.log('Progress Tracker initialized with ' + this.totalSteps + ' steps.');
    },
    
    nextStep: function() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateUI();
        
        // Dispatch event for other components to listen to
        const event = new CustomEvent('progress-updated', {
          detail: {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps
          }
        });
        document.dispatchEvent(event);
        
        return true;
      }
      return false;
    },
    
    prevStep: function() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.updateUI();
        
        // Dispatch event for other components to listen to
        const event = new CustomEvent('progress-updated', {
          detail: {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps
          }
        });
        document.dispatchEvent(event);
        
        return true;
      }
      return false;
    },
    
    goToStep: function(step) {
      if (step >= 1 && step <= this.totalSteps) {
        this.currentStep = step;
        this.updateUI();
        
        // Dispatch event for other components to listen to
        const event = new CustomEvent('progress-updated', {
          detail: {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps
          }
        });
        document.dispatchEvent(event);
        
        return true;
      }
      return false;
    },
    
    updateUI: function() {
      // Update progress bar
      const progressFill = document.querySelector('.filing-progress-fill');
      if (progressFill) {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = percentage + '%';
      }
      
      // Update step text
      const currentStepText = document.querySelector('.filing-progress-text .current-step');
      if (currentStepText) {
        currentStepText.textContent = this.currentStep;
      }
      
      const totalStepsText = document.querySelector('.filing-progress-text .total-steps');
      if (totalStepsText) {
        totalStepsText.textContent = this.totalSteps;
      }
      
      // Update step indicators
      const stepIndicators = document.querySelectorAll('.step-indicator');
      stepIndicators.forEach((indicator, index) => {
        if (index + 1 < this.currentStep) {
          indicator.classList.add('completed');
          indicator.classList.remove('active');
        } else if (index + 1 === this.currentStep) {
          indicator.classList.add('active');
          indicator.classList.remove('completed');
        } else {
          indicator.classList.remove('active', 'completed');
        }
      });
      
      // Show/hide step content
      for (let i = 1; i <= this.totalSteps; i++) {
        const stepContent = document.getElementById('filingStep' + i);
        if (stepContent) {
          if (i === this.currentStep) {
            stepContent.classList.add('active');
          } else {
            stepContent.classList.remove('active');
          }
        }
      }
    }
  };
`;

// Execute the code to create the ProgressTracker object
eval(progressTrackerCode);

describe('Progress Tracker', () => {
  let ProgressTracker;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the ProgressTracker object
    ProgressTracker = window.ProgressTracker;
    
    // Reset ProgressTracker state
    ProgressTracker.totalSteps = 0;
    ProgressTracker.currentStep = 0;
    
    // Mock document.querySelectorAll
    document.querySelectorAll.mockImplementation(selector => {
      if (selector === '.next-step' || selector === '.prev-step') {
        return [{ addEventListener: jest.fn() }];
      }
      if (selector === '.step-indicator') {
        return [
          { classList: { add: jest.fn(), remove: jest.fn() } },
          { classList: { add: jest.fn(), remove: jest.fn() } },
          { classList: { add: jest.fn(), remove: jest.fn() } },
          { classList: { add: jest.fn(), remove: jest.fn() } },
          { classList: { add: jest.fn(), remove: jest.fn() } }
        ];
      }
      return [];
    });
    
    // Mock document.getElementById
    document.getElementById.mockImplementation(id => {
      if (id.startsWith('filingStep')) {
        return {
          classList: {
            add: jest.fn(),
            remove: jest.fn()
          }
        };
      }
      return null;
    });
  });
  
  test('init should initialize the progress tracker', () => {
    // Call the method
    ProgressTracker.init(5);
    
    // Verify that the state was initialized correctly
    expect(ProgressTracker.totalSteps).toBe(5);
    expect(ProgressTracker.currentStep).toBe(1);
    
    // Verify that event listeners were added
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    expect(nextButtons[0].addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(prevButtons[0].addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    
    // Verify that updateUI was called
    const progressFill = document.querySelector('.filing-progress-fill');
    expect(progressFill.style.width).toBe('20%'); // 1/5 * 100
  });
  
  test('nextStep should increment the current step', () => {
    // Initialize the progress tracker
    ProgressTracker.init(5);
    
    // Call the method
    const result = ProgressTracker.nextStep();
    
    // Verify that the state was updated correctly
    expect(ProgressTracker.currentStep).toBe(2);
    expect(result).toBe(true);
    
    // Verify that updateUI was called
    const progressFill = document.querySelector('.filing-progress-fill');
    expect(progressFill.style.width).toBe('40%'); // 2/5 * 100
    
    // Verify that the event was dispatched
    expect(document.dispatchEvent).toHaveBeenCalled();
    
    // Test boundary condition: last step
    ProgressTracker.currentStep = 5;
    const result2 = ProgressTracker.nextStep();
    
    // Verify that the state was not updated
    expect(ProgressTracker.currentStep).toBe(5);
    expect(result2).toBe(false);
  });
  
  test('prevStep should decrement the current step', () => {
    // Initialize the progress tracker
    ProgressTracker.init(5);
    ProgressTracker.currentStep = 3;
    
    // Call the method
    const result = ProgressTracker.prevStep();
    
    // Verify that the state was updated correctly
    expect(ProgressTracker.currentStep).toBe(2);
    expect(result).toBe(true);
    
    // Verify that updateUI was called
    const progressFill = document.querySelector('.filing-progress-fill');
    expect(progressFill.style.width).toBe('40%'); // 2/5 * 100
    
    // Verify that the event was dispatched
    expect(document.dispatchEvent).toHaveBeenCalled();
    
    // Test boundary condition: first step
    ProgressTracker.currentStep = 1;
    const result2 = ProgressTracker.prevStep();
    
    // Verify that the state was not updated
    expect(ProgressTracker.currentStep).toBe(1);
    expect(result2).toBe(false);
  });
  
  test('goToStep should set the current step', () => {
    // Initialize the progress tracker
    ProgressTracker.init(5);
    
    // Call the method
    const result = ProgressTracker.goToStep(4);
    
    // Verify that the state was updated correctly
    expect(ProgressTracker.currentStep).toBe(4);
    expect(result).toBe(true);
    
    // Verify that updateUI was called
    const progressFill = document.querySelector('.filing-progress-fill');
    expect(progressFill.style.width).toBe('80%'); // 4/5 * 100
    
    // Verify that the event was dispatched
    expect(document.dispatchEvent).toHaveBeenCalled();
    
    // Test invalid step: too low
    const result2 = ProgressTracker.goToStep(0);
    
    // Verify that the state was not updated
    expect(ProgressTracker.currentStep).toBe(4);
    expect(result2).toBe(false);
    
    // Test invalid step: too high
    const result3 = ProgressTracker.goToStep(6);
    
    // Verify that the state was not updated
    expect(ProgressTracker.currentStep).toBe(4);
    expect(result3).toBe(false);
  });
  
  test('updateUI should update the UI elements', () => {
    // Initialize the progress tracker
    ProgressTracker.init(5);
    ProgressTracker.currentStep = 3;
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Call the method
    ProgressTracker.updateUI();
    
    // Verify that the progress bar was updated
    const progressFill = document.querySelector('.filing-progress-fill');
    expect(progressFill.style.width).toBe('60%'); // 3/5 * 100
    
    // Verify that the step text was updated
    const currentStepText = document.querySelector('.filing-progress-text .current-step');
    expect(currentStepText.textContent).toBe(3);
    
    const totalStepsText = document.querySelector('.filing-progress-text .total-steps');
    expect(totalStepsText.textContent).toBe(5);
    
    // Verify that the step indicators were updated
    const stepIndicators = document.querySelectorAll('.step-indicator');
    
    // First two steps should be completed
    expect(stepIndicators[0].classList.add).toHaveBeenCalledWith('completed');
    expect(stepIndicators[0].classList.remove).toHaveBeenCalledWith('active');
    
    expect(stepIndicators[1].classList.add).toHaveBeenCalledWith('completed');
    expect(stepIndicators[1].classList.remove).toHaveBeenCalledWith('active');
    
    // Third step should be active
    expect(stepIndicators[2].classList.add).toHaveBeenCalledWith('active');
    expect(stepIndicators[2].classList.remove).toHaveBeenCalledWith('completed');
    
    // Fourth and fifth steps should be neither active nor completed
    expect(stepIndicators[3].classList.remove).toHaveBeenCalledWith('active', 'completed');
    expect(stepIndicators[4].classList.remove).toHaveBeenCalledWith('active', 'completed');
    
    // Verify that the step content was updated
    for (let i = 1; i <= 5; i++) {
      const stepContent = document.getElementById('filingStep' + i);
      
      if (i === 3) {
        expect(stepContent.classList.add).toHaveBeenCalledWith('active');
      } else {
        expect(stepContent.classList.remove).toHaveBeenCalledWith('active');
      }
    }
  });
});
