const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Display error or success messages from URL parameters
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    if (error) {
        const signupMessage = document.getElementById('signup-message');
        const signinMessage = document.getElementById('signin-message');
        signupMessage.textContent = error;
        signupMessage.classList.add('error');
        signinMessage.textContent = error;
        signinMessage.classList.add('error');
    }
    
    if (success) {
        const signinMessage = document.getElementById('signin-message');
        signinMessage.textContent = success;
        signinMessage.classList.add('success');
        // Clear URL after displaying message
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});