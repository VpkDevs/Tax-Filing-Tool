/**
 * Tests for the Responsiveness functionality
 * 
 * This test suite defines how the responsive design OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Responsiveness', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="container">
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
          <section class="hero">
            <div class="hero-content">
              <h1>File Your Taxes with Ease</h1>
              <p>Our tax filing tool makes it simple to file your taxes accurately and quickly.</p>
              <button class="cta-button">Get Started</button>
            </div>
            <div class="hero-image">
              <img src="hero.png" alt="Tax Filing Illustration">
            </div>
          </section>
          
          <section class="features">
            <div class="feature-card">
              <i class="feature-icon"></i>
              <h3>Easy to Use</h3>
              <p>Our intuitive interface guides you through the tax filing process step by step.</p>
            </div>
            <div class="feature-card">
              <i class="feature-icon"></i>
              <h3>Accurate Calculations</h3>
              <p>Our advanced algorithms ensure your tax calculations are accurate and optimized.</p>
            </div>
            <div class="feature-card">
              <i class="feature-icon"></i>
              <h3>Secure Storage</h3>
              <p>Your tax information is stored securely with bank-level encryption.</p>
            </div>
          </section>
        </main>
        
        <footer>
          <div class="footer-content">
            <div class="footer-logo">
              <img src="logo.png" alt="Tax Filing Tool Logo">
              <span>Tax Filing Tool</span>
            </div>
            <div class="footer-links">
              <div class="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#press">Press</a></li>
                </ul>
              </div>
              <div class="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#guides">Guides</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
              <div class="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#cookies">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2023 Tax Filing Tool. All rights reserved.</p>
            <div class="social-links">
              <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
        </footer>
      </div>
    `;
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1200
    });
    
    // Mock window.matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
  });
  
  test('Layout should adapt to mobile viewport', () => {
    // Initialize responsiveness
    window.Responsiveness.init();
    
    // Simulate mobile viewport
    window.innerWidth = 480;
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    
    // Trigger resize event
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    // Verify that mobile class is added to body
    expect(document.body.classList.contains('mobile-view')).toBe(true);
    
    // Verify that mobile menu button is visible
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    expect(window.getComputedStyle(mobileMenuBtn).display).not.toBe('none');
    
    // Verify that nav links are hidden
    const navLinks = document.querySelector('.nav-links');
    expect(window.getComputedStyle(navLinks).display).toBe('none');
    
    // Verify that hero section is stacked
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    expect(window.getComputedStyle(heroContent).width).toBe('100%');
    expect(window.getComputedStyle(heroImage).width).toBe('100%');
    
    // Verify that feature cards are stacked
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      expect(window.getComputedStyle(card).width).toBe('100%');
    });
    
    // Verify that footer columns are stacked
    const footerColumns = document.querySelectorAll('.footer-column');
    footerColumns.forEach(column => {
      expect(window.getComputedStyle(column).width).toBe('100%');
    });
  });
  
  test('Layout should adapt to tablet viewport', () => {
    // Initialize responsiveness
    window.Responsiveness.init();
    
    // Simulate tablet viewport
    window.innerWidth = 768;
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === '(min-width: 769px) and (max-width: 1024px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    
    // Trigger resize event
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    // Verify that tablet class is added to body
    expect(document.body.classList.contains('tablet-view')).toBe(true);
    
    // Verify that mobile menu button is hidden
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    expect(window.getComputedStyle(mobileMenuBtn).display).toBe('none');
    
    // Verify that nav links are visible
    const navLinks = document.querySelector('.nav-links');
    expect(window.getComputedStyle(navLinks).display).not.toBe('none');
    
    // Verify that hero section is side by side
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    expect(window.getComputedStyle(heroContent).width).toBe('50%');
    expect(window.getComputedStyle(heroImage).width).toBe('50%');
    
    // Verify that feature cards are in a grid
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      expect(window.getComputedStyle(card).width).toBe('calc(50% - 20px)');
    });
    
    // Verify that footer columns are in a grid
    const footerColumns = document.querySelectorAll('.footer-column');
    footerColumns.forEach(column => {
      expect(window.getComputedStyle(column).width).toBe('calc(33.33% - 20px)');
    });
  });
  
  test('Layout should adapt to desktop viewport', () => {
    // Initialize responsiveness
    window.Responsiveness.init();
    
    // Simulate desktop viewport
    window.innerWidth = 1200;
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === '(min-width: 1025px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    
    // Trigger resize event
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    // Verify that desktop class is added to body
    expect(document.body.classList.contains('desktop-view')).toBe(true);
    
    // Verify that mobile menu button is hidden
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    expect(window.getComputedStyle(mobileMenuBtn).display).toBe('none');
    
    // Verify that nav links are visible
    const navLinks = document.querySelector('.nav-links');
    expect(window.getComputedStyle(navLinks).display).not.toBe('none');
    
    // Verify that hero section is side by side
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    expect(window.getComputedStyle(heroContent).width).toBe('50%');
    expect(window.getComputedStyle(heroImage).width).toBe('50%');
    
    // Verify that feature cards are in a grid
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      expect(window.getComputedStyle(card).width).toBe('calc(33.33% - 20px)');
    });
    
    // Verify that footer columns are in a grid
    const footerColumns = document.querySelectorAll('.footer-column');
    footerColumns.forEach(column => {
      expect(window.getComputedStyle(column).width).toBe('calc(33.33% - 20px)');
    });
  });
  
  test('Images should be responsive', () => {
    // Initialize responsiveness
    window.Responsiveness.init();
    
    // Get all images
    const images = document.querySelectorAll('img');
    
    // Verify that all images have max-width: 100%
    images.forEach(image => {
      expect(window.getComputedStyle(image).maxWidth).toBe('100%');
    });
    
    // Verify that all images have height: auto
    images.forEach(image => {
      expect(window.getComputedStyle(image).height).toBe('auto');
    });
  });
  
  test('Font sizes should be responsive', () => {
    // Initialize responsiveness
    window.Responsiveness.init();
    
    // Get heading elements
    const h1 = document.querySelector('h1');
    const h3 = document.querySelector('h3');
    const p = document.querySelector('p');
    
    // Verify desktop font sizes
    window.innerWidth = 1200;
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    expect(window.getComputedStyle(h1).fontSize).toBe('2.5rem');
    expect(window.getComputedStyle(h3).fontSize).toBe('1.5rem');
    expect(window.getComputedStyle(p).fontSize).toBe('1rem');
    
    // Verify tablet font sizes
    window.innerWidth = 768;
    window.dispatchEvent(resizeEvent);
    
    expect(window.getComputedStyle(h1).fontSize).toBe('2rem');
    expect(window.getComputedStyle(h3).fontSize).toBe('1.25rem');
    expect(window.getComputedStyle(p).fontSize).toBe('0.9rem');
    
    // Verify mobile font sizes
    window.innerWidth = 480;
    window.dispatchEvent(resizeEvent);
    
    expect(window.getComputedStyle(h1).fontSize).toBe('1.75rem');
    expect(window.getComputedStyle(h3).fontSize).toBe('1.1rem');
    expect(window.getComputedStyle(p).fontSize).toBe('0.85rem');
  });
});
