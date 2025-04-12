/**
 * Tests for the form validation functionality
 */

describe('Form Validation', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="personalInfoForm" class="tax-form">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="ssn">Social Security Number</label>
          <input type="text" id="ssn" name="ssn" required>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="filingStatusTax">Filing Status</label>
          <select id="filingStatusTax" name="filingStatusTax" required>
            <option value="">Select Filing Status</option>
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="marriedSeparate">Married Filing Separately</option>
            <option value="headOfHousehold">Head of Household</option>
            <option value="widow">Qualifying Widow(er)</option>
          </select>
          <div class="error-message"></div>
        </div>
        <button type="submit" class="btn btn-primary">Continue</button>
      </form>
    `;

    // Create a mock TaxFilingApp object
    window.TaxFilingApp = {
      validateField: function(field) {
        // Reset field state
        field.classList.remove('valid', 'invalid');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) errorElement.textContent = '';

        // Check if field is empty
        if (field.required && !field.value.trim()) {
          field.classList.add('invalid');
          if (errorElement) errorElement.textContent = 'This field is required';
          return false;
        }

        // Validate based on field name
        let isValid = true;

        switch (field.name) {
          case 'fullName':
            // Name should be at least 2 characters
            if (field.value.trim().length < 2) {
              isValid = false;
              if (errorElement) errorElement.textContent = 'Name should be at least 2 characters';
            }
            break;

          case 'ssn':
            // SSN should match format XXX-XX-XXXX
            const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
            if (!ssnRegex.test(field.value)) {
              isValid = false;
              if (errorElement) errorElement.textContent = 'SSN should be in format XXX-XX-XXXX';
            }
            break;

          case 'email':
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
              isValid = false;
              if (errorElement) errorElement.textContent = 'Please enter a valid email address';
            }
            break;

          case 'phoneNumber':
            // Phone number validation (simple)
            const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
            if (!phoneRegex.test(field.value)) {
              isValid = false;
              if (errorElement) errorElement.textContent = 'Phone number should be in format (XXX) XXX-XXXX';
            }
            break;

          case 'filingStatusTax':
            // Filing status should be selected
            if (!field.value) {
              isValid = false;
              if (errorElement) errorElement.textContent = 'Please select a filing status';
            }
            break;
        }

        // Update field state
        if (isValid) {
          field.classList.add('valid');
        } else {
          field.classList.add('invalid');
        }

        return isValid;
      },

      validateForm: function(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
          if (!this.validateField(field)) {
            isValid = false;
          }
        });

        return isValid;
      },

      initFormValidation: function() {
        // Get all forms
        const forms = [
          document.getElementById('personalInfoForm'),
          document.getElementById('contactInfoForm'),
          document.getElementById('dependentInfoForm')
        ].filter(form => form !== null);

        // Add submit event listeners to forms
        forms.forEach(form => {
          form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (this.validateForm(form)) {
              console.log('Form is valid, proceeding...');
              // In a real app, we would submit the form or move to the next step
            } else {
              console.log('Form validation failed');
            }
          });

          // Add input event listeners to form fields
          const fields = form.querySelectorAll('input, select, textarea');
          fields.forEach(field => {
            field.addEventListener('input', () => {
              this.validateField(field);
            });

            field.addEventListener('blur', () => {
              this.validateField(field);
            });
          });
        });
      }
    };
  });

  test('validateField validates full name correctly', () => {
    const fullNameField = document.getElementById('fullName');

    // Test with empty name
    fullNameField.value = '';
    const emptyResult = window.TaxFilingApp.validateField(fullNameField);
    expect(emptyResult).toBe(false);
    expect(fullNameField.classList.contains('invalid')).toBe(true);
    expect(fullNameField.parentElement.querySelector('.error-message').textContent).toBe('This field is required');

    // Test with short name
    fullNameField.value = 'A';
    const shortResult = window.TaxFilingApp.validateField(fullNameField);
    expect(shortResult).toBe(false);
    expect(fullNameField.classList.contains('invalid')).toBe(true);
    expect(fullNameField.parentElement.querySelector('.error-message').textContent).toBe('Name should be at least 2 characters');

    // Test with valid name
    fullNameField.value = 'John Doe';
    const validResult = window.TaxFilingApp.validateField(fullNameField);
    expect(validResult).toBe(true);
    expect(fullNameField.classList.contains('valid')).toBe(true);
    expect(fullNameField.parentElement.querySelector('.error-message').textContent).toBe('');
  });

  test('validateField validates SSN correctly', () => {
    const ssnField = document.getElementById('ssn');

    // Test with empty SSN
    ssnField.value = '';
    const emptyResult = window.TaxFilingApp.validateField(ssnField);
    expect(emptyResult).toBe(false);
    expect(ssnField.classList.contains('invalid')).toBe(true);

    // Test with invalid format
    ssnField.value = '123456789';
    const invalidResult = window.TaxFilingApp.validateField(ssnField);
    expect(invalidResult).toBe(false);
    expect(ssnField.classList.contains('invalid')).toBe(true);
    expect(ssnField.parentElement.querySelector('.error-message').textContent).toBe('SSN should be in format XXX-XX-XXXX');

    // Test with valid SSN
    ssnField.value = '123-45-6789';
    const validResult = window.TaxFilingApp.validateField(ssnField);
    expect(validResult).toBe(true);
    expect(ssnField.classList.contains('valid')).toBe(true);
  });

  test('validateField validates filing status correctly', () => {
    const filingStatusField = document.getElementById('filingStatusTax');

    // Test with no selection
    filingStatusField.value = '';
    const emptyResult = window.TaxFilingApp.validateField(filingStatusField);
    expect(emptyResult).toBe(false);
    expect(filingStatusField.classList.contains('invalid')).toBe(true);

    // Test with valid selection
    filingStatusField.value = 'single';
    const validResult = window.TaxFilingApp.validateField(filingStatusField);
    expect(validResult).toBe(true);
    expect(filingStatusField.classList.contains('valid')).toBe(true);
  });

  test('validateForm validates the entire form', () => {
    const form = document.getElementById('personalInfoForm');
    const fullNameField = document.getElementById('fullName');
    const ssnField = document.getElementById('ssn');
    const filingStatusField = document.getElementById('filingStatusTax');

    // Test with all fields empty
    fullNameField.value = '';
    ssnField.value = '';
    filingStatusField.value = '';

    const emptyResult = window.TaxFilingApp.validateForm(form);
    expect(emptyResult).toBe(false);

    // Test with some fields valid, some invalid
    fullNameField.value = 'John Doe';
    ssnField.value = '123-45-6789';
    filingStatusField.value = '';

    const partialResult = window.TaxFilingApp.validateForm(form);
    expect(partialResult).toBe(false);

    // Test with all fields valid
    fullNameField.value = 'John Doe';
    ssnField.value = '123-45-6789';
    filingStatusField.value = 'single';

    const validResult = window.TaxFilingApp.validateForm(form);
    expect(validResult).toBe(true);
  });

  test('form submission is prevented when validation fails', () => {
    const form = document.getElementById('personalInfoForm');
    const fullNameField = document.getElementById('fullName');
    const ssnField = document.getElementById('ssn');
    const filingStatusField = document.getElementById('filingStatusTax');

    // Initialize form validation
    window.TaxFilingApp.initFormValidation();

    // Set up console.log spy
    console.log = jest.fn();

    // Test with invalid form
    fullNameField.value = '';
    ssnField.value = '';
    filingStatusField.value = '';

    // Simulate form submission
    const submitEvent = new Event('submit');
    form.dispatchEvent(submitEvent);

    // Verify that form submission was prevented
    expect(console.log).toHaveBeenCalledWith('Form validation failed');

    // Test with valid form
    fullNameField.value = 'John Doe';
    ssnField.value = '123-45-6789';
    filingStatusField.value = 'single';

    // Simulate form submission
    form.dispatchEvent(submitEvent);

    // Verify that form submission proceeded
    expect(console.log).toHaveBeenCalledWith('Form is valid, proceeding...');
  });
});
