/**
 * Pinch-to-zoom functionality for document previews
 */

function initPinchToZoom() {
    // Only initialize on touch devices
    if (!('ontouchstart' in window)) return;
    
    // Find all document preview elements
    const documentPreviews = document.querySelectorAll('.document-preview, .zoomable-image');
    
    documentPreviews.forEach(preview => {
        let initialDistance = 0;
        let currentScale = 1;
        let initialScale = 1;
        let lastScale = 1;
        let initialX = 0;
        let initialY = 0;
        let lastX = 0;
        let lastY = 0;
        let currentX = 0;
        let currentY = 0;
        
        // Add touch event listeners
        preview.addEventListener('touchstart', handleTouchStart, { passive: false });
        preview.addEventListener('touchmove', handleTouchMove, { passive: false });
        preview.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        function handleTouchStart(e) {
            e.preventDefault(); // Prevent default browser behavior
            
            if (e.touches.length === 2) {
                // Two-finger pinch
                initialDistance = getDistance(e.touches[0], e.touches[1]);
                initialScale = currentScale;
                
                // Get initial position for panning
                initialX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                initialY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                lastX = currentX;
                lastY = currentY;
            }
        }
        
        function handleTouchMove(e) {
            e.preventDefault(); // Prevent default browser behavior
            
            if (e.touches.length === 2) {
                // Calculate new scale
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const scaleChange = currentDistance / initialDistance;
                currentScale = Math.min(Math.max(initialScale * scaleChange, 1), 3); // Limit scale between 1 and 3
                
                // Calculate new position for panning
                const currentCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const currentCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                
                // Only allow panning when zoomed in
                if (currentScale > 1) {
                    // Calculate pan distance
                    const deltaX = currentCenterX - initialX;
                    const deltaY = currentCenterY - initialY;
                    
                    // Update position
                    currentX = lastX + deltaX / currentScale;
                    currentY = lastY + deltaY / currentScale;
                } else {
                    // Reset position when zoomed out
                    currentX = 0;
                    currentY = 0;
                }
                
                // Apply transform
                preview.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
                
                // Add transition class for smoother scaling
                preview.classList.add('smooth-zoom');
            }
        }
        
        function handleTouchEnd() {
            // Remove smooth transition after a short delay
            setTimeout(() => {
                preview.classList.remove('smooth-zoom');
            }, 200);
            
            // Reset to original scale with animation if scale is close to 1
            if (currentScale < 1.1) {
                currentScale = 1;
                currentX = 0;
                currentY = 0;
                preview.style.transform = 'scale(1) translate(0, 0)';
            }
            
            // Store last scale and position
            lastScale = currentScale;
            lastX = currentX;
            lastY = currentY;
        }
        
        // Helper function to calculate distance between two touch points
        function getDistance(touch1, touch2) {
            return Math.hypot(
                touch1.clientX - touch2.clientX,
                touch1.clientY - touch2.clientY
            );
        }
        
        // Double-tap to zoom
        let lastTap = 0;
        preview.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0 && e.touches.length === 0) {
                // Double tap detected
                if (currentScale === 1) {
                    // Zoom in to 2x at the tap position
                    currentScale = 2;
                    
                    // Get tap position relative to the element
                    const rect = preview.getBoundingClientRect();
                    const tapX = e.changedTouches[0].clientX - rect.left;
                    const tapY = e.changedTouches[0].clientY - rect.top;
                    
                    // Calculate position to center the tap point
                    currentX = (rect.width / 2 - tapX) / 2;
                    currentY = (rect.height / 2 - tapY) / 2;
                } else {
                    // Zoom out
                    currentScale = 1;
                    currentX = 0;
                    currentY = 0;
                }
                
                // Apply transform with smooth transition
                preview.classList.add('smooth-zoom');
                preview.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
                
                // Provide haptic feedback
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
                
                // Remove smooth transition after animation completes
                setTimeout(() => {
                    preview.classList.remove('smooth-zoom');
                }, 300);
                
                lastScale = currentScale;
                lastX = currentX;
                lastY = currentY;
                
                e.preventDefault();
            }
            
            lastTap = currentTime;
        });
    });
    
    // Add CSS for smooth zooming
    const style = document.createElement('style');
    style.textContent = `
        .smooth-zoom {
            transition: transform 0.2s ease-out;
        }
        
        .document-preview, .zoomable-image {
            touch-action: none;
            transform-origin: center;
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
}

// Export the function
window.initPinchToZoom = initPinchToZoom;
