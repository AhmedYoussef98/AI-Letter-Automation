module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    
    try {
        // Your Google Apps Script URL
        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbFJiqMQs-WYPqFy9qg-nKFfZPq3UB6ykvHO_Ieo8D-oesWlbOxMvKE7Vh_gjvOCSY/exec';
        
        // Parse the request body
        let requestData;
        if (typeof req.body === "string") {
            requestData = req.body;
        } else {
            // Convert object to URLSearchParams format
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(req.body)) {
                params.append(key, value);
            }
            requestData = params.toString();
        }
        
        console.log("Proxying request to Apps Script:", APPS_SCRIPT_URL);
        console.log("Request data:", requestData);
        
        // Make the request to Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestData,
        });
        
        const result = await response.json();
        console.log("Apps Script response:", result);
        
        // Return the response with CORS headers
        res.status(200).json(result);
        
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ 
            error: "Internal server error",
            message: error.message 
        });
    }
};
