// Modern Popup Notification System
function showNotification(message, type = 'info', title = '', actions = []) {
    // Remove existing notifications
    const existingPopup = document.querySelector('.notification-popup');
    const existingOverlay = document.querySelector('.notification-overlay');
    if (existingPopup) existingPopup.remove();
    if (existingOverlay) existingOverlay.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = `notification-popup ${type}`;
    
    // Get emoji based on type
    const icons = {
        success: '✅',
        error: '❌', 
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    // Build popup content
    let popupContent = `<div class="notification-icon">${icons[type] || icons.info}</div>`;
    
    if (title) {
        popupContent += `<h3>${title}</h3>`;
    }
    
    if (message) {
        popupContent += `<p>${message}</p>`;
    }
    
    // Add action buttons if provided
    if (actions.length > 0) {
        popupContent += '<div class="notification-actions">';
        actions.forEach(action => {
            popupContent += `<button class="btn btn-${action.type || 'primary'}" onclick="${action.onclick}">${action.text}</button>`;
        });
        popupContent += '</div>';
    }
    
    // Add close button
    popupContent += '<button class="notification-close" onclick="closeNotification()">×</button>';
    
    popup.innerHTML = popupContent;
    
    // Add to page
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Auto-close after 5 seconds if no actions
    if (actions.length === 0) {
        setTimeout(() => {
            closeNotification();
        }, 5000);
    }
}

function closeNotification() {
    const popup = document.querySelector('.notification-popup');
    const overlay = document.querySelector('.notification-overlay');
    
    if (popup) {
        popup.classList.add('hiding');
    }
    if (overlay) {
        overlay.classList.add('hiding');
    }
    
    // Remove after animation
    setTimeout(() => {
        if (popup) popup.remove();
        if (overlay) overlay.remove();
    }, 300);
}

// Replace old notification system calls
function showNotificationOld(message, type = 'success') {
    showNotification(message, type);
}

// Export functions for global use
window.showNotificationPopup = showNotification;
window.closeNotification = closeNotification;
