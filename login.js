// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpNGfEibHQdL4TX8UtT9r_dlk27ZhvMpw",
    authDomain: "truecred-355dd.firebaseapp.com",
    projectId: "truecred-355dd",
    storageBucket: "truecred-355dd.firebasestorage.app",
    messagingSenderId: "1036609637307",
    appId: "1:1036609637307:web:2e90f97eed4fa73578d29e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Current user type tracking
let currentUserType = 'institution';

// Simple login function with user type-based redirect
async function handleLogin(email, password) {
    const loginBtn = document.getElementById('loginBtn');
    
    try {
        // Show loading state
        if (loginBtn) loginBtn.classList.add('loading');
        
        console.log(`Attempting login for ${currentUserType}...`);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', userCredential.user.email);
        
        // Store user data with selected user type
        const userData = {
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            userType: currentUserType,
            loginTime: new Date().toISOString(),
            displayName: userCredential.user.displayName || email.split('@')[0]
        };
        
        localStorage.setItem('truecred_user', JSON.stringify(userData));
        
        // Show success message
        showNotification(`Login successful! Redirecting to ${currentUserType} dashboard...`, 'success');
        
        // Redirect based on user type after 1.5 seconds
        setTimeout(() => {
            redirectBasedOnUserType(currentUserType);
        }, 1500);
        
    } catch (error) {
        console.error('Login failed:', error.code, error.message);
        
        let errorMessage = 'An error occurred during login.';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
            default:
                errorMessage = error.message;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        // Remove loading state
        if (loginBtn) loginBtn.classList.remove('loading');
    }
}

// Google login function with user type-based redirect
async function handleGoogleLogin() {
    try {
        console.log(`Attempting Google login for ${currentUserType}...`);
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google login successful:', result.user.email);
        
        const userData = {
            email: result.user.email,
            uid: result.user.uid,
            userType: currentUserType,
            loginTime: new Date().toISOString(),
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            provider: 'google'
        };
        
        localStorage.setItem('truecred_user', JSON.stringify(userData));
        
        showNotification(`Google login successful! Redirecting to ${currentUserType} dashboard...`, 'success');
        
        setTimeout(() => {
            redirectBasedOnUserType(currentUserType);
        }, 1500);
        
    } catch (error) {
        console.error('Google login failed:', error.code, error.message);
        
        let errorMessage = 'Google login failed.';
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Sign-in popup was closed.';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Another sign-in popup is already open.';
                break;
            default:
                errorMessage = error.message;
        }
        
        showNotification(errorMessage, 'error');
    }
}

// Redirect function based on user type
function redirectBasedOnUserType(userType) {
    console.log(`Redirecting based on user type: ${userType}`);
    
    const redirectUrls = {
        institution: 'index.html',     // Institution -> index.html
        employer: 'public.html',     // Employer -> employer.html  
        government: 'government.html'  // Government -> government.html
    };
    
    const redirectUrl = redirectUrls[userType] || 'index.html';
    console.log(`Redirecting to: ${redirectUrl}`);
    
    try {
        // Method 1: Direct redirect
        window.location.href = redirectUrl;
        
        // Method 2: Fallback after 1 second
        setTimeout(() => {
            if (window.location.pathname.includes('login')) {
                console.log('First redirect failed, trying method 2...');
                window.location.replace(redirectUrl);
            }
        }, 1000);
        
        // Method 3: Final fallback after 2 seconds
        setTimeout(() => {
            if (window.location.pathname.includes('login')) {
                console.log('Second redirect failed, trying method 3...');
                window.location = redirectUrl;
            }
        }, 2000);
        
    } catch (error) {
        console.error('Redirect error:', error);
        // Ultimate fallback
        alert(`Login successful! Please click OK to go to your ${userType} dashboard.`);
        window.location.href = redirectUrl;
    }
}

// Show notification function
function showNotification(message, type = 'success') {
    console.log(`Notification: ${message} (${type})`);
    
    const notification = document.getElementById('notification');
    if (!notification) {
        // Fallback: show alert if notification element doesn't exist
        alert(`${type.toUpperCase()}: ${message}`);
        return;
    }
    
    const messageEl = notification.querySelector('.notification-message');
    if (messageEl) {
        messageEl.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

// Update email placeholder based on user type
function updateEmailPlaceholder() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;
    
    const placeholders = {
        institution: 'registrar@university.edu',
        employer: 'hr@company.com',
        government: 'officer@gov.in'
    };
    
    emailInput.placeholder = placeholders[currentUserType] || 'Enter your email address';
    console.log('Updated placeholder to:', emailInput.placeholder);
}

// Form validation
function validateField(field) {
    const wrapper = field.closest('.input-wrapper');
    if (!wrapper) return true;
    
    let isValid = true;
    let errorMessage = '';

    // Clear existing errors
    wrapper.classList.remove('error', 'success');
    const existingError = wrapper.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Password validation
    if (field.type === 'password') {
        if (field.value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters';
        }
    }

    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    if (!isValid) {
        wrapper.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        wrapper.parentNode.appendChild(errorElement);
    } else {
        wrapper.classList.add('success');
    }

    return isValid;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, setting up TrueCred login...');
    
    // Clear any existing localStorage to prevent auto-redirect
    // Comment this out if you want to keep users logged in across sessions
    // localStorage.removeItem('truecred_user');
    
    // Email login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (!emailInput || !passwordInput) {
                showNotification('Form elements not found', 'error');
                return;
            }
            
            // Validate form
            const emailValid = validateField(emailInput);
            const passwordValid = validateField(passwordInput);
            
            if (!emailValid || !passwordValid) {
                showNotification('Please fix the errors above', 'error');
                return;
            }
            
            const email = emailInput.value;
            const password = passwordInput.value;
            handleLogin(email, password);
        });
    }
    
    // Google login button
    const googleBtn = document.getElementById('googleLogin');
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleGoogleLogin();
        });
    }
    
    // Microsoft login button (placeholder)
    const microsoftBtn = document.getElementById('microsoftLogin');
    if (microsoftBtn) {
        microsoftBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Microsoft login coming soon!', 'error');
        });
    }
    
    // User type buttons - FIXED
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    console.log('Found user type buttons:', userTypeBtns.length);
    
    userTypeBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`User type button ${index} clicked`);
            
            // Remove active from all buttons
            document.querySelectorAll('.user-type-btn').forEach(b => b.classList.remove('active'));
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Update current user type
            currentUserType = this.getAttribute('data-type');
            console.log('Selected user type:', currentUserType);
            
            // Update email placeholder
            updateEmailPlaceholder();
        });
    });
    
    // Password toggle
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
        });
    }
    
    // Form field validation on blur
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            const wrapper = input.closest('.input-wrapper');
            if (wrapper) {
                wrapper.classList.remove('error', 'success');
                const existingError = wrapper.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }
        });
    });
    
    // Set initial placeholder
    updateEmailPlaceholder();
});

// Logout function (for use in other pages)
async function logout() {
    try {
        await signOut(auth);
        localStorage.removeItem('truecred_user');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

// Create user function (for signup page)
async function createUser(email, password, userType) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userData = {
            uid: user.uid,
            email: user.email,
            userType: userType,
            createdAt: new Date().toISOString(),
            displayName: email.split('@')[0]
        };
        
        localStorage.setItem('truecred_user', JSON.stringify(userData));
        return { success: true, user: userData };
    } catch (error) {
        return { success: false, error: error };
    }
}

// Export functions globally for use in other files
window.logout = logout;
window.createUser = createUser;
window.TruCredLogin = {
    logout,
    createUser,
    handleLogin,
    handleGoogleLogin,
    redirectBasedOnUserType
};
