/**
 * Real-time Tax Optimization Dashboard
 * Advanced visualization and analytics for tax optimization
 * Provides competitive advantage through sophisticated data visualization
 */

const TaxDashboard = (function() {
    // Private variables
    let chartInstances = {};
    let dashboardData = {};
    let realTimeTimer = null;
    
    const optimizationMetrics = {
        taxSavingsGoal: 0,
        currentSavings: 0,
        optimizationScore: 0,
        completionPercentage: 0,
        riskLevel: 'moderate',
        timeToOptimal: 0
    };
    
    const widgets = {
        taxSavingsProgress: {
            title: 'Tax Savings Progress',
            type: 'progress_ring',
            icon: 'fas fa-bullseye',
            priority: 1
        },
        optimizationScore: {
            title: 'Optimization Score',
            type: 'gauge',
            icon: 'fas fa-tachometer-alt',
            priority: 2
        },
        taxBracketAnalysis: {
            title: 'Tax Bracket Analysis',
            type: 'line_chart',
            icon: 'fas fa-chart-line',
            priority: 3
        },
        deductionOpportunities: {
            title: 'Deduction Opportunities',
            type: 'bar_chart',
            icon: 'fas fa-chart-bar',
            priority: 4
        },
        monthlyTaxImpact: {
            title: 'Monthly Tax Impact',
            type: 'area_chart',
            icon: 'fas fa-chart-area',
            priority: 5
        },
        scenarioComparison: {
            title: 'Scenario Comparison',
            type: 'comparison_table',
            icon: 'fas fa-balance-scale',
            priority: 6
        },
        auditRiskAssessment: {
            title: 'Audit Risk Assessment',
            type: 'risk_meter',
            icon: 'fas fa-shield-alt',
            priority: 7
        },
        taxCalendar: {
            title: 'Tax Calendar & Deadlines',
            type: 'calendar',
            icon: 'fas fa-calendar-alt',
            priority: 8
        }
    };
    
    // Private methods
    function initializeChartLibrary() {
        // Check if Chart.js is available, if not load it dynamically
        if (typeof Chart === 'undefined') {
            return loadChartJS().then(() => {
                Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
                Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-dark');
            });
        } else {
            return Promise.resolve();
        }
    }
    
    function loadChartJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    function calculateOptimizationScore(userData) {
        let score = 0;
        const weights = {
            deductionsMaximized: 25,
            creditsOptimized: 25,
            retirementContributions: 20,
            taxBracketOptimization: 15,
            timinigStrategies: 10,
            documentationComplete: 5
        };
        
        // Calculate individual scores
        const scores = {
            deductionsMaximized: userData.deductionUtilization || 0,
            creditsOptimized: userData.creditUtilization || 0,
            retirementContributions: userData.retirementOptimization || 0,
            taxBracketOptimization: userData.bracketOptimization || 0,
            timinigStrategies: userData.timingOptimization || 0,
            documentationComplete: userData.documentationScore || 0
        };
        
        // Calculate weighted score
        Object.keys(weights).forEach(key => {
            score += (scores[key] * weights[key]) / 100;
        });
        
        return Math.min(100, Math.max(0, score));
    }
    
    function generateTaxProjections(userData) {
        const projections = [];
        const currentYear = new Date().getFullYear();
        
        for (let i = 0; i < 5; i++) {
            const year = currentYear + i;
            const growthRate = 0.03 + (Math.random() * 0.04); // 3-7% growth
            const income = userData.income * Math.pow(1 + growthRate, i);
            const tax = calculateEstimatedTax(income, userData.filingStatus);
            const optimizedTax = tax * (1 - (userData.optimizationLevel || 0.1));
            
            projections.push({
                year: year,
                income: income,
                standardTax: tax,
                optimizedTax: optimizedTax,
                savings: tax - optimizedTax
            });
        }
        
        return projections;
    }
    
    function calculateEstimatedTax(income, filingStatus) {
        // Simplified tax calculation - in reality this would be more complex
        const standardDeduction = filingStatus === 'joint' ? 25100 : 12550;
        const taxableIncome = Math.max(0, income - standardDeduction);
        
        // Simplified progressive tax calculation
        let tax = 0;
        if (taxableIncome > 0) {
            tax += Math.min(taxableIncome, 20550) * 0.10;
        }
        if (taxableIncome > 20550) {
            tax += Math.min(taxableIncome - 20550, 62700) * 0.12;
        }
        if (taxableIncome > 83350) {
            tax += (taxableIncome - 83350) * 0.22;
        }
        
        return tax;
    }
    
    function createProgressRing(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const percentage = data.percentage || 0;
        const value = data.value || 0;
        const target = data.target || 0;
        
        container.innerHTML = `
            <div class="progress-ring-container">
                <div class="progress-ring">
                    <svg class="progress-ring-svg" width="120" height="120">
                        <circle class="progress-ring-background"
                                cx="60" cy="60" r="54"
                                fill="transparent"
                                stroke="var(--border)"
                                stroke-width="8"/>
                        <circle class="progress-ring-progress"
                                cx="60" cy="60" r="54"
                                fill="transparent"
                                stroke="var(--accent)"
                                stroke-width="8"
                                stroke-linecap="round"
                                stroke-dasharray="${54 * 2 * Math.PI}"
                                stroke-dashoffset="${54 * 2 * Math.PI * (1 - percentage / 100)}"
                                transform="rotate(-90 60 60)"/>
                    </svg>
                    <div class="progress-ring-content">
                        <div class="progress-percentage">${percentage.toFixed(0)}%</div>
                        <div class="progress-label">Complete</div>
                    </div>
                </div>
                <div class="progress-details">
                    <div class="progress-current">$${value.toLocaleString()}</div>
                    <div class="progress-target">of $${target.toLocaleString()}</div>
                </div>
            </div>
        `;
    }
    
    function createGaugeChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const score = data.score || 0;
        const maxScore = 100;
        
        // Draw gauge
        const centerX = canvas.width / 2;
        const centerY = canvas.height - 20;
        const radius = 80;
        const startAngle = Math.PI;
        const endAngle = 2 * Math.PI;
        
        // Background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border');
        ctx.lineWidth = 20;
        ctx.stroke();
        
        // Progress arc
        const progressAngle = startAngle + (endAngle - startAngle) * (score / maxScore);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, progressAngle);
        ctx.strokeStyle = this.getScoreColor(score);
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Score text
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-dark');
        ctx.font = 'bold 24px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(score.toFixed(0), centerX, centerY - 10);
        
        ctx.font = '14px Segoe UI';
        ctx.fillText('Optimization Score', centerX, centerY + 10);
    }
    
    function getScoreColor(score) {
        if (score >= 80) return '#22c55e'; // Green
        if (score >= 60) return '#eab308'; // Yellow
        if (score >= 40) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }
    
    function createLineChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstances[containerId]) {
            chartInstances[containerId].destroy();
        }
        
        chartInstances[containerId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: 'Tax Liability',
                    data: data.taxLiability || [],
                    borderColor: 'var(--danger)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Optimized Tax',
                    data: data.optimizedTax || [],
                    borderColor: 'var(--success)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + 
                                       context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    function createBarChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstances[containerId]) {
            chartInstances[containerId].destroy();
        }
        
        chartInstances[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: 'Potential Savings',
                    data: data.values || [],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Potential Savings: $' + 
                                       context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    function createAreaChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstances[containerId]) {
            chartInstances[containerId].destroy();
        }
        
        chartInstances[containerId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months || [],
                datasets: [{
                    label: 'Tax Impact',
                    data: data.impact || [],
                    borderColor: 'var(--accent)',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'var(--accent)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Monthly Impact: $' + 
                                       context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    function createComparisonTable(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="comparison-table-container">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Scenario</th>
                            <th>Annual Tax</th>
                            <th>Effective Rate</th>
                            <th>Savings</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.scenarios?.map((scenario, index) => `
                            <tr class="${scenario.recommended ? 'recommended' : ''}">
                                <td class="scenario-name">
                                    ${scenario.recommended ? '<i class="fas fa-star"></i>' : ''}
                                    ${scenario.name}
                                </td>
                                <td class="tax-amount">$${scenario.tax.toLocaleString()}</td>
                                <td class="effective-rate">${scenario.effectiveRate.toFixed(2)}%</td>
                                <td class="savings ${scenario.savings > 0 ? 'positive' : ''}">
                                    ${scenario.savings > 0 ? '+' : ''}$${scenario.savings.toLocaleString()}
                                </td>
                                <td class="status">
                                    <span class="status-badge ${scenario.status.toLowerCase()}">
                                        ${scenario.status}
                                    </span>
                                </td>
                            </tr>
                        `).join('') || ''}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    function createRiskMeter(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const riskLevel = data.riskLevel || 'low';
        const riskScore = data.riskScore || 0;
        const factors = data.factors || [];
        
        container.innerHTML = `
            <div class="risk-meter-container">
                <div class="risk-gauge">
                    <div class="risk-dial">
                        <div class="risk-needle" style="transform: rotate(${(riskScore / 100) * 180 - 90}deg)"></div>
                        <div class="risk-levels">
                            <div class="risk-level low">Low</div>
                            <div class="risk-level medium">Medium</div>
                            <div class="risk-level high">High</div>
                        </div>
                    </div>
                    <div class="risk-score">
                        <div class="score-value">${riskScore}</div>
                        <div class="score-label">Risk Score</div>
                    </div>
                </div>
                
                <div class="risk-factors">
                    <h4>Risk Factors</h4>
                    <div class="factors-list">
                        ${factors.map(factor => `
                            <div class="factor-item ${factor.level}">
                                <div class="factor-icon">
                                    <i class="${factor.icon}"></i>
                                </div>
                                <div class="factor-content">
                                    <div class="factor-name">${factor.name}</div>
                                    <div class="factor-description">${factor.description}</div>
                                </div>
                                <div class="factor-impact ${factor.impact}">
                                    ${factor.impact.toUpperCase()}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    function createTaxCalendar(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const currentDate = new Date();
        const deadlines = data.deadlines || [];
        const upcomingDeadlines = deadlines.filter(deadline => 
            new Date(deadline.date) > currentDate
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        container.innerHTML = `
            <div class="tax-calendar-container">
                <div class="calendar-header">
                    <h4>Upcoming Tax Deadlines</h4>
                    <div class="calendar-nav">
                        <button class="calendar-btn prev"><i class="fas fa-chevron-left"></i></button>
                        <span class="calendar-month">${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button class="calendar-btn next"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                
                <div class="deadlines-list">
                    ${upcomingDeadlines.slice(0, 5).map(deadline => {
                        const deadlineDate = new Date(deadline.date);
                        const daysUntil = Math.ceil((deadlineDate - currentDate) / (1000 * 60 * 60 * 24));
                        
                        return `
                            <div class="deadline-item ${deadline.priority}">
                                <div class="deadline-date">
                                    <div class="date-day">${deadlineDate.getDate()}</div>
                                    <div class="date-month">${deadlineDate.toLocaleString('default', { month: 'short' })}</div>
                                </div>
                                <div class="deadline-content">
                                    <div class="deadline-title">${deadline.title}</div>
                                    <div class="deadline-description">${deadline.description}</div>
                                    <div class="deadline-countdown ${daysUntil <= 7 ? 'urgent' : ''}">
                                        ${daysUntil} days remaining
                                    </div>
                                </div>
                                <div class="deadline-actions">
                                    <button class="btn btn-sm btn-primary">Set Reminder</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="calendar-actions">
                    <button class="btn btn-secondary">View Full Calendar</button>
                    <button class="btn btn-primary">Add Custom Deadline</button>
                </div>
            </div>
        `;
    }
    
    function updateRealTimeMetrics() {
        // Simulate real-time updates with slight variations
        const variations = {
            optimizationScore: (Math.random() - 0.5) * 2,
            taxSavings: (Math.random() - 0.5) * 100,
            riskScore: (Math.random() - 0.5) * 5
        };
        
        // Update metrics with variations
        Object.keys(variations).forEach(key => {
            if (optimizationMetrics[key] !== undefined) {
                optimizationMetrics[key] = Math.max(0, 
                    Math.min(100, optimizationMetrics[key] + variations[key])
                );
            }
        });
        
        // Dispatch update event
        window.dispatchEvent(new CustomEvent('dashboard-metrics-updated', {
            detail: { ...optimizationMetrics }
        }));
    }
    
    // Public methods
    return {
        init: function() {
            return initializeChartLibrary().then(() => {
                console.log('Tax Dashboard initialized');
                
                // Start real-time updates
                if (realTimeTimer) {
                    clearInterval(realTimeTimer);
                }
                realTimeTimer = setInterval(updateRealTimeMetrics, 5000); // Update every 5 seconds
            });
        },
        
        renderDashboard: function(containerId, userData) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // Store dashboard data
            dashboardData = userData;
            
            // Calculate metrics
            optimizationMetrics.optimizationScore = calculateOptimizationScore(userData);
            optimizationMetrics.taxSavingsGoal = userData.taxSavingsGoal || 5000;
            optimizationMetrics.currentSavings = userData.currentTaxSavings || 0;
            optimizationMetrics.completionPercentage = 
                (optimizationMetrics.currentSavings / optimizationMetrics.taxSavingsGoal) * 100;
            
            container.innerHTML = `
                <div class="tax-dashboard">
                    <div class="dashboard-header">
                        <div class="header-content">
                            <h1>Tax Optimization Dashboard</h1>
                            <p>Real-time insights and analytics for your tax strategy</p>
                        </div>
                        <div class="dashboard-controls">
                            <select class="dashboard-selector" id="taxYear">
                                <option value="2021">2021 Tax Year</option>
                                <option value="2022">2022 Tax Year</option>
                                <option value="2023">2023 Tax Year</option>
                            </select>
                            <button class="btn btn-primary refresh-btn" id="refreshDashboard">
                                <i class="fas fa-sync"></i> Refresh
                            </button>
                            <button class="btn btn-secondary export-btn" id="exportDashboard">
                                <i class="fas fa-download"></i> Export
                            </button>
                        </div>
                    </div>
                    
                    <div class="dashboard-metrics">
                        <div class="metric-card primary">
                            <div class="metric-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="metric-content">
                                <div class="metric-value">$${optimizationMetrics.currentSavings.toLocaleString()}</div>
                                <div class="metric-label">Tax Savings This Year</div>
                                <div class="metric-change positive">
                                    <i class="fas fa-arrow-up"></i> +12.5%
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-target"></i>
                            </div>
                            <div class="metric-content">
                                <div class="metric-value">${optimizationMetrics.optimizationScore.toFixed(0)}</div>
                                <div class="metric-label">Optimization Score</div>
                                <div class="metric-change ${optimizationMetrics.optimizationScore > 70 ? 'positive' : 'neutral'}">
                                    <i class="fas fa-${optimizationMetrics.optimizationScore > 70 ? 'arrow-up' : 'minus'}"></i> 
                                    ${optimizationMetrics.optimizationScore > 70 ? 'Excellent' : 'Good'}
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-percentage"></i>
                            </div>
                            <div class="metric-content">
                                <div class="metric-value">${userData.effectiveRate || 18.5}%</div>
                                <div class="metric-label">Effective Tax Rate</div>
                                <div class="metric-change positive">
                                    <i class="fas fa-arrow-down"></i> -2.3%
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="metric-content">
                                <div class="metric-value">${userData.riskScore || 25}</div>
                                <div class="metric-label">Audit Risk Score</div>
                                <div class="metric-change neutral">
                                    <i class="fas fa-minus"></i> Low Risk
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-widgets">
                        ${Object.keys(widgets).map(widgetKey => {
                            const widget = widgets[widgetKey];
                            return `
                                <div class="widget-card" data-widget="${widgetKey}">
                                    <div class="widget-header">
                                        <div class="widget-title">
                                            <i class="${widget.icon}"></i>
                                            ${widget.title}
                                        </div>
                                        <div class="widget-actions">
                                            <button class="widget-action" title="Refresh">
                                                <i class="fas fa-sync"></i>
                                            </button>
                                            <button class="widget-action" title="Expand">
                                                <i class="fas fa-expand"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="widget-content" id="${widgetKey}Content">
                                        <!-- Widget content will be populated here -->
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="dashboard-insights">
                        <div class="insights-card">
                            <h3>AI-Powered Insights</h3>
                            <div class="insights-list">
                                <div class="insight-item">
                                    <i class="fas fa-lightbulb insight-icon"></i>
                                    <div class="insight-content">
                                        <div class="insight-title">Retirement Contribution Opportunity</div>
                                        <div class="insight-description">You can save $1,200 in taxes by maximizing your 401(k) contribution.</div>
                                    </div>
                                    <button class="btn btn-sm btn-primary insight-action">Apply</button>
                                </div>
                                
                                <div class="insight-item">
                                    <i class="fas fa-exclamation-triangle insight-icon warning"></i>
                                    <div class="insight-content">
                                        <div class="insight-title">Estimated Payment Due</div>
                                        <div class="insight-description">You may need to make an estimated tax payment by January 15th to avoid penalties.</div>
                                    </div>
                                    <button class="btn btn-sm btn-warning insight-action">Calculate</button>
                                </div>
                                
                                <div class="insight-item">
                                    <i class="fas fa-chart-line insight-icon success"></i>
                                    <div class="insight-content">
                                        <div class="insight-title">Tax-Loss Harvesting Opportunity</div>
                                        <div class="insight-description">Consider harvesting losses in your investment portfolio to offset gains.</div>
                                    </div>
                                    <button class="btn btn-sm btn-success insight-action">Analyze</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Initialize widgets
            this.initializeWidgets(userData);
            
            // Add event listeners
            this.addEventListeners();
        },
        
        initializeWidgets: function(userData) {
            // Initialize each widget with appropriate data
            this.renderWidget('taxSavingsProgress', {
                percentage: optimizationMetrics.completionPercentage,
                value: optimizationMetrics.currentSavings,
                target: optimizationMetrics.taxSavingsGoal
            });
            
            this.renderWidget('optimizationScore', {
                score: optimizationMetrics.optimizationScore
            });
            
            // Generate sample data for charts
            const projections = generateTaxProjections(userData);
            
            this.renderWidget('taxBracketAnalysis', {
                labels: projections.map(p => p.year.toString()),
                taxLiability: projections.map(p => p.standardTax),
                optimizedTax: projections.map(p => p.optimizedTax)
            });
            
            this.renderWidget('deductionOpportunities', {
                labels: ['Home Office', 'Vehicle', 'Education', 'Charitable', 'Medical'],
                values: [1500, 2800, 2500, 1200, 800]
            });
            
            this.renderWidget('monthlyTaxImpact', {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                impact: [400, 350, 500, 200, 300, 450]
            });
            
            this.renderWidget('scenarioComparison', {
                scenarios: [
                    {
                        name: 'Current Strategy',
                        tax: 8500,
                        effectiveRate: 17.5,
                        savings: 0,
                        status: 'Current',
                        recommended: false
                    },
                    {
                        name: 'Optimized Strategy',
                        tax: 7200,
                        effectiveRate: 14.8,
                        savings: 1300,
                        status: 'Recommended',
                        recommended: true
                    },
                    {
                        name: 'Aggressive Strategy',
                        tax: 6800,
                        effectiveRate: 14.0,
                        savings: 1700,
                        status: 'High Risk',
                        recommended: false
                    }
                ]
            });
            
            this.renderWidget('auditRiskAssessment', {
                riskLevel: 'low',
                riskScore: userData.riskScore || 25,
                factors: [
                    {
                        name: 'Income Level',
                        description: 'Moderate income reduces audit risk',
                        level: 'low',
                        impact: 'low',
                        icon: 'fas fa-dollar-sign'
                    },
                    {
                        name: 'Deduction Amount',
                        description: 'Deductions within normal range',
                        level: 'medium',
                        impact: 'medium',
                        icon: 'fas fa-receipt'
                    }
                ]
            });
            
            this.renderWidget('taxCalendar', {
                deadlines: [
                    {
                        date: '2024-01-15',
                        title: 'Q4 Estimated Payments',
                        description: '2023 fourth quarter estimated tax payments due',
                        priority: 'high'
                    },
                    {
                        date: '2024-01-31',
                        title: 'W-2 Forms Due',
                        description: 'Employers must provide W-2 forms to employees',
                        priority: 'medium'
                    },
                    {
                        date: '2024-04-15',
                        title: 'Tax Return Filing',
                        description: '2023 individual tax returns due',
                        priority: 'high'
                    }
                ]
            });
        },
        
        renderWidget: function(widgetType, data) {
            const contentId = widgetType + 'Content';
            
            switch(widgets[widgetType].type) {
                case 'progress_ring':
                    createProgressRing(contentId, data);
                    break;
                case 'gauge':
                    createGaugeChart(contentId, data);
                    break;
                case 'line_chart':
                    createLineChart(contentId, data);
                    break;
                case 'bar_chart':
                    createBarChart(contentId, data);
                    break;
                case 'area_chart':
                    createAreaChart(contentId, data);
                    break;
                case 'comparison_table':
                    createComparisonTable(contentId, data);
                    break;
                case 'risk_meter':
                    createRiskMeter(contentId, data);
                    break;
                case 'calendar':
                    createTaxCalendar(contentId, data);
                    break;
            }
        },
        
        addEventListeners: function() {
            // Refresh dashboard
            const refreshBtn = document.getElementById('refreshDashboard');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    this.refreshDashboard();
                });
            }
            
            // Export dashboard
            const exportBtn = document.getElementById('exportDashboard');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.exportDashboard();
                });
            }
            
            // Widget actions
            document.querySelectorAll('.widget-action').forEach(button => {
                button.addEventListener('click', (e) => {
                    const action = e.target.closest('button').title;
                    const widget = e.target.closest('.widget-card').dataset.widget;
                    this.handleWidgetAction(widget, action);
                });
            });
            
            // Listen for real-time updates
            window.addEventListener('dashboard-metrics-updated', (e) => {
                this.updateMetrics(e.detail);
            });
        },
        
        refreshDashboard: function() {
            // Add loading state
            const refreshBtn = document.getElementById('refreshDashboard');
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                refreshBtn.disabled = true;
            }
            
            // Simulate data refresh
            setTimeout(() => {
                this.initializeWidgets(dashboardData);
                
                // Reset button
                if (refreshBtn) {
                    refreshBtn.innerHTML = '<i class="fas fa-sync"></i> Refresh';
                    refreshBtn.disabled = false;
                }
                
                // Show success message
                this.showNotification('Dashboard refreshed successfully', 'success');
            }, 1500);
        },
        
        exportDashboard: function() {
            const dashboardData = {
                metrics: optimizationMetrics,
                generatedAt: new Date().toISOString(),
                widgets: Object.keys(widgets)
            };
            
            const blob = new Blob([JSON.stringify(dashboardData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tax-dashboard-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            this.showNotification('Dashboard exported successfully', 'success');
        },
        
        handleWidgetAction: function(widget, action) {
            switch(action) {
                case 'Refresh':
                    // Refresh individual widget
                    const sampleData = this.generateSampleData(widget);
                    this.renderWidget(widget, sampleData);
                    break;
                case 'Expand':
                    // Expand widget to full screen
                    this.expandWidget(widget);
                    break;
            }
        },
        
        expandWidget: function(widgetType) {
            // Create modal overlay for expanded widget view
            const modal = document.createElement('div');
            modal.className = 'widget-modal';
            modal.innerHTML = `
                <div class="widget-modal-content">
                    <div class="widget-modal-header">
                        <h3>${widgets[widgetType].title}</h3>
                        <button class="widget-modal-close">&times;</button>
                    </div>
                    <div class="widget-modal-body" id="${widgetType}ModalContent">
                        <!-- Expanded widget content -->
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal handler
            modal.querySelector('.widget-modal-close').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            // Render expanded widget
            const sampleData = this.generateSampleData(widgetType);
            // You would render a larger, more detailed version here
        },
        
        generateSampleData: function(widgetType) {
            // Generate appropriate sample data for each widget type
            const sampleData = {
                taxSavingsProgress: {
                    percentage: Math.random() * 100,
                    value: Math.random() * 5000,
                    target: 5000
                },
                optimizationScore: {
                    score: 50 + Math.random() * 50
                }
                // Add more as needed
            };
            
            return sampleData[widgetType] || {};
        },
        
        updateMetrics: function(newMetrics) {
            // Update dashboard metrics in real-time
            Object.keys(newMetrics).forEach(key => {
                const element = document.querySelector(`[data-metric="${key}"] .metric-value`);
                if (element) {
                    element.textContent = newMetrics[key];
                }
            });
        },
        
        showNotification: function(message, type) {
            const notification = document.createElement('div');
            notification.className = `dashboard-notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                ${message}
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        },
        
        destroy: function() {
            // Clean up chart instances
            Object.keys(chartInstances).forEach(key => {
                if (chartInstances[key]) {
                    chartInstances[key].destroy();
                }
            });
            
            // Clear real-time timer
            if (realTimeTimer) {
                clearInterval(realTimeTimer);
                realTimeTimer = null;
            }
            
            chartInstances = {};
        }
    };
})();

// Export the module
export default TaxDashboard;