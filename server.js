const express = require('express');
const axios = require('axios');
const https = require('https');
const formidable = require('formidable');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('.'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.all('/api/proxy', async (req, res) => {
    if (!['GET', 'PUT', 'POST', 'DELETE'].includes(req.method)) {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const API_BASE_URL = 'https://128.140.37.194:5000';
        
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        if (req.method === 'GET') {
            const { endpoint, session_id, category, letter_id, limit, offset, include_expired } = req.query;
            
            let targetUrl;
            switch (endpoint) {
                case 'letter-categories':
                    targetUrl = `${API_BASE_URL}/api/v1/letter/categories`;
                    break;
                case 'letter-template':
                    targetUrl = `${API_BASE_URL}/api/v1/letter/templates/${category}`;
                    break;
                case 'chat-sessions':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/sessions`;
                    if (include_expired) targetUrl += `?include_expired=${include_expired}`;
                    break;
                case 'chat-history':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/sessions/${session_id}/history`;
                    const params = new URLSearchParams();
                    if (limit) params.append('limit', limit);
                    if (offset) params.append('offset', offset);
                    if (params.toString()) targetUrl += `?${params.toString()}`;
                    break;
                case 'chat-status':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/sessions/${session_id}/status`;
                    break;
                case 'memory-stats':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/memory/stats`;
                    break;
                case 'memory-instructions':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/memory/instructions`;
                    const memParams = new URLSearchParams();
                    if (category) memParams.append('category', category);
                    if (session_id) memParams.append('session_id', session_id);
                    if (memParams.toString()) targetUrl += `?${memParams.toString()}`;
                    break;
                case 'archive-status':
                    targetUrl = `${API_BASE_URL}/api/v1/archive/status/${letter_id}`;
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid GET endpoint' });
            }
            
            try {
                console.log('GET request to:', targetUrl);
                const response = await axios.get(targetUrl, {
                    httpsAgent: agent,
                    timeout: 30000
                });
                
                console.log('GET API success:', response.status);
                return res.status(200).json(response.data);
            } catch (axiosError) {
                console.error(`GET ${endpoint} API error:`, axiosError.message);
                if (axiosError.response) {
                    return res.status(axiosError.response.status).json({
                        error: `${endpoint} API error`,
                        message: axiosError.response.data || axiosError.message
                    });
                } else {
                    return res.status(500).json({
                        error: 'Internal server error',
                        message: `Failed to call ${endpoint} endpoint`
                    });
                }
            }
        }

        if (req.method === 'DELETE') {
            const { endpoint, session_id } = req.query;
            
            let targetUrl;
            switch (endpoint) {
                case 'delete-chat-session':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/sessions/${session_id}`;
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid DELETE endpoint' });
            }
            
            try {
                console.log('DELETE request to:', targetUrl);
                const response = await axios.delete(targetUrl, {
                    httpsAgent: agent,
                    timeout: 30000
                });
                
                console.log('DELETE API success:', response.status);
                return res.status(200).json(response.data);
            } catch (axiosError) {
                console.error(`DELETE ${endpoint} API error:`, axiosError.message);
                if (axiosError.response) {
                    return res.status(axiosError.response.status).json({
                        error: `${endpoint} API error`,
                        message: axiosError.response.data || axiosError.message
                    });
                } else {
                    return res.status(500).json({
                        error: 'Internal server error',
                        message: `Failed to call ${endpoint} endpoint`
                    });
                }
            }
        }

        if (req.method === 'PUT') {
            console.log('Processing PUT request');
            
            let requestData;
            try {
                requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                return res.status(400).json({ error: 'Invalid JSON in request body' });
            }
            
            const { endpoint, data } = requestData;
            
            let targetUrl;
            switch (endpoint) {
                case 'update-archive':
                    targetUrl = `${API_BASE_URL}/api/v1/archive/update`;
                    break;
                default:
                    console.log('Invalid PUT endpoint:', endpoint);
                    return res.status(400).json({ error: 'Invalid endpoint' });
            }
            
            try {
                console.log(`Attempting ${endpoint} PUT call to:`, targetUrl);
                console.log('Payload:', data);
                
                const response = await axios.put(targetUrl, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    httpsAgent: agent,
                    timeout: 30000,
                });
                
                console.log(`${endpoint} PUT success:`, response.status);
                return res.status(200).json(response.data);
                
            } catch (axiosError) {
                console.error(`${endpoint} PUT error:`, axiosError.message);
                if (axiosError.response) {
                    console.error(`${endpoint} PUT response data:`, axiosError.response.data);
                    console.error(`${endpoint} PUT response status:`, axiosError.response.status);
                    return res.status(axiosError.response.status).json({
                        error: `${endpoint} PUT error`,
                        message: axiosError.response.data || axiosError.message
                    });
                } else {
                    return res.status(500).json({
                        error: 'Internal server error',
                        message: `Failed to call ${endpoint}. Please try again later.`
                    });
                }
            }
        }

        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('multipart/form-data')) {
            console.log('Processing FormData request for archive-letter');
            
            const form = new formidable.IncomingForm({
                multiples: true,
                keepExtensions: true,
                maxFileSize: 50 * 1024 * 1024,
            });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Formidable error:', err);
                    return res.status(500).json({
                        error: 'Internal server error',
                        message: 'Failed to parse form data.'
                    });
                }

                console.log('Parsed fields:', fields);
                console.log('Parsed files:', Object.keys(files));

                const targetUrl = `${API_BASE_URL}/api/v1/archive/letter`;
                const formData = new FormData();

                for (const key in fields) {
                    if (key !== 'endpoint') {
                        const value = fields[key];
                        
                        if (Array.isArray(value)) {
                            if (value.length > 0) {
                                formData.append(key, value[0]);
                                console.log(`Added field (from array): ${key} = ${value[0]}`);
                            }
                        } else {
                            formData.append(key, value);
                            console.log(`Added field: ${key} = ${value}`);
                        }
                    }
                }

                for (const key in files) {
                    const file = files[key];
                    
                    if (Array.isArray(file)) {
                        file.forEach((f, index) => {
                            if (f && f.filepath) {
                                const fileKey = file.length > 1 ? `${key}_${index}` : key;
                                formData.append(fileKey, fs.createReadStream(f.filepath), {
                                    filename: f.originalFilename || 'file',
                                    contentType: f.mimetype || 'application/octet-stream'
                                });
                                console.log(`Added file (from array): ${fileKey} = ${f.originalFilename}`);
                            }
                        });
                    } else {
                        if (file && file.filepath) {
                            formData.append(key, fs.createReadStream(file.filepath), {
                                filename: file.originalFilename || 'file',
                                contentType: file.mimetype || 'application/octet-stream'
                            });
                            console.log(`Added file: ${key} = ${file.originalFilename}`);
                        }
                    }
                }

                try {
                    console.log('Sending request to:', targetUrl);
                    const response = await axios.post(targetUrl, formData, {
                        headers: {
                            ...formData.getHeaders(),
                        },
                        httpsAgent: agent,
                        timeout: 30000,
                    });
                    
                    console.log('Archive API success:', response.status);
                    return res.status(200).json(response.data);
                    
                } catch (axiosError) {
                    console.error('Archive API error:', axiosError.message);
                    if (axiosError.response) {
                        console.error('Archive API response data:', axiosError.response.data);
                        console.error('Archive API response status:', axiosError.response.status);
                        return res.status(axiosError.response.status).json({
                            error: 'Archive API error',
                            message: axiosError.response.data || axiosError.message
                        });
                    } else {
                        return res.status(500).json({
                            error: 'Internal server error',
                            message: 'Failed to archive letter. Please try again later.'
                        });
                    }
                }
            });
            
        } else {
            console.log('Processing JSON request');
            
            let requestData;
            try {
                requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                return res.status(400).json({ error: 'Invalid JSON in request body' });
            }
            
            const { endpoint, data } = requestData;
            
            let targetUrl;
            switch (endpoint) {
                case 'generate-letter':
                    targetUrl = `${API_BASE_URL}/api/v1/letter/generate`;
                    break;
                case 'validate-letter':
                    targetUrl = `${API_BASE_URL}/api/v1/letter/validate`;
                    break;
                case 'edit-letter':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/sessions/${data.session_id}/edit`;
                    break;
                case 'create-chat-session':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/sessions`;
                    break;
                case 'extend-chat-session':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/sessions/${data.session_id}/extend`;
                    break;
                case 'cleanup-chat':
                    targetUrl = `${API_BASE_URL}/api/v1/chat/cleanup`;
                    break;
                case 'archive-letter':
                    targetUrl = `${API_BASE_URL}/api/v1/archive/letter`;
                    break;
                case 'update-archive':
                    targetUrl = `${API_BASE_URL}/api/v1/archive/update`;
                    break;
                default:
                    console.log('Invalid endpoint:', endpoint);
                    return res.status(400).json({ error: 'Invalid endpoint' });
            }
            
            try {
                console.log(`Attempting ${endpoint} API call to:`, targetUrl);
                console.log('Payload:', data);
                
                const response = await axios.post(targetUrl, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    httpsAgent: agent,
                    timeout: 30000,
                });
                
                console.log(`${endpoint} API success:`, response.status);
                return res.status(200).json(response.data);
                
            } catch (axiosError) {
                console.error(`${endpoint} API error:`, axiosError.message);
                if (axiosError.response) {
                    console.error(`${endpoint} API response data:`, axiosError.response.data);
                    console.error(`${endpoint} API response status:`, axiosError.response.status);
                    return res.status(axiosError.response.status).json({
                        error: `${endpoint} API error`,
                        message: axiosError.response.data || axiosError.message
                    });
                } else {
                    return res.status(500).json({
                        error: 'Internal server error',
                        message: `Failed to call ${endpoint}. Please try again later.`
                    });
                }
            }
        }
        
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

app.all('/api/apps-script-proxy', async (req, res) => {
    try {
        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUPSTsNajKH8ffg1fT4Wri9T-63eJYn4_zquPAkdPLF7c5g4nr89IXvbbFhyWEce9T/exec';
        
        console.log('Apps Script Proxy - Method:', req.method);
        console.log('Apps Script Proxy - Query:', req.query);
        console.log('Apps Script Proxy - Body:', req.body);

        let targetUrl = APPS_SCRIPT_URL;
        const queryParams = new URLSearchParams();

        if (req.method === 'GET') {
            Object.keys(req.query).forEach(key => {
                queryParams.append(key, req.query[key]);
            });
        } else if (req.method === 'POST') {
            const bodyParams = req.body || {};
            Object.keys(bodyParams).forEach(key => {
                queryParams.append(key, bodyParams[key]);
            });
        }

        if (queryParams.toString()) {
            targetUrl += `?${queryParams.toString()}`;
        }

        console.log('Forwarding to Apps Script:', targetUrl);

        const response = await axios.get(targetUrl, {
            timeout: 30000,
        });

        console.log('Apps Script Response:', response.status);
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Apps Script Proxy Error:', error.message);
        if (error.response) {
            console.error('Apps Script Error Response:', error.response.data);
            return res.status(error.response.status).json({
                error: 'Apps Script API error',
                message: error.response.data || error.message
            });
        } else {
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
