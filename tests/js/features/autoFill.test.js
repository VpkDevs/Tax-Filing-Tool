/**
 * Tests for the Auto-Fill functionality
 * 
 * This test suite defines how the auto-fill feature OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Auto-Fill', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="auto-fill-section">
        <h2>Speed Up Your Filing</h2>
        <p>Choose one of the following options to auto-fill your information:</p>
        <div class="auto-fill-options">
          <div id="autoFillIRS" class="auto-fill-option">
            <i class="fas fa-university"></i>
            <h3>Connect IRS Account</h3>
            <p>Import your information directly from the IRS</p>
          </div>
          <div id="autoFillTaxReturn" class="auto-fill-option">
            <i class="fas fa-file-upload"></i>
            <h3>Upload 2022 Tax Return</h3>
            <p>We'll extract your information from last year's return</p>
          </div>
          <div id="autoFillManual" class="auto-fill-option">
            <i class="fas fa-keyboard"></i>
            <h3>Enter Manually</h3>
            <p>Fill in your information step by step</p>
          </div>
        </div>
      </div>
      
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
          <label for="dateOfBirth">Date of Birth</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" required>
          <div class="error-message"></div>
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
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" id="address" name="address" required>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" id="city" name="city" required>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <select id="state" name="state" required>
            <option value="">Select State</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <!-- Other states... -->
            <option value="WY">Wyoming</option>
          </select>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="zipCode">ZIP Code</label>
          <input type="text" id="zipCode" name="zipCode" required>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required>
          <div class="error-message"></div>
        </div>
        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" required>
          <div class="error-message"></div>
        </div>
      </form>
      
      <div id="irsConnectionModal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Connect to IRS Account</h2>
          <p>Please enter your IRS account credentials to import your information.</p>
          <form id="irsConnectionForm">
            <div class="form-group">
              <label for="irsUsername">IRS Username</label>
              <input type="text" id="irsUsername" name="irsUsername" required>
            </div>
            <div class="form-group">
              <label for="irsPassword">IRS Password</label>
              <input type="password" id="irsPassword" name="irsPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Connect</button>
          </form>
        </div>
      </div>
      
      <div id="taxReturnUploadModal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Upload 2022 Tax Return</h2>
          <p>Please upload your 2022 tax return in PDF format.</p>
          <div class="upload-area" id="taxReturnUploadArea">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop your tax return here or click to browse</p>
            <input type="file" id="taxReturnFileInput" accept=".pdf">
          </div>
          <button id="uploadTaxReturnBtn" class="btn btn-primary">Upload</button>
        </div>
      </div>
      
      <div id="autoFillSuccessModal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Information Imported Successfully</h2>
          <p>Your information has been imported successfully. Please review and make any necessary changes.</p>
          <button id="continueBtn" class="btn btn-primary">Continue</button>
        </div>
      </div>
    `;
  });
  
  test('Auto-fill options should be selectable', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Get auto-fill options
    const autoFillIRS = document.getElementById('autoFillIRS');
    const autoFillTaxReturn = document.getElementById('autoFillTaxReturn');
    const autoFillManual = document.getElementById('autoFillManual');
    
    // Verify initial state
    expect(autoFillIRS.classList.contains('selected')).toBe(false);
    expect(autoFillTaxReturn.classList.contains('selected')).toBe(false);
    expect(autoFillManual.classList.contains('selected')).toBe(false);
    
    // Select IRS option
    autoFillIRS.click();
    
    // Verify that IRS option is selected
    expect(autoFillIRS.classList.contains('selected')).toBe(true);
    expect(autoFillTaxReturn.classList.contains('selected')).toBe(false);
    expect(autoFillManual.classList.contains('selected')).toBe(false);
    
    // Select tax return option
    autoFillTaxReturn.click();
    
    // Verify that tax return option is selected
    expect(autoFillIRS.classList.contains('selected')).toBe(false);
    expect(autoFillTaxReturn.classList.contains('selected')).toBe(true);
    expect(autoFillManual.classList.contains('selected')).toBe(false);
    
    // Select manual option
    autoFillManual.click();
    
    // Verify that manual option is selected
    expect(autoFillIRS.classList.contains('selected')).toBe(false);
    expect(autoFillTaxReturn.classList.contains('selected')).toBe(false);
    expect(autoFillManual.classList.contains('selected')).toBe(true);
  });
  
  test('IRS connection modal should open when IRS option is selected', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Get IRS option and modal
    const autoFillIRS = document.getElementById('autoFillIRS');
    const irsConnectionModal = document.getElementById('irsConnectionModal');
    
    // Verify initial state
    expect(irsConnectionModal.style.display).not.toBe('block');
    
    // Select IRS option
    autoFillIRS.click();
    
    // Verify that IRS connection modal is displayed
    expect(irsConnectionModal.style.display).toBe('block');
  });
  
  test('Tax return upload modal should open when tax return option is selected', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Get tax return option and modal
    const autoFillTaxReturn = document.getElementById('autoFillTaxReturn');
    const taxReturnUploadModal = document.getElementById('taxReturnUploadModal');
    
    // Verify initial state
    expect(taxReturnUploadModal.style.display).not.toBe('block');
    
    // Select tax return option
    autoFillTaxReturn.click();
    
    // Verify that tax return upload modal is displayed
    expect(taxReturnUploadModal.style.display).toBe('block');
  });
  
  test('IRS connection form should submit and auto-fill form fields', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Mock fetch API
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          fullName: 'John Q. Taxpayer',
          ssn: '123-45-6789',
          dateOfBirth: '1980-01-15',
          filingStatus: 'single',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          email: 'john@example.com',
          phoneNumber: '(555) 123-4567'
        })
      })
    );
    
    // Get IRS option and form
    const autoFillIRS = document.getElementById('autoFillIRS');
    const irsConnectionForm = document.getElementById('irsConnectionForm');
    const irsUsername = document.getElementById('irsUsername');
    const irsPassword = document.getElementById('irsPassword');
    
    // Select IRS option
    autoFillIRS.click();
    
    // Fill in IRS credentials
    irsUsername.value = 'testuser';
    irsPassword.value = 'testpassword';
    
    // Submit IRS connection form
    const submitEvent = new Event('submit');
    irsConnectionForm.dispatchEvent(submitEvent);
    
    // Wait for fetch to complete
    return new Promise(resolve => {
      setTimeout(() => {
        // Verify that fetch was called with correct parameters
        expect(fetch).toHaveBeenCalledWith(
          'https://api.taxfilingtool.com/irs-connect',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              username: 'testuser',
              password: 'testpassword'
            })
          })
        );
        
        // Verify that form fields were auto-filled
        expect(document.getElementById('fullName').value).toBe('John Q. Taxpayer');
        expect(document.getElementById('ssn').value).toBe('123-45-6789');
        expect(document.getElementById('dateOfBirth').value).toBe('1980-01-15');
        expect(document.getElementById('filingStatus').value).toBe('single');
        expect(document.getElementById('address').value).toBe('123 Main St');
        expect(document.getElementById('city').value).toBe('Anytown');
        expect(document.getElementById('state').value).toBe('CA');
        expect(document.getElementById('zipCode').value).toBe('12345');
        expect(document.getElementById('email').value).toBe('john@example.com');
        expect(document.getElementById('phoneNumber').value).toBe('(555) 123-4567');
        
        // Verify that success modal is displayed
        expect(document.getElementById('autoFillSuccessModal').style.display).toBe('block');
        
        resolve();
      }, 0);
    });
  });
  
  test('Tax return upload should process PDF and auto-fill form fields', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Mock PDF processing
    window.AutoFill.processTaxReturnPDF = jest.fn().mockResolvedValue({
      fullName: 'Jane P. Taxpayer',
      ssn: '987-65-4321',
      dateOfBirth: '1985-05-20',
      filingStatus: 'married',
      address: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '54321',
      email: 'jane@example.com',
      phoneNumber: '(555) 987-6543'
    });
    
    // Get tax return option and upload button
    const autoFillTaxReturn = document.getElementById('autoFillTaxReturn');
    const uploadTaxReturnBtn = document.getElementById('uploadTaxReturnBtn');
    
    // Select tax return option
    autoFillTaxReturn.click();
    
    // Create a mock file
    const mockFile = new File(['dummy content'], 'tax-return-2022.pdf', { type: 'application/pdf' });
    
    // Set the file input value
    const fileInput = document.getElementById('taxReturnFileInput');
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile]
    });
    
    // Trigger file input change event
    const changeEvent = new Event('change');
    fileInput.dispatchEvent(changeEvent);
    
    // Click upload button
    uploadTaxReturnBtn.click();
    
    // Wait for PDF processing to complete
    return new Promise(resolve => {
      setTimeout(() => {
        // Verify that PDF processing was called with the file
        expect(window.AutoFill.processTaxReturnPDF).toHaveBeenCalledWith(mockFile);
        
        // Verify that form fields were auto-filled
        expect(document.getElementById('fullName').value).toBe('Jane P. Taxpayer');
        expect(document.getElementById('ssn').value).toBe('987-65-4321');
        expect(document.getElementById('dateOfBirth').value).toBe('1985-05-20');
        expect(document.getElementById('filingStatus').value).toBe('married');
        expect(document.getElementById('address').value).toBe('456 Oak Ave');
        expect(document.getElementById('city').value).toBe('Somewhere');
        expect(document.getElementById('state').value).toBe('NY');
        expect(document.getElementById('zipCode').value).toBe('54321');
        expect(document.getElementById('email').value).toBe('jane@example.com');
        expect(document.getElementById('phoneNumber').value).toBe('(555) 987-6543');
        
        // Verify that success modal is displayed
        expect(document.getElementById('autoFillSuccessModal').style.display).toBe('block');
        
        resolve();
      }, 0);
    });
  });
  
  test('Manual option should not auto-fill form fields', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Get manual option
    const autoFillManual = document.getElementById('autoFillManual');
    
    // Select manual option
    autoFillManual.click();
    
    // Verify that form fields are empty
    expect(document.getElementById('fullName').value).toBe('');
    expect(document.getElementById('ssn').value).toBe('');
    expect(document.getElementById('dateOfBirth').value).toBe('');
    expect(document.getElementById('filingStatus').value).toBe('');
    expect(document.getElementById('address').value).toBe('');
    expect(document.getElementById('city').value).toBe('');
    expect(document.getElementById('state').value).toBe('');
    expect(document.getElementById('zipCode').value).toBe('');
    expect(document.getElementById('email').value).toBe('');
    expect(document.getElementById('phoneNumber').value).toBe('');
  });
  
  test('Auto-fill should validate imported data', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Mock fetch API with invalid data
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          fullName: 'John Q. Taxpayer',
          ssn: '123456789', // Invalid SSN format
          dateOfBirth: '1980-01-15',
          filingStatus: 'single',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          email: 'invalid-email', // Invalid email format
          phoneNumber: '5551234567' // Invalid phone format
        })
      })
    );
    
    // Get IRS option and form
    const autoFillIRS = document.getElementById('autoFillIRS');
    const irsConnectionForm = document.getElementById('irsConnectionForm');
    const irsUsername = document.getElementById('irsUsername');
    const irsPassword = document.getElementById('irsPassword');
    
    // Select IRS option
    autoFillIRS.click();
    
    // Fill in IRS credentials
    irsUsername.value = 'testuser';
    irsPassword.value = 'testpassword';
    
    // Submit IRS connection form
    const submitEvent = new Event('submit');
    irsConnectionForm.dispatchEvent(submitEvent);
    
    // Wait for fetch to complete
    return new Promise(resolve => {
      setTimeout(() => {
        // Verify that form fields were auto-filled with corrected data
        expect(document.getElementById('fullName').value).toBe('John Q. Taxpayer');
        expect(document.getElementById('ssn').value).toBe('123-45-6789'); // Corrected format
        expect(document.getElementById('dateOfBirth').value).toBe('1980-01-15');
        expect(document.getElementById('filingStatus').value).toBe('single');
        expect(document.getElementById('address').value).toBe('123 Main St');
        expect(document.getElementById('city').value).toBe('Anytown');
        expect(document.getElementById('state').value).toBe('CA');
        expect(document.getElementById('zipCode').value).toBe('12345');
        expect(document.getElementById('email').value).toBe('invalid-email'); // Still invalid, will be highlighted
        expect(document.getElementById('phoneNumber').value).toBe('(555) 123-4567'); // Corrected format
        
        // Verify that invalid fields are highlighted
        expect(document.getElementById('email').classList.contains('invalid')).toBe(true);
        
        // Verify that success modal is displayed with warning
        const successModal = document.getElementById('autoFillSuccessModal');
        expect(successModal.style.display).toBe('block');
        expect(successModal.querySelector('p').textContent).toContain('Some information may be incomplete or invalid');
        
        resolve();
      }, 0);
    });
  });
  
  test('Auto-fill should handle API errors gracefully', () => {
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Mock fetch API with error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })
    );
    
    // Get IRS option and form
    const autoFillIRS = document.getElementById('autoFillIRS');
    const irsConnectionForm = document.getElementById('irsConnectionForm');
    const irsUsername = document.getElementById('irsUsername');
    const irsPassword = document.getElementById('irsPassword');
    
    // Select IRS option
    autoFillIRS.click();
    
    // Fill in IRS credentials
    irsUsername.value = 'testuser';
    irsPassword.value = 'testpassword';
    
    // Submit IRS connection form
    const submitEvent = new Event('submit');
    irsConnectionForm.dispatchEvent(submitEvent);
    
    // Wait for fetch to complete
    return new Promise(resolve => {
      setTimeout(() => {
        // Verify that error message is displayed
        const errorMessage = document.querySelector('#irsConnectionForm .error-message');
        expect(errorMessage.textContent).toContain('Authentication failed');
        
        // Verify that form fields were not auto-filled
        expect(document.getElementById('fullName').value).toBe('');
        expect(document.getElementById('ssn').value).toBe('');
        
        // Verify that success modal is not displayed
        expect(document.getElementById('autoFillSuccessModal').style.display).not.toBe('block');
        
        resolve();
      }, 0);
    });
  });
  
  test('Auto-fill should save imported data to localStorage', () => {
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
    
    // Initialize auto-fill
    window.AutoFill.init();
    
    // Mock fetch API
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          fullName: 'John Q. Taxpayer',
          ssn: '123-45-6789',
          dateOfBirth: '1980-01-15',
          filingStatus: 'single',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          email: 'john@example.com',
          phoneNumber: '(555) 123-4567'
        })
      })
    );
    
    // Get IRS option and form
    const autoFillIRS = document.getElementById('autoFillIRS');
    const irsConnectionForm = document.getElementById('irsConnectionForm');
    
    // Select IRS option
    autoFillIRS.click();
    
    // Fill in IRS credentials
    document.getElementById('irsUsername').value = 'testuser';
    document.getElementById('irsPassword').value = 'testpassword';
    
    // Submit IRS connection form
    const submitEvent = new Event('submit');
    irsConnectionForm.dispatchEvent(submitEvent);
    
    // Wait for fetch to complete
    return new Promise(resolve => {
      setTimeout(() => {
        // Verify that data was saved to localStorage
        const savedData = JSON.parse(localStorage.getItem('taxFilingData'));
        expect(savedData).not.toBeNull();
        expect(savedData.personalInfo.fullName).toBe('John Q. Taxpayer');
        expect(savedData.personalInfo.ssn).toBe('123-45-6789');
        expect(savedData.personalInfo.dateOfBirth).toBe('1980-01-15');
        expect(savedData.personalInfo.filingStatus).toBe('single');
        expect(savedData.personalInfo.address).toBe('123 Main St');
        expect(savedData.personalInfo.city).toBe('Anytown');
        expect(savedData.personalInfo.state).toBe('CA');
        expect(savedData.personalInfo.zipCode).toBe('12345');
        expect(savedData.personalInfo.email).toBe('john@example.com');
        expect(savedData.personalInfo.phoneNumber).toBe('(555) 123-4567');
        
        resolve();
      }, 0);
    });
  });
});
