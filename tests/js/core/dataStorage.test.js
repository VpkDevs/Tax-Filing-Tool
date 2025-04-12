/**
 * Tests for the Data Storage functionality
 * 
 * This test suite defines how the data storage OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Data Storage', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        removeItem: function(key) {
          delete store[key];
        },
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Mock sessionStorage
    const sessionStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        removeItem: function(key) {
          delete store[key];
        },
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock
    });
    
    // Mock IndexedDB
    const indexedDBMock = {
      open: jest.fn().mockReturnValue({
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
        result: {
          createObjectStore: jest.fn(),
          transaction: jest.fn().mockReturnValue({
            objectStore: jest.fn().mockReturnValue({
              put: jest.fn().mockReturnValue({
                onsuccess: null,
                onerror: null
              }),
              get: jest.fn().mockReturnValue({
                onsuccess: null,
                onerror: null
              }),
              delete: jest.fn().mockReturnValue({
                onsuccess: null,
                onerror: null
              }),
              getAll: jest.fn().mockReturnValue({
                onsuccess: null,
                onerror: null
              })
            }),
            oncomplete: null,
            onerror: null
          })
        }
      })
    };
    
    Object.defineProperty(window, 'indexedDB', {
      value: indexedDBMock
    });
  });
  
  test('DataStorage should initialize with default settings', () => {
    // Initialize data storage
    window.DataStorage.init();
    
    // Verify that data storage was initialized
    expect(window.DataStorage.isInitialized).toBe(true);
    expect(window.DataStorage.storageType).toBe('localStorage');
    expect(window.DataStorage.encryptionEnabled).toBe(false);
  });
  
  test('DataStorage should store and retrieve data using localStorage', () => {
    // Initialize data storage
    window.DataStorage.init();
    
    // Store data
    const testData = { name: 'John Doe', age: 30 };
    window.DataStorage.setItem('testKey', testData);
    
    // Verify that data was stored in localStorage
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify(testData));
    
    // Retrieve data
    const retrievedData = window.DataStorage.getItem('testKey');
    
    // Verify that data was retrieved correctly
    expect(retrievedData).toEqual(testData);
  });
  
  test('DataStorage should store and retrieve data using sessionStorage', () => {
    // Initialize data storage with sessionStorage
    window.DataStorage.init({ storageType: 'sessionStorage' });
    
    // Store data
    const testData = { name: 'John Doe', age: 30 };
    window.DataStorage.setItem('testKey', testData);
    
    // Verify that data was stored in sessionStorage
    expect(sessionStorage.getItem('testKey')).toBe(JSON.stringify(testData));
    
    // Retrieve data
    const retrievedData = window.DataStorage.getItem('testKey');
    
    // Verify that data was retrieved correctly
    expect(retrievedData).toEqual(testData);
  });
  
  test('DataStorage should store and retrieve data using IndexedDB', (done) => {
    // Initialize data storage with IndexedDB
    window.DataStorage.init({ storageType: 'indexedDB' });
    
    // Store data
    const testData = { name: 'John Doe', age: 30 };
    
    window.DataStorage.setItem('testKey', testData)
      .then(() => {
        // Verify that IndexedDB.open was called
        expect(window.indexedDB.open).toHaveBeenCalled();
        
        // Retrieve data
        return window.DataStorage.getItem('testKey');
      })
      .then(retrievedData => {
        // Verify that data was retrieved correctly
        expect(retrievedData).toEqual(testData);
        done();
      })
      .catch(error => {
        done.fail(error);
      });
    
    // Simulate successful database open
    const openRequest = window.indexedDB.open.mock.results[0].value;
    openRequest.onsuccess({ target: { result: openRequest.result } });
    
    // Simulate successful transaction
    const transaction = openRequest.result.transaction.mock.results[0].value;
    transaction.oncomplete();
    
    // Simulate successful data retrieval
    const getRequest = transaction.objectStore.mock.results[0].value.get.mock.results[0].value;
    getRequest.onsuccess({ target: { result: testData } });
  });
  
  test('DataStorage should remove data', () => {
    // Initialize data storage
    window.DataStorage.init();
    
    // Store data
    const testData = { name: 'John Doe', age: 30 };
    window.DataStorage.setItem('testKey', testData);
    
    // Verify that data was stored
    expect(window.DataStorage.getItem('testKey')).toEqual(testData);
    
    // Remove data
    window.DataStorage.removeItem('testKey');
    
    // Verify that data was removed
    expect(window.DataStorage.getItem('testKey')).toBeNull();
    expect(localStorage.getItem('testKey')).toBeNull();
  });
  
  test('DataStorage should clear all data', () => {
    // Initialize data storage
    window.DataStorage.init();
    
    // Store multiple data items
    window.DataStorage.setItem('testKey1', { name: 'John Doe', age: 30 });
    window.DataStorage.setItem('testKey2', { name: 'Jane Doe', age: 28 });
    
    // Verify that data was stored
    expect(window.DataStorage.getItem('testKey1')).not.toBeNull();
    expect(window.DataStorage.getItem('testKey2')).not.toBeNull();
    
    // Clear all data
    window.DataStorage.clear();
    
    // Verify that all data was cleared
    expect(window.DataStorage.getItem('testKey1')).toBeNull();
    expect(window.DataStorage.getItem('testKey2')).toBeNull();
    expect(localStorage.getItem('testKey1')).toBeNull();
    expect(localStorage.getItem('testKey2')).toBeNull();
  });
  
  test('DataStorage should encrypt and decrypt data when encryption is enabled', () => {
    // Initialize data storage with encryption
    window.DataStorage.init({ encryptionEnabled: true, encryptionKey: 'secretKey123' });
    
    // Store data
    const testData = { name: 'John Doe', age: 30 };
    window.DataStorage.setItem('testKey', testData);
    
    // Verify that data was encrypted in localStorage
    const encryptedData = localStorage.getItem('testKey');
    expect(encryptedData).not.toBe(JSON.stringify(testData));
    expect(encryptedData).toContain('iv');
    expect(encryptedData).toContain('data');
    
    // Retrieve data
    const retrievedData = window.DataStorage.getItem('testKey');
    
    // Verify that data was decrypted correctly
    expect(retrievedData).toEqual(testData);
  });
  
  test('DataStorage should handle complex data types', () => {
    // Initialize data storage
    window.DataStorage.init();
    
    // Store complex data
    const complexData = {
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      },
      phoneNumbers: ['555-1234', '555-5678'],
      isActive: true,
      registrationDate: new Date('2023-01-15T12:00:00Z')
    };
    
    window.DataStorage.setItem('complexData', complexData);
    
    // Retrieve data
    const retrievedData = window.DataStorage.getItem('complexData');
    
    // Verify that complex data was stored and retrieved correctly
    expect(retrievedData.name).toBe(complexData.name);
    expect(retrievedData.age).toBe(complexData.age);
    expect(retrievedData.address.street).toBe(complexData.address.street);
    expect(retrievedData.address.city).toBe(complexData.address.city);
    expect(retrievedData.address.state).toBe(complexData.address.state);
    expect(retrievedData.address.zip).toBe(complexData.address.zip);
    expect(retrievedData.phoneNumbers).toEqual(complexData.phoneNumbers);
    expect(retrievedData.isActive).toBe(complexData.isActive);
    expect(new Date(retrievedData.registrationDate)).toEqual(complexData.registrationDate);
  });
  
  test('DataStorage should handle storage quota exceeded', () => {
    // Mock localStorage.setItem to throw quota exceeded error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn().mockImplementation((key, value) => {
      throw new Error('QuotaExceededError');
    });
    
    // Initialize data storage
    window.DataStorage.init();
    
    // Store large data
    const largeData = { data: 'x'.repeat(10 * 1024 * 1024) }; // 10MB of data
    
    // Verify that quota exceeded error is handled
    expect(() => {
      window.DataStorage.setItem('largeData', largeData);
    }).not.toThrow();
    
    // Verify that error callback was called
    expect(window.DataStorage.lastError).not.toBeNull();
    expect(window.DataStorage.lastError.message).toContain('QuotaExceededError');
    
    // Restore original localStorage.setItem
    localStorage.setItem = originalSetItem;
  });
  
  test('DataStorage should migrate data between storage types', () => {
    // Initialize data storage with localStorage
    window.DataStorage.init();
    
    // Store data in localStorage
    const testData = { name: 'John Doe', age: 30 };
    window.DataStorage.setItem('testKey', testData);
    
    // Verify that data was stored in localStorage
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify(testData));
    
    // Migrate to sessionStorage
    window.DataStorage.migrateStorage('sessionStorage');
    
    // Verify that data was migrated to sessionStorage
    expect(sessionStorage.getItem('testKey')).toBe(JSON.stringify(testData));
    expect(localStorage.getItem('testKey')).toBeNull();
    
    // Verify that storage type was updated
    expect(window.DataStorage.storageType).toBe('sessionStorage');
    
    // Retrieve data from new storage
    const retrievedData = window.DataStorage.getItem('testKey');
    
    // Verify that data can be retrieved from new storage
    expect(retrievedData).toEqual(testData);
  });
  
  test('DataStorage should handle data versioning', () => {
    // Initialize data storage with versioning
    window.DataStorage.init({ versioning: true });
    
    // Store data with version 1
    const dataV1 = { name: 'John Doe', age: 30 };
    window.DataStorage.setItem('testKey', dataV1);
    
    // Verify that data was stored with version
    const storedData = JSON.parse(localStorage.getItem('testKey'));
    expect(storedData.__version).toBe(1);
    expect(storedData.data).toEqual(dataV1);
    
    // Update data to version 2
    const dataV2 = { name: 'John Doe', age: 31 };
    window.DataStorage.setItem('testKey', dataV2);
    
    // Verify that data was updated with new version
    const updatedData = JSON.parse(localStorage.getItem('testKey'));
    expect(updatedData.__version).toBe(2);
    expect(updatedData.data).toEqual(dataV2);
    
    // Retrieve data
    const retrievedData = window.DataStorage.getItem('testKey');
    
    // Verify that data was retrieved correctly
    expect(retrievedData).toEqual(dataV2);
    
    // Get version history
    const versionHistory = window.DataStorage.getVersionHistory('testKey');
    
    // Verify that version history contains both versions
    expect(versionHistory.length).toBe(2);
    expect(versionHistory[0].version).toBe(1);
    expect(versionHistory[0].data).toEqual(dataV1);
    expect(versionHistory[1].version).toBe(2);
    expect(versionHistory[1].data).toEqual(dataV2);
    
    // Revert to version 1
    window.DataStorage.revertToVersion('testKey', 1);
    
    // Verify that data was reverted to version 1
    const revertedData = window.DataStorage.getItem('testKey');
    expect(revertedData).toEqual(dataV1);
  });
});
