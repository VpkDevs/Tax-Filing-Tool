/**
 * Offline detection and handling
 * Provides feedback and functionality when device goes offline
 */

function initOfflineDetection() {
    let isOnline = navigator.onLine;
    let offlineIndicator = null;
    let offlineBanner = null;
    
    // Create offline indicator
    createOfflineIndicator();
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection status periodically
    setInterval(checkConnection, 30000);
    
    // Initial check
    updateOfflineStatus(isOnline);
    
    /**
     * Create the offline indicator elements
     */
    function createOfflineIndicator() {
        // Create small indicator for status bar
        offlineIndicator = document.createElement('div');
        offlineIndicator.className = 'offline-indicator';
        offlineIndicator.innerHTML = '<i class="fas fa-wifi"></i>';
        offlineIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: var(--danger);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transform: scale(0);
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(offlineIndicator);
        
        // Create banner for offline notification
        offlineBanner = document.createElement('div');
        offlineBanner.className = 'offline-banner';
        offlineBanner.innerHTML = `
            <div class="offline-icon"><i class="fas fa-wifi"></i></div>
            <div class="offline-message">
                <h3>You're offline</h3>
                <p>Don't worry, your data is saved and will be submitted when you're back online.</p>
            </div>
            <button class="offline-close"><i class="fas fa-times"></i></button>
        `;
        offlineBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: var(--danger);
            color: white;
            padding: 10px 15px;
            display: flex;
            align-items: center;
            z-index: 9998;
            transform: translateY(-100%);
            transition: transform 0.3s ease-out;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(offlineBanner);
        
        // Style the banner elements
        const iconStyle = `
            font-size: 24px;
            margin-right: 15px;
        `;
        offlineBanner.querySelector('.offline-icon').style.cssText = iconStyle;
        
        const messageStyle = `
            flex: 1;
        `;
        offlineBanner.querySelector('.offline-message').style.cssText = messageStyle;
        
        const titleStyle = `
            margin: 0;
            font-size: 16px;
            font-weight: bold;
        `;
        offlineBanner.querySelector('h3').style.cssText = titleStyle;
        
        const textStyle = `
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
        `;
        offlineBanner.querySelector('p').style.cssText = textStyle;
        
        const closeStyle = `
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 5px;
        `;
        const closeButton = offlineBanner.querySelector('.offline-close');
        closeButton.style.cssText = closeStyle;
        
        // Add close button functionality
        closeButton.addEventListener('click', () => {
            offlineBanner.style.transform = 'translateY(-100%)';
        });
    }
    
    /**
     * Handle online event
     */
    function handleOnline() {
        isOnline = true;
        updateOfflineStatus(true);
        
        // Show online notification
        showNotification('You\'re back online!', 'success');
        
        // Sync any pending form submissions
        syncPendingData();
    }
    
    /**
     * Handle offline event
     */
    function handleOffline() {
        isOnline = false;
        updateOfflineStatus(false);
        
        // Provide haptic feedback
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([50, 100, 50]);
        }
    }
    
    /**
     * Update UI based on connection status
     */
    function updateOfflineStatus(online) {
        if (online) {
            // Online state
            document.body.classList.remove('offline-mode');
            offlineIndicator.style.opacity = '0';
            offlineIndicator.style.transform = 'scale(0)';
            offlineBanner.style.transform = 'translateY(-100%)';
            
            // Enable submit buttons
            document.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(button => {
                button.disabled = false;
                button.title = '';
            });
        } else {
            // Offline state
            document.body.classList.add('offline-mode');
            offlineIndicator.style.opacity = '1';
            offlineIndicator.style.transform = 'scale(1)';
            offlineBanner.style.transform = 'translateY(0)';
            
            // Disable submit buttons with message
            document.querySelectorAll('button[type="submit"], input[type="submit"]').forEach(button => {
                button.disabled = true;
                button.title = 'You\'re offline. Your data will be saved and submitted when you\'re back online.';
            });
        }
    }
    
    /**
     * Check connection by making a small fetch request
     */
    function checkConnection() {
        // Only check if we think we're online
        if (navigator.onLine) {
            fetch('/ping.txt', { 
                method: 'HEAD',
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            })
            .then(() => {
                if (!isOnline) {
                    isOnline = true;
                    updateOfflineStatus(true);
                    showNotification('Connection restored!', 'success');
                    syncPendingData();
                }
            })
            .catch(() => {
                if (isOnline) {
                    isOnline = false;
                    updateOfflineStatus(false);
                }
            });
        }
    }
    
    /**
     * Sync pending form submissions
     */
    function syncPendingData() {
        // Check if we have the OfflineStorage module
        if (window.OfflineStorage) {
            // Attempt to sync pending submissions
            console.log('Syncing pending submissions...');
            
            // Register for background sync if available
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.sync.register('tax-form-submission')
                        .then(() => console.log('Background sync registered'))
                        .catch(err => console.error('Background sync registration failed:', err));
                });
            }
        }
    }
    
    /**
     * Show a notification message
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transition: transform 0.3s ease-out;
            max-width: 90%;
        `;
        document.body.appendChild(notification);
        
        // Style the notification elements
        notification.querySelector('.notification-icon').style.cssText = `
            margin-right: 10px;
            font-size: 20px;
        `;
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Hide and remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Create a ping.txt file for connection testing
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
            const pingBlob = new Blob(['pong'], { type: 'text/plain' });
            caches.open('tax-filing-cache-v1').then(cache => {
                cache.put('/ping.txt', new Response(pingBlob));
            });
        });
    }
}

// Export the function
window.initOfflineDetection = initOfflineDetection;
