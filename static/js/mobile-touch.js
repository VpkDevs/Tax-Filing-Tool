/**
 * Enhanced Mobile Touch Interactions
 * Provides advanced touch interactions for a flawless mobile experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        console.log('Touch device detected, initializing enhanced mobile touch interactions...');
        document.body.classList.add('touch-device');

        // Initialize touch feedback with haptics
        initTouchFeedback();

        // Initialize advanced swipe detection
        initAdvancedSwipeDetection();

        // Fix iOS 100vh issue
        fixIOSViewportHeight();

        // Optimize for orientation changes
        initOrientationHandler();

        // Fix position:fixed elements on iOS
        fixPositionFixedElements();

        // Prevent double-tap zoom on buttons and links
        preventDoubleTapZoom();

        // Add touch-specific classes
        addTouchClasses();

        // Initialize pull-to-refresh
        initPullToRefresh();

        // Initialize pinch-to-zoom for documents
        initPinchToZoom();

        // Initialize form persistence
        initFormPersistence();

        // Initialize offline mode detection
        initOfflineDetection();

        // Register service worker if supported
        registerServiceWorker();
    }
});

/**
 * Adds enhanced visual and haptic feedback when elements are touched
 */
function initTouchFeedback() {
    // Add touch-active class on touch start with haptic feedback
    document.addEventListener('touchstart', function(e) {
        const target = e.target.closest('button, .btn, .card, .clickable, a, input[type="checkbox"], input[type="radio"]');
        if (target) {
            target.classList.add('touch-active');

            // Provide haptic feedback if available
            if (window.navigator && window.navigator.vibrate) {
                // Subtle vibration (10ms)
                window.navigator.vibrate(10);
            }
        }
    }, { passive: true });

    // Remove touch-active class on touch end or cancel
    ['touchend', 'touchcancel'].forEach(eventType => {
        document.addEventListener(eventType, function() {
            document.querySelectorAll('.touch-active').forEach(el => {
                el.classList.remove('touch-active');
            });
        }, { passive: true });
    });

    // Add special feedback for form submissions and errors
    document.addEventListener('submit', function(e) {
        // Stronger vibration for form submission (50ms)
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    });

    // Add haptic feedback for validation errors
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('has-error') && !target.dataset.errorFeedbackGiven) {
                    // Error pattern vibration (error feedback)
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate([30, 50, 30]);
                    }
                    target.dataset.errorFeedbackGiven = 'true';

                    // Reset the flag when error is fixed
                    if (target.classList.contains('form-group')) {
                        const input = target.querySelector('input, select, textarea');
                        if (input) {
                            input.addEventListener('input', function() {
                                if (!target.classList.contains('has-error')) {
                                    delete target.dataset.errorFeedbackGiven;
                                }
                            });
                        }
                    }
                }
            }
        });
    });

    // Observe all form groups for validation errors
    document.querySelectorAll('.form-group').forEach(formGroup => {
        observer.observe(formGroup, { attributes: true });
    });
}

/**
 * Initializes advanced swipe detection for UI elements
 */
function initAdvancedSwipeDetection() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let touchEndTime = 0;
    let currentTouchTarget = null;

    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeTimeThreshold = 300; // Maximum time for a swipe (ms)
    const swipeRestrictedElements = ['INPUT', 'SELECT', 'TEXTAREA', 'RANGE', 'CHECKBOX', 'RADIO', 'SLIDER']; // Elements where swiping should be restricted

    // Track touch start position and time
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = new Date().getTime();
        currentTouchTarget = e.target;
    }, { passive: true });

    // Track touch end position and time, then determine swipe direction
    document.addEventListener('touchend', function(e) {
        // Don't process swipes on form elements
        if (shouldRestrictSwipe(currentTouchTarget)) {
            return;
        }

        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        touchEndTime = new Date().getTime();

        handleSwipe();
    }, { passive: true });

    function shouldRestrictSwipe(element) {
        if (!element) return false;

        // Check if element or any parent is a restricted element
        let currentElement = element;
        while (currentElement) {
            if (swipeRestrictedElements.includes(currentElement.tagName) ||
                currentElement.classList.contains('no-swipe')) {
                return true;
            }

            // Check for special cases like sliders, document viewers, etc.
            if (currentElement.classList.contains('slider') ||
                currentElement.classList.contains('document-viewer') ||
                currentElement.classList.contains('calculator-display')) {
                return true;
            }

            currentElement = currentElement.parentElement;
        }

        return false;
    }

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const swipeTime = touchEndTime - touchStartTime;

        // Only process quick swipes (under the time threshold)
        if (swipeTime > swipeTimeThreshold) {
            return;
        }

        // Calculate swipe velocity (pixels per ms)
        const velocityX = Math.abs(deltaX) / swipeTime;
        const velocityY = Math.abs(deltaY) / swipeTime;

        // Determine if horizontal or vertical swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            // Horizontal swipe
            if (deltaX > 0) {
                // Right swipe - handle navigation
                handleRightSwipe(velocityX);
            } else {
                // Left swipe - handle navigation
                handleLeftSwipe(velocityX);
            }
        } else if (Math.abs(deltaY) > swipeThreshold) {
            // Vertical swipe
            if (deltaY > 0) {
                // Down swipe - collapse sections, close modals
                handleDownSwipe(velocityY);
            } else {
                // Up swipe - expand sections
                handleUpSwipe(velocityY);
            }
        }
    }

    function handleRightSwipe(velocity) {
        // Handle right swipe - typically "back" or "previous"
        const prevButtons = document.querySelectorAll('.prev-step:not([disabled]), .back-btn:not([disabled])');
        if (prevButtons.length > 0) {
            // Find the visible prev button
            for (const btn of prevButtons) {
                if (isElementVisible(btn)) {
                    // Add swipe animation
                    animateSwipeTransition('right');
                    // Provide haptic feedback
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(15);
                    }
                    btn.click();
                    break;
                }
            }
        }

        // Handle tab navigation if in a tabbed interface
        const activeTabs = document.querySelectorAll('.tab-content.active');
        activeTabs.forEach(activeTab => {
            const tabContainer = activeTab.closest('.tabs-container');
            if (tabContainer) {
                const allTabs = tabContainer.querySelectorAll('.tab-content');
                const activeIndex = Array.from(allTabs).indexOf(activeTab);
                if (activeIndex > 0) {
                    const prevTab = allTabs[activeIndex - 1];
                    const prevTabBtn = tabContainer.querySelector(`[data-tab="${prevTab.id}"]`);
                    if (prevTabBtn) {
                        animateSwipeTransition('right');
                        prevTabBtn.click();
                    }
                }
            }
        });
    }

    function handleLeftSwipe(velocity) {
        // Handle left swipe - typically "next" or "continue"
        const nextButtons = document.querySelectorAll('.next-step:not([disabled]), .continue-btn:not([disabled])');
        if (nextButtons.length > 0) {
            // Find the visible next button
            for (const btn of nextButtons) {
                if (isElementVisible(btn)) {
                    // Add swipe animation
                    animateSwipeTransition('left');
                    // Provide haptic feedback
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(15);
                    }
                    btn.click();
                    break;
                }
            }
        }

        // Handle tab navigation if in a tabbed interface
        const activeTabs = document.querySelectorAll('.tab-content.active');
        activeTabs.forEach(activeTab => {
            const tabContainer = activeTab.closest('.tabs-container');
            if (tabContainer) {
                const allTabs = tabContainer.querySelectorAll('.tab-content');
                const activeIndex = Array.from(allTabs).indexOf(activeTab);
                if (activeIndex < allTabs.length - 1) {
                    const nextTab = allTabs[activeIndex + 1];
                    const nextTabBtn = tabContainer.querySelector(`[data-tab="${nextTab.id}"]`);
                    if (nextTabBtn) {
                        animateSwipeTransition('left');
                        nextTabBtn.click();
                    }
                }
            }
        });
    }

    function handleUpSwipe(velocity) {
        // Handle up swipe - expand accordion, scroll to top
        const accordionHeaders = document.querySelectorAll('.accordion-header:not(.active)');
        let handled = false;

        // Find visible accordion headers and expand them
        for (const header of accordionHeaders) {
            if (isElementInViewport(header)) {
                header.click();
                handled = true;
                break;
            }
        }

        // If no accordion was handled and swipe was fast, scroll to top
        if (!handled && velocity > 1.5) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function handleDownSwipe(velocity) {
        // Handle down swipe - collapse accordion, close modals
        const activeAccordions = document.querySelectorAll('.accordion-header.active');
        let handled = false;

        // Find visible active accordion headers and collapse them
        for (const header of activeAccordions) {
            if (isElementInViewport(header)) {
                header.click();
                handled = true;
                break;
            }
        }

        // Close any open modals
        const openModals = document.querySelectorAll('.modal.open');
        if (openModals.length > 0) {
            const closeButtons = document.querySelectorAll('.modal.open .close-modal');
            if (closeButtons.length > 0) {
                closeButtons[0].click();
                handled = true;
            }
        }
    }

    function animateSwipeTransition(direction) {
        // Create and append a temporary animation overlay
        const overlay = document.createElement('div');
        overlay.className = `swipe-transition-overlay swipe-${direction}`;
        document.body.appendChild(overlay);

        // Remove after animation completes
        setTimeout(() => {
            overlay.remove();
        }, 500);
    }

    function isElementVisible(el) {
        if (!el) return false;

        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function isElementInViewport(el) {
        if (!el) return false;

        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Add swipe transition styles
    const style = document.createElement('style');
    style.textContent = `
        .swipe-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            animation: swipeTransition 0.5s ease-out;
        }

        .swipe-left {
            background: linear-gradient(to left, rgba(var(--primary-rgb), 0.1), transparent);
        }

        .swipe-right {
            background: linear-gradient(to right, rgba(var(--primary-rgb), 0.1), transparent);
        }

        @keyframes swipeTransition {
            0% { opacity: 0.3; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Fixes the iOS 100vh issue
 */
function fixIOSViewportHeight() {
    // iOS doesn't handle 100vh correctly, this fixes it
    function setVhProperty() {
        // Set a CSS variable with the actual viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set on initial load
    setVhProperty();

    // Update on resize and orientation change
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', setVhProperty);

    // Add CSS to use the variable
    const style = document.createElement('style');
    style.textContent = `
        .full-height {
            height: 100vh; /* Fallback */
            height: calc(var(--vh, 1vh) * 100);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Handles orientation changes
 */
function initOrientationHandler() {
    function handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;

        if (isLandscape) {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        } else {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        }

        // Adjust UI elements based on orientation
        adjustUIForOrientation(isLandscape);
    }

    // Initial check
    handleOrientationChange();

    // Listen for changes
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
}

/**
 * Adjusts UI elements based on orientation
 */
function adjustUIForOrientation(isLandscape) {
    // Adjust calculator layout
    const calculator = document.querySelector('.calculator');
    if (calculator && isLandscape) {
        calculator.classList.add('landscape-mode');
    } else if (calculator) {
        calculator.classList.remove('landscape-mode');
    }

    // Adjust filing tool layout
    const filingTool = document.querySelector('.filing-tool');
    if (filingTool && isLandscape) {
        filingTool.classList.add('landscape-mode');
    } else if (filingTool) {
        filingTool.classList.remove('landscape-mode');
    }
}

/**
 * Fixes position:fixed elements on iOS
 */
function fixPositionFixedElements() {
    // iOS has issues with position:fixed during scroll
    // This adds a class to help with that
    const fixedElements = document.querySelectorAll('.filing-progress, .virtual-assistant-button, #virtual-assistant-container');

    fixedElements.forEach(el => {
        el.classList.add('fixed-element');
    });
}

/**
 * Prevents double-tap zoom on buttons and links
 */
function preventDoubleTapZoom() {
    // Add touch-action: manipulation to prevent double-tap zoom
    const style = document.createElement('style');
    style.textContent = `
        button, .btn, a, .clickable {
            touch-action: manipulation;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Adds touch-specific classes to elements
 */
function addTouchClasses() {
    // Add touch-target class to interactive elements
    const touchTargets = document.querySelectorAll('button, .btn, a, input[type="checkbox"], input[type="radio"], select, .clickable');

    touchTargets.forEach(el => {
        el.classList.add('touch-target');
    });

    // Add smooth-scroll class to scrollable elements
    const scrollableElements = document.querySelectorAll('.filing-step, .walkthrough-content, .modal-content, .calculator');

    scrollableElements.forEach(el => {
        el.classList.add('smooth-scroll');
    });
}

/**
 * Initialize pull-to-refresh
 */
function initPullToRefresh() {
    // Load and execute the pull-to-refresh module
    if (window.initPullToRefresh) {
        window.initPullToRefresh();
    } else {
        // Dynamically load the module
        const script = document.createElement('script');
        script.src = '/static/js/mobile-features/pull-to-refresh.js';
        script.onload = () => window.initPullToRefresh();
        document.head.appendChild(script);
    }
}

/**
 * Initialize pinch-to-zoom for documents
 */
function initPinchToZoom() {
    // Load and execute the pinch-zoom module
    if (window.initPinchToZoom) {
        window.initPinchToZoom();
    } else {
        // Dynamically load the module
        const script = document.createElement('script');
        script.src = '/static/js/mobile-features/pinch-zoom.js';
        script.onload = () => window.initPinchToZoom();
        document.head.appendChild(script);
    }
}

/**
 * Initialize form persistence
 */
function initFormPersistence() {
    // Load and execute the form-persistence module
    if (window.initFormPersistence) {
        window.initFormPersistence();
    } else {
        // Dynamically load the module
        const script = document.createElement('script');
        script.src = '/static/js/mobile-features/form-persistence.js';
        script.onload = () => window.initFormPersistence();
        document.head.appendChild(script);
    }
}

/**
 * Initialize offline mode detection
 */
function initOfflineDetection() {
    // Load and execute the offline-detection module
    if (window.initOfflineDetection) {
        window.initOfflineDetection();
    } else {
        // Dynamically load the module
        const script = document.createElement('script');
        script.src = '/static/js/mobile-features/offline-detection.js';
        script.onload = () => window.initOfflineDetection();
        document.head.appendChild(script);
    }
}

/**
 * Register service worker if supported
 */
function registerServiceWorker() {
    // Load and execute the service-worker module
    if (window.registerServiceWorker) {
        window.registerServiceWorker();
    } else {
        // Dynamically load the module
        const script = document.createElement('script');
        script.src = '/static/js/mobile-features/service-worker.js';
        script.onload = () => window.registerServiceWorker();
        document.head.appendChild(script);
    }

    // Also load the offline storage module
    if (!window.OfflineStorage) {
        const offlineStorageScript = document.createElement('script');
        offlineStorageScript.src = '/static/js/core/offlineStorage.js';
        document.head.appendChild(offlineStorageScript);
    }
}
