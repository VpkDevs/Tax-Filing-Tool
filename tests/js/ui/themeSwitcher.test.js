/**
 * Tests for the Theme Switcher functionality
 * 
 * This test suite defines how the theme switcher OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Theme Switcher', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="theme-switcher">
        <button id="lightThemeBtn" class="theme-btn" data-theme="light">Light</button>
        <button id="darkThemeBtn" class="theme-btn" data-theme="dark">Dark</button>
        <button id="vaporwaveThemeBtn" class="theme-btn" data-theme="vaporwave">Vaporwave</button>
      </div>
    `;
    
    // Add meta theme-color tag for mobile browsers
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    metaThemeColor.setAttribute('content', '#ffffff');
    document.head.appendChild(metaThemeColor);
    
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
  });
  
  test('ThemeSwitcher should initialize with event listeners on theme buttons', () => {
    // Initialize theme switcher
    window.ThemeSwitcher.init();
    
    // Get theme buttons
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    const vaporwaveThemeBtn = document.getElementById('vaporwaveThemeBtn');
    
    // Simulate clicks on theme buttons
    lightThemeBtn.click();
    expect(document.body.classList.contains('theme-light')).toBe(true);
    
    darkThemeBtn.click();
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    
    vaporwaveThemeBtn.click();
    expect(document.body.classList.contains('theme-vaporwave')).toBe(true);
  });
  
  test('ThemeSwitcher should load theme from localStorage on initialization', () => {
    // Set a theme in localStorage
    localStorage.setItem('theme', 'dark');
    
    // Initialize theme switcher
    window.ThemeSwitcher.init();
    
    // Verify that the theme was loaded from localStorage
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    
    // Verify that the dark theme button is active
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    expect(darkThemeBtn.classList.contains('active')).toBe(true);
  });
  
  test('setTheme should update body classes, localStorage, and active button', () => {
    // Initialize theme switcher
    window.ThemeSwitcher.init();
    
    // Set theme to dark
    window.ThemeSwitcher.setTheme('dark');
    
    // Verify body classes
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(document.body.classList.contains('theme-light')).toBe(false);
    expect(document.body.classList.contains('theme-vaporwave')).toBe(false);
    
    // Verify localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Verify active button
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    const vaporwaveThemeBtn = document.getElementById('vaporwaveThemeBtn');
    
    expect(lightThemeBtn.classList.contains('active')).toBe(false);
    expect(darkThemeBtn.classList.contains('active')).toBe(true);
    expect(vaporwaveThemeBtn.classList.contains('active')).toBe(false);
  });
  
  test('setTheme should update meta theme-color for mobile browsers', () => {
    // Initialize theme switcher
    window.ThemeSwitcher.init();
    
    // Get meta theme-color element
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    // Set theme to dark
    window.ThemeSwitcher.setTheme('dark');
    expect(metaThemeColor.getAttribute('content')).toBe('#1a1a1a');
    
    // Set theme to vaporwave
    window.ThemeSwitcher.setTheme('vaporwave');
    expect(metaThemeColor.getAttribute('content')).toBe('#ff00ff');
    
    // Set theme to light
    window.ThemeSwitcher.setTheme('light');
    expect(metaThemeColor.getAttribute('content')).toBe('#ffffff');
  });
  
  test('ThemeSwitcher should handle system preference changes', () => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    
    // Initialize theme switcher with system preference enabled
    window.ThemeSwitcher.enableSystemPreference();
    
    // Verify that dark theme is applied based on system preference
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    
    // Change system preference to light
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    
    // Simulate change event
    window.ThemeSwitcher.handleSystemPreferenceChange();
    
    // Verify that light theme is applied
    expect(document.body.classList.contains('theme-light')).toBe(true);
  });
  
  test('ThemeSwitcher should allow disabling system preference', () => {
    // Enable system preference
    window.ThemeSwitcher.enableSystemPreference();
    
    // Disable system preference and set a specific theme
    window.ThemeSwitcher.disableSystemPreference();
    window.ThemeSwitcher.setTheme('vaporwave');
    
    // Verify that the specified theme is applied
    expect(document.body.classList.contains('theme-vaporwave')).toBe(true);
    
    // Change system preference
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    
    // Simulate change event
    window.ThemeSwitcher.handleSystemPreferenceChange();
    
    // Verify that the theme hasn't changed
    expect(document.body.classList.contains('theme-vaporwave')).toBe(true);
  });
});
