const fetch = require('node-fetch');

const url = 'http://127.0.0.1:19134/message';

(async () => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: "AaA", artist: "itsamemario" }),
        });
    
        if (!response.ok) {
            throw new Error(`HTTP request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending HTTP request to BDSX server:', error);
    }
})();
