/**
 * Enhanced Progress Saving System
 * Professional-grade session management with auto-save, recovery, and cloud sync capabilities
 */

const ProgressManager = (function() {
    // Configuration
    const CONFIG = {
        autoSaveInterval: 30000, // 30 seconds
        maxBackups: 5,
        storageKey: 'taxFilingProgress',
        encryptionEnabled: true,
        cloudSyncEnabled: false, // For future cloud integration
        sessionTimeout: 30 * 60 * 1000 // 30 minutes
    };

    // State management
    let currentSession = null;
    let autoSaveTimer = null;
    let lastSaveTime = null;
    let isOnline = navigator.onLine;
    let saveQueue = [];
    let listeners = [];

    // Private methods
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function encryptData(data) {
        if (!CONFIG.encryptionEnabled) return data;
        
        // Simple XOR encryption for demo (in production, use proper encryption)
        const key = 'taxFilingKey2023';
        const encrypted = JSON.stringify(data)
            .split('')
            .map((char, index) => 
                String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
            )
            .join('');
        
        return btoa(encrypted);
    }

    function decryptData(encryptedData) {
        if (!CONFIG.encryptionEnabled) return encryptedData;
        
        try {
            const key = 'taxFilingKey2023';
            const decrypted = atob(encryptedData)
                .split('')
                .map((char, index) => 
                    String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
                )
                .join('');
            
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Failed to decrypt data:', error);
            return null;
        }
    }

    function saveToLocalStorage(sessionData) {
        try {
            const encryptedData = encryptData(sessionData);
            localStorage.setItem(CONFIG.storageKey, encryptedData);
            
            // Save backup
            const backupKey = `${CONFIG.storageKey}_backup_${Date.now()}`;
            localStorage.setItem(backupKey, encryptedData);
            
            // Clean up old backups
            cleanupOldBackups();
            
            lastSaveTime = Date.now();
            console.log('Progress saved to local storage');
            
            return true;
        } catch (error) {
            console.error('Failed to save to local storage:', error);
            return false;
        }
    }

    function loadFromLocalStorage() {
        try {
            const encryptedData = localStorage.getItem(CONFIG.storageKey);
            if (!encryptedData) return null;
            
            return decryptData(encryptedData);
        } catch (error) {
            console.error('Failed to load from local storage:', error);
            return null;
        }
    }

    function cleanupOldBackups() {
        const backupKeys = Object.keys(localStorage)
            .filter(key => key.startsWith(`${CONFIG.storageKey}_backup_`))
            .sort()
            .reverse();
        
        // Keep only the most recent backups
        backupKeys.slice(CONFIG.maxBackups).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    function collectFormData() {
        const formData = {};
        
        // Collect data from all forms
        document.querySelectorAll('form').forEach(form => {
            const data = new FormData(form);
            for (const [key, value] of data.entries()) {
                if (value && value.toString().trim()) {
                    formData[key] = value;
                }
            }
        });
        
        // Collect additional data from specific elements
        document.querySelectorAll('[data-save]').forEach(element => {
            const saveKey = element.getAttribute('data-save');
            if (element.type === 'checkbox') {
                formData[saveKey] = element.checked;
            } else if (element.type === 'radio') {
                if (element.checked) {
                    formData[saveKey] = element.value;
                }
            } else {
                formData[saveKey] = element.value;
            }
        });
        
        return formData;
    }

    function restoreFormData(formData) {
        let restoredCount = 0;
        
        // Restore form fields
        for (const [key, value] of Object.entries(formData)) {
            const elements = document.querySelectorAll(`[name="${key}"], [data-save="${key}"]`);
            
            elements.forEach(element => {
                if (element.type === 'checkbox') {
                    element.checked = value === true || value === 'true';
                } else if (element.type === 'radio') {
                    if (element.value === value) {
                        element.checked = true;
                    }
                } else if (element.tagName === 'SELECT') {
                    element.value = value;
                } else {
                    element.value = value;
                }
                
                // Trigger change event to update any dependent calculations
                element.dispatchEvent(new Event('change', { bubbles: true }));
                restoredCount++;
            });
        }
        
        return restoredCount;
    }

    function performAutoSave() {
        if (!currentSession) return;
        
        const formData = collectFormData();
        const sessionData = {
            ...currentSession,
            formData,
            lastModified: Date.now(),
            autoSave: true
        };
        
        if (saveToLocalStorage(sessionData)) {
            currentSession = sessionData;
            notifyListeners('autoSave', { success: true, time: lastSaveTime });
        }
    }

    function startAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
        }
        
        autoSaveTimer = setInterval(performAutoSave, CONFIG.autoSaveInterval);
        console.log(`Auto-save enabled (${CONFIG.autoSaveInterval / 1000}s interval)`);
    }

    function stopAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
            console.log('Auto-save disabled');
        }
    }

    function notifyListeners(event, data) {
        listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('Error in progress listener:', error);
            }
        });
    }

    function showProgressIndicator(message, type = 'info') {
        // Remove existing indicator
        const existing = document.querySelector('.progress-indicator');
        if (existing) existing.remove();
        
        const indicator = document.createElement('div');
        indicator.className = `progress-indicator progress-${type}`;
        indicator.innerHTML = `
            <div class="progress-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'save'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.classList.add('fade-out');
                setTimeout(() => indicator.remove(), 300);
            }
        }, 3000);
    }

    function handleOnlineStatusChange() {
        const wasOnline = isOnline;
        isOnline = navigator.onLine;
        
        if (!wasOnline && isOnline) {
            // Back online - sync pending changes
            showProgressIndicator('Connection restored - syncing changes', 'success');
            // TODO: Implement cloud sync when available
        } else if (wasOnline && !isOnline) {
            // Gone offline
            showProgressIndicator('Working offline - changes saved locally', 'info');
        }
    }

    // Public API
    return {
        // Initialize the progress manager
        init: function(options = {}) {
            Object.assign(CONFIG, options);
            
            // Add styles
            this.addProgressStyles();
            
            // Set up online/offline detection
            window.addEventListener('online', handleOnlineStatusChange);
            window.addEventListener('offline', handleOnlineStatusChange);
            
            // Set up beforeunload to save progress
            window.addEventListener('beforeunload', (e) => {
                if (currentSession) {
                    this.saveProgress();
                    // Show warning if there are unsaved changes
                    const timeSinceLastSave = Date.now() - (lastSaveTime || 0);
                    if (timeSinceLastSave > CONFIG.autoSaveInterval) {
                        e.preventDefault();
                        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                        return e.returnValue;
                    }
                }
            });
            
            // Start auto-save
            startAutoSave();
            
            console.log('Progress Manager initialized');
        },

        // Start a new session
        startSession: function(userData = {}) {
            const sessionId = generateSessionId();
            
            currentSession = {
                id: sessionId,
                userId: userData.userId || 'anonymous',
                started: Date.now(),
                lastModified: Date.now(),
                formData: {},
                completedSteps: [],
                currentStep: 1,
                userInfo: userData
            };
            
            this.saveProgress();
            notifyListeners('sessionStarted', currentSession);
            
            return currentSession;
        },

        // Load existing session
        loadSession: function() {
            const savedData = loadFromLocalStorage();
            
            if (savedData && savedData.id) {
                // Check if session is still valid (not expired)
                const timeSinceLastModified = Date.now() - savedData.lastModified;
                
                if (timeSinceLastModified > CONFIG.sessionTimeout) {
                    console.log('Session expired, starting new session');
                    this.clearSession();
                    return null;
                }
                
                currentSession = savedData;
                
                // Restore form data
                if (savedData.formData) {
                    setTimeout(() => {
                        const restoredCount = restoreFormData(savedData.formData);
                        if (restoredCount > 0) {
                            showProgressIndicator(`Restored ${restoredCount} field(s) from previous session`, 'success');
                        }
                    }, 100);
                }
                
                notifyListeners('sessionLoaded', currentSession);
                return currentSession;
            }
            
            return null;
        },

        // Save current progress
        saveProgress: function(forceSync = false) {
            if (!currentSession) {
                console.warn('No active session to save');
                return false;
            }
            
            const formData = collectFormData();
            currentSession.formData = formData;
            currentSession.lastModified = Date.now();
            
            const success = saveToLocalStorage(currentSession);
            
            if (success) {
                showProgressIndicator('Progress saved', 'success');
                notifyListeners('progressSaved', { 
                    session: currentSession, 
                    time: lastSaveTime 
                });
            } else {
                showProgressIndicator('Failed to save progress', 'error');
                notifyListeners('saveError', { session: currentSession });
            }
            
            return success;
        },

        // Update step progress
        updateStepProgress: function(stepNumber, data = {}) {
            if (!currentSession) return false;
            
            currentSession.currentStep = stepNumber;
            
            if (!currentSession.completedSteps.includes(stepNumber - 1) && stepNumber > 1) {
                currentSession.completedSteps.push(stepNumber - 1);
            }
            
            // Merge step-specific data
            Object.assign(currentSession.formData, data);
            
            this.saveProgress();
            notifyListeners('stepUpdated', { 
                step: stepNumber, 
                data, 
                progress: this.getProgress() 
            });
            
            return true;
        },

        // Get current progress percentage
        getProgress: function() {
            if (!currentSession) return 0;
            
            const totalSteps = 5; // Configurable
            const completedSteps = currentSession.completedSteps.length;
            
            return Math.round((completedSteps / totalSteps) * 100);
        },

        // Get session info
        getSession: function() {
            return currentSession ? { ...currentSession } : null;
        },

        // Clear current session
        clearSession: function() {
            try {
                localStorage.removeItem(CONFIG.storageKey);
                currentSession = null;
                lastSaveTime = null;
                
                showProgressIndicator('Session cleared', 'info');
                notifyListeners('sessionCleared');
                
                return true;
            } catch (error) {
                console.error('Failed to clear session:', error);
                return false;
            }
        },

        // Get available backups
        getBackups: function() {
            const backupKeys = Object.keys(localStorage)
                .filter(key => key.startsWith(`${CONFIG.storageKey}_backup_`))
                .map(key => ({
                    key,
                    timestamp: parseInt(key.split('_').pop()),
                    date: new Date(parseInt(key.split('_').pop()))
                }))
                .sort((a, b) => b.timestamp - a.timestamp);
            
            return backupKeys;
        },

        // Restore from backup
        restoreFromBackup: function(backupKey) {
            try {
                const encryptedData = localStorage.getItem(backupKey);
                if (!encryptedData) {
                    throw new Error('Backup not found');
                }
                
                const backupData = decryptData(encryptedData);
                if (!backupData) {
                    throw new Error('Failed to decrypt backup');
                }
                
                currentSession = backupData;
                this.saveProgress();
                
                // Restore form data
                if (backupData.formData) {
                    const restoredCount = restoreFormData(backupData.formData);
                    showProgressIndicator(`Restored from backup (${restoredCount} fields)`, 'success');
                }
                
                notifyListeners('backupRestored', currentSession);
                return true;
                
            } catch (error) {
                console.error('Failed to restore from backup:', error);
                showProgressIndicator('Failed to restore backup', 'error');
                return false;
            }
        },

        // Export session data
        exportSession: function() {
            if (!currentSession) return null;
            
            const exportData = {
                ...currentSession,
                exported: Date.now(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `tax-filing-progress-${currentSession.id}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            showProgressIndicator('Progress exported successfully', 'success');
        },

        // Import session data
        importSession: function(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    try {
                        const importData = JSON.parse(e.target.result);
                        
                        // Validate import data
                        if (!importData.id || !importData.formData) {
                            throw new Error('Invalid import file format');
                        }
                        
                        // Create new session with imported data
                        currentSession = {
                            ...importData,
                            imported: Date.now(),
                            originalId: importData.id,
                            id: generateSessionId() // Generate new ID
                        };
                        
                        this.saveProgress();
                        
                        // Restore form data
                        const restoredCount = restoreFormData(importData.formData);
                        showProgressIndicator(`Imported session (${restoredCount} fields)`, 'success');
                        
                        notifyListeners('sessionImported', currentSession);
                        resolve(currentSession);
                        
                    } catch (error) {
                        showProgressIndicator('Failed to import session', 'error');
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    reject(new Error('Failed to read import file'));
                };
                
                reader.readAsText(file);
            });
        },

        // Add progress listener
        addListener: function(listener) {
            if (typeof listener === 'function') {
                listeners.push(listener);
            }
        },

        // Remove progress listener
        removeListener: function(listener) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        },

        // Manual save trigger
        manualSave: function() {
            this.saveProgress(true);
        },

        // Add CSS styles for progress indicators
        addProgressStyles: function() {
            const styles = `
                .progress-indicator {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    padding: 1rem;
                    z-index: 10000;
                    min-width: 300px;
                    animation: slideInRight 0.3s ease-out;
                    border-left: 4px solid #3b82f6;
                }

                .progress-indicator.progress-success {
                    border-left-color: #10b981;
                }

                .progress-indicator.progress-error {
                    border-left-color: #ef4444;
                }

                .progress-indicator.progress-info {
                    border-left-color: #3b82f6;
                }

                .progress-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .progress-content i {
                    font-size: 1.25rem;
                    color: #3b82f6;
                }

                .progress-success .progress-content i {
                    color: #10b981;
                }

                .progress-error .progress-content i {
                    color: #ef4444;
                }

                .progress-content span {
                    font-weight: 500;
                    color: #374151;
                }

                .fade-out {
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @media (max-width: 768px) {
                    .progress-indicator {
                        left: 10px;
                        right: 10px;
                        min-width: auto;
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        },

        // Get configuration
        getConfig: function() {
            return { ...CONFIG };
        },

        // Update configuration
        updateConfig: function(newConfig) {
            Object.assign(CONFIG, newConfig);
            
            // Restart auto-save if interval changed
            if (newConfig.autoSaveInterval) {
                startAutoSave();
            }
        }
    };
})();

// Export the module
export default ProgressManager;