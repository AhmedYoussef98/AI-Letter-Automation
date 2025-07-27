(function() {
    // This checks if the user is on the login page. If so, do nothing.
    if (window.location.pathname.endsWith('login.html')) {
        return;
    }

    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // If no user data is found, redirect to the login page.
    if (!user) {
        window.location.href = 'login.html';
        return; // Stop script execution
    }

    // If user data exists, dynamically add the profile UI to the header.
    document.addEventListener('DOMContentLoaded', () => {
        const profileContainer = document.getElementById('profile-container');
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div class="profile-info">
                    <span id="username">${user.username}</span>
                    <img id="user-image" src="${user.imageUrl}" alt="Profile">
                </div>
                <button id="logoutButton" class="logout-button">
                    <i class="fas fa-sign-out-alt"></i>
                    خروج
                </button>
            `;

            document.getElementById('logoutButton').addEventListener('click', () => {
                sessionStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            });
        }
    });
})();
