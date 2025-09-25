/**
 * Main JavaScript file for the Tax Filing Tool
 * Imports and initializes all modules
 */

// Import modules
import TaxWalkthrough from './modules/walkthrough.js';
import MicroSteps from './modules/micro-steps.js';

// These modules may not exist yet, so we'll handle them conditionally
let VirtualAssistant, DocumentAnalyzer, Calculator, TimeEstimates, TaxOptimizer, AdvancedCalculators, TaxDashboard;

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

    // Advanced modules
    import('./modules/tax-optimizer.js').then(module => {
        TaxOptimizer = module.default;
        if (typeof TaxOptimizer !== 'undefined' && document.readyState === 'complete') {
            TaxOptimizer.init();
        }
    }).catch(() => console.log('Tax Optimizer module not available'));

    import('./modules/advanced-calculators.js').then(module => {
        AdvancedCalculators = module.default;
        if (typeof AdvancedCalculators !== 'undefined' && document.readyState === 'complete') {
            AdvancedCalculators.init();
        }
    }).catch(() => console.log('Advanced Calculators module not available'));

    import('./modules/tax-dashboard.js').then(module => {
        TaxDashboard = module.default;
        if (typeof TaxDashboard !== 'undefined' && document.readyState === 'complete') {
            TaxDashboard.init();
        }
    }).catch(() => console.log('Tax Dashboard module not available'));
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
    
    // Initialize advanced modules
    if (typeof TaxOptimizer !== 'undefined') TaxOptimizer.init();
    if (typeof AdvancedCalculators !== 'undefined') AdvancedCalculators.init();
    if (typeof TaxDashboard !== 'undefined') {
        TaxDashboard.init().then(() => {
            console.log('Tax Dashboard ready');
        });
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

// Advanced feature functions
window.launchTaxOptimizer = function() {
    if (typeof TaxOptimizer !== 'undefined') {
        // Sample user data - in real app this would come from form
        const userData = {
            income: 75000,
            filingStatus: 'single',
            hasW2: true,
            selfEmployed: false,
            worksFromHome: true,
            hasEducationExpenses: false,
            hasCharitableDonations: true,
            hasMedicalExpenses: false,
            qualifyingChildren: 0,
            dependents: 0
        };
        
        const analysis = TaxOptimizer.analyzeReturn(userData);
        console.log('Tax optimization analysis:', analysis);
        
        if (analysis.opportunities.length > 0) {
            // Create a modal or navigate to optimization interview
            const modal = document.createElement('div');
            modal.className = 'optimization-modal';
            modal.innerHTML = `
                <div class="optimization-modal-content">
                    <div class="optimization-modal-header">
                        <h2>Tax Optimization Opportunities Found</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="optimization-modal-body">
                        <p>We found ${analysis.opportunities.length} potential optimization opportunities for you!</p>
                        <button class="btn btn-primary start-optimization">Start Optimization Interview</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal handler
            modal.querySelector('.close-modal').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            // Start optimization handler
            modal.querySelector('.start-optimization').addEventListener('click', () => {
                document.body.removeChild(modal);
                
                // Create optimization container
                const container = document.createElement('div');
                container.id = 'optimization-interview-container';
                document.body.appendChild(container);
                
                TaxOptimizer.runOptimizationInterview(analysis.opportunities, 'optimization-interview-container');
            });
        } else {
            alert('Great news! Your tax strategy appears to be well optimized already.');
        }
    } else {
        alert('Tax Optimizer module is not available. Please refresh the page and try again.');
    }
};

window.openTaxDashboard = function() {
    if (typeof TaxDashboard !== 'undefined') {
        // Sample user data for dashboard
        const userData = {
            income: 75000,
            filingStatus: 'single',
            taxSavingsGoal: 5000,
            currentTaxSavings: 2800,
            effectiveRate: 18.5,
            riskScore: 25,
            deductionUtilization: 75,
            creditUtilization: 80,
            retirementOptimization: 60,
            bracketOptimization: 85,
            timingOptimization: 70,
            documentationScore: 90,
            optimizationLevel: 0.15
        };
        
        // Navigate to dashboard section and render
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            TaxDashboard.renderDashboard('tax-dashboard-container', userData);
        }, 1000);
    } else {
        alert('Tax Dashboard module is not available. Please refresh the page and try again.');
    }
};

window.openCalculatorSuite = function() {
    if (typeof AdvancedCalculators !== 'undefined') {
        // Navigate to calculator section and render
        document.getElementById('advanced-calculators').scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            AdvancedCalculators.renderCalculatorSelector('calculator-suite-container');
        }, 1000);
    } else {
        alert('Advanced Calculator Suite is not available. Please refresh the page and try again.');
    }
};

window.openSecurityCenter = function() {
    // Security center functionality
    const modal = document.createElement('div');
    modal.className = 'security-modal';
    modal.innerHTML = `
        <div class="security-modal-content">
            <div class="security-modal-header">
                <h2>Security & Compliance Center</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="security-modal-body">
                <div class="security-features">
                    <div class="security-feature">
                        <div class="security-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <h3>256-bit Encryption</h3>
                        <p>Bank-grade encryption protects all your data</p>
                        <div class="security-status active">Active</div>
                    </div>
                    
                    <div class="security-feature">
                        <div class="security-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3>Multi-Factor Authentication</h3>
                        <p>Additional security layer for account access</p>
                        <div class="security-status active">Enabled</div>
                    </div>
                    
                    <div class="security-feature">
                        <div class="security-icon">
                            <i class="fas fa-file-contract"></i>
                        </div>
                        <h3>Audit Trail</h3>
                        <p>Complete logging of all system activities</p>
                        <div class="security-status active">Monitoring</div>
                    </div>
                    
                    <div class="security-feature">
                        <div class="security-icon">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h3>Privacy Compliance</h3>
                        <p>GDPR and privacy regulation compliance</p>
                        <div class="security-status active">Compliant</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handler
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
};

// Export the toggleDarkMode function to make it globally available
window.toggleDarkMode = toggleDarkMode;
