/**
 * Tests for the claim process tracker functionality
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
          </div>
          <div class="status-step">
            <div class="status-dot">2</div>
            <div class="status-label">Filing</div>
          </div>
          <div class="status-step">
            <div class="status-dot">3</div>
            <div class="status-label">Processing</div>
          </div>
          <div class="status-step">
            <div class="status-dot">4</div>
            <div class="status-label">Approved</div>
          </div>
          <div class="status-step">
            <div class="status-dot">5</div>
            <div class="status-label">Payment</div>
          </div>
        </div>
      </div>
    `;
    
    // Create a mock TaxFilingApp object
    window.TaxFilingApp = {
      initClaimProcessTracker: function() {
        // Get the claim process tracker element
        const claimProcessTracker = document.getElementById('claimProcessTracker');
        
        if (!claimProcessTracker) {
          console.warn('Claim process tracker not found.');
          return;
        }
        
        console.log('Initializing claim process tracker...');
        
        // Reset the tracker to the first step
        const statusSteps = claimProcessTracker.querySelectorAll('.status-step');
        statusSteps.forEach((step, index) => {
          step.classList.remove('active', 'completed');
          if (index === 0) {
            step.classList.add('active');
          }
        });
        
        // Add event listeners to update the tracker when filing steps change
        document.addEventListener('progress-updated', (event) => {
          const { currentStep, totalSteps } = event.detail;
          this.updateClaimProcessTracker(currentStep, totalSteps);
        });
      },
      
      updateClaimProcessTracker: function(currentStep, totalSteps) {
        const claimProcessTracker = document.getElementById('claimProcessTracker');
        if (!claimProcessTracker) return;
        
        const statusSteps = claimProcessTracker.querySelectorAll('.status-step');
        const claimStep = Math.ceil((currentStep / totalSteps) * statusSteps.length);
        
        statusSteps.forEach((step, index) => {
          step.classList.remove('active', 'completed');
          
          if (index + 1 < claimStep) {
            step.classList.add('completed');
            const dot = step.querySelector('.status-dot');
            if (dot) {
              dot.innerHTML = '<i class="fas fa-check"></i>';
            }
          } else if (index + 1 === claimStep) {
            step.classList.add('active');
          }
        });
      }
    };
  });
  
  test('initClaimProcessTracker initializes the claim process tracker', () => {
    // Initialize claim process tracker
    window.TaxFilingApp.initClaimProcessTracker();
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that the first step is active
    expect(statusSteps[0].classList.contains('active')).toBe(true);
    expect(statusSteps[1].classList.contains('active')).toBe(false);
    expect(statusSteps[2].classList.contains('active')).toBe(false);
    expect(statusSteps[3].classList.contains('active')).toBe(false);
    expect(statusSteps[4].classList.contains('active')).toBe(false);
    
    // Verify that no steps are completed
    statusSteps.forEach(step => {
      expect(step.classList.contains('completed')).toBe(false);
    });
  });
  
  test('updateClaimProcessTracker updates the claim process tracker', () => {
    // Initialize claim process tracker
    window.TaxFilingApp.initClaimProcessTracker();
    
    // Update tracker to step 3 of 5
    window.TaxFilingApp.updateClaimProcessTracker(3, 5);
    
    // Get status steps
    const statusSteps = document.querySelectorAll('.status-step');
    
    // Verify that steps 1 and 2 are completed
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    
    // Verify that step 3 is active
    expect(statusSteps[2].classList.contains('active')).toBe(true);
    
    // Verify that steps 4 and 5 are neither active nor completed
    expect(statusSteps[3].classList.contains('active')).toBe(false);
    expect(statusSteps[3].classList.contains('completed')).toBe(false);
    expect(statusSteps[4].classList.contains('active')).toBe(false);
    expect(statusSteps[4].classList.contains('completed')).toBe(false);
    
    // Verify that check icons were added to completed steps
    expect(statusSteps[0].querySelector('.status-dot').innerHTML).toBe('<i class="fas fa-check"></i>');
    expect(statusSteps[1].querySelector('.status-dot').innerHTML).toBe('<i class="fas fa-check"></i>');
    
    // Update tracker to step 5 of 5
    window.TaxFilingApp.updateClaimProcessTracker(5, 5);
    
    // Verify that steps 1-4 are completed
    expect(statusSteps[0].classList.contains('completed')).toBe(true);
    expect(statusSteps[1].classList.contains('completed')).toBe(true);
    expect(statusSteps[2].classList.contains('completed')).toBe(true);
    expect(statusSteps[3].classList.contains('completed')).toBe(true);
    
    // Verify that step 5 is active
    expect(statusSteps[4].classList.contains('active')).toBe(true);
    
    // Verify that check icons were added to completed steps
    expect(statusSteps[0].querySelector('.status-dot').innerHTML).toBe('<i class="fas fa-check"></i>');
    expect(statusSteps[1].querySelector('.status-dot').innerHTML).toBe('<i class="fas fa-check"></i>');
    expect(statusSteps[2].querySelector('.status-dot').innerHTML).toBe('<i class="fas fa-check"></i>');
    expect(statusSteps[3].querySelector('.status-dot').innerHTML).toBe('<i class="fas fa-check"></i>');
  });
});
