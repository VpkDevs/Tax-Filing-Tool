/**
 * Tax Forms Module
 * Manages all tax forms and resources needed for filing
 */

const TaxForms = (function() {
    // Private variables
    const forms = {
        // Main tax forms
        '1040': {
            name: 'Form 1040',
            description: 'U.S. Individual Income Tax Return',
            year: '2021',
            path: '/static/forms/f1040_2021.pdf',
            instructions: '/static/forms/i1040_2021.pdf'
        },
        'schedule1': {
            name: 'Schedule 1',
            description: 'Additional Income and Adjustments to Income',
            year: '2021',
            path: '/static/forms/f1040s1_2021.pdf',
            instructions: '/static/forms/i1040s1_2021.pdf'
        },
        'schedule2': {
            name: 'Schedule 2',
            description: 'Additional Taxes',
            year: '2021',
            path: '/static/forms/f1040s2_2021.pdf',
            instructions: '/static/forms/i1040s2_2021.pdf'
        },
        'schedule3': {
            name: 'Schedule 3',
            description: 'Additional Credits and Payments',
            year: '2021',
            path: '/static/forms/f1040s3_2021.pdf',
            instructions: '/static/forms/i1040s3_2021.pdf'
        },
        'schedule8812': {
            name: 'Schedule 8812',
            description: 'Credits for Qualifying Children and Other Dependents',
            year: '2021',
            path: '/static/forms/f1040s8_2021.pdf',
            instructions: '/static/forms/i1040s8_2021.pdf'
        },
        
        // Supporting forms
        'w2': {
            name: 'Form W-2',
            description: 'Wage and Tax Statement',
            year: '2021',
            path: '/static/forms/fw2_2021.pdf',
            instructions: '/static/forms/iw2_2021.pdf'
        },
        '1099g': {
            name: 'Form 1099-G',
            description: 'Certain Government Payments',
            year: '2021',
            path: '/static/forms/f1099g_2021.pdf',
            instructions: '/static/forms/i1099g_2021.pdf'
        },
        '1099misc': {
            name: 'Form 1099-MISC',
            description: 'Miscellaneous Income',
            year: '2021',
            path: '/static/forms/f1099misc_2021.pdf',
            instructions: '/static/forms/i1099misc_2021.pdf'
        },
        '1099nec': {
            name: 'Form 1099-NEC',
            description: 'Nonemployee Compensation',
            year: '2021',
            path: '/static/forms/f1099nec_2021.pdf',
            instructions: '/static/forms/i1099nec_2021.pdf'
        },
        
        // Recovery Rebate Credit specific
        'letter6475': {
            name: 'Letter 6475',
            description: 'Your Third Economic Impact Payment',
            year: '2021',
            path: '/static/forms/letter6475_sample.pdf',
            instructions: '/static/forms/letter6475_info.pdf'
        }
    };
    
    // Additional resources
    const resources = {
        'filingGuide': {
            name: 'Complete 2021 Tax Filing Guide',
            description: 'Step-by-step instructions for filing your 2021 tax return',
            path: '/static/forms/2021_filing_guide.pdf'
        },
        'rebateWorksheet': {
            name: 'Recovery Rebate Credit Worksheet',
            description: 'Calculate your Recovery Rebate Credit amount',
            path: '/static/forms/rebate_worksheet_2021.pdf'
        },
        'mailingAddresses': {
            name: 'IRS Mailing Addresses',
            description: 'Where to mail your paper return based on your state',
            path: '/static/forms/irs_mailing_addresses_2021.pdf'
        },
        'recordkeepingGuide': {
            name: 'Tax Recordkeeping Guide',
            description: 'What documents to keep and for how long',
            path: '/static/forms/recordkeeping_guide.pdf'
        },
        'amendedReturns': {
            name: 'Amended Return Guide',
            description: 'How to file an amended return if needed',
            path: '/static/forms/amended_return_guide.pdf'
        }
    };
    
    // Public methods
    return {
        // Get a specific form
        getForm: function(formId) {
            return forms[formId] || null;
        },
        
        // Get all forms
        getAllForms: function() {
            return forms;
        },
        
        // Get a specific resource
        getResource: function(resourceId) {
            return resources[resourceId] || null;
        },
        
        // Get all resources
        getAllResources: function() {
            return resources;
        },
        
        // Generate form library UI
        generateFormLibrary: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            let html = '<div class="forms-library">';
            
            // Main tax forms section
            html += `
                <div class="forms-section">
                    <h3 class="forms-section-title"><i class="fas fa-file-alt"></i> Main Tax Forms</h3>
                    <div class="forms-grid">
            `;
            
            // Add main forms
            ['1040', 'schedule1', 'schedule2', 'schedule3', 'schedule8812'].forEach(formId => {
                const form = forms[formId];
                html += this.generateFormCard(formId, form);
            });
            
            html += `
                    </div>
                </div>
            `;
            
            // Supporting forms section
            html += `
                <div class="forms-section">
                    <h3 class="forms-section-title"><i class="fas fa-file-invoice"></i> Supporting Forms</h3>
                    <div class="forms-grid">
            `;
            
            // Add supporting forms
            ['w2', '1099g', '1099misc', '1099nec', 'letter6475'].forEach(formId => {
                const form = forms[formId];
                html += this.generateFormCard(formId, form);
            });
            
            html += `
                    </div>
                </div>
            `;
            
            // Additional resources section
            html += `
                <div class="forms-section">
                    <h3 class="forms-section-title"><i class="fas fa-book"></i> Additional Resources</h3>
                    <div class="forms-grid">
            `;
            
            // Add resources
            Object.keys(resources).forEach(resourceId => {
                const resource = resources[resourceId];
                html += this.generateResourceCard(resourceId, resource);
            });
            
            html += `
                    </div>
                </div>
            `;
            
            html += '</div>';
            container.innerHTML = html;
            
            // Add event listeners
            container.querySelectorAll('.form-preview-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const formId = btn.getAttribute('data-form');
                    this.showFormPreview(formId);
                });
            });
            
            container.querySelectorAll('.form-download-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const formId = btn.getAttribute('data-form');
                    this.trackDownload(formId);
                });
            });
            
            container.querySelectorAll('.instructions-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const formId = btn.getAttribute('data-form');
                    this.trackInstructionsView(formId);
                });
            });
        },
        
        // Generate HTML for a form card
        generateFormCard: function(formId, form) {
            return `
                <div class="form-card" id="form-${formId}">
                    <div class="form-card-header">
                        <h4 class="form-card-title">${form.name}</h4>
                        <span class="form-card-year">${form.year}</span>
                    </div>
                    <div class="form-card-body">
                        <p class="form-card-description">${form.description}</p>
                    </div>
                    <div class="form-card-footer">
                        <button class="form-preview-btn" data-form="${formId}">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <a href="${form.path}" class="form-download-btn" data-form="${formId}" download>
                            <i class="fas fa-download"></i> Download
                        </a>
                        <a href="${form.instructions}" class="instructions-btn" data-form="${formId}" target="_blank">
                            <i class="fas fa-info-circle"></i> Instructions
                        </a>
                    </div>
                </div>
            `;
        },
        
        // Generate HTML for a resource card
        generateResourceCard: function(resourceId, resource) {
            return `
                <div class="resource-card" id="resource-${resourceId}">
                    <div class="resource-card-header">
                        <h4 class="resource-card-title">${resource.name}</h4>
                    </div>
                    <div class="resource-card-body">
                        <p class="resource-card-description">${resource.description}</p>
                    </div>
                    <div class="resource-card-footer">
                        <a href="${resource.path}" class="resource-download-btn" download>
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                </div>
            `;
        },
        
        // Show form preview in a modal
        showFormPreview: function(formId) {
            const form = forms[formId];
            if (!form) return;
            
            // Create modal for form preview
            const modal = document.createElement('div');
            modal.className = 'form-preview-modal';
            modal.innerHTML = `
                <div class="form-preview-content">
                    <div class="form-preview-header">
                        <h3>${form.name} (${form.year})</h3>
                        <button class="form-preview-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="form-preview-body">
                        <iframe src="${form.path}" width="100%" height="500px"></iframe>
                    </div>
                    <div class="form-preview-footer">
                        <a href="${form.path}" download class="btn btn-primary">
                            <i class="fas fa-download"></i> Download Form
                        </a>
                        <a href="${form.instructions}" target="_blank" class="btn btn-secondary">
                            <i class="fas fa-info-circle"></i> View Instructions
                        </a>
                        <button class="btn btn-secondary form-preview-close">Close</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            modal.querySelectorAll('.form-preview-close').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
            });
            
            // Close on click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        },
        
        // Track form downloads (for analytics)
        trackDownload: function(formId) {
            console.log(`Form downloaded: ${formId}`);
            // In a real implementation, this would send analytics data
        },
        
        // Track instructions views (for analytics)
        trackInstructionsView: function(formId) {
            console.log(`Instructions viewed: ${formId}`);
            // In a real implementation, this would send analytics data
        }
    };
})();

// Export the module
export default TaxForms;
