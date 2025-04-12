/**
 * Tests for the Form Validation functionality
 * 
 * This test suite defines how the form validation OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Form Validation', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="personalInfoForm" class="tax-form">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="ssn">Social Security Number</label>
          <input type="text" id="ssn" name="ssn" required>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" required>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="filingStatus">Filing Status</label>
          <select id="filingStatus" name="filingStatus" required>
            <option value="">Select Filing Status</option>
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="marriedSeparate">Married Filing Separately</option>
            <option value="headOfHousehold">Head of Household</option>
            <option value="widow">Qualifying Widow(er)</option>
          </select>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="income">Annual Income</label>
          <input type="number" id="income" name="income" min="0" step="0.01" required>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="dependents">Number of Dependents</label>
          <input type="number" id="dependents" name="dependents" min="0" step="1" required>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="birthdate">Date of Birth</label>
          <input type="date" id="birthdate" name="birthdate" required>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <textarea id="address" name="address" required></textarea>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="termsAgreement" name="termsAgreement" required>
            I agree to the terms and conditions
          </label>
          <div class="error-message" aria-live="polite"></div>
        </div>
        <button type="submit" class="btn btn-primary">Continue</button>
      </form>
    `;
  });
  
  test('validateField should validate required fields', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Get required fields
    const fullNameField = document.getElementById('fullName');
    const ssnField = document.getElementById('ssn');
    const emailField = document.getElementById('email');
    
    // Test empty fields
    expect(window.FormValidator.validateField(fullNameField)).toBe(false);
    expect(fullNameField.classList.contains('invalid')).toBe(true);
    expect(fullNameField.parentElement.querySelector('.error-message').textContent).toBe('This field is required');
    
    expect(window.FormValidator.validateField(ssnField)).toBe(false);
    expect(ssnField.classList.contains('invalid')).toBe(true);
    expect(ssnField.parentElement.querySelector('.error-message').textContent).toBe('This field is required');
    
    expect(window.FormValidator.validateField(emailField)).toBe(false);
    expect(emailField.classList.contains('invalid')).toBe(true);
    expect(emailField.parentElement.querySelector('.error-message').textContent).toBe('This field is required');
    
    // Test with values
    fullNameField.value = 'John Doe';
    ssnField.value = '123-45-6789';
    emailField.value = 'john@example.com';
    
    expect(window.FormValidator.validateField(fullNameField)).toBe(true);
    expect(fullNameField.classList.contains('valid')).toBe(true);
    expect(fullNameField.parentElement.querySelector('.error-message').textContent).toBe('');
    
    expect(window.FormValidator.validateField(ssnField)).toBe(true);
    expect(ssnField.classList.contains('valid')).toBe(true);
    expect(ssnField.parentElement.querySelector('.error-message').textContent).toBe('');
    
    expect(window.FormValidator.validateField(emailField)).toBe(true);
    expect(emailField.classList.contains('valid')).toBe(true);
    expect(emailField.parentElement.querySelector('.error-message').textContent).toBe('');
  });
  
  test('validateField should validate field formats', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Test SSN format
    const ssnField = document.getElementById('ssn');
    
    ssnField.value = '123456789'; // Invalid format
    expect(window.FormValidator.validateField(ssnField)).toBe(false);
    expect(ssnField.classList.contains('invalid')).toBe(true);
    expect(ssnField.parentElement.querySelector('.error-message').textContent).toBe('SSN must be in format XXX-XX-XXXX');
    
    ssnField.value = '123-45-6789'; // Valid format
    expect(window.FormValidator.validateField(ssnField)).toBe(true);
    expect(ssnField.classList.contains('valid')).toBe(true);
    expect(ssnField.parentElement.querySelector('.error-message').textContent).toBe('');
    
    // Test email format
    const emailField = document.getElementById('email');
    
    emailField.value = 'invalid-email'; // Invalid format
    expect(window.FormValidator.validateField(emailField)).toBe(false);
    expect(emailField.classList.contains('invalid')).toBe(true);
    expect(emailField.parentElement.querySelector('.error-message').textContent).toBe('Please enter a valid email address');
    
    emailField.value = 'john@example.com'; // Valid format
    expect(window.FormValidator.validateField(emailField)).toBe(true);
    expect(emailField.classList.contains('valid')).toBe(true);
    expect(emailField.parentElement.querySelector('.error-message').textContent).toBe('');
    
    // Test phone number format
    const phoneField = document.getElementById('phoneNumber');
    
    phoneField.value = '1234567890'; // Invalid format
    expect(window.FormValidator.validateField(phoneField)).toBe(false);
    expect(phoneField.classList.contains('invalid')).toBe(true);
    expect(phoneField.parentElement.querySelector('.error-message').textContent).toBe('Phone number must be in format (XXX) XXX-XXXX');
    
    phoneField.value = '(123) 456-7890'; // Valid format
    expect(window.FormValidator.validateField(phoneField)).toBe(true);
    expect(phoneField.classList.contains('valid')).toBe(true);
    expect(phoneField.parentElement.querySelector('.error-message').textContent).toBe('');
  });
  
  test('validateField should validate number ranges', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Test income range
    const incomeField = document.getElementById('income');
    
    incomeField.value = '-1000'; // Invalid (negative)
    expect(window.FormValidator.validateField(incomeField)).toBe(false);
    expect(incomeField.classList.contains('invalid')).toBe(true);
    expect(incomeField.parentElement.querySelector('.error-message').textContent).toBe('Income cannot be negative');
    
    incomeField.value = '50000'; // Valid
    expect(window.FormValidator.validateField(incomeField)).toBe(true);
    expect(incomeField.classList.contains('valid')).toBe(true);
    expect(incomeField.parentElement.querySelector('.error-message').textContent).toBe('');
    
    // Test dependents range
    const dependentsField = document.getElementById('dependents');
    
    dependentsField.value = '-2'; // Invalid (negative)
    expect(window.FormValidator.validateField(dependentsField)).toBe(false);
    expect(dependentsField.classList.contains('invalid')).toBe(true);
    expect(dependentsField.parentElement.querySelector('.error-message').textContent).toBe('Number of dependents cannot be negative');
    
    dependentsField.value = '2.5'; // Invalid (not an integer)
    expect(window.FormValidator.validateField(dependentsField)).toBe(false);
    expect(dependentsField.classList.contains('invalid')).toBe(true);
    expect(dependentsField.parentElement.querySelector('.error-message').textContent).toBe('Number of dependents must be a whole number');
    
    dependentsField.value = '3'; // Valid
    expect(window.FormValidator.validateField(dependentsField)).toBe(true);
    expect(dependentsField.classList.contains('valid')).toBe(true);
    expect(dependentsField.parentElement.querySelector('.error-message').textContent).toBe('');
  });
  
  test('validateField should validate date fields', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Test birthdate
    const birthdateField = document.getElementById('birthdate');
    
    // Set future date (invalid)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    birthdateField.value = futureDate.toISOString().split('T')[0];
    
    expect(window.FormValidator.validateField(birthdateField)).toBe(false);
    expect(birthdateField.classList.contains('invalid')).toBe(true);
    expect(birthdateField.parentElement.querySelector('.error-message').textContent).toBe('Date of birth cannot be in the future');
    
    // Set valid date
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 30);
    birthdateField.value = validDate.toISOString().split('T')[0];
    
    expect(window.FormValidator.validateField(birthdateField)).toBe(true);
    expect(birthdateField.classList.contains('valid')).toBe(true);
    expect(birthdateField.parentElement.querySelector('.error-message').textContent).toBe('');
  });
  
  test('validateField should validate checkbox fields', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Test terms agreement checkbox
    const termsCheckbox = document.getElementById('termsAgreement');
    
    // Unchecked (invalid)
    termsCheckbox.checked = false;
    expect(window.FormValidator.validateField(termsCheckbox)).toBe(false);
    expect(termsCheckbox.classList.contains('invalid')).toBe(true);
    expect(termsCheckbox.parentElement.querySelector('.error-message').textContent).toBe('You must agree to the terms and conditions');
    
    // Checked (valid)
    termsCheckbox.checked = true;
    expect(window.FormValidator.validateField(termsCheckbox)).toBe(true);
    expect(termsCheckbox.classList.contains('valid')).toBe(true);
    expect(termsCheckbox.parentElement.querySelector('.error-message').textContent).toBe('');
  });
  
  test('validateForm should validate all fields in a form', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Get form
    const form = document.getElementById('personalInfoForm');
    
    // Test with all fields empty
    expect(window.FormValidator.validateForm(form)).toBe(false);
    
    // Fill in all fields with valid values
    document.getElementById('fullName').value = 'John Doe';
    document.getElementById('ssn').value = '123-45-6789';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phoneNumber').value = '(123) 456-7890';
    document.getElementById('filingStatus').value = 'single';
    document.getElementById('income').value = '50000';
    document.getElementById('dependents').value = '2';
    
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 30);
    document.getElementById('birthdate').value = validDate.toISOString().split('T')[0];
    
    document.getElementById('address').value = '123 Main St, Anytown, USA';
    document.getElementById('termsAgreement').checked = true;
    
    // Test with all fields valid
    expect(window.FormValidator.validateForm(form)).toBe(true);
    
    // Make one field invalid
    document.getElementById('email').value = 'invalid-email';
    
    // Test with one invalid field
    expect(window.FormValidator.validateForm(form)).toBe(false);
  });
  
  test('form submission should be prevented when validation fails', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Get form
    const form = document.getElementById('personalInfoForm');
    
    // Mock form submission
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = jest.fn();
    
    // Dispatch submit event with invalid form
    form.dispatchEvent(submitEvent);
    
    // Verify that preventDefault was called
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    
    // Fill in all fields with valid values
    document.getElementById('fullName').value = 'John Doe';
    document.getElementById('ssn').value = '123-45-6789';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phoneNumber').value = '(123) 456-7890';
    document.getElementById('filingStatus').value = 'single';
    document.getElementById('income').value = '50000';
    document.getElementById('dependents').value = '2';
    
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 30);
    document.getElementById('birthdate').value = validDate.toISOString().split('T')[0];
    
    document.getElementById('address').value = '123 Main St, Anytown, USA';
    document.getElementById('termsAgreement').checked = true;
    
    // Reset mock
    submitEvent.preventDefault.mockClear();
    
    // Mock form submission handler
    window.FormValidator.onFormSubmit = jest.fn();
    
    // Dispatch submit event with valid form
    form.dispatchEvent(submitEvent);
    
    // Verify that preventDefault was not called
    expect(submitEvent.preventDefault).not.toHaveBeenCalled();
    
    // Verify that onFormSubmit was called
    expect(window.FormValidator.onFormSubmit).toHaveBeenCalled();
  });
  
  test('real-time validation should occur on input and blur events', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Get a field
    const emailField = document.getElementById('email');
    
    // Mock validateField
    window.FormValidator.validateField = jest.fn();
    
    // Simulate input event
    const inputEvent = new Event('input');
    emailField.dispatchEvent(inputEvent);
    
    // Verify that validateField was called
    expect(window.FormValidator.validateField).toHaveBeenCalledWith(emailField);
    
    // Reset mock
    window.FormValidator.validateField.mockClear();
    
    // Simulate blur event
    const blurEvent = new Event('blur');
    emailField.dispatchEvent(blurEvent);
    
    // Verify that validateField was called
    expect(window.FormValidator.validateField).toHaveBeenCalledWith(emailField);
  });
  
  test('form should show a summary of validation errors', () => {
    // Initialize form validation
    window.FormValidator.init();
    
    // Get form
    const form = document.getElementById('personalInfoForm');
    
    // Add error summary element
    const errorSummary = document.createElement('div');
    errorSummary.id = 'error-summary';
    errorSummary.setAttribute('role', 'alert');
    errorSummary.setAttribute('aria-live', 'assertive');
    form.prepend(errorSummary);
    
    // Submit form with errors
    const submitEvent = new Event('submit');
    form.dispatchEvent(submitEvent);
    
    // Verify that error summary is shown
    expect(errorSummary.style.display).not.toBe('none');
    expect(errorSummary.innerHTML).toContain('Please correct the following errors:');
    expect(errorSummary.querySelectorAll('li').length).toBeGreaterThan(0);
    
    // Fill in all fields with valid values
    document.getElementById('fullName').value = 'John Doe';
    document.getElementById('ssn').value = '123-45-6789';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('phoneNumber').value = '(123) 456-7890';
    document.getElementById('filingStatus').value = 'single';
    document.getElementById('income').value = '50000';
    document.getElementById('dependents').value = '2';
    
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 30);
    document.getElementById('birthdate').value = validDate.toISOString().split('T')[0];
    
    document.getElementById('address').value = '123 Main St, Anytown, USA';
    document.getElementById('termsAgreement').checked = true;
    
    // Submit form without errors
    form.dispatchEvent(submitEvent);
    
    // Verify that error summary is hidden
    expect(errorSummary.style.display).toBe('none');
  });
});
