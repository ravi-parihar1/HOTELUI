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

// Field Validation Utility
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove any existing error/success messages
    clearFieldValidation(fieldId);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    
    // Focus on the field
    field.focus();
}

function showFieldSuccess(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove any existing error/success messages
    clearFieldValidation(fieldId);
    
    // Add success class to field
    field.classList.add('success');
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'field-success';
    successDiv.textContent = message;
    
    // Insert success message after the field
    field.parentNode.insertBefore(successDiv, field.nextSibling);
}

function clearFieldValidation(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove error/success classes
    field.classList.remove('error', 'success');
    
    // Remove any existing error/success messages
    const existingMessages = formGroup.querySelectorAll('.field-error, .field-success');
    existingMessages.forEach(msg => msg.remove());
}

function clearAllFieldValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Remove all error/success classes
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.classList.remove('error', 'success');
    });
    
    // Remove all error/success messages
    const messages = form.querySelectorAll('.field-error, .field-success');
    messages.forEach(msg => msg.remove());
}
// Real-time input validation
function setupRealTimeValidation() {
    // Check if we're on login page - don't apply real-time validation there
    const isLoginPage = document.getElementById('loginForm');
    
    if (isLoginPage) {
        // Only add basic validation on submit for login
        return;
    }
    
    // Name field validation - prevent numbers and special characters (registration only)
    const nameField = document.getElementById('customerName');
    if (nameField) {
        nameField.addEventListener('input', function(e) {
            const value = e.target.value;
            // Allow only letters and spaces
            const cleanValue = value.replace(/[^a-zA-Z\s]/g, '');
            
            if (value !== cleanValue) {
                e.target.value = cleanValue;
                showFieldError('customerName', 'Name can only contain letters and spaces');
            } else if (cleanValue.length > 0) {
                clearFieldValidation('customerName');
                if (cleanValue.length >= 3) {
                    showFieldSuccess('customerName', 'Name looks good!');
                }
            }
        });
        
        nameField.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && value.length >= 3 && /^[a-zA-Z\s]+$/.test(value)) {
                showFieldSuccess('customerName', 'Name is valid');
            }
        });
    }
    
    // Email field validation (non-login pages)
    const emailField = document.getElementById('email');
    if (emailField && !isLoginPage) {
        emailField.addEventListener('blur', function() {
            const value = this.value.trim();
            if (!value) {
                showFieldError('email', 'Email is mandatory');
            } else if (!validateEmail(value)) {
                showFieldError('email', 'Please enter a valid email address');
            } else {
                showFieldSuccess('email', 'Email is valid');
            }
        });
    }
    
    // Mobile field validation
    const mobileField = document.getElementById('mobile');
    if (mobileField) {
        mobileField.addEventListener('input', function(e) {
            const value = e.target.value;
            // Allow only numbers and limit to 10 digits
            const cleanValue = value.replace(/\D/g, '').slice(0, 10);
            e.target.value = cleanValue;
            
            if (cleanValue.length === 10) {
                showFieldSuccess('mobile', 'Mobile number is valid');
            } else if (cleanValue.length > 0) {
                showFieldError('mobile', 'Mobile number must be exactly 10 digits');
            }
        });
    }
    
    // Password field validation (non-login pages)
    const passwordField = document.getElementById('password');
    if (passwordField && !isLoginPage) {
        passwordField.addEventListener('blur', function() {
            const value = this.value;
            if (!value) {
                showFieldError('password', 'Password is mandatory');
            } else if (!validatePassword(value)) {
                showFieldError('password', 'Password must contain at least one uppercase, one lowercase, and one special character (8-30 characters)');
            } else {
                showFieldSuccess('password', 'Password is strong');
            }
        });
    }
    
    // Confirm password validation
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('blur', function() {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;
            
            if (!confirmPassword) {
                showFieldError('confirmPassword', 'Confirm password is mandatory');
            } else if (password !== confirmPassword) {
                showFieldError('confirmPassword', 'Password and Confirm Password must match');
            } else {
                showFieldSuccess('confirmPassword', 'Passwords match');
            }
        });
    }
}

// Active State Management - Universal for all pages
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop().replace('.html', '');
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('.navbar nav ul li a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.replace('.html', '').replace('./', '');
        
        // Remove existing active class
        link.classList.remove('active');
        
        // Add active class to current page
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index') ||
            (currentPage === 'customer-dashboard' && linkPage === 'customer-dashboard') ||
            (currentPage === 'admin-dashboard' && linkPage === 'admin-dashboard')) {
            link.classList.add('active');
        }
    });
    
    // Also set active in mobile drawer
    const drawerLinks = document.querySelectorAll('.mobile-drawer nav ul li a');
    drawerLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.replace('.html', '').replace('./', '');
        
        // Remove existing active class
        link.classList.remove('active');
        
        // Add active class to current page
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index') ||
            (currentPage === 'customer-dashboard' && linkPage === 'customer-dashboard') ||
            (currentPage === 'admin-dashboard' && linkPage === 'admin-dashboard')) {
            link.classList.add('active');
        }
    });
}

// Initialize active state when page loads
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavigation();
    setupRealTimeValidation();
});

// Also update active state when navigation occurs
window.addEventListener('popstate', setActiveNavigation);

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

// Registration form validation with inline errors
function validateRegistrationForm() {
    const form = document.getElementById('registrationForm');
    const name = form.customerName.value.trim();
    const email = form.email.value.trim();
    const mobile = form.mobile.value.trim();
    const address = form.address.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    
    // Clear previous validation
    clearAllFieldValidation('registrationForm');
    
    let hasErrors = false;
    
    // Validate name - prevent numbers and special characters
    if (!name) {
        showFieldError('customerName', 'Name is mandatory');
        hasErrors = true;
    } else if (name.length < 3) {
        showFieldError('customerName', 'Name must be at least 3 characters');
        hasErrors = true;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        showFieldError('customerName', 'Name can only contain letters and spaces');
        hasErrors = true;
    }
    
    // Validate email
    if (!email) {
        showFieldError('email', 'Email is mandatory');
        hasErrors = true;
    } else if (!validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    // Validate mobile
    if (!mobile) {
        showFieldError('mobile', 'Mobile number is mandatory');
        hasErrors = true;
    } else if (!/^\d{10}$/.test(mobile)) {
        showFieldError('mobile', 'Mobile number must be exactly 10 digits');
        hasErrors = true;
    }
    
    // Validate address
    if (!address) {
        showFieldError('address', 'Address is mandatory');
        hasErrors = true;
    } else if (address.length < 10) {
        showFieldError('address', 'Address must be at least 10 characters');
        hasErrors = true;
    }
    
    // Validate password
    if (!password) {
        showFieldError('password', 'Password is mandatory');
        hasErrors = true;
    } else if (!validatePassword(password)) {
        showFieldError('password', 'Password must contain at least one uppercase, one lowercase, and one special character (8-30 characters)');
        hasErrors = true;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        showFieldError('confirmPassword', 'Confirm password is mandatory');
        hasErrors = true;
    } else if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Password and Confirm Password must match');
        hasErrors = true;
    }
    
    return !hasErrors;
}

// Login form validation with inline errors
function validateLoginForm() {
    const form = document.getElementById('loginForm');
    const email = form.email.value.trim(); 
    const password = form.password.value;
    
    // Clear previous validation
    clearAllFieldValidation('loginForm');
    
    let hasErrors = false;
    
    // Validate email
    if (!email) {
        showFieldError('email', 'Email is mandatory');
        hasErrors = true;
    } else if (!validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    // Validate password
    if (!password) {
        showFieldError('password', 'Password is mandatory');
        hasErrors = true;
    } else if (!validatePassword(password)) {
        showFieldError('password', 'Invalid password format');
        hasErrors = true;
    }
    
    return !hasErrors;
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
