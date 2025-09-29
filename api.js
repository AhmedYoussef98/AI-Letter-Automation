// API Configuration
const API_BASE_URL = 'https://128.140.37.194:5000'; // This goes through Vercel proxy

// Generate Letter API - Updated for new endpoint with optional title
async function generateLetter(formData) {
    const loader = document.getElementById('loader');
    loader.classList.add('active');
    
    try {
        // Determine the recipient_title to send - UPDATED LOGIC
        let finalRecipientTitle = formData.get('recipient_title');
        const otherRecipientTitle = formData.get('other_recipient_title');

        if (finalRecipientTitle === 'أخرى' && otherRecipientTitle) {
            finalRecipientTitle = otherRecipientTitle;
        } else if (!finalRecipientTitle || finalRecipientTitle.trim() === '') {
            // NEW: If no title selected, send fixed value
            finalRecipientTitle = 'لا يوجد لقب';
        }

        // Prepare the payload for new API structure
        const payload = {
            type: formData.get('type'),
            category: formData.get('category'),
            recipient: formData.get("recipient").trim() === "" ? "لا يوجد" : formData.get("recipient"),
            is_first: formData.get('is_first') === 'true',
            prompt: formData.get('prompt'),
            organization_name: formData.get('organization_name'),
            recipient_job_title: formData.get('recipient_job_title'),
            recipient_title: finalRecipientTitle, // Updated logic for optional recipient_title
        };

        // Only include member_name if a value is selected
        const memberName = formData.get('member_name');
        if (memberName && memberName.trim() !== '') {
            payload.member_name = memberName;
        }

        // Handle previous letter content for follow-up letters
        const previousLetterId = formData.get('previous_letter_id');
        if (previousLetterId && previousLetterId.trim() !== '') {
            const previousLetterSelect = document.getElementById('previousLetter');
            const selectedOption = previousLetterSelect.querySelector(`option[value="${previousLetterId}"]`);
            if (selectedOption && selectedOption.dataset.content) {
                payload.previous_letter_content = selectedOption.dataset.content;
                payload.previous_letter_id = previousLetterId;
            }
        }

        // Handle received letter content for reply letters
        const receivedLetterId = formData.get('received_letter_id');
        if (receivedLetterId && receivedLetterId.trim() !== '') {
            const receivedLetterSelect = document.getElementById('receivedLetter');
            const selectedOption = receivedLetterSelect.querySelector(`option[value="${receivedLetterId}"]`);
            if (selectedOption && selectedOption.dataset.content) {
                payload.previous_letter_content = selectedOption.dataset.content;
            }
        }
        
        // All requests go through Vercel proxy
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint: 'generate-letter',
                data: payload
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate letter');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error generating letter:', error);
        notify.error('حدث خطأ أثناء إنشاء الخطاب. الرجاء المحاولة مرة أخرى.');
        return null;
    } finally {
        loader.classList.remove('active');
    }
}

// Validate Letter API - NEW FUNCTION
async function validateLetter(letterContent) {
    try {
        const payload = { letter: letterContent };

        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint: 'validate-letter',
                data: payload
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to validate letter');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error validating letter:', error);
        return null;
    }
}

// Create Chat Session - NEW FUNCTION
async function createChatSession(initialLetter = null, context = null) {
    try {
        const payload = {};
        if (initialLetter) payload.initial_letter = initialLetter;
        if (context) payload.context = context;

        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint: 'create-chat-session',
                data: payload
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create chat session');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error creating chat session:', error);
        return null;
    }
}

// Edit Letter via Chat - UPDATED FUNCTION
async function editLetter(letter, feedback, sessionId) {
    const loader = document.getElementById('loader');
    loader.classList.add('active');
    
    try {
        if (!sessionId) {
            throw new Error('Session ID is required for editing');
        }

        const payload = {
            session_id: sessionId,
            message: feedback,
            current_letter: letter,
            editing_instructions: feedback,
            preserve_formatting: true
        };

        console.log('Sending edit request:', payload);

        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint: 'edit-letter',
                data: payload
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to edit letter');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error editing letter:', error);
        notify.error('حدث خطأ أثناء تعديل الخطاب. الرجاء المحاولة مرة أخرى.');
        return null;
    } finally {
        loader.classList.remove('active');
    }
}

// Delete Chat Session - NEW FUNCTION
async function deleteChatSession(sessionId) {
    try {
        if (!sessionId) {
            console.warn('No session ID provided for deletion');
            return true; // Don't throw error for missing session
        }

        const response = await fetch(`/api/proxy?endpoint=delete-chat-session&session_id=${sessionId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete session');
        }
        
        const data = await response.json();
        console.log('Session deleted successfully:', data);
        return data;
        
    } catch (error) {
        console.error('Error deleting session:', error);
        // Don't throw error - session cleanup should be non-blocking
        return null;
    }
}

// Get Archive Status - NEW FUNCTION
async function getArchiveStatus(letterId) {
    try {
        const response = await fetch(`/api/proxy?endpoint=archive-status&letter_id=${letterId}`, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error('Failed to get archive status');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error getting archive status:', error);
        return null;
    }
}

// Archive Letter API - Updated for new endpoint
async function archiveLetter(formData) {
    try {
        // Get the logged-in user data from sessionStorage
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const username = loggedInUser ? loggedInUser.username : null;

        // Convert FormData to a plain JS object
        const payload = {};
        for (let [key, value] of formData.entries()) {
            payload[key] = value;
        }

        // Add the username to the payload
        if (username) {
            payload.username = username;
            console.log('Adding username to archive payload:', username);
        } else {
            console.warn('No username found in sessionStorage');
        }

        const requestBody = {
            endpoint: 'archive-letter',
            data: payload
        };

        console.log('Sending archive request:', requestBody);

        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Archive response error:', errorText);
            throw new Error(`Failed to archive letter: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error archiving letter:', error);
        notify.error('حدث خطأ أثناء حفظ الخطاب. الرجاء المحاولة مرة أخرى.');
        return null;
    }
}

// Form submission handler
if (document.getElementById('letterForm')) {
    document.getElementById('letterForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate recipient name before proceeding
        const recipientInput = document.getElementById("recipient");
        const recipientValue = recipientInput.value.trim();

        // Count the number of words
        if (recipientValue.length > 0 && recipientValue.split(" ").length < 2) {
            alert("يرجى إدخال الاسم الأول والثاني للمرسل إليه.");
            recipientInput.focus();
            return;
        }
        
        const formData = new FormData(e.target);
        const result = await generateLetter(formData);
        
        if (result) {
            // Handle new API response structure
            const letterContent = result.letter || result.Letter || 'محتوى الخطاب المُنشأ سيظهر هنا...';
            
            // Display the generated letter in both formats
            document.getElementById('letterPreview').value = letterContent;
            
            // Populate the document template
            if (typeof populateDocumentTemplate === 'function') {
                populateDocumentTemplate({
                    Letter: letterContent,
                    Title: result.title || result.Title || 'خطاب',
                    ID: result.id || result.ID || generateUniqueId()
                }, formData);
            }
            
            document.getElementById('previewSection').style.display = 'block';
            
            // Store the generated letter data
            window.generatedLetterData = {
                Letter: letterContent,
                Title: result.title || result.Title || 'خطاب',
                ID: result.id || result.ID || generateUniqueId()
            };
            
            // Automatically validate the generated letter and display results
            if (typeof validateAndDisplayResults === 'function') {
                await validateAndDisplayResults(letterContent);
            }
        }
    });
}

// Generate unique ID for letters
function generateUniqueId() {
    return 'L' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
