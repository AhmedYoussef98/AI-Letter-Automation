// api/whitelist.js
// Whitelist Management API - Uses the apps-script-proxy like auth.js

const PROXY_URL = '/api/apps-script-proxy'; // Use the Vercel proxy

/**
 * Add a user to the whitelist
 * @param {string} adminEmail - Email of the admin performing the action
 * @param {string} targetEmail - Email to be added to whitelist
 * @param {string} targetRole - Role for the user ('admin' or 'user')
 * @returns {Promise<Object>} Response object
 */
export async function addToWhitelist(adminEmail, targetEmail, targetRole = 'user') {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'manageWhitelist',
                whitelistAction: 'add',
                adminEmail: adminEmail,
                targetEmail: targetEmail,
                targetRole: targetRole
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding to whitelist:', error);
        return {
            success: false,
            message: 'Network error: ' + error.message
        };
    }
}

/**
 * Remove a user from the whitelist
 * @param {string} adminEmail - Email of the admin performing the action
 * @param {string} targetEmail - Email to be removed from whitelist
 * @returns {Promise<Object>} Response object
 */
export async function removeFromWhitelist(adminEmail, targetEmail) {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'manageWhitelist',
                whitelistAction: 'remove',
                adminEmail: adminEmail,
                targetEmail: targetEmail
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error removing from whitelist:', error);
        return {
            success: false,
            message: 'Network error: ' + error.message
        };
    }
}

/**
 * Get all whitelist entries
 * @param {string} adminEmail - Email of the admin requesting the list
 * @returns {Promise<Object>} Response object with data array
 */
export async function getWhitelistEntries(adminEmail) {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'manageWhitelist',
                whitelistAction: 'list',
                adminEmail: adminEmail
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error getting whitelist:', error);
        return {
            success: false,
            message: 'Network error: ' + error.message
        };
    }
}

/**
 * Update user status (activate/deactivate)
 * @param {string} adminEmail - Email of the admin performing the action
 * @param {string} targetEmail - Email of user to update
 * @param {string} status - New status ('active' or 'inactive')
 * @returns {Promise<Object>} Response object
 */
export async function updateUserStatus(adminEmail, targetEmail, status) {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'manageWhitelist',
                whitelistAction: 'updateStatus',
                adminEmail: adminEmail,
                targetEmail: targetEmail,
                status: status
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating user status:', error);
        return {
            success: false,
            message: 'Network error: ' + error.message
        };
    }
}

/**
 * Batch add multiple users to whitelist
 * @param {string} adminEmail - Admin's email
 * @param {Array<{email: string, role: string}>} users - Array of user objects
 * @returns {Promise<Array>} Array of results
 */
export async function addMultipleToWhitelist(adminEmail, users) {
    const results = [];
    
    for (const user of users) {
        const result = await addToWhitelist(adminEmail, user.email, user.role);
        results.push({
            email: user.email,
            success: result.success,
            message: result.message
        });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
}

/**
 * Check if current user has admin privileges
 * @returns {boolean}
 */
export function isCurrentUserAdmin() {
    try {
        const userRole = localStorage.getItem('userRole');
        return userRole === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * Get current user's email from localStorage
 * @returns {string|null}
 */
export function getCurrentUserEmail() {
    try {
        return localStorage.getItem('userEmail');
    } catch (error) {
        console.error('Error getting current user email:', error);
        return null;
    }
}
