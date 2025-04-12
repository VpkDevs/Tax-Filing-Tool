/**
 * Tests for the Navigation functionality
 * 
 * This test suite defines how the navigation OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Navigation', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <header>
        <nav class="main-nav">
          <div class="logo">
            <img src="logo.png" alt="Tax Filing Tool Logo">
            <span>Tax Filing Tool</span>
          </div>
          <ul class="nav-links">
            <li><a href="#home" class="nav-link">Home</a></li>
            <li><a href="#features" class="nav-link">Features</a></li>
            <li><a href="#pricing" class="nav-link">Pricing</a></li>
            <li><a href="#faq" class="nav-link">FAQ</a></li>
            <li><a href="#contact" class="nav-link">Contact</a></li>
          </ul>
          <div class="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>
      
      <main>
        <section id="home">Home Section</section>
        <section id="features">Features Section</section>
        <section id="pricing">Pricing Section</section>
        <section id="faq">FAQ Section</section>
        <section id="contact">Contact Section</section>
      </main>
    `;
    
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
          if (this.id === 'features') return 500;
          if (this.id === 'pricing') return 1000;
          if (this.id === 'faq') return 1500;
          if (this.id === 'contact') return 2000;
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
  
  test('Navigation should highlight the active section based on scroll position', () => {
    // Initialize navigation
    window.Navigation.init();
    
    // Get navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Verify initial state (home should be active)
    expect(navLinks[0].classList.contains('active')).toBe(true);
    
    // Simulate scrolling to features section
    window.scrollY = 600;
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Verify that features link is now active
    expect(navLinks[0].classList.contains('active')).toBe(false);
    expect(navLinks[1].classList.contains('active')).toBe(true);
    
    // Simulate scrolling to pricing section
    window.scrollY = 1100;
    window.dispatchEvent(scrollEvent);
    
    // Verify that pricing link is now active
    expect(navLinks[1].classList.contains('active')).toBe(false);
    expect(navLinks[2].classList.contains('active')).toBe(true);
  });
  
  test('Clicking navigation links should scroll to the corresponding section', () => {
    // Initialize navigation
    window.Navigation.init();
    
    // Get navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Simulate clicking on features link
    navLinks[1].click();
    
    // Verify that scrollTo was called with the correct arguments
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 480, // 500 - 20 (offset)
      behavior: 'smooth'
    });
    
    // Verify that features link is now active
    expect(navLinks[0].classList.contains('active')).toBe(false);
    expect(navLinks[1].classList.contains('active')).toBe(true);
  });
  
  test('Mobile menu button should toggle the mobile menu', () => {
    // Initialize navigation
    window.Navigation.init();
    
    // Get mobile menu button and nav
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    // Verify initial state
    expect(nav.classList.contains('mobile-active')).toBe(false);
    
    // Simulate clicking mobile menu button
    mobileMenuBtn.click();
    
    // Verify that mobile menu is open
    expect(nav.classList.contains('mobile-active')).toBe(true);
    expect(mobileMenuBtn.classList.contains('active')).toBe(true);
    
    // Simulate clicking mobile menu button again
    mobileMenuBtn.click();
    
    // Verify that mobile menu is closed
    expect(nav.classList.contains('mobile-active')).toBe(false);
    expect(mobileMenuBtn.classList.contains('active')).toBe(false);
  });
  
  test('Clicking outside the mobile menu should close it', () => {
    // Initialize navigation
    window.Navigation.init();
    
    // Get mobile menu button and nav
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    // Open mobile menu
    mobileMenuBtn.click();
    expect(nav.classList.contains('mobile-active')).toBe(true);
    
    // Simulate clicking outside the menu
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    document.body.dispatchEvent(clickEvent);
    
    // Verify that mobile menu is closed
    expect(nav.classList.contains('mobile-active')).toBe(false);
  });
  
  test('Navigation should be sticky when scrolling down', () => {
    // Initialize navigation
    window.Navigation.init();
    
    // Get header
    const header = document.querySelector('header');
    
    // Verify initial state
    expect(header.classList.contains('sticky')).toBe(false);
    
    // Simulate scrolling down
    window.scrollY = 100;
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Verify that header is sticky
    expect(header.classList.contains('sticky')).toBe(true);
    
    // Simulate scrolling back to top
    window.scrollY = 0;
    window.dispatchEvent(scrollEvent);
    
    // Verify that header is not sticky
    expect(header.classList.contains('sticky')).toBe(false);
  });
  
  test('Navigation should have a scroll progress indicator', () => {
    // Initialize navigation
    window.Navigation.init();
    
    // Verify that scroll progress indicator exists
    const scrollProgress = document.querySelector('.scroll-progress');
    expect(scrollProgress).not.toBeNull();
    
    // Simulate scrolling halfway down the page
    window.scrollY = document.body.scrollHeight / 2;
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
    
    // Verify that scroll progress is updated
    expect(scrollProgress.style.width).toBe('50%');
    
    // Simulate scrolling to the bottom of the page
    window.scrollY = document.body.scrollHeight;
    window.dispatchEvent(scrollEvent);
    
    // Verify that scroll progress is 100%
    expect(scrollProgress.style.width).toBe('100%');
  });
});
