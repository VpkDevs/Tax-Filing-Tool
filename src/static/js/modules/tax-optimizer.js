/**
 * Advanced Tax Optimization Engine
 * AI-powered tax optimization that finds additional deductions and credits
 * This is a competitive advantage feature that goes beyond basic tax filing
 */

const TaxOptimizer = (function() {
    // Private variables
    const optimizations = {
        deductions: {
            'home_office': {
                name: 'Home Office Deduction',
                description: 'Deduct expenses for business use of your home',
                maxAmount: 1500,
                qualifications: ['self_employed', 'remote_work'],
                questions: [
                    'Do you work from home?',
                    'Do you use part of your home exclusively for work?',
                    'What percentage of your home is used for business?'
                ],
                calculator: (responses) => {
                    const percentage = parseFloat(responses.homePercentage) || 0;
                    const homeValue = parseFloat(responses.homeValue) || 0;
                    return Math.min(homeValue * 0.02 * (percentage / 100), 1500);
                }
            },
            'vehicle_expenses': {
                name: 'Vehicle Business Expenses',
                description: 'Deduct vehicle expenses for business use',
                maxAmount: 10000,
                qualifications: ['business_vehicle_use'],
                questions: [
                    'Do you use your personal vehicle for business?',
                    'How many business miles did you drive in 2021?',
                    'What was your total mileage for 2021?'
                ],
                calculator: (responses) => {
                    const businessMiles = parseFloat(responses.businessMiles) || 0;
                    const standardRate = 0.56; // 2021 IRS standard mileage rate
                    return businessMiles * standardRate;
                }
            },
            'education_expenses': {
                name: 'Education Tax Benefits',
                description: 'American Opportunity Credit or Lifetime Learning Credit',
                maxAmount: 2500,
                qualifications: ['student', 'education_expenses'],
                questions: [
                    'Did you pay for qualified education expenses in 2021?',
                    'How much did you pay for tuition and fees?',
                    'Are you pursuing a degree?'
                ],
                calculator: (responses) => {
                    const expenses = parseFloat(responses.educationExpenses) || 0;
                    const isDegreeProgram = responses.degreeProgram === 'yes';
                    
                    if (isDegreeProgram && expenses > 0) {
                        // American Opportunity Credit: 100% of first $2,000, 25% of next $2,000
                        return Math.min(2000 + (Math.max(0, expenses - 2000) * 0.25), 2500);
                    } else if (expenses > 0) {
                        // Lifetime Learning Credit: 20% of first $10,000
                        return Math.min(expenses * 0.20, 2000);
                    }
                    return 0;
                }
            },
            'charitable_contributions': {
                name: 'Charitable Contributions',
                description: 'Deduct donations to qualified charitable organizations',
                maxAmount: null, // No specific limit, but subject to AGI limits
                qualifications: ['charitable_donations'],
                questions: [
                    'Did you make charitable donations in 2021?',
                    'What was the total amount of your cash donations?',
                    'What was the total value of non-cash donations?'
                ],
                calculator: (responses) => {
                    const cashDonations = parseFloat(responses.cashDonations) || 0;
                    const nonCashDonations = parseFloat(responses.nonCashDonations) || 0;
                    return cashDonations + nonCashDonations;
                }
            },
            'medical_expenses': {
                name: 'Medical and Dental Expenses',
                description: 'Deduct medical expenses exceeding 7.5% of AGI',
                maxAmount: null,
                qualifications: ['medical_expenses'],
                questions: [
                    'Did you have significant medical expenses in 2021?',
                    'What was your total out-of-pocket medical expenses?',
                    'What was your AGI for 2021?'
                ],
                calculator: (responses) => {
                    const medicalExpenses = parseFloat(responses.medicalExpenses) || 0;
                    const agi = parseFloat(responses.agi) || 0;
                    const threshold = agi * 0.075; // 7.5% of AGI
                    return Math.max(0, medicalExpenses - threshold);
                }
            }
        },
        credits: {
            'child_tax_credit': {
                name: 'Child Tax Credit',
                description: 'Credit for qualifying children under 17',
                maxAmount: 2000,
                qualifications: ['qualifying_children'],
                questions: [
                    'How many qualifying children do you have?',
                    'What are their ages?',
                    'What is your AGI?'
                ],
                calculator: (responses) => {
                    const children = parseInt(responses.qualifyingChildren) || 0;
                    const agi = parseFloat(responses.agi) || 0;
                    
                    // Phase out starts at $200,000 for single filers, $400,000 for joint
                    const filingStatus = responses.filingStatus || 'single';
                    const phaseOutStart = filingStatus === 'joint' ? 400000 : 200000;
                    
                    let creditPerChild = 2000;
                    if (agi > phaseOutStart) {
                        const excess = agi - phaseOutStart;
                        const reduction = Math.ceil(excess / 1000) * 50;
                        creditPerChild = Math.max(0, creditPerChild - reduction);
                    }
                    
                    return children * creditPerChild;
                }
            },
            'earned_income_credit': {
                name: 'Earned Income Tax Credit (EITC)',
                description: 'Credit for low to moderate income working individuals',
                maxAmount: 6728, // 2021 max with 3+ children
                qualifications: ['low_moderate_income'],
                questions: [
                    'What was your earned income in 2021?',
                    'How many qualifying children do you have?',
                    'What is your filing status?'
                ],
                calculator: (responses) => {
                    const earnedIncome = parseFloat(responses.earnedIncome) || 0;
                    const children = parseInt(responses.qualifyingChildren) || 0;
                    const filingStatus = responses.filingStatus || 'single';
                    
                    // Simplified EITC calculation - in reality this is more complex
                    const limits = {
                        0: { max: 1502, income_limit: 21430 },
                        1: { max: 3618, income_limit: 42158 },
                        2: { max: 5980, income_limit: 47915 },
                        3: { max: 6728, income_limit: 51464 }
                    };
                    
                    const childCount = Math.min(children, 3);
                    const limit = limits[childCount];
                    
                    if (earnedIncome <= limit.income_limit) {
                        // Simplified calculation - real formula is more complex
                        const rate = childCount === 0 ? 0.0765 : (childCount === 1 ? 0.34 : 0.40);
                        return Math.min(earnedIncome * rate, limit.max);
                    }
                    
                    return 0;
                }
            },
            'dependent_care_credit': {
                name: 'Child and Dependent Care Credit',
                description: 'Credit for care expenses that allow you to work',
                maxAmount: 4000, // 2021 enhanced amount
                qualifications: ['dependent_care_expenses'],
                questions: [
                    'Did you pay for child or dependent care to allow you to work?',
                    'How much did you pay for care expenses?',
                    'How many qualifying dependents?'
                ],
                calculator: (responses) => {
                    const careExpenses = parseFloat(responses.careExpenses) || 0;
                    const dependents = parseInt(responses.dependents) || 0;
                    const agi = parseFloat(responses.agi) || 0;
                    
                    if (dependents === 0 || careExpenses === 0) return 0;
                    
                    // 2021 enhanced credit rates
                    const maxExpenses = dependents === 1 ? 8000 : 16000;
                    const qualifyingExpenses = Math.min(careExpenses, maxExpenses);
                    
                    // Credit rate varies by AGI - simplified calculation
                    let creditRate = 0.50; // Max rate for lower incomes
                    if (agi > 125000) {
                        creditRate = Math.max(0.20, 0.50 - ((agi - 125000) / 10000) * 0.01);
                    }
                    
                    return qualifyingExpenses * creditRate;
                }
            }
        }
    };
    
    // AI-powered optimization suggestions
    const optimizationStrategies = {
        'timing_strategies': {
            name: 'Income and Deduction Timing',
            suggestions: [
                'Consider deferring income to next year if you\'re near a tax bracket threshold',
                'Accelerate deductible expenses before year-end',
                'Consider Roth IRA conversions in low-income years'
            ]
        },
        'retirement_optimization': {
            name: 'Retirement Savings Optimization',
            suggestions: [
                'Maximize 401(k) contributions to reduce taxable income',
                'Consider traditional vs. Roth IRA based on current tax bracket',
                'Take advantage of catch-up contributions if over 50'
            ]
        },
        'investment_strategies': {
            name: 'Investment Tax Strategies',
            suggestions: [
                'Harvest tax losses to offset gains',
                'Hold investments longer than one year for lower capital gains rates',
                'Consider tax-efficient fund placement in different account types'
            ]
        }
    };
    
    // Private methods
    function analyzeUserProfile(userdata) {
        const profile = {
            income_level: categorizeIncome(userdata.agi || 0),
            filing_status: userdata.filingStatus || 'single',
            has_dependents: (userdata.dependents || 0) > 0,
            employment_type: determineEmploymentType(userdata),
            life_stage: determineLifeStage(userdata)
        };
        
        return profile;
    }
    
    function categorizeIncome(agi) {
        if (agi < 25000) return 'low';
        if (agi < 75000) return 'moderate';
        if (agi < 200000) return 'high';
        return 'very_high';
    }
    
    function determineEmploymentType(userdata) {
        if (userdata.selfEmployed) return 'self_employed';
        if (userdata.hasW2) return 'employee';
        if (userdata.has1099) return 'contractor';
        return 'unknown';
    }
    
    function determineLifeStage(userdata) {
        const age = userdata.age || 0;
        const hasChildren = (userdata.dependents || 0) > 0;
        
        if (age < 30) return 'young_professional';
        if (age < 50 && hasChildren) return 'family_building';
        if (age < 65) return 'peak_earning';
        return 'pre_retirement';
    }
    
    function findApplicableOptimizations(profile, userdata) {
        const applicable = [];
        
        // Check deductions
        Object.keys(optimizations.deductions).forEach(key => {
            const deduction = optimizations.deductions[key];
            if (isQualified(deduction.qualifications, profile, userdata)) {
                applicable.push({
                    type: 'deduction',
                    key: key,
                    ...deduction
                });
            }
        });
        
        // Check credits
        Object.keys(optimizations.credits).forEach(key => {
            const credit = optimizations.credits[key];
            if (isQualified(credit.qualifications, profile, userdata)) {
                applicable.push({
                    type: 'credit',
                    key: key,
                    ...credit
                });
            }
        });
        
        return applicable;
    }
    
    function isQualified(qualifications, profile, userdata) {
        return qualifications.some(qualification => {
            switch(qualification) {
                case 'self_employed':
                    return profile.employment_type === 'self_employed';
                case 'remote_work':
                    return userdata.worksFromHome === true;
                case 'business_vehicle_use':
                    return userdata.useVehicleForBusiness === true;
                case 'student':
                    return userdata.isStudent === true;
                case 'education_expenses':
                    return userdata.hasEducationExpenses === true;
                case 'charitable_donations':
                    return userdata.hasCharitableDonations === true;
                case 'medical_expenses':
                    return userdata.hasMedicalExpenses === true;
                case 'qualifying_children':
                    return (userdata.qualifyingChildren || 0) > 0;
                case 'low_moderate_income':
                    return ['low', 'moderate'].includes(profile.income_level);
                case 'dependent_care_expenses':
                    return userdata.hasDependentCareExpenses === true;
                default:
                    return false;
            }
        });
    }
    
    function calculatePotentialSavings(optimizations, responses) {
        let totalSavings = 0;
        const details = [];
        
        optimizations.forEach(opt => {
            const amount = opt.calculator(responses);
            if (amount > 0) {
                const taxSavings = opt.type === 'credit' ? amount : amount * 0.22; // Assume 22% bracket
                totalSavings += taxSavings;
                details.push({
                    name: opt.name,
                    type: opt.type,
                    amount: amount,
                    taxSavings: taxSavings,
                    description: opt.description
                });
            }
        });
        
        return { totalSavings, details };
    }
    
    // Public methods
    return {
        init: function() {
            console.log('Tax Optimizer initialized');
        },
        
        analyzeReturn: function(userdata) {
            const profile = analyzeUserProfile(userdata);
            const applicableOptimizations = findApplicableOptimizations(profile, userdata);
            
            return {
                profile: profile,
                opportunities: applicableOptimizations,
                strategies: this.getStrategicRecommendations(profile)
            };
        },
        
        getStrategicRecommendations: function(profile) {
            const recommendations = [];
            
            Object.keys(optimizationStrategies).forEach(key => {
                const strategy = optimizationStrategies[key];
                recommendations.push({
                    category: strategy.name,
                    suggestions: strategy.suggestions.filter(suggestion => 
                        this.isRelevantSuggestion(suggestion, profile)
                    )
                });
            });
            
            return recommendations.filter(rec => rec.suggestions.length > 0);
        },
        
        isRelevantSuggestion: function(suggestion, profile) {
            // Simple relevance check - in a real implementation this would be more sophisticated
            if (suggestion.includes('401(k)') && profile.employment_type === 'self_employed') {
                return false;
            }
            if (suggestion.includes('catch-up') && profile.life_stage === 'young_professional') {
                return false;
            }
            return true;
        },
        
        runOptimizationInterview: function(opportunities, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            let currentOpportunity = 0;
            const responses = {};
            
            function showNextOpportunity() {
                if (currentOpportunity >= opportunities.length) {
                    showResults();
                    return;
                }
                
                const opp = opportunities[currentOpportunity];
                container.innerHTML = this.generateInterviewHTML(opp, currentOpportunity + 1, opportunities.length);
                
                // Add event listeners
                const form = container.querySelector('.optimization-interview-form');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    // Collect responses
                    const formData = new FormData(form);
                    responses[opp.key] = {};
                    for (let [key, value] of formData.entries()) {
                        responses[opp.key][key] = value;
                    }
                    
                    currentOpportunity++;
                    showNextOpportunity();
                });
            }
            
            function showResults() {
                const savings = calculatePotentialSavings(opportunities, responses);
                container.innerHTML = this.generateResultsHTML(savings);
                
                // Dispatch event with results
                const event = new CustomEvent('tax-optimization-complete', {
                    detail: savings
                });
                window.dispatchEvent(event);
            }
            
            showNextOpportunity();
        },
        
        generateInterviewHTML: function(opportunity, current, total) {
            return `
                <div class="optimization-interview">
                    <div class="interview-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(current / total) * 100}%"></div>
                        </div>
                        <div class="progress-text">Question ${current} of ${total}</div>
                    </div>
                    
                    <div class="opportunity-card">
                        <div class="opportunity-header">
                            <h3>${opportunity.name}</h3>
                            <p class="opportunity-description">${opportunity.description}</p>
                            ${opportunity.maxAmount ? `<div class="max-benefit">Maximum benefit: $${opportunity.maxAmount.toLocaleString()}</div>` : ''}
                        </div>
                        
                        <form class="optimization-interview-form">
                            ${opportunity.questions.map((question, index) => `
                                <div class="form-group">
                                    <label>${question}</label>
                                    <input type="text" name="question_${index}" class="form-control" required>
                                </div>
                            `).join('')}
                            
                            <div class="interview-buttons">
                                <button type="button" class="btn btn-secondary skip-btn">Skip This</button>
                                <button type="submit" class="btn btn-primary">Continue</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        },
        
        generateResultsHTML: function(savings) {
            return `
                <div class="optimization-results">
                    <div class="results-header">
                        <h2>Your Tax Optimization Results</h2>
                        <div class="total-savings">
                            <div class="savings-amount">$${Math.round(savings.totalSavings).toLocaleString()}</div>
                            <div class="savings-label">Potential Tax Savings</div>
                        </div>
                    </div>
                    
                    <div class="savings-breakdown">
                        <h3>Breakdown of Opportunities</h3>
                        ${savings.details.map(detail => `
                            <div class="savings-item">
                                <div class="item-header">
                                    <h4>${detail.name}</h4>
                                    <div class="item-savings">$${Math.round(detail.taxSavings).toLocaleString()}</div>
                                </div>
                                <p>${detail.description}</p>
                                <div class="item-details">
                                    ${detail.type === 'credit' ? 'Tax Credit' : 'Tax Deduction'}: $${detail.amount.toLocaleString()}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="optimization-actions">
                        <button class="btn btn-primary apply-optimizations">Apply These Optimizations</button>
                        <button class="btn btn-secondary save-for-later">Save for Later</button>
                    </div>
                </div>
            `;
        }
    };
})();

// Export the module
export default TaxOptimizer;