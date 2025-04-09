/**
 * Main JavaScript file for the Tax Filing Tool
 * Imports and initializes all modules
 */

// Import modules
import TaxWalkthrough from './modules/walkthrough.js';
import MicroSteps from './modules/micro-steps.js';

// These modules may not exist yet, so we'll handle them conditionally
let VirtualAssistant, DocumentAnalyzer, Calculator, TimeEstimates;

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
} catch (e) {
    console.log('Error loading modules:', e);
}

// Initialize modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the walkthrough module
    TaxWalkthrough.init('walkthrough-container');

    // Initialize the micro-steps module
    MicroSteps.init();

    // Initialize modules that were dynamically imported
    if (typeof VirtualAssistant !== 'undefined') VirtualAssistant.init();
    if (typeof DocumentAnalyzer !== 'undefined') DocumentAnalyzer.init();
    if (typeof Calculator !== 'undefined') Calculator.init();
    if (typeof TimeEstimates !== 'undefined') TimeEstimates.init();

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
