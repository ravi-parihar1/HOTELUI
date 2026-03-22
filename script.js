// Global variables
let currentUser = null;
let userRole = null;
let reservations = [];
let bookings = [];

// Utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,30}$/;
    return passwordRegex.test(password);
}

function validateMobile(mobile) {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}

function generateUserId() {
    // Generate 13-digit customer ID
    let customerId = '';
    for (let i = 0; i < 13; i++) {
        customerId += Math.floor(Math.random() * 10);
    }
    return customerId;
}

function generateBookingId() {
    return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateTransactionId() {
    return 'TXN' + Math.random().toString(36).substr(2, 12).toUpperCase();
}

// Show notification - Updated to use popup system
function showNotification(message, type = 'success') {
    // Use the modern popup notification system
    if (typeof window.showNotificationPopup === 'function') {
        window.showNotificationPopup(message, type);
        return;
    }
    
    // Simple fallback if popup system not loaded
    console.log('Notification:', message, type);
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Store data in localStorage
function storeUserData(userData) {
    const users = JSON.parse(localStorage.getItem('hotelUsers') || '[]');
    users.push(userData);
    localStorage.setItem('hotelUsers', JSON.stringify(users));
}

function getUsers() {
    return JSON.parse(localStorage.getItem('hotelUsers') || '[]');
}

function findUser(userId, password) {
    const users = getUsers();
    return users.find(user => user.customerId === userId && user.password === password);
}

// New function to find user by email
function findUserByEmail(email, password) {
    const users = getUsers();
    return users.find(user => user.email === email && user.password === password);
}

// Registration form validation
function validateRegistrationForm() {
    const form = document.getElementById('registrationForm');
    const errors = [];
    
    const name = form.customerName.value.trim();
    const email = form.email.value.trim();
    const mobile = form.mobile.value.trim();
    const address = form.address.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    
    if (name.length > 50) {
        errors.push('Customer name must be maximum 50 characters');
    }
    
    if (!validateEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!validateMobile(mobile)) {
        errors.push('Mobile number must be exactly 10 digits');
    }
    
    if (!validatePassword(password)) {
        errors.push('Password must contain at least one uppercase, one lowercase, and one special character (8-30 characters)');
    }
    
    if (password !== confirmPassword) {
        errors.push('Password and Confirm Password must match');
    }
    
    const errorDiv = document.getElementById('errorMessages');
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error', 'Validation Error');
        return false;
    }
    
    errorDiv.innerHTML = '';
    return true;
}

// Login form validation
function validateLoginForm() {
    const form = document.getElementById('loginForm');
    const email = form.email.value.trim(); // Changed from userId to email
    const password = form.password.value;
    
    if (!validateEmail(email)) { // Updated validation
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!validatePassword(password)) {
        showNotification('Invalid password format', 'error');
        return false;
    }
    
    return true;
}

// Handle registration
function handleRegistration(event) {
    event.preventDefault();
    
    if (!validateRegistrationForm()) {
        return;
    }
    
    const form = document.getElementById('registrationForm');
    
    // Generate automatic Customer ID
    const autoCustomerId = generateUserId();
    
    // Display the generated Customer ID in the readonly field
    form.customerId.value = autoCustomerId;
    
    const userData = {
        customerName: form.customerName.value.trim(),
        email: form.email.value.trim(),
        mobile: form.mobile.value.trim(),
        address: form.address.value.trim(),
        customerId: autoCustomerId, // Auto-generated
        password: form.password.value,
        role: 'customer',
        registrationDate: new Date().toISOString()
    };
    
    // Check if user already exists (by email)
    const existingUsers = getUsers();
    if (existingUsers.find(user => user.email === userData.email)) {
        showNotification('An account with this email already exists', 'error');
        return;
    }
    
    storeUserData(userData);
    
    // Show success popup
    const successMessage = `Consumer Registration successful!\n\nYour Customer ID: ${autoCustomerId}\n\nPlease save this Customer ID for future reference. You can now login with your email.`;
    showNotification(successMessage, 'success', 'Registration Successful!');
    
    // Also show the Customer ID in the success div for reference
    const successDiv = document.getElementById('successMessage');
    successDiv.innerHTML = `
        <div class="success-message">
            <h3>Registration completed! Your Customer ID is: ${autoCustomerId}</h3>
            <p>Please save this Customer ID for future reference.</p>
        </div>
    `;
    
    // Reset form (but keep the generated Customer ID visible)
    form.reset();
    form.customerId.value = autoCustomerId;
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 3000);
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    if (!validateLoginForm()) {
        return;
    }
    
    const form = document.getElementById('loginForm');
    const email = form.email.value.trim(); // Changed from userId to email
    const password = form.password.value;
    
    const user = findUserByEmail(email, password); // Updated to find by email
    
    if (!user) {
        showNotification('Invalid email or Password', 'error');
        return;
    }
    
    // Set current user
    currentUser = user;
    userRole = user.role;
    
    // Store in session
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    showNotification('Login successful!');
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'customer-dashboard.html';
        }
    }, 1000);
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    userRole = null;
    showNotification('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Check if user is logged in
function checkAuth() {
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    currentUser = JSON.parse(user);
    userRole = currentUser.role;
    return currentUser;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for forms
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add logout button listeners
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
});

// Reservation handling
function handleReservation(event) {
    event.preventDefault();
    
    const form = document.getElementById('reservationForm');
    const reservation = {
        bookingId: generateBookingId(),
        checkInDate: form.checkInDate.value,
        checkOutDate: form.checkOutDate.value,
        roomPreference: form.roomPreference.value,
        name: form.name.value.trim(),
        contact: form.contact.value.trim(),
        customerId: currentUser.customerId,
        bookingDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Store reservation
    let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    showNotification('Reservation Successful! Booking ID: ' + reservation.bookingId);
    
    // Reset form
    form.reset();
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'customer-dashboard.html';
    }, 2000);
}

// Payment handling
function handlePayment(event) {
    event.preventDefault();
    
    const form = document.getElementById('paymentForm');
    const cardNumber = form.cardNumber.value.trim();
    const cardHolderName = form.cardHolderName.value.trim();
    const expiryDate = form.expiryDate.value.trim();
    const cvv = form.cvv.value.trim();
    
    // Basic validation
    if (cardNumber.length !== 16) {
        showNotification('Card number must be 16 digits', 'error');
        return;
    }
    
    if (cardHolderName.length < 10) {
        showNotification('Card holder name must be at least 10 characters', 'error');
        return;
    }
    
    if (cvv.length !== 3) {
        showNotification('CVV must be 3 digits', 'error');
        return;
    }
    
    const transactionId = generateTransactionId();
    showNotification('Payment Successful! Transaction ID: ' + transactionId);
    
    // Store checkout notification
    storeCheckoutNotification();
    
    // Reset form
    form.reset();
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'customer-dashboard.html';
    }, 2000);
}

// Store checkout notification
function storeCheckoutNotification() {
    const notification = {
        id: Date.now(),
        customerId: currentUser.customerId,
        message: "Thank you for choosing us a trusted hotel. For more details contact the customer support",
        timestamp: new Date().toISOString(),
        type: 'checkout',
        read: false
    };
    
    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Show checkout notification on dashboard
function showCheckoutNotification() {
    if (!currentUser) return;
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const unreadNotifications = notifications.filter(n => 
        n.customerId === currentUser.customerId && !n.read && n.type === 'checkout'
    );
    
    if (unreadNotifications.length > 0) {
        setTimeout(() => {
            const notification = unreadNotifications[unreadNotifications.length - 1];
            showNotification(notification.message, 'success');
            
            // Mark as read
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }, 2000);
    }
}
