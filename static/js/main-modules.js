/**
 * Main JavaScript file for the Tax Filing Tool
 * Imports and initializes all modules
 */

// Import modules
import TaxWalkthrough from './modules/walkthrough.js';
import MicroSteps from './modules/micro-steps.js';

// These modules may not exist yet, so we'll handle them conditionally
let VirtualAssistant, DocumentAnalyzer, Calculator, TimeEstimates, DataStorage, FormValidator, TaxLogic, AutoFill, ClaimProcessTracker;

// Dynamically import modules if they exist
try {
    import('./modules/virtual-assistant.js').then(module => {
        VirtualAssistant = module.default;
        if (typeof VirtualAssistant !== 'undefined' && document.readyState === 'complete') {
            VirtualAssistant.init();
        }
    }).catch(() => console.log('Virtual Assistant module not available'));

    import('./modules/document-analyzer.js').then(module => {
        DocumentAnalyzer = module.default;
        if (typeof DocumentAnalyzer !== 'undefined' && document.readyState === 'complete') {
            DocumentAnalyzer.init();
        }
    }).catch(() => console.log('Document Analyzer module not available'));

    import('./modules/calculator.js').then(module => {
        Calculator = module.default;
        if (typeof Calculator !== 'undefined' && document.readyState === 'complete') {
            Calculator.init();
        }
    }).catch(() => console.log('Calculator module not available'));

    import('./modules/time-estimates.js').then(module => {
        TimeEstimates = module.default;
        if (typeof TimeEstimates !== 'undefined' && document.readyState === 'complete') {
            TimeEstimates.init();
        }
    }).catch(() => console.log('Time Estimates module not available'));

    // Import our core modules
    import('./core/dataStorage.js').then(module => {
        DataStorage = module.default || window.DataStorage;
        if (typeof DataStorage !== 'undefined' && document.readyState === 'complete') {
            DataStorage.init();
        }
    }).catch(() => console.log('Data Storage module not available'));

    import('./core/formValidator.js').then(module => {
        FormValidator = module.default || window.FormValidator;
        if (typeof FormValidator !== 'undefined' && document.readyState === 'complete') {
            FormValidator.init();
        }
    }).catch(() => console.log('Form Validator module not available'));

    import('./core/taxLogic.js').then(module => {
        TaxLogic = module.default || window.TaxLogic;
        if (typeof TaxLogic !== 'undefined' && document.readyState === 'complete') {
            TaxLogic.init();
        }
    }).catch(() => console.log('Tax Logic module not available'));

    // Import our feature modules
    import('./features/autoFill.js').then(module => {
        AutoFill = module.default || window.AutoFill;
        if (typeof AutoFill !== 'undefined' && document.readyState === 'complete') {
            AutoFill.init();
        }
    }).catch(() => console.log('Auto Fill module not available'));

    import('./features/claimProcessTracker.js').then(module => {
        ClaimProcessTracker = module.default || window.ClaimProcessTracker;
        if (typeof ClaimProcessTracker !== 'undefined' && document.readyState === 'complete') {
            ClaimProcessTracker.init();
        }
    }).catch(() => console.log('Claim Process Tracker module not available'));
} catch (e) {
    console.log('Error loading modules:', e);
}

// Initialize modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if walkthrough container exists before initializing
    const walkthroughContainer = document.getElementById('walkthrough-container');
    if (walkthroughContainer) {
        console.log('Initializing walkthrough module...');
        TaxWalkthrough.init('walkthrough-container');
    } else {
        console.warn('Walkthrough container not found. Skipping initialization.');
    }

    // Initialize the micro-steps module if it exists
    if (typeof MicroSteps !== 'undefined') {
        console.log('Initializing micro-steps module...');
        MicroSteps.init();
    }

    // Initialize modules that were dynamically imported
    if (typeof VirtualAssistant !== 'undefined') {
        console.log('Initializing virtual assistant module...');
        VirtualAssistant.init();
    }
    if (typeof DocumentAnalyzer !== 'undefined') {
        console.log('Initializing document analyzer module...');
        DocumentAnalyzer.init();
    }
    if (typeof Calculator !== 'undefined') {
        console.log('Initializing calculator module...');
        Calculator.init();
    }
    if (typeof TimeEstimates !== 'undefined') {
        console.log('Initializing time estimates module...');
        TimeEstimates.init();
    }

    // Initialize our core modules
    if (typeof DataStorage !== 'undefined') {
        console.log('Initializing data storage module...');
        DataStorage.init();
    }
    if (typeof FormValidator !== 'undefined') {
        console.log('Initializing form validator module...');
        FormValidator.init();
    }
    if (typeof TaxLogic !== 'undefined') {
        console.log('Initializing tax logic module...');
        TaxLogic.init();
    }

    // Initialize our feature modules
    if (typeof AutoFill !== 'undefined') {
        console.log('Initializing auto fill module...');
        AutoFill.init();
    }
    if (typeof ClaimProcessTracker !== 'undefined') {
        console.log('Initializing claim process tracker module...');
        ClaimProcessTracker.init();
    }

    // Dark mode toggle
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', toggleDarkMode);

        // Check for saved theme preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
});

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) {
        modeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// Export the toggleDarkMode function to make it globally available
window.toggleDarkMode = toggleDarkMode;
