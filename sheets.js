// Google Sheets API Configuration (for read-only operations)
const SPREADSHEET_ID = '1cLbTgbluZyWYHRouEgqHQuYQqKexHhu4st9ANzuaxGk';
const API_KEY = 'AIzaSyBqF-nMxyZMrjmdFbULO9I_j75hXXaiq4A';
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

// NEW: Your Google Apps Script Web App URL
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzWtObb3O5GG8s8XN-mduvzw2lFrUvaATUwx-qULzcxDUHeJDtZJiA9mbq9KZ4ey8xq/exec'; // REPLACE THIS WITH THE URL YOU COPIED FROM APPS SCRIPT DEPLOYMENT

// Load settings from Google Sheets
async function loadSettings() {
    try {
        const range = 'Settings!A:G';
        const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            // Skip header row
            const settings = data.values.slice(1);
            return processSettings(settings);
        }
        
        return null;
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
}

// Process settings data
function processSettings(settings) {
    const processed = {
        letterTypes: [],
        recipientTitles: [], // For "لقب المرسل إليه"
        styles: []
    };
    
    settings.forEach(row => {
        if (row[1]) processed.letterTypes.push(row[1]); // Column B
        if (row[2]) processed.recipientTitles.push(row[2]); // Column C
        if (row[6]) processed.styles.push(row[6]); // Column G
    });
    
    // Remove duplicates
    processed.letterTypes = [...new Set(processed.letterTypes)];
    processed.recipientTitles = [...new Set(processed.recipientTitles)];
    processed.styles = [...new Set(processed.styles)];
    
    return processed;
}

// Load received letters data from Google Sheets
async function loadReceivedData() {
    try {
        const range = 'Received!A:B';
        const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            // Skip header row
            const received = data.values.slice(1);
            return processReceivedData(received);
        }
        
        return [];
    } catch (error) {
        console.error('Error loading received data:', error);
        return [];
    }
}

// Process received data
function processReceivedData(received) {
    return received.map(row => ({
        id: row[0] || '',
        content: row[1] || ''
    }));
}

async function loadSubmissionsData() {
    try {
        const range = 'Submissions!A:O'; // Updated range to include column O
        const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            // Skip header row
            const submissions = data.values.slice(1);
            return processSubmissions(submissions);
        }
        
        return [];
    } catch (error) {
        console.error('Error loading submissions:', error);
        return [];
    }
}

// Process submissions data
function processSubmissions(submissions) {
    return submissions.map(row => ({
        id: row[0] || '',
        date: row[1] || '',
        type: row[3] || '',
        recipient: row[4] || '',
        subject: row[5] || '',
        content: row[6] || '', // Column G
        letterLink: row[8] || '', // Column I
        reviewStatus: row[9] || 'في الانتظار',
        sendStatus: row[10] || 'في الانتظار',
        reviewerName: row[12] || '', // Column M
        reviewNotes: row[13] || '', // Column N
        writer: row[14] || '' // Column O - NEW: Writer column
    }));
}

// Update review status in Google Sheets using Apps Script
// UPDATED: Now includes letterContent parameter
async function updateReviewStatusInSheet(letterId, status, reviewerName, notes, letterContent) {
    try {
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for cross-origin requests to Apps Script
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Required for e.parameter in Apps Script
            },
            body: new URLSearchParams({
                action: 'updateReviewStatus',
                letterId: letterId,
                status: status,
                reviewerName: reviewerName,
                notes: notes,
                letterContent: letterContent // NEW: Include the letter content
            })
        });

        // Note: When using 'no-cors', response.ok will always be true, and you can't read the response body.
        // You'll rely on the Apps Script execution to confirm success.
        console.log('Request to update review status sent to Apps Script.');
    } catch (error) {
        console.error('Error sending update review status request to Apps Script:', error);
        throw error; // Re-throw to be caught by the calling function in main.js
    }
}

// Delete letter from Google Sheets using Apps Script
async function deleteLetterFromSheet(letterId) {
    try {
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for cross-origin requests to Apps Script
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'deleteLetter',
                letterId: letterId
            })
        });

        console.log('Request to delete letter sent to Apps Script.');
    } catch (error) {
        console.error('Error sending delete letter request to Apps Script:', error);
        throw error; // Re-throw to be caught by the calling function in main.js
    }
}

// Populate dropdowns on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('letterType')) {
        const settings = await loadSettings();
        
        if (settings) {
            // Populate letter type dropdown
            const letterTypeSelect = document.getElementById('letterType');
            settings.letterTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                letterTypeSelect.appendChild(option);
            });
            
            // Populate recipient title dropdown
            const recipientTitleSelect = document.getElementById('recipientTitle');
            if (recipientTitleSelect) {
                settings.recipientTitles.forEach(title => {
                    const option = document.createElement('option');
                    option.value = title;
                    option.textContent = title;
                    recipientTitleSelect.appendChild(option);
                });
                // Add the 'أخرى' option
                const otherOption = document.createElement('option');
                otherOption.value = 'أخرى';
                otherOption.textContent = 'أخرى';
                recipientTitleSelect.appendChild(otherOption);
            }
            
            // Populate style dropdown
            const styleSelect = document.getElementById('letterStyle');
            if (styleSelect) {
                settings.styles.forEach(style => {
                    const option = document.createElement('option');
                    option.value = style;
                    option.textContent = style;
                    styleSelect.appendChild(option);
                });
            }
        }
    }
});
