// api/apps-script-proxy.js (UPDATED to handle both form data and JSON)
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAWuXZWJcyuImUc2yjM9Zb5aattFbNV9iQqS_uBwHnU2U6rv6Gb2drqKqp6EJQJjB-/exec';
    
    console.log('Proxying request to Apps Script:', APPS_SCRIPT_URL);
    console.log('Request Content-Type:', req.headers['content-type']);
    
    let body;
    let contentType = 'application/x-www-form-urlencoded';
    
    // Check if request is JSON (for whitelist management)
    if (req.headers['content-type']?.includes('application/json')) {
      console.log('JSON request detected');
      console.log('Request body:', req.body);
      
      // Convert JSON to FormData format for Apps Script
      const params = new URLSearchParams();
      Object.keys(req.body).forEach(key => {
        params.append(key, req.body[key]);
      });
      body = params.toString();
      console.log('Converted to URL params:', body);
    } else {
      // Handle form data (existing auth functionality)
      console.log('Form data request detected');
      body = new URLSearchParams(req.body).toString();
      console.log('Request data:', body);
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: body,
      redirect: 'follow'
    });

    console.log('Apps Script response status:', response.status);
    console.log('Apps Script response headers:', Object.fromEntries(response.headers));

    const responseText = await response.text();
    console.log('Apps Script raw response:', responseText);

    // Check if response is JSON
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response was:', responseText);
      return res.status(500).json({ 
        error: 'Invalid JSON response from Apps Script', 
        response: responseText.substring(0, 200) + '...' 
      });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(jsonData);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy request failed', 
      details: error.message 
    });
  }
}
