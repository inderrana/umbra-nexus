const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Email submission endpoint
app.post('/api/submit-email', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Get timestamp and IP
        const timestamp = new Date().toISOString();
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const submission = {
            email,
            timestamp,
            ip: ip?.split(',')[0]
        };

        // Log to console
        console.log('Email submission:', submission);

        // Save to JSON file (simple storage)
        try {
            let emails = [];
            try {
                const data = await fs.readFile('emails.json', 'utf8');
                emails = JSON.parse(data);
            } catch (err) {
                // File doesn't exist yet, start with empty array
            }

            emails.push(submission);
            await fs.writeFile('emails.json', JSON.stringify(emails, null, 2));
        } catch (fileError) {
            console.error('Error saving to file:', fileError);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Email received'
        });

    } catch (error) {
        console.error('Error processing email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Hell.com server running on port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}`);
});
