/**
 * Tests for the navigation functionality
 */

describe('Navigation', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
      </nav>
      <section id="home">Home Section</section>
      <section id="about">About Section</section>
      <section id="services">Services Section</section>
    `;

    // Create a mock TaxFilingApp object
    window.TaxFilingApp = {
      initNavigation: function() {
        // Get all navigation links
        const navLinks = document.querySelectorAll('nav a');

        if (navLinks.length === 0) {
          console.warn('No navigation links found.');
          return;
        }

        // Add active class style
        const style = document.createElement('style');
        style.textContent = `
          nav a.active {
            background-color: rgba(139, 92, 246, 0.1);
            color: var(--accent);
            box-shadow: 0 0 10px var(--primary), 0 0 20px var(--accent);
            transform: translateY(-2px);
            text-shadow: 0 0 5px var(--accent);
          }
        `;
        document.head.appendChild(style);

        // Set active link based on current section
        const setActiveNavLink = () => {
          // Get current scroll position
          const scrollPosition = window.scrollY;

          // Get all sections
          const sections = document.querySelectorAll('section');

          // Find the current section
          let currentSection = '';

          sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for better UX
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              currentSection = section.getAttribute('id');
            }
          });

          // Update active link
          navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSection) {
              link.classList.add('active');
            }
          });
        };

        // Add scroll event listener
        window.addEventListener('scroll', setActiveNavLink);

        // Set active link on page load
        setActiveNavLink();

        // Add click event to smooth scroll and set active
        navLinks.forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
              window.scrollTo({
                top: targetSection.offsetTop - 20,
                behavior: 'smooth'
              });

              // Update active link
              navLinks.forEach(link => link.classList.remove('active'));
              this.classList.add('active');
            }
          });
        });
      },

      initMobileMenu: function() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('nav');

        if (mobileMenuBtn && nav) {
          mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') &&
              !nav.contains(e.target) &&
              !mobileMenuBtn.contains(e.target)) {
              nav.classList.remove('active');
              mobileMenuBtn.classList.remove('active');
            }
          });
        }
      }
    };

    // Mock window.scrollTo
    window.scrollTo = jest.fn();

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    });

    // Mock offsetTop and offsetHeight
    Object.defineProperties(HTMLElement.prototype, {
      offsetTop: {
        get: function() {
          if (this.id === 'home') return 0;
          if (this.id === 'about') return 500;
          if (this.id === 'services') return 1000;
          return 0;
        }
      },
      offsetHeight: {
        get: function() {
          return 500;
        }
      }
    });
  });

  test('initNavigation adds style and event listeners', () => {
    // Initialize navigation
    window.TaxFilingApp.initNavigation();

    // Verify that style was added
    const style = document.querySelector('style');
    expect(style).not.toBeNull();
    expect(style.textContent).toContain('nav a.active');

    // Verify that scroll event listener was added
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));

    // Verify that click event listeners were added to nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      expect(link.onclick).not.toBeNull();
    });
  });

  test('navigation links update active state on scroll', () => {
    // Initialize navigation
    window.TaxFilingApp.initNavigation();

    // Get navigation links
    const navLinks = document.querySelectorAll('nav a');

    // Verify initial state (home should be active)
    expect(navLinks[0].classList.contains('active')).toBe(true);
    expect(navLinks[1].classList.contains('active')).toBe(false);
    expect(navLinks[2].classList.contains('active')).toBe(false);

    // Simulate scrolling to about section
    window.scrollY = 600;
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);

    // Verify that about link is now active
    expect(navLinks[0].classList.contains('active')).toBe(false);
    expect(navLinks[1].classList.contains('active')).toBe(true);
    expect(navLinks[2].classList.contains('active')).toBe(false);

    // Simulate scrolling to services section
    window.scrollY = 1100;
    window.dispatchEvent(scrollEvent);

    // Verify that services link is now active
    expect(navLinks[0].classList.contains('active')).toBe(false);
    expect(navLinks[1].classList.contains('active')).toBe(false);
    expect(navLinks[2].classList.contains('active')).toBe(true);
  });

  test('clicking navigation links scrolls to the section', () => {
    // Initialize navigation
    window.TaxFilingApp.initNavigation();

    // Get navigation links
    const navLinks = document.querySelectorAll('nav a');

    // Simulate clicking on about link
    navLinks[1].click();

    // Verify that scrollTo was called with the correct arguments
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 480, // 500 - 20
      behavior: 'smooth'
    });

    // Verify that about link is now active
    expect(navLinks[0].classList.contains('active')).toBe(false);
    expect(navLinks[1].classList.contains('active')).toBe(true);
    expect(navLinks[2].classList.contains('active')).toBe(false);
  });

  test('initMobileMenu initializes mobile menu', () => {
    // Add mobile menu button to the DOM
    document.body.innerHTML += `
      <button class="mobile-menu-btn">Menu</button>
    `;

    // Initialize mobile menu
    window.TaxFilingApp.initMobileMenu();

    // Get elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    // Verify that event listeners were added
    expect(mobileMenuBtn.onclick).not.toBeNull();

    // Simulate clicking the mobile menu button
    mobileMenuBtn.click();

    // Verify that the nav and button have the active class
    expect(nav.classList.contains('active')).toBe(true);
    expect(mobileMenuBtn.classList.contains('active')).toBe(true);

    // Simulate clicking outside
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.dispatchEvent(event);

    // Verify that the active class was removed
    expect(nav.classList.contains('active')).toBe(false);
    expect(mobileMenuBtn.classList.contains('active')).toBe(false);
  });
});
