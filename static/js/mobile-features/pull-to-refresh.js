/**
 * Pull-to-refresh functionality for mobile devices
 */

function initPullToRefresh() {
    // Only initialize on touch devices
    if (!('ontouchstart' in window)) return;
    
    let startY = 0;
    let currentY = 0;
    let pulling = false;
    let refreshing = false;
    const pullThreshold = 80; // Pixels to pull before triggering refresh
    
    // Create pull indicator element
    const indicator = document.createElement('div');
    indicator.className = 'pull-to-refresh-indicator';
    indicator.innerHTML = '<i class="fas fa-arrow-down"></i><span>Pull to refresh</span>';
    indicator.style.cssText = `
        position: absolute;
        top: -60px;
        left: 0;
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--background);
        color: var(--text);
        transition: transform 0.2s;
        z-index: 1000;
        pointer-events: none;
    `;
    document.body.prepend(indicator);
    
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    function handleTouchStart(e) {
        // Only enable pull-to-refresh at the top of the page
        if (window.scrollY <= 0) {
            startY = e.touches[0].clientY;
            pulling = true;
        }
    }
    
    function handleTouchMove(e) {
        if (!pulling || refreshing) return;
        
        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        // Only activate when pulling down from the top
        if (pullDistance > 0 && window.scrollY <= 0) {
            // Calculate pull percentage
            const pullPercentage = Math.min(pullDistance / pullThreshold, 1);
            
            // Update indicator
            indicator.style.transform = `translateY(${pullDistance * 0.5}px)`;
            
            // Update indicator text based on pull percentage
            if (pullPercentage >= 1) {
                indicator.querySelector('span').textContent = 'Release to refresh';
                indicator.querySelector('i').className = 'fas fa-sync-alt';
            } else {
                indicator.querySelector('span').textContent = 'Pull to refresh';
                indicator.querySelector('i').className = 'fas fa-arrow-down';
            }
            
            // Prevent default scrolling behavior
            e.preventDefault();
        }
    }
    
    function handleTouchEnd() {
        if (!pulling || refreshing) return;
        
        const pullDistance = currentY - startY;
        
        // Check if pulled enough to trigger refresh
        if (pullDistance > pullThreshold && window.scrollY <= 0) {
            // Trigger refresh
            refreshPage();
        } else {
            // Reset indicator
            indicator.style.transform = 'translateY(-60px)';
        }
        
        pulling = false;
    }
    
    function refreshPage() {
        refreshing = true;
        
        // Update indicator
        indicator.style.transform = 'translateY(0)';
        indicator.querySelector('span').textContent = 'Refreshing...';
        indicator.querySelector('i').className = 'fas fa-sync-alt fa-spin';
        
        // Provide haptic feedback
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(20);
        }
        
        // Reload the page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Export the function
window.initPullToRefresh = initPullToRefresh;
