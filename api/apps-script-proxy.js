// api/apps-script-proxy.js
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
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyuq1A0-PYojbyjPGfZK_8wqNJRw2iDoBrGGTUaz3xYX94qnEFG8S7Ew2Jdx83VJtjw/exec'; // Replace with your actual URL
    
    console.log('Proxying request to Apps Script:', APPS_SCRIPT_URL);
    console.log('Request data:', new URLSearchParams(req.body).toString());

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(req.body).toString(),
      redirect: 'follow' // Important: follow redirects
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
