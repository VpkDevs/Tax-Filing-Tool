/**
 * Offline Storage Module
 * Provides robust offline data storage using IndexedDB
 */

const OfflineStorage = {
    dbName: 'TaxFilingDB',
    dbVersion: 1,
    db: null,

    /**
     * Initialize the database
     * @returns {Promise} - Resolves when DB is ready
     */
    init: function() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = event => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = event => {
                this.db = event.target.result;
                console.log('IndexedDB initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = event => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('form-data')) {
                    const formStore = db.createObjectStore('form-data', { keyPath: 'formId' });
                    formStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('pending-submissions')) {
                    const submissionStore = db.createObjectStore('pending-submissions', { keyPath: 'id', autoIncrement: true });
                    submissionStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('user-documents')) {
                    const docStore = db.createObjectStore('user-documents', { keyPath: 'id', autoIncrement: true });
                    docStore.createIndex('type', 'type', { unique: false });
                    docStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    },

    /**
     * Save form data
     * @param {string} formId - Identifier for the form
     * @param {Object} data - Form data to save
     * @returns {Promise}
     */
    saveFormData: function(formId, data) {
        return this.init().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['form-data'], 'readwrite');
                const store = transaction.objectStore('form-data');

                const record = {
                    formId: formId,
                    data: data,
                    timestamp: new Date().getTime()
                };

                const request = store.put(record);

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Load form data
     * @param {string} formId - Identifier for the form
     * @returns {Promise<Object>} - Resolves with form data
     */
    loadFormData: function(formId) {
        return this.init().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['form-data'], 'readonly');
                const store = transaction.objectStore('form-data');
                const request = store.get(formId);

                request.onsuccess = () => {
                    if (request.result) {
                        resolve(request.result.data);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Queue a form submission for when online
     * @param {Object} data - Form data to submit
     * @returns {Promise}
     */
    queueFormSubmission: function(data) {
        return this.init().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['pending-submissions'], 'readwrite');
                const store = transaction.objectStore('pending-submissions');

                const record = {
                    data: data,
                    timestamp: new Date().getTime(),
                    attempts: 0
                };

                const request = store.add(record);

                request.onsuccess = () => {
                    // Register for background sync if available
                    if ('serviceWorker' in navigator && 'SyncManager' in window) {
                        navigator.serviceWorker.ready.then(registration => {
                            registration.sync.register('tax-form-submission')
                                .then(() => console.log('Background sync registered'))
                                .catch(err => console.error('Background sync registration failed:', err));
                        });
                    }
                    resolve(true);
                };

                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Save a document
     * @param {string} type - Document type
     * @param {Blob} fileData - The document file
     * @param {string} fileName - Name of the file
     * @returns {Promise}
     */
    saveDocument: function(type, fileData, fileName) {
        return this.init().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['user-documents'], 'readwrite');
                const store = transaction.objectStore('user-documents');

                const record = {
                    type: type,
                    file: fileData,
                    fileName: fileName,
                    timestamp: new Date().getTime()
                };

                const request = store.add(record);

                request.onsuccess = event => resolve(event.target.result); // Returns the generated ID
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Get all documents of a specific type
     * @param {string} type - Document type
     * @returns {Promise<Array>} - Resolves with array of documents
     */
    getDocumentsByType: function(type) {
        return this.init().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['user-documents'], 'readonly');
                const store = transaction.objectStore('user-documents');
                const index = store.index('type');
                const request = index.getAll(type);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Delete a document
     * @param {number} id - Document ID
     * @returns {Promise}
     */
    deleteDocument: function(id) {
        return this.init().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['user-documents'], 'readwrite');
                const store = transaction.objectStore('user-documents');
                const request = store.delete(id);

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
            });
        });
    },

    /**
     * Clear all stored data
     * @returns {Promise}
     */
    clearAllData: function() {
        return this.init().then(db => {
            return new Promise((resolve, reject) => {
                const storeNames = ['form-data', 'pending-submissions', 'user-documents'];
                const transaction = db.transaction(storeNames, 'readwrite');
                
                let completed = 0;
                let hasError = false;

                storeNames.forEach(storeName => {
                    const store = transaction.objectStore(storeName);
                    const request = store.clear();

                    request.onsuccess = () => {
                        completed++;
                        if (completed === storeNames.length && !hasError) {
                            resolve(true);
                        }
                    };

                    request.onerror = () => {
                        if (!hasError) {
                            hasError = true;
                            reject(request.error);
                        }
                    };
                });
            });
        });
    }
};

// Export the module
window.OfflineStorage = OfflineStorage;
