// The URL for your Google Apps Script Web App
const APPS_SCRIPT_URL = 'YOUR_NEW_APPS_SCRIPT_WEB_APP_URL'; // <-- IMPORTANT: Use your new deployment URL

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // In a real app, you would securely hash the password here.
            // This is a simplified example.
            const passwordHash = "hashed_" + password; // Replace with a real hashing function in production

            const formData = new FormData();
            formData.append('action', 'signup');
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('passwordHash', passwordHash);
            
            try {
                const response = await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    alert('Account created successfully! Please log in.');
                    window.location.href = 'login.html';
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (loginForm) {
        // We will add login logic here in the next step
    }
});
