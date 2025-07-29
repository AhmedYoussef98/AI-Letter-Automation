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
    
    // Extract file ID from various Google Drive URL formats
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9-_]+)/,
        /open\?id=([a-zA-Z0-9-_]+)/,
        /id=([a-zA-Z0-9-_]+)/
    ];
    
    let fileId = null;
    for (const pattern of patterns) {
        const match = driveUrl.match(pattern);
        if (match && match[1]) {
            fileId = match[1];
            break;
        }
    }
    
    if (fileId) {
        // Try multiple Google Drive direct access formats
        // First try the thumbnail API which is more reliable for profile images
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h200`;
    }
    
    // If it's already a direct URL or different format, return as is
    return driveUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Login form handler
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

    // Signup form handler
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!name || !email || !password) {
                alert('الرجاء ملء جميع الحقول');
                return;
            }
            
            if (password.length < 6) {
                alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                return;
            }
            
            // Hash the password
            const passwordHash = await hashPassword(password);
            
            // Create the request data
            const requestData = {
                action: 'signup',
                name: name,
                email: email,
                passwordHash: passwordHash,
                imageUrl: '' // Default empty image URL
            };

            try {
                // Show loading state
                const submitButton = signupForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'جاري إنشاء الحساب...';
                submitButton.disabled = true;

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
                    alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
                    window.location.href = 'login.html';
                } else {
                    alert('فشل في إنشاء الحساب: ' + result.message);
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.');
            } finally {
                // Reset button state
                const submitButton = signupForm.querySelector('button[type="submit"]');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});


// Google Sign-In Handlers
function handleGoogleSignIn(response) {
    console.log('Google Sign-In response:', response);
    
    try {
        // Decode the JWT token to get user information
        const payload = parseJwt(response.credential);
        console.log('User info from Google:', payload);
        
        // Create user data object
        const userData = {
            username: payload.name,
            email: payload.email,
            imageUrl: payload.picture || '',
            googleId: payload.sub,
            isGoogleUser: true
        };
        
        // Store user data and redirect
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error processing Google Sign-In:', error);
        alert('حدث خطأ أثناء تسجيل الدخول بـ Google');
    }
}

function handleGoogleSignUp(response) {
    console.log('Google Sign-Up response:', response);
    
    try {
        // Decode the JWT token to get user information
        const payload = parseJwt(response.credential);
        console.log('User info from Google:', payload);
        
        // For signup, we can either:
        // 1. Create account automatically (current implementation)
        // 2. Send to backend to create account in database
        
        // Create user data object
        const userData = {
            username: payload.name,
            email: payload.email,
            imageUrl: payload.picture || '',
            googleId: payload.sub,
            isGoogleUser: true
        };
        
        // Store user data and redirect
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
        alert('تم إنشاء الحساب بنجاح باستخدام Google!');
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error processing Google Sign-Up:', error);
        alert('حدث خطأ أثناء إنشاء الحساب بـ Google');
    }
}

// Helper function to decode JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        throw error;
    }
}
