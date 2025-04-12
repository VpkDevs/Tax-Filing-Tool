/**
 * Document Analyzer Module
 * Helps users extract information from tax documents
 */

const DocumentAnalyzer = (function() {
    // Private variables
    const supportedDocuments = {
        'w2': {
            name: 'W-2 Form',
            description: 'Wage and Tax Statement',
            fields: [
                { id: 'employerEIN', name: 'Employer EIN', box: '1b', type: 'text' },
                { id: 'wages', name: 'Wages, tips, other compensation', box: '1', type: 'currency' },
                { id: 'federalTax', name: 'Federal income tax withheld', box: '2', type: 'currency' },
                { id: 'socialSecurityWages', name: 'Social security wages', box: '3', type: 'currency' },
                { id: 'socialSecurityTax', name: 'Social security tax withheld', box: '4', type: 'currency' },
                { id: 'medicareWages', name: 'Medicare wages and tips', box: '5', type: 'currency' },
                { id: 'medicareTax', name: 'Medicare tax withheld', box: '6', type: 'currency' },
                { id: 'stateTax', name: 'State income tax', box: '17', type: 'currency' }
            ]
        },
        'letter6475': {
            name: 'Letter 6475',
            description: 'Your Third Economic Impact Payment',
            fields: [
                { id: 'paymentAmount', name: 'Economic Impact Payment amount', type: 'currency' },
                { id: 'paymentDate', name: 'Payment date', type: 'date' }
            ]
        },
        '1099g': {
            name: 'Form 1099-G',
            description: 'Certain Government Payments',
            fields: [
                { id: 'unemploymentCompensation', name: 'Unemployment compensation', box: '1', type: 'currency' },
                { id: 'federalTaxWithheld', name: 'Federal income tax withheld', box: '4', type: 'currency' },
                { id: 'stateTaxWithheld', name: 'State income tax withheld', box: '11', type: 'currency' }
            ]
        },
        '1099int': {
            name: 'Form 1099-INT',
            description: 'Interest Income',
            fields: [
                { id: 'interestIncome', name: 'Interest income', box: '1', type: 'currency' },
                { id: 'federalTaxWithheld', name: 'Federal income tax withheld', box: '4', type: 'currency' }
            ]
        },
        '1099misc': {
            name: 'Form 1099-MISC',
            description: 'Miscellaneous Income',
            fields: [
                { id: 'rents', name: 'Rents', box: '1', type: 'currency' },
                { id: 'royalties', name: 'Royalties', box: '2', type: 'currency' },
                { id: 'otherIncome', name: 'Other income', box: '3', type: 'currency' },
                { id: 'federalTaxWithheld', name: 'Federal income tax withheld', box: '4', type: 'currency' }
            ]
        },
        '1099nec': {
            name: 'Form 1099-NEC',
            description: 'Nonemployee Compensation',
            fields: [
                { id: 'nonemployeeCompensation', name: 'Nonemployee compensation', box: '1', type: 'currency' },
                { id: 'federalTaxWithheld', name: 'Federal income tax withheld', box: '4', type: 'currency' }
            ]
        },
        '1040': {
            name: 'Form 1040',
            description: 'U.S. Individual Income Tax Return',
            fields: [
                { id: 'adjustedGrossIncome', name: 'Adjusted gross income', line: '11', type: 'currency' },
                { id: 'standardDeduction', name: 'Standard deduction', line: '12', type: 'currency' },
                { id: 'taxableIncome', name: 'Taxable income', line: '15', type: 'currency' },
                { id: 'tax', name: 'Tax', line: '16', type: 'currency' },
                { id: 'totalPayments', name: 'Total payments', line: '33', type: 'currency' },
                { id: 'refund', name: 'Refund', line: '34', type: 'currency' },
                { id: 'amountOwed', name: 'Amount you owe', line: '37', type: 'currency' }
            ]
        }
    };
    
    // Private methods
    function detectDocumentType(imageData) {
        // In a real implementation, this would use OCR and ML to detect the document type
        // For this demo, we'll simulate the detection
        
        return new Promise((resolve) => {
            // Simulate processing time
            setTimeout(() => {
                // For demo purposes, randomly select a document type
                const documentTypes = Object.keys(supportedDocuments);
                const randomIndex = Math.floor(Math.random() * documentTypes.length);
                const detectedType = documentTypes[randomIndex];
                
                resolve({
                    type: detectedType,
                    confidence: 0.85 + (Math.random() * 0.15), // Random confidence between 85% and 100%
                    name: supportedDocuments[detectedType].name,
                    description: supportedDocuments[detectedType].description
                });
            }, 1500);
        });
    }
    
    function extractDataFromDocument(imageData, documentType) {
        // In a real implementation, this would use OCR and ML to extract data
        // For this demo, we'll simulate the extraction
        
        return new Promise((resolve) => {
            // Simulate processing time
            setTimeout(() => {
                const documentFields = supportedDocuments[documentType].fields;
                const extractedData = {};
                
                // Generate realistic-looking data for each field
                documentFields.forEach(field => {
                    if (field.type === 'currency') {
                        // Generate a random currency value
                        const baseAmount = Math.floor(Math.random() * 50000) + 1000;
                        extractedData[field.id] = (baseAmount / 100).toFixed(2);
                    } else if (field.type === 'date') {
                        // Generate a date in 2021
                        const month = Math.floor(Math.random() * 12) + 1;
                        const day = Math.floor(Math.random() * 28) + 1;
                        extractedData[field.id] = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/2021`;
                    } else {
                        // Generate a random alphanumeric string for text fields
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                        let result = '';
                        for (let i = 0; i < 9; i++) {
                            result += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        extractedData[field.id] = result;
                    }
                });
                
                // For Letter 6475, set a realistic stimulus payment amount
                if (documentType === 'letter6475') {
                    extractedData.paymentAmount = '1400.00';
                }
                
                resolve({
                    documentType,
                    extractedData,
                    confidence: 0.75 + (Math.random() * 0.2) // Random confidence between 75% and 95%
                });
            }, 2000);
        });
    }
    
    function validateExtractedData(data, documentType) {
        const documentFields = supportedDocuments[documentType].fields;
        const validationResults = {};
        
        documentFields.forEach(field => {
            const value = data[field.id];
            let isValid = true;
            let validationMessage = '';
            
            if (value === undefined || value === null || value === '') {
                isValid = false;
                validationMessage = 'Field is required';
            } else if (field.type === 'currency') {
                // Validate currency format
                const currencyRegex = /^\d+(\.\d{2})?$/;
                if (!currencyRegex.test(value)) {
                    isValid = false;
                    validationMessage = 'Invalid currency format';
                }
            } else if (field.type === 'date') {
                // Validate date format (MM/DD/YYYY)
                const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
                if (!dateRegex.test(value)) {
                    isValid = false;
                    validationMessage = 'Invalid date format (MM/DD/YYYY)';
                }
            }
            
            validationResults[field.id] = {
                isValid,
                message: validationMessage
            };
        });
        
        return validationResults;
    }
    
    // Public methods
    return {
        getSupportedDocuments: function() {
            return Object.keys(supportedDocuments).map(key => ({
                id: key,
                name: supportedDocuments[key].name,
                description: supportedDocuments[key].description
            }));
        },
        
        getDocumentFields: function(documentType) {
            if (!supportedDocuments[documentType]) {
                return null;
            }
            
            return supportedDocuments[documentType].fields;
        },
        
        analyzeDocument: async function(file) {
            try {
                // Convert file to image data (base64)
                const imageData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                
                // Step 1: Detect document type
                const documentInfo = await detectDocumentType(imageData);
                
                // Step 2: Extract data from document
                const extractionResult = await extractDataFromDocument(imageData, documentInfo.type);
                
                // Step 3: Validate extracted data
                const validationResults = validateExtractedData(extractionResult.extractedData, documentInfo.type);
                
                return {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    documentType: documentInfo.type,
                    documentName: documentInfo.name,
                    documentDescription: documentInfo.description,
                    detectionConfidence: documentInfo.confidence,
                    extractedData: extractionResult.extractedData,
                    extractionConfidence: extractionResult.confidence,
                    validationResults,
                    isValid: Object.values(validationResults).every(result => result.isValid),
                    analyzedAt: new Date().toISOString()
                };
            } catch (error) {
                console.error('Error analyzing document:', error);
                return {
                    error: true,
                    message: 'Failed to analyze document',
                    details: error.message
                };
            }
        },
        
        generateDataEntryForm: function(documentType, containerId, initialData = {}) {
            const container = document.getElementById(containerId);
            if (!container) return null;
            
            const documentFields = this.getDocumentFields(documentType);
            if (!documentFields) return null;
            
            let formHtml = `
                <form id="document-data-form" class="document-data-form">
                    <h3>${supportedDocuments[documentType].name}</h3>
                    <p class="form-description">${supportedDocuments[documentType].description}</p>
            `;
            
            documentFields.forEach(field => {
                const fieldValue = initialData[field.id] || '';
                const fieldId = `document-field-${field.id}`;
                
                formHtml += `
                    <div class="form-group">
                        <label for="${fieldId}">${field.name}${field.box ? ` (Box ${field.box})` : field.line ? ` (Line ${field.line})` : ''}:</label>
                `;
                
                if (field.type === 'currency') {
                    formHtml += `
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="text" id="${fieldId}" name="${field.id}" class="form-control" value="${fieldValue}" placeholder="0.00">
                        </div>
                    `;
                } else if (field.type === 'date') {
                    formHtml += `
                        <input type="text" id="${fieldId}" name="${field.id}" class="form-control" value="${fieldValue}" placeholder="MM/DD/YYYY">
                    `;
                } else {
                    formHtml += `
                        <input type="text" id="${fieldId}" name="${field.id}" class="form-control" value="${fieldValue}">
                    `;
                }
                
                formHtml += `
                        <div class="error-message" id="${fieldId}-error"></div>
                    </div>
                `;
            });
            
            formHtml += `
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save Document Data</button>
                        <button type="button" class="btn btn-secondary" id="cancel-document-form">Cancel</button>
                    </div>
                </form>
            `;
            
            container.innerHTML = formHtml;
            
            // Add event listeners
            const form = document.getElementById('document-data-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = {};
                let isValid = true;
                
                documentFields.forEach(field => {
                    const fieldId = `document-field-${field.id}`;
                    const fieldElement = document.getElementById(fieldId);
                    const errorElement = document.getElementById(`${fieldId}-error`);
                    const value = fieldElement.value.trim();
                    
                    // Validate field
                    let fieldIsValid = true;
                    let errorMessage = '';
                    
                    if (value === '') {
                        fieldIsValid = false;
                        errorMessage = 'This field is required';
                    } else if (field.type === 'currency') {
                        const currencyRegex = /^\d+(\.\d{2})?$/;
                        if (!currencyRegex.test(value)) {
                            fieldIsValid = false;
                            errorMessage = 'Please enter a valid amount (e.g., 1234.56)';
                        }
                    } else if (field.type === 'date') {
                        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
                        if (!dateRegex.test(value)) {
                            fieldIsValid = false;
                            errorMessage = 'Please enter a valid date (MM/DD/YYYY)';
                        }
                    }
                    
                    if (!fieldIsValid) {
                        isValid = false;
                        fieldElement.classList.add('error');
                        errorElement.textContent = errorMessage;
                        errorElement.style.display = 'block';
                    } else {
                        fieldElement.classList.remove('error');
                        errorElement.style.display = 'none';
                        formData[field.id] = value;
                    }
                });
                
                if (isValid) {
                    // Dispatch custom event with form data
                    const event = new CustomEvent('document-data-saved', {
                        detail: {
                            documentType,
                            data: formData
                        }
                    });
                    document.dispatchEvent(event);
                    
                    // Clear form
                    container.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <p>Document data saved successfully!</p>
                        </div>
                    `;
                }
            });
            
            const cancelButton = document.getElementById('cancel-document-form');
            cancelButton.addEventListener('click', () => {
                // Dispatch cancel event
                const event = new CustomEvent('document-form-cancelled');
                document.dispatchEvent(event);
                
                // Clear form
                container.innerHTML = '';
            });
            
            return form;
        },
        
        initDocumentUploader: function(uploadContainerId, previewContainerId, onDocumentAnalyzed) {
            const uploadContainer = document.getElementById(uploadContainerId);
            const previewContainer = document.getElementById(previewContainerId);
            
            if (!uploadContainer || !previewContainer) return null;
            
            // Create file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'document-file-input';
            fileInput.accept = 'image/jpeg,image/png,application/pdf';
            fileInput.style.display = 'none';
            uploadContainer.appendChild(fileInput);
            
            // Add event listener to upload container
            uploadContainer.addEventListener('click', () => {
                fileInput.click();
            });
            
            // Add drag and drop support
            uploadContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadContainer.classList.add('drag-over');
            });
            
            uploadContainer.addEventListener('dragleave', () => {
                uploadContainer.classList.remove('drag-over');
            });
            
            uploadContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadContainer.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    handleFile(e.dataTransfer.files[0]);
                }
            });
            
            // Handle file selection
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    handleFile(fileInput.files[0]);
                }
            });
            
            // Function to handle the selected file
            const handleFile = async (file) => {
                // Show loading state
                previewContainer.innerHTML = `
                    <div class="document-loading">
                        <div class="loading">
                            <div></div><div></div><div></div><div></div>
                        </div>
                        <p>Analyzing document...</p>
                    </div>
                `;
                
                try {
                    // Analyze document
                    const result = await this.analyzeDocument(file);
                    
                    // Display results
                    if (result.error) {
                        previewContainer.innerHTML = `
                            <div class="document-error">
                                <i class="fas fa-exclamation-circle"></i>
                                <h4>Analysis Failed</h4>
                                <p>${result.message}</p>
                                <button class="btn btn-secondary try-again-btn">Try Again</button>
                            </div>
                        `;
                        
                        // Add event listener to try again button
                        previewContainer.querySelector('.try-again-btn').addEventListener('click', () => {
                            fileInput.click();
                        });
                    } else {
                        // Create preview of the document
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const documentPreview = `
                                <div class="document-preview">
                                    <div class="document-preview-header">
                                        <h4>${result.documentName}</h4>
                                        <p>${result.documentDescription}</p>
                                    </div>
                                    <div class="document-preview-image">
                                        ${file.type.includes('pdf') 
                                            ? `<div class="pdf-preview"><i class="fas fa-file-pdf"></i><span>${file.name}</span></div>`
                                            : `<img src="${e.target.result}" alt="${result.documentName}">`
                                        }
                                    </div>
                                    <div class="document-preview-info">
                                        <div class="document-confidence">
                                            <div class="confidence-label">Document Detection Confidence:</div>
                                            <div class="confidence-bar">
                                                <div class="confidence-fill" style="width: ${Math.round(result.detectionConfidence * 100)}%"></div>
                                            </div>
                                            <div class="confidence-value">${Math.round(result.detectionConfidence * 100)}%</div>
                                        </div>
                                        <div class="document-confidence">
                                            <div class="confidence-label">Data Extraction Confidence:</div>
                                            <div class="confidence-bar">
                                                <div class="confidence-fill" style="width: ${Math.round(result.extractionConfidence * 100)}%"></div>
                                            </div>
                                            <div class="confidence-value">${Math.round(result.extractionConfidence * 100)}%</div>
                                        </div>
                                    </div>
                                    <div class="document-preview-data">
                                        <h5>Extracted Data</h5>
                                        <div class="extracted-data-list">
                                            ${Object.entries(result.extractedData).map(([key, value]) => {
                                                const field = supportedDocuments[result.documentType].fields.find(f => f.id === key);
                                                return `
                                                    <div class="extracted-data-item">
                                                        <div class="extracted-data-label">${field ? field.name : key}:</div>
                                                        <div class="extracted-data-value">${field && field.type === 'currency' ? `$${value}` : value}</div>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                    <div class="document-preview-actions">
                                        <button class="btn btn-primary use-data-btn">Use This Data</button>
                                        <button class="btn btn-secondary edit-data-btn">Edit Data</button>
                                        <button class="btn btn-secondary try-again-btn">Try Different Document</button>
                                    </div>
                                </div>
                            `;
                            
                            previewContainer.innerHTML = documentPreview;
                            
                            // Add event listeners to buttons
                            previewContainer.querySelector('.use-data-btn').addEventListener('click', () => {
                                if (typeof onDocumentAnalyzed === 'function') {
                                    onDocumentAnalyzed(result);
                                }
                            });
                            
                            previewContainer.querySelector('.edit-data-btn').addEventListener('click', () => {
                                // Generate data entry form
                                this.generateDataEntryForm(result.documentType, previewContainerId, result.extractedData);
                                
                                // Add event listener for form submission
                                document.addEventListener('document-data-saved', (e) => {
                                    if (typeof onDocumentAnalyzed === 'function') {
                                        onDocumentAnalyzed({
                                            ...result,
                                            extractedData: e.detail.data,
                                            manuallyEdited: true
                                        });
                                    }
                                }, { once: true });
                                
                                // Add event listener for form cancellation
                                document.addEventListener('document-form-cancelled', () => {
                                    // Restore document preview
                                    previewContainer.innerHTML = documentPreview;
                                    
                                    // Re-add event listeners
                                    previewContainer.querySelector('.use-data-btn').addEventListener('click', () => {
                                        if (typeof onDocumentAnalyzed === 'function') {
                                            onDocumentAnalyzed(result);
                                        }
                                    });
                                    
                                    previewContainer.querySelector('.edit-data-btn').addEventListener('click', () => {
                                        this.generateDataEntryForm(result.documentType, previewContainerId, result.extractedData);
                                    });
                                    
                                    previewContainer.querySelector('.try-again-btn').addEventListener('click', () => {
                                        fileInput.click();
                                    });
                                }, { once: true });
                            });
                            
                            previewContainer.querySelector('.try-again-btn').addEventListener('click', () => {
                                fileInput.click();
                            });
                        };
                        
                        reader.readAsDataURL(file);
                    }
                } catch (error) {
                    console.error('Error handling document:', error);
                    previewContainer.innerHTML = `
                        <div class="document-error">
                            <i class="fas fa-exclamation-circle"></i>
                            <h4>Analysis Failed</h4>
                            <p>An unexpected error occurred while analyzing the document.</p>
                            <button class="btn btn-secondary try-again-btn">Try Again</button>
                        </div>
                    `;
                    
                    // Add event listener to try again button
                    previewContainer.querySelector('.try-again-btn').addEventListener('click', () => {
                        fileInput.click();
                    });
                }
            };
            
            return {
                uploadContainer,
                previewContainer,
                fileInput
            };
        }
    };
})();

// Export the module
export default DocumentAnalyzer;
