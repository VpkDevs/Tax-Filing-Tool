// Service Worker for Tax Filing Tool
const CACHE_NAME = 'tax-filing-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/css/modules/walkthrough.css',
  '/static/css/modules/beginner-walkthrough.css',
  '/static/css/modules/beginner-intro.css',
  '/static/css/modules/forms.css',
  '/static/css/modules/calculator.css',
  '/static/css/modules/virtual-assistant.css',
  '/static/css/modules/document-analyzer.css',
  '/static/css/modules/micro-steps.css',
  '/static/css/time-estimates.css',
  '/static/css/mobile-responsive.css',
  '/static/css/claim-process-tracker.css',
  '/static/js/main.js',
  '/static/js/mobile-touch.js',
  '/static/js/core/dataStorage.js',
  '/static/js/core/formValidator.js',
  '/static/js/core/taxLogic.js',
  '/static/js/features/autoFill.js',
  '/static/js/features/claimProcessTracker.js',
  '/static/js/features/filingSteps.js',
  '/static/js/features/paymentMethods.js',
  '/static/js/features/eligibilityChecker.js',
  '/static/js/modules/progress-tracker.js',
  '/static/js/features/rebateCalculator.js',
  '/static/js/tax-filing-app.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        // Clone the request - request can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response - response can only be used once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'tax-form-submission') {
    event.waitUntil(syncFormData());
  }
});

// Function to sync form data when online
async function syncFormData() {
  const dataToSync = await getDataFromIndexedDB('pending-submissions');
  
  if (dataToSync && dataToSync.length > 0) {
    try {
      // Attempt to send each pending submission
      for (const submission of dataToSync) {
        await fetch('/api/submit-tax-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submission.data)
        });
        
        // If successful, remove from pending
        await removeFromIndexedDB('pending-submissions', submission.id);
      }
      
      // Notify all clients that sync is complete
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          message: 'All pending submissions have been processed'
        });
      });
    } catch (error) {
      console.error('Sync failed:', error);
      // Will retry on next sync event
    }
  }
}

// IndexedDB helper functions
async function getDataFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TaxFilingDB', 1);
    
    request.onerror = event => reject(event.target.error);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

async function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TaxFilingDB', 1);
    
    request.onerror = event => reject(event.target.error);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}
