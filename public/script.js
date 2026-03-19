const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Toggle between Sign In and Sign Up forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// --- SIGNUP LOGIC ---
async function handleSignup(event) {
    event.preventDefault(); // Stops the page from refreshing

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration Successful! Please Sign In.");
            document.getElementById('container').classList.remove("active");
        } else {
            alert("Signup Failed: " + data.error);
        }
    } catch (err) {
        console.error("Signup error:", err);
        alert("Server error during signup. Check your console.");
    }
}

// --- LOGIN LOGIC ---
async function handleLogin(event) {
    event.preventDefault(); // Stops the page from refreshing

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login Successful! Welcome " + data.userName);
            
            // CRITICAL UPDATES: Save both Name and ID to localStorage
            localStorage.setItem('userName', data.userName);
            localStorage.setItem('userId', data.userId); 
            
            // Redirect to Dashboard
            window.location.href = 'dashboard.html'; 
        } else {
            alert("Login Failed: " + (data.error || "Check your credentials"));
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("Server error during login. Check your console.");
    }
}