/**
 * Mobile Touch Enhancements
 * Improves touch interactions on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        console.log('Touch device detected, initializing mobile touch enhancements...');
        document.body.classList.add('touch-device');
        
        // Initialize touch feedback
        initTouchFeedback();
        
        // Initialize swipe detection
        initSwipeDetection();
        
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
    }
});

/**
 * Adds visual feedback when elements are touched
 */
function initTouchFeedback() {
    // Add touch-active class on touch start
    document.addEventListener('touchstart', function(e) {
        const target = e.target.closest('button, .btn, .card, .clickable, a');
        if (target) {
            target.classList.add('touch-active');
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
}

/**
 * Initializes swipe detection for UI elements
 */
function initSwipeDetection() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    const swipeThreshold = 50; // Minimum distance for a swipe
    
    // Track touch start position
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    // Track touch end position and determine swipe direction
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine if horizontal or vertical swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    // Right swipe - handle navigation
                    handleRightSwipe();
                } else {
                    // Left swipe - handle navigation
                    handleLeftSwipe();
                }
            }
        } else {
            // Vertical swipe - we can add specific handling if needed
        }
    }
    
    function handleRightSwipe() {
        // Handle right swipe - typically "back" or "previous"
        const prevButtons = document.querySelectorAll('.prev-step:not([disabled]), .back-btn:not([disabled])');
        if (prevButtons.length > 0) {
            // Find the visible prev button
            for (const btn of prevButtons) {
                if (isElementVisible(btn)) {
                    btn.click();
                    break;
                }
            }
        }
    }
    
    function handleLeftSwipe() {
        // Handle left swipe - typically "next" or "continue"
        const nextButtons = document.querySelectorAll('.next-step:not([disabled]), .continue-btn:not([disabled])');
        if (nextButtons.length > 0) {
            // Find the visible next button
            for (const btn of nextButtons) {
                if (isElementVisible(btn)) {
                    btn.click();
                    break;
                }
            }
        }
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
