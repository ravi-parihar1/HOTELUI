# Hotel Management System

A comprehensive hotel management web application built with HTML, CSS, and JavaScript that provides complete functionality for both customers and administrators.

## Features

### Customer Features
- **Registration**: Self-registration with validation for all fields
- **Login**: Secure login with password validation
- **Dashboard**: Personalized dashboard with quick access to all features
- **Reservation**: Book rooms with date selection and room preferences
- **Billing**: View bills and make payments
- **Payment**: Secure credit card payment processing
- **Booking History**: View past and upcoming bookings
- **Customer Support**: Register complaints and provide feedback
- **Notifications**: Receive checkout notifications and updates

### Admin Features
- **Admin Dashboard**: Overview of system statistics and activities
- **Reservation Management**: Approve or reject customer reservations
- **Billing Management**: Generate invoices for customers
- **Room Status**: Track room availability and assignments
- **Booking History**: View booking history for specific customers
- **All Bookings**: Manage all customer bookings with filtering
- **Customer Support**: Handle customer queries and feedback

## Project Structure

```
HOTELUI/
├── login.html                     # Main entry point (login page)
├── registration.html              # Customer registration page
├── customer-dashboard.html        # Customer dashboard
├── admin-dashboard.html           # Admin dashboard
├── reservation.html               # Customer reservation form
├── admin-reservation.html         # Admin reservation management
├── billing.html                   # Customer billing page
├── admin-billing.html            # Admin billing management
├── payment.html                   # Payment processing page
├── booking-history.html          # Customer booking history
├── admin-booking-history.html    # Admin booking history
├── room-status.html              # Room status management
├── bookings.html                 # Customer upcoming bookings
├── admin-bookings.html          # Admin all bookings
├── customer-support.html        # Customer support page
├── styles.css                    # Global styles
├── script.js                     # Main JavaScript functionality
└── README.md                     # Project documentation
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, but recommended)

### Installation
1. Clone or download the project files
2. Place all files in a single directory
3. Open `login.html` in your web browser (this is now the main entry point)
4. Or run with a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Then visit: http://localhost:8000/login.html
   
   # Using Node.js
   npx http-server
   
   # Then visit: http://localhost:8080/login.html
   ```

### Default Admin Account
- **Email**: admin@hotel.com
- **Password**: Admin@123
- **Customer ID**: 1234567890123 (13 digits)

### Sample Customer IDs for Testing:

### **For Room Status Page (13-digit IDs):**
- `1234567890123` (Admin account)
- `9876543210987`
- `1111222233334`
- `5555666677778`

### **Customer Registration:**
- Customer IDs are **automatically generated** as 13-digit numbers during registration
- Example: `8392746501823`

## Usage

### For Customers
1. **Register**: Create a new account with your details
2. **Login**: Access your account with your credentials
3. **Make Reservation**: Book rooms by selecting dates and preferences
4. **View Bills**: Check your billing information
5. **Make Payment**: Pay bills using credit card
6. **View History**: See your booking history
7. **Get Support**: Contact customer support for help

### For Administrators
1. **Login**: Use admin credentials to access admin panel
2. **Manage Reservations**: Approve or reject booking requests
3. **Generate Invoices**: Create invoices for customers
4. **Track Rooms**: Monitor room availability and status
5. **View Statistics**: Access comprehensive booking and revenue data
6. **Handle Support**: Manage customer complaints and feedback

## Data Storage

The application uses browser's `localStorage` for data persistence:
- User accounts and profiles
- Reservations and bookings
- Payment records
- Invoices
- Complaints and feedback
- Notifications

## Validation Rules

### Registration
- **Customer Name**: Maximum 50 characters
- **Email**: Valid email format
- **Mobile**: Exactly 10 digits
- **Customer ID**: 5-20 characters
- **Password**: 8-30 characters, must contain uppercase, lowercase, and special character

### Payment
- **Card Number**: Exactly 16 digits
- **Card Holder Name**: Minimum 10 characters
- **CVV**: Exactly 3 digits
- **Expiry Date**: MM/YY format

## Browser Compatibility

This application is compatible with all modern browsers that support:
- ES6 JavaScript features
- CSS Grid and Flexbox
- Local Storage API
- HTML5 form validation

## Security Features

- Password validation with complexity requirements
- Input sanitization
- Client-side form validation
- Session management
- Role-based access control

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Future Enhancements

Potential improvements for future versions:
- Backend server integration
- Database connectivity
- Real-time notifications
- Email notifications
- Advanced reporting
- Multi-language support
- Payment gateway integration

## Troubleshooting

### Common Issues

1. **Data not persisting**: Ensure localStorage is enabled in your browser
2. **Forms not submitting**: Check browser console for JavaScript errors
3. **Styling issues**: Clear browser cache and reload
4. **Login issues**: Verify admin account exists in localStorage

### Resetting Data
To clear all application data:
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

## License

This project is for educational purposes. Feel free to modify and distribute as needed.

## Contact

For questions or support regarding this application, please refer to the customer support section within the application.
