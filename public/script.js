const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// --- SIGNUP LOGIC ---
async function handleSignup(event) {
    event.preventDefault(); // Stops the page from refreshing

    // Capture values from your HTML input IDs
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    // Simple check before sending to MongoDB
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Send data to the SIGNUP ROUTE in server.js
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration Successful! Please Sign In.");
            // Optional: Toggle the animation to show login form
            document.getElementById('container').classList.remove("active");
        } else {
            alert("Signup Failed: " + data.error);
        }
    } catch (err) {
        console.error("Signup error:", err);
    }
}

// --- LOGIN LOGIC ---
async function handleLogin(event) {
    event.preventDefault(); // Stops the page from refreshing

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Send data to the LOGIN ROUTE in server.js
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login Successful! Welcome " + data.userName);
            // Save the user's name to use on the Dashboard
            localStorage.setItem('userName', data.userName);
            window.location.href = 'dashboard.html'; 
        } else {
            alert("Login Failed: " + data.error);
        }
    } catch (err) {
        console.error("Login error:", err);
    }
}