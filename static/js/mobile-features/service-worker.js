/**
 * Service Worker registration and management
 */

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/static/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('Service Worker update found!');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });

                    // Listen for messages from the Service Worker
                    navigator.serviceWorker.addEventListener('message', event => {
                        if (event.data && event.data.type === 'SYNC_COMPLETE') {
                            showSyncNotification(event.data.message);
                        }
                    });
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }

    /**
     * Show notification when an update is available
     */
    function showUpdateNotification() {
        // Create update notification
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <div class="update-icon"><i class="fas fa-sync-alt"></i></div>
            <div class="update-message">
                <h3>Update Available</h3>
                <p>A new version is available. Refresh to update.</p>
            </div>
            <div class="update-actions">
                <button class="update-now">Update Now</button>
                <button class="update-later">Later</button>
            </div>
        `;
        updateNotification.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--primary);
            color: white;
            padding: 15px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            z-index: 9999;
            transform: translateY(100%);
            transition: transform 0.3s ease-out;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(updateNotification);

        // Style the notification elements
        updateNotification.querySelector('.update-icon').style.cssText = `
            margin-right: 15px;
            font-size: 24px;
        `;

        updateNotification.querySelector('.update-message').style.cssText = `
            flex: 1;
        `;

        updateNotification.querySelector('h3').style.cssText = `
            margin: 0;
            font-size: 16px;
            font-weight: bold;
        `;

        updateNotification.querySelector('p').style.cssText = `
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
        `;

        updateNotification.querySelector('.update-actions').style.cssText = `
            display: flex;
            gap: 10px;
            margin-left: 15px;
        `;

        const buttonStyle = `
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border: none;
        `;

        updateNotification.querySelector('.update-now').style.cssText = `
            ${buttonStyle}
            background-color: white;
            color: var(--primary);
        `;

        updateNotification.querySelector('.update-later').style.cssText = `
            ${buttonStyle}
            background-color: transparent;
            color: white;
            border: 1px solid white;
        `;

        // Show notification
        setTimeout(() => {
            updateNotification.style.transform = 'translateY(0)';
        }, 1000);

        // Add button event listeners
        updateNotification.querySelector('.update-now').addEventListener('click', () => {
            window.location.reload();
        });

        updateNotification.querySelector('.update-later').addEventListener('click', () => {
            updateNotification.style.transform = 'translateY(100%)';
            setTimeout(() => {
                updateNotification.remove();
            }, 300);
        });
    }

    /**
     * Show notification when background sync completes
     */
    function showSyncNotification(message) {
        // Create sync notification
        const notification = document.createElement('div');
        notification.className = 'sync-notification';
        notification.innerHTML = `
            <div class="sync-icon"><i class="fas fa-check-circle"></i></div>
            <div class="sync-message">${message || 'Your data has been successfully submitted.'}</div>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--success);
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
        notification.querySelector('.sync-icon').style.cssText = `
            margin-right: 10px;
            font-size: 20px;
        `;

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';

            // Provide haptic feedback
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(100);
            }
        }, 10);

        // Hide and remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Export the function
window.registerServiceWorker = registerServiceWorker;
