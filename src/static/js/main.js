/**
 * Main JavaScript file for the Tax Filing Tool
 *
 * This file loads all the required modules in the correct order
 * and initializes the application.
 */

// Load modules in the correct order
document.addEventListener('DOMContentLoaded', function() {
    // Load core modules first
    loadScript('./static/js/core/dataStorage.js', function() {
        loadScript('./static/js/core/formValidator.js', function() {
            loadScript('./static/js/core/taxLogic.js', function() {
                // Then load feature modules
                loadScript('./static/js/features/autoFill.js', function() {
                    loadScript('./static/js/features/claimProcessTracker.js', function() {
                        loadScript('./static/js/features/filingSteps.js', function() {
                            loadScript('./static/js/features/paymentMethods.js', function() {
                                // Finally, load the main application
                                loadScript('./static/js/tax-filing-app.js', function() {
                                    console.log('All modules loaded successfully!');

                                    // Initialize mobile menu
                                    initMobileMenu();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

/**
 * Load a script dynamically
 * @param {string} url - The URL of the script to load
 * @param {Function} callback - The callback to execute when the script is loaded
 */
function loadScript(url, callback) {
    console.log(`Loading script: ${url}`);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Handle script loading events
    script.onload = function() {
        console.log(`Script loaded: ${url}`);
        if (callback) callback();
    };

    script.onerror = function() {
        console.error(`Error loading script: ${url}`);
        if (callback) callback();
    };

    // Add the script to the document
    document.head.appendChild(script);
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const bars = menuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('animate'));

            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');

                const bars = menuToggle.querySelectorAll('.bar');
                bars.forEach(bar => bar.classList.remove('animate'));

                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Add animation for hamburger menu
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .menu-toggle .bar.animate:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

        .menu-toggle .bar.animate:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle .bar.animate:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }

        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});
