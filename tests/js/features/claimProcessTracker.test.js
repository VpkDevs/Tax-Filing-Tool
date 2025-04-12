/**
 * Tests for the Claim Process Tracker functionality
 * 
 * This test suite defines how the claim process tracker OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Claim Process Tracker', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="claimProcessTracker" class="status-tracker">
        <div class="status-steps">
          <div class="status-step">
            <div class="status-dot">1</div>
            <div class="status-label">Preparation</div>
            <div class="status-description">Gather your documents and information</div>
          </div>
          <div class="status-step">
            <div class="status-dot">2</div>
            <div class="status-label">Filing</div>
            <div class="status-description">Complete and submit your tax return</div>
          </div>
          <div class="status-step">
            <div class="status-dot">3</div>
            <div class="status-label">Processing</div>
            <div class="status-description">Your return is being processed by the IRS</div>
          </div>
          <div class="status-step">
            <div class="status-dot">4</div>
            <div class="status-label">Approved</div>
            <div class="status-description">Your return has been approved</div>
          </div>
          <div class="status-step">
            <div class="status-dot">5</div>
            <div class="status-label">Payment</div>
            <div class="status-description">Receive your refund or make payment</div>
          </div>
        </div>
        <div class="status-progress-bar">
          <div class="status-progress"></div>
        </div>
      </div>
      
      <div class="filing-steps">
        <div id="step1" class="filing-step active">
          <h2>Step 1: Personal Information</h2>
          <!-- Step content -->
          <button class="next-step-btn">Next</button>
        </div>
        <div id="step2" class="filing-step">
          <h2>Step 2: Income</h2>
          <!-- Step content -->
          <button class="prev-step-btn">Previous</button>
          <button class="next-step-btn">Next</button>
        </div>
        <div id="step3" class="filing-step">
          <h2>Step 3: Deductions</h2>
          <!-- Step content -->
          <button class="prev-step-btn">Previous</button>
          <button class="next-step-btn">Next</button>
        </div>
        <div id="step4" class="filing-step">
          <h2>Step 4: Credits</h2>
          <!-- Step content -->
          <button class="prev-step-btn">Previous</button>
          <button class="next-step-btn">Next</button>
        </div>
        <div id="step5" class="filing-step">
          <h2>Step 5: Review & Submit</h2>
          <!-- Step content -->
          <button class="prev-step-btn">Previous</button>
          <button id="submitTaxReturn" class="submit-btn">Submit Tax Return</button>
        </div>
      </div>
    `;
  });
  
  test('ClaimProcessTracker should initialize with the first step active', () => {
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that the first step is active
    expect(statusSteps[0].classList.contains('active')).toBe(true);
    expect(statusSteps[1].classList.contains('active')).toBe(false);
    expect(statusSteps[2].classList.contains('active')).toBe(false);
    expect(statusSteps[3].classList.contains('active')).toBe(false);
    expect(statusSteps[4].classList.contains('active')).toBe(false);
    
    // Verify that no steps are completed
    expect(statusSteps[0].classList.contains('completed')).toBe(false);
    expect(statusSteps[1].classList.contains('completed')).toBe(false);
    expect(statusSteps[2].classList.contains('completed')).toBe(false);
    expect(statusSteps[3].classList.contains('completed')).toBe(false);
    expect(statusSteps[4].classList.contains('completed')).toBe(false);
    
    // Verify that progress bar is at 0%
    const progressBar = document.querySelector('.status-progress');
    expect(progressBar.style.width).toBe('0%');
  });
  
  test('ClaimProcessTracker should update when filing steps change', () => {
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Get next step buttons
    const nextStepButtons = document.querySelectorAll('.next-step-btn');
    
    // Click next step button to go to step 2
    nextStepButtons[0].click();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that the first step is completed and the second step is active
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[0].classList.contains('active')).toBe(false);
    expect(statusSteps[1].classList.contains('active')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(false);
    
    // Verify that the first step has a check icon
    const firstStepDot = statusSteps[0].querySelector('.status-dot');
    expect(firstStepDot.innerHTML).toBe('<i class="fas fa-check"></i>');
    
    // Verify that progress bar is at 20%
    const progressBar = document.querySelector('.status-progress');
    expect(progressBar.style.width).toBe('20%');
    
    // Click next step button to go to step 3
    nextStepButtons[1].click();
    
    // Verify that the first and second steps are completed and the third step is active
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    expect(statusSteps[2].classList.contains('active')).toBe(true);
    
    // Verify that the second step has a check icon
    const secondStepDot = statusSteps[1].querySelector('.status-dot');
    expect(secondStepDot.innerHTML).toBe('<i class="fas fa-check"></i>');
    
    // Verify that progress bar is at 40%
    expect(progressBar.style.width).toBe('40%');
  });
  
  test('ClaimProcessTracker should update when going back to previous steps', () => {
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Get next and previous step buttons
    const nextStepButtons = document.querySelectorAll('.next-step-btn');
    const prevStepButtons = document.querySelectorAll('.prev-step-btn');
    
    // Go to step 3
    nextStepButtons[0].click();
    nextStepButtons[1].click();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that steps 1 and 2 are completed and step 3 is active
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    expect(statusSteps[2].classList.contains('active')).toBe(true);
    
    // Go back to step 2
    prevStepButtons[1].click();
    
    // Verify that step 1 is completed, step 2 is active, and step 3 is neither
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('active')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(false);
    expect(statusSteps[2].classList.contains('active')).toBe(false);
    expect(statusSteps[2].classList.contains('completed')).toBe(false);
    
    // Verify that progress bar is at 20%
    const progressBar = document.querySelector('.status-progress');
    expect(progressBar.style.width).toBe('20%');
  });
  
  test('ClaimProcessTracker should update when tax return is submitted', () => {
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Get next step buttons and submit button
    const nextStepButtons = document.querySelectorAll('.next-step-btn');
    const submitButton = document.getElementById('submitTaxReturn');
    
    // Go to step 5
    nextStepButtons[0].click();
    nextStepButtons[1].click();
    nextStepButtons[2].click();
    nextStepButtons[3].click();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that steps 1-4 are completed and step 5 is active
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    expect(statusSteps[2].classList.contains('completed')).toBe(true);
    expect(statusSteps[3].classList.contains('completed')).toBe(true);
    expect(statusSteps[4].classList.contains('active')).toBe(true);
    
    // Verify that progress bar is at 80%
    const progressBar = document.querySelector('.status-progress');
    expect(progressBar.style.width).toBe('80%');
    
    // Submit tax return
    submitButton.click();
    
    // Verify that all steps are completed
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    expect(statusSteps[2].classList.contains('completed')).toBe(true);
    expect(statusSteps[3].classList.contains('completed')).toBe(true);
    expect(statusSteps[4].classList.contains('completed')).toBe(true);
    
    // Verify that progress bar is at 100%
    expect(progressBar.style.width).toBe('100%');
  });
  
  test('ClaimProcessTracker should show detailed information when hovering over steps', () => {
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Simulate hovering over step 3
    const mouseEnterEvent = new MouseEvent('mouseenter');
    statusSteps[2].dispatchEvent(mouseEnterEvent);
    
    // Verify that step 3 has the hover class
    expect(statusSteps[2].classList.contains('hover')).toBe(true);
    
    // Verify that step description is visible
    const stepDescription = statusSteps[2].querySelector('.status-description');
    expect(window.getComputedStyle(stepDescription).opacity).toBe('1');
    
    // Simulate moving mouse away from step 3
    const mouseLeaveEvent = new MouseEvent('mouseleave');
    statusSteps[2].dispatchEvent(mouseLeaveEvent);
    
    // Verify that step 3 no longer has the hover class
    expect(statusSteps[2].classList.contains('hover')).toBe(false);
    
    // Verify that step description is hidden
    expect(window.getComputedStyle(stepDescription).opacity).toBe('0');
  });
  
  test('ClaimProcessTracker should update when receiving progress-updated event', () => {
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Create progress-updated event
    const progressEvent = new CustomEvent('progress-updated', {
      detail: {
        currentStep: 3,
        totalSteps: 5
      }
    });
    
    // Dispatch progress-updated event
    document.dispatchEvent(progressEvent);
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that steps 1 and 2 are completed and step 3 is active
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    expect(statusSteps[2].classList.contains('active')).toBe(true);
    expect(statusSteps[3].classList.contains('active')).toBe(false);
    expect(statusSteps[4].classList.contains('active')).toBe(false);
    
    // Verify that progress bar is at 40%
    const progressBar = document.querySelector('.status-progress');
    expect(progressBar.style.width).toBe('40%');
  });
  
  test('ClaimProcessTracker should handle custom step mapping', () => {
    // Initialize claim process tracker with custom step mapping
    window.ClaimProcessTracker.init({
      stepMapping: {
        1: 1, // Step 1 maps to Preparation
        2: 1, // Step 2 maps to Preparation
        3: 2, // Step 3 maps to Filing
        4: 2, // Step 4 maps to Filing
        5: 3  // Step 5 maps to Processing
      }
    });
    
    // Get next step buttons
    const nextStepButtons = document.querySelectorAll('.next-step-btn');
    
    // Go to step 3
    nextStepButtons[0].click();
    nextStepButtons[1].click();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that step 1 is completed and step 2 is active (based on custom mapping)
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('active')).toBe(true);
    expect(statusSteps[2].classList.contains('active')).toBe(false);
    
    // Verify that progress bar is at 20%
    const progressBar = document.querySelector('.status-progress');
    expect(progressBar.style.width).toBe('20%');
  });
  
  test('ClaimProcessTracker should save progress to localStorage', () => {
    // Mock localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Get next step buttons
    const nextStepButtons = document.querySelectorAll('.next-step-btn');
    
    // Go to step 3
    nextStepButtons[0].click();
    nextStepButtons[1].click();
    
    // Verify that progress was saved to localStorage
    const savedProgress = JSON.parse(localStorage.getItem('taxFilingProgress'));
    expect(savedProgress).not.toBeNull();
    expect(savedProgress.currentStep).toBe(3);
    expect(savedProgress.completedSteps).toEqual([1, 2]);
  });
  
  test('ClaimProcessTracker should load progress from localStorage', () => {
    // Mock localStorage with saved progress
    const savedProgress = {
      currentStep: 4,
      completedSteps: [1, 2, 3]
    };
    
    const localStorageMock = (function() {
      let store = {
        taxFilingProgress: JSON.stringify(savedProgress)
      };
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Initialize claim process tracker
    window.ClaimProcessTracker.init();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that steps 1-3 are completed and step 4 is active
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    expect(statusSteps[2].classList.contains('completed')).toBe(true);
    expect(statusSteps[3].classList.contains('active')).toBe(true);
    expect(statusSteps[4].classList.contains('active')).toBe(false);
    
    // Verify that progress bar is at 60%
    const progressBar = document.querySelector('.status-progress');
    expect(progressBar.style.width).toBe('60%');
    
    // Verify that filing step 4 is active
    const filingSteps = document.querySelectorAll('.filing-step');
    expect(filingSteps[0].classList.contains('active')).toBe(false);
    expect(filingSteps[1].classList.contains('active')).toBe(false);
    expect(filingSteps[2].classList.contains('active')).toBe(false);
    expect(filingSteps[3].classList.contains('active')).toBe(true);
    expect(filingSteps[4].classList.contains('active')).toBe(false);
  });
});
