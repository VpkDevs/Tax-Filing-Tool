/**
 * Tests for the theme toggle functionality
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

describe('Theme Toggle', () => {
  let TaxFilingApp;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new instance of TaxFilingApp for each test
    eval(taxFilingAppCode);
    TaxFilingApp = window.TaxFilingApp;
    
    // Mock the DOM elements
    const themeToggle = {
      addEventListener: jest.fn(),
      checked: false
    };
    
    document.querySelector.mockImplementation(selector => {
      if (selector === '#themeToggle') return themeToggle;
      return null;
    });
    
    // Mock localStorage
    localStorage.getItem.mockReturnValue(null);
  });
  
  test('initThemeToggle should initialize the theme toggle', () => {
    // Call the method
    TaxFilingApp.initThemeToggle();
    
    // Get the theme toggle
    const themeToggle = document.querySelector('#themeToggle');
    
    // Verify that event listener was added
    expect(themeToggle.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    
    // Verify that localStorage was checked
    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
    
    // Test with dark theme in localStorage
    localStorage.getItem.mockReturnValueOnce('dark');
    
    // Call the method again
    TaxFilingApp.initThemeToggle();
    
    // Verify that the theme toggle was checked
    expect(themeToggle.checked).toBe(true);
    
    // Verify that the dark theme was applied
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark-theme');
  });
  
  test('toggleTheme should toggle between light and dark themes', () => {
    // Call the method with dark theme
    TaxFilingApp.toggleTheme(true);
    
    // Verify that the dark theme was applied
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark-theme');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    
    // Call the method with light theme
    TaxFilingApp.toggleTheme(false);
    
    // Verify that the dark theme was removed
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark-theme');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});
