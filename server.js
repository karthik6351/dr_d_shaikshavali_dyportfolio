const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Simple authentication (In a real app, use sessions or JWT)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'shah' && password === 'Shah321') {
        res.json({ success: true, token: 'admin-token-123' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Save changes to index.html
app.post('/api/save', (req, res) => {
    const { token, mainContent } = req.body;
    
    if (token !== 'admin-token-123') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const indexPath = path.join(__dirname, 'index.html');
    
    try {
        const html = fs.readFileSync(indexPath, 'utf-8');
        const $ = cheerio.load(html);
        
        // Update the main element's inner HTML
        // We use .html(mainContent) to replace everything inside <main id="main">
        $('#main').html(mainContent);
        
        // Remove contenteditable attributes that might have been accidentally sent
        $('[contenteditable]').removeAttr('contenteditable');
        
        // Save the updated HTML
        fs.writeFileSync(indexPath, $.html(), 'utf-8');
        
        res.json({ success: true, message: 'Portfolio updated successfully' });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ success: false, message: 'Error saving changes' });
    }
});

app.listen(PORT, () => {
    console.log(`Admin backend server running on http://localhost:${PORT}`);
});
