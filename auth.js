const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2-ZELQSfxY-ZuX1CwPpw2gxPMRJrq2bGO0x-zhWuNlf19azOm6TGO8tel8MZ0krCT6A/exec'; // <-- IMPORTANT: Use your new deployment URL

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordHash = await hashPassword(password);

            // CHANGED: We are now using URLSearchParams instead of FormData
            const body = new URLSearchParams();
            body.append('action', 'login');
            body.append('email', email);
            body.append('passwordHash', passwordHash);

            try {
                // CHANGED: We are adding a 'Content-Type' header
                const response = await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body,
                });

                const result = await response.json();

                if (result.success) {
                    sessionStorage.setItem('loggedInUser', JSON.stringify(result.user));
                    window.location.href = 'index.html';
                } else {
                    alert('Login failed: ' + result.message);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login.');
            }
        });
    }
});
