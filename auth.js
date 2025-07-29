const PROXY_URL = '/api/apps-script-proxy'; // Use the Vercel proxy

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Add this function to convert Google Drive URLs
function convertDriveUrlToDirectUrl(driveUrl) {
    if (!driveUrl || typeof driveUrl !== 'string') {
        return '';
    }
    
    // Extract file ID from Google Drive URL
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/uc?id=${fileId}`;
    }
    
    // If it's already a direct URL or different format, return as is
    return driveUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordHash = await hashPassword(password);

            // Create the request data
            const requestData = {
                action: 'login',
                email: email,
                passwordHash: passwordHash
            };

            try {
                // Use the Vercel proxy instead of direct Apps Script call
                const response = await fetch(PROXY_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                const result = await response.json();

                if (result.success) {
                    // Convert the image URL before storing
                    const userData = {
                        ...result.user,
                        imageUrl: convertDriveUrlToDirectUrl(result.user.imageUrl)
                    };
                    
                    sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
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
