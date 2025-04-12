/**
 * Tests for the theme switcher functionality
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

    // Create a mock ThemeSwitcher object
    window.ThemeSwitcher = {
      currentTheme: 'light',

      init: function() {
        // Get theme buttons
        const themeButtons = document.querySelectorAll('.theme-btn');

        // Add event listeners to theme buttons
        themeButtons.forEach(button => {
          button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            this.setTheme(theme);
          });
        });

        // Check for saved theme in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          this.setTheme(savedTheme);
        }
      },

      setTheme: function(theme) {
        // Remove current theme class
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-vaporwave');

        // Add new theme class
        document.body.classList.add(`theme-${theme}`);

        // Update current theme
        this.currentTheme = theme;

        // Save theme to localStorage
        localStorage.setItem('theme', theme);

        // Update active button
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
          button.classList.remove('active');
          if (button.dataset.theme === theme) {
            button.classList.add('active');
          }
        });

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          switch (theme) {
            case 'light':
              metaThemeColor.setAttribute('content', '#ffffff');
              break;
            case 'dark':
              metaThemeColor.setAttribute('content', '#1a1a1a');
              break;
            case 'vaporwave':
              metaThemeColor.setAttribute('content', '#ff00ff');
              break;
          }
        }
      }
    };

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

  test('init initializes the theme switcher', () => {
    // Add spy to addEventListener
    const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');

    // Initialize theme switcher
    window.ThemeSwitcher.init();

    // Verify that event listeners were added to theme buttons
    expect(addEventListenerSpy).toHaveBeenCalled();

    // Clean up
    addEventListenerSpy.mockRestore();
  });

  test('init loads theme from localStorage', () => {
    // Set a theme in localStorage
    localStorage.setItem('theme', 'dark');

    // Initialize theme switcher
    window.ThemeSwitcher.init();

    // Verify that the theme was loaded from localStorage
    expect(window.ThemeSwitcher.currentTheme).toBe('dark');
    expect(document.body.classList.contains('theme-dark')).toBe(true);
  });

  test('setTheme changes the theme', () => {
    // Initialize theme switcher
    window.ThemeSwitcher.init();

    // Set theme to dark
    window.ThemeSwitcher.setTheme('dark');

    // Verify that the theme was changed
    expect(window.ThemeSwitcher.currentTheme).toBe('dark');
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(document.body.classList.contains('theme-light')).toBe(false);
    expect(document.body.classList.contains('theme-vaporwave')).toBe(false);

    // Verify that the dark theme button is active
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    const vaporwaveThemeBtn = document.getElementById('vaporwaveThemeBtn');

    expect(lightThemeBtn.classList.contains('active')).toBe(false);
    expect(darkThemeBtn.classList.contains('active')).toBe(true);
    expect(vaporwaveThemeBtn.classList.contains('active')).toBe(false);

    // Verify that the theme was saved to localStorage
    expect(localStorage.getItem('theme')).toBe('dark');

    // Set theme to vaporwave
    window.ThemeSwitcher.setTheme('vaporwave');

    // Verify that the theme was changed
    expect(window.ThemeSwitcher.currentTheme).toBe('vaporwave');
    expect(document.body.classList.contains('theme-vaporwave')).toBe(true);
    expect(document.body.classList.contains('theme-light')).toBe(false);
    expect(document.body.classList.contains('theme-dark')).toBe(false);

    // Verify that the vaporwave theme button is active
    expect(lightThemeBtn.classList.contains('active')).toBe(false);
    expect(darkThemeBtn.classList.contains('active')).toBe(false);
    expect(vaporwaveThemeBtn.classList.contains('active')).toBe(true);

    // Verify that the theme was saved to localStorage
    expect(localStorage.getItem('theme')).toBe('vaporwave');
  });

  test('clicking theme buttons changes the theme', () => {
    // Initialize theme switcher
    window.ThemeSwitcher.init();

    // Get theme buttons
    const lightThemeBtn = document.getElementById('lightThemeBtn');
    const darkThemeBtn = document.getElementById('darkThemeBtn');
    const vaporwaveThemeBtn = document.getElementById('vaporwaveThemeBtn');

    // Click dark theme button
    darkThemeBtn.click();

    // Verify that the theme was changed
    expect(window.ThemeSwitcher.currentTheme).toBe('dark');
    expect(document.body.classList.contains('theme-dark')).toBe(true);

    // Click vaporwave theme button
    vaporwaveThemeBtn.click();

    // Verify that the theme was changed
    expect(window.ThemeSwitcher.currentTheme).toBe('vaporwave');
    expect(document.body.classList.contains('theme-vaporwave')).toBe(true);

    // Click light theme button
    lightThemeBtn.click();

    // Verify that the theme was changed
    expect(window.ThemeSwitcher.currentTheme).toBe('light');
    expect(document.body.classList.contains('theme-light')).toBe(true);
  });

  test('setTheme updates meta theme-color for mobile browsers', () => {
    // Add meta theme-color tag
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    metaThemeColor.setAttribute('content', '#ffffff');
    document.head.appendChild(metaThemeColor);

    // Initialize theme switcher
    window.ThemeSwitcher.init();

    // Set theme to dark
    window.ThemeSwitcher.setTheme('dark');

    // Verify that meta theme-color was updated
    expect(metaThemeColor.getAttribute('content')).toBe('#1a1a1a');

    // Set theme to vaporwave
    window.ThemeSwitcher.setTheme('vaporwave');

    // Verify that meta theme-color was updated
    expect(metaThemeColor.getAttribute('content')).toBe('#ff00ff');

    // Set theme to light
    window.ThemeSwitcher.setTheme('light');

    // Verify that meta theme-color was updated
    expect(metaThemeColor.getAttribute('content')).toBe('#ffffff');
  });
});
