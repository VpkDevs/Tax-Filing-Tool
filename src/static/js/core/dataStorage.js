/**
 * Data Storage Module
 * 
 * Handles storing and retrieving data using various storage mechanisms
 * (localStorage, sessionStorage, IndexedDB) with optional encryption.
 */

const DataStorage = {
    isInitialized: false,
    storageType: 'localStorage',
    encryptionEnabled: false,
    encryptionKey: null,
    lastError: null,
    
    /**
     * Initialize the data storage module
     * @param {Object} options - Configuration options
     * @param {string} options.storageType - Storage type ('localStorage', 'sessionStorage', 'indexedDB')
     * @param {boolean} options.encryptionEnabled - Whether to encrypt data
     * @param {string} options.encryptionKey - Key to use for encryption
     */
    init: function(options = {}) {
        this.storageType = options.storageType || 'localStorage';
        this.encryptionEnabled = options.encryptionEnabled || false;
        this.encryptionKey = options.encryptionKey || null;
        
        if (this.storageType === 'indexedDB') {
            this.initIndexedDB();
        }
        
        this.isInitialized = true;
        console.log(`Data Storage initialized with ${this.storageType}`);
    },
    
    /**
     * Initialize IndexedDB
     * @private
     */
    initIndexedDB: function() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open('taxFilingToolDB', 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('userData')) {
                    db.createObjectStore('userData', { keyPath: 'key' });
                }
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            
            request.onerror = (event) => {
                this.lastError = new Error('Failed to initialize IndexedDB');
                console.error('IndexedDB initialization failed:', event.target.error);
                reject(event.target.error);
            };
        });
    },
    
    /**
     * Store an item in storage
     * @param {string} key - The key to store the data under
     * @param {any} value - The data to store
     * @returns {Promise|void} - Promise for IndexedDB, void for other storage types
     */
    setItem: function(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            const dataToStore = this.encryptionEnabled ? 
                this.encrypt(serializedValue) : serializedValue;
            
            if (this.storageType === 'localStorage') {
                localStorage.setItem(key, dataToStore);
                return true;
            } else if (this.storageType === 'sessionStorage') {
                sessionStorage.setItem(key, dataToStore);
                return true;
            } else if (this.storageType === 'indexedDB') {
                return this.setItemIndexedDB(key, dataToStore);
            }
        } catch (error) {
            this.lastError = error;
            console.error('Error storing data:', error);
            return false;
        }
    },
    
    /**
     * Store an item in IndexedDB
     * @private
     * @param {string} key - The key to store the data under
     * @param {string} value - The serialized data to store
     * @returns {Promise} - Promise that resolves when data is stored
     */
    setItemIndexedDB: function(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userData'], 'readwrite');
            const store = transaction.objectStore('userData');
            const request = store.put({ key, value });
            
            request.onsuccess = () => resolve(true);
            
            request.onerror = (event) => {
                this.lastError = new Error('Failed to store data in IndexedDB');
                console.error('IndexedDB storage failed:', event.target.error);
                reject(event.target.error);
            };
        });
    },
    
    /**
     * Retrieve an item from storage
     * @param {string} key - The key to retrieve data for
     * @returns {Promise|any} - The retrieved data, or null if not found
     */
    getItem: function(key) {
        try {
            if (this.storageType === 'localStorage') {
                const data = localStorage.getItem(key);
                if (!data) return null;
                
                return this.encryptionEnabled ? 
                    JSON.parse(this.decrypt(data)) : JSON.parse(data);
            } else if (this.storageType === 'sessionStorage') {
                const data = sessionStorage.getItem(key);
                if (!data) return null;
                
                return this.encryptionEnabled ? 
                    JSON.parse(this.decrypt(data)) : JSON.parse(data);
            } else if (this.storageType === 'indexedDB') {
                return this.getItemIndexedDB(key).then(data => {
                    if (!data) return null;
                    return this.encryptionEnabled ? 
                        JSON.parse(this.decrypt(data)) : JSON.parse(data);
                });
            }
        } catch (error) {
            this.lastError = error;
            console.error('Error retrieving data:', error);
            return null;
        }
    },
    
    /**
     * Retrieve an item from IndexedDB
     * @private
     * @param {string} key - The key to retrieve data for
     * @returns {Promise} - Promise that resolves with the retrieved data
     */
    getItemIndexedDB: function(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userData'], 'readonly');
            const store = transaction.objectStore('userData');
            const request = store.get(key);
            
            request.onsuccess = (event) => {
                const result = event.target.result;
                resolve(result ? result.value : null);
            };
            
            request.onerror = (event) => {
                this.lastError = new Error('Failed to retrieve data from IndexedDB');
                console.error('IndexedDB retrieval failed:', event.target.error);
                reject(event.target.error);
            };
        });
    },
    
    /**
     * Remove an item from storage
     * @param {string} key - The key to remove
     * @returns {Promise|boolean} - Whether the operation was successful
     */
    removeItem: function(key) {
        try {
            if (this.storageType === 'localStorage') {
                localStorage.removeItem(key);
                return true;
            } else if (this.storageType === 'sessionStorage') {
                sessionStorage.removeItem(key);
                return true;
            } else if (this.storageType === 'indexedDB') {
                return this.removeItemIndexedDB(key);
            }
        } catch (error) {
            this.lastError = error;
            console.error('Error removing data:', error);
            return false;
        }
    },
    
    /**
     * Remove an item from IndexedDB
     * @private
     * @param {string} key - The key to remove
     * @returns {Promise} - Promise that resolves when data is removed
     */
    removeItemIndexedDB: function(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userData'], 'readwrite');
            const store = transaction.objectStore('userData');
            const request = store.delete(key);
            
            request.onsuccess = () => resolve(true);
            
            request.onerror = (event) => {
                this.lastError = new Error('Failed to remove data from IndexedDB');
                console.error('IndexedDB removal failed:', event.target.error);
                reject(event.target.error);
            };
        });
    },
    
    /**
     * Clear all data from storage
     * @returns {Promise|boolean} - Whether the operation was successful
     */
    clear: function() {
        try {
            if (this.storageType === 'localStorage') {
                localStorage.clear();
                return true;
            } else if (this.storageType === 'sessionStorage') {
                sessionStorage.clear();
                return true;
            } else if (this.storageType === 'indexedDB') {
                return this.clearIndexedDB();
            }
        } catch (error) {
            this.lastError = error;
            console.error('Error clearing data:', error);
            return false;
        }
    },
    
    /**
     * Clear all data from IndexedDB
     * @private
     * @returns {Promise} - Promise that resolves when data is cleared
     */
    clearIndexedDB: function() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userData'], 'readwrite');
            const store = transaction.objectStore('userData');
            const request = store.clear();
            
            request.onsuccess = () => resolve(true);
            
            request.onerror = (event) => {
                this.lastError = new Error('Failed to clear data from IndexedDB');
                console.error('IndexedDB clear failed:', event.target.error);
                reject(event.target.error);
            };
        });
    },
    
    /**
     * Migrate data from one storage type to another
     * @param {string} newStorageType - The storage type to migrate to
     * @returns {Promise|boolean} - Whether the operation was successful
     */
    migrateStorage: function(newStorageType) {
        if (newStorageType === this.storageType) {
            return true;
        }
        
        try {
            // Get all data from current storage
            const data = this.getAllData();
            
            // Change storage type
            const oldStorageType = this.storageType;
            this.storageType = newStorageType;
            
            // Initialize new storage if needed
            if (newStorageType === 'indexedDB' && !this.db) {
                return this.initIndexedDB().then(() => {
                    // Store all data in new storage
                    return this.storeAllData(data).then(() => {
                        // Clear old storage
                        this.clearOldStorage(oldStorageType);
                        return true;
                    });
                });
            } else {
                // Store all data in new storage
                const result = this.storeAllData(data);
                
                // Clear old storage
                this.clearOldStorage(oldStorageType);
                
                return result;
            }
        } catch (error) {
            this.lastError = error;
            console.error('Error migrating storage:', error);
            return false;
        }
    },
    
    /**
     * Get all data from current storage
     * @private
     * @returns {Object} - All stored data
     */
    getAllData: function() {
        const data = {};
        
        if (this.storageType === 'localStorage') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = this.getItem(key);
            }
        } else if (this.storageType === 'sessionStorage') {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                data[key] = this.getItem(key);
            }
        } else if (this.storageType === 'indexedDB') {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['userData'], 'readonly');
                const store = transaction.objectStore('userData');
                const request = store.getAll();
                
                request.onsuccess = (event) => {
                    const result = event.target.result;
                    result.forEach(item => {
                        data[item.key] = this.encryptionEnabled ? 
                            JSON.parse(this.decrypt(item.value)) : JSON.parse(item.value);
                    });
                    resolve(data);
                };
                
                request.onerror = (event) => {
                    this.lastError = new Error('Failed to get all data from IndexedDB');
                    console.error('IndexedDB getAll failed:', event.target.error);
                    reject(event.target.error);
                };
            });
        }
        
        return data;
    },
    
    /**
     * Store all data in new storage
     * @private
     * @param {Object} data - All data to store
     * @returns {Promise|boolean} - Whether the operation was successful
     */
    storeAllData: function(data) {
        if (data instanceof Promise) {
            return data.then(resolvedData => {
                for (const key in resolvedData) {
                    this.setItem(key, resolvedData[key]);
                }
                return true;
            });
        } else {
            for (const key in data) {
                this.setItem(key, data[key]);
            }
            return true;
        }
    },
    
    /**
     * Clear old storage
     * @private
     * @param {string} storageType - The storage type to clear
     */
    clearOldStorage: function(storageType) {
        if (storageType === 'localStorage') {
            localStorage.clear();
        } else if (storageType === 'sessionStorage') {
            sessionStorage.clear();
        } else if (storageType === 'indexedDB') {
            const request = window.indexedDB.deleteDatabase('taxFilingToolDB');
            request.onsuccess = () => console.log('Old IndexedDB database deleted');
            request.onerror = (event) => console.error('Error deleting old IndexedDB database:', event.target.error);
        }
    },
    
    /**
     * Encrypt data
     * @private
     * @param {string} data - The data to encrypt
     * @returns {string} - The encrypted data
     */
    encrypt: function(data) {
        if (!this.encryptionEnabled || !this.encryptionKey) {
            return data;
        }
        
        try {
            // Simple XOR encryption for demonstration
            // In a real application, use a proper encryption library
            const iv = this.generateRandomString(16);
            let encrypted = '';
            
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                encrypted += String.fromCharCode(charCode);
            }
            
            return JSON.stringify({
                iv: iv,
                data: btoa(encrypted)
            });
        } catch (error) {
            this.lastError = error;
            console.error('Encryption failed:', error);
            return data;
        }
    },
    
    /**
     * Decrypt data
     * @private
     * @param {string} encryptedData - The data to decrypt
     * @returns {string} - The decrypted data
     */
    decrypt: function(encryptedData) {
        if (!this.encryptionEnabled || !this.encryptionKey) {
            return encryptedData;
        }
        
        try {
            const { iv, data } = JSON.parse(encryptedData);
            const encrypted = atob(data);
            let decrypted = '';
            
            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                decrypted += String.fromCharCode(charCode);
            }
            
            return decrypted;
        } catch (error) {
            this.lastError = error;
            console.error('Decryption failed:', error);
            return encryptedData;
        }
    },
    
    /**
     * Generate a random string
     * @private
     * @param {number} length - The length of the string to generate
     * @returns {string} - The generated string
     */
    generateRandomString: function(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    },
    
    /**
     * Get version history for a key
     * @param {string} key - The key to get version history for
     * @returns {Array} - The version history
     */
    getVersionHistory: function(key) {
        const historyKey = `${key}_history`;
        return this.getItem(historyKey) || [];
    },
    
    /**
     * Revert to a specific version
     * @param {string} key - The key to revert
     * @param {number} version - The version to revert to
     * @returns {boolean} - Whether the operation was successful
     */
    revertToVersion: function(key, version) {
        const history = this.getVersionHistory(key);
        const versionData = history.find(item => item.version === version);
        
        if (versionData) {
            this.setItem(key, versionData.data);
            return true;
        }
        
        return false;
    }
};

// Export the module
window.DataStorage = DataStorage;
