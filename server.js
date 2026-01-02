const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.buymeacoffee.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// CORS Configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 email submissions per hour
    message: 'Too many email submissions, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Body Parser with Size Limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// HTTPS enforcement - redirect HTTP to message
app.use((req, res, next) => {
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    
    if (!isSecure && process.env.NODE_ENV === 'production') {
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>...</title>
                <style>
                    body {
                        background: #000;
                        color: #fff;
                        font-family: 'Courier New', monospace;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        font-size: 14px;
                    }
                    .message {
                        text-align: center;
                        line-height: 2;
                        letter-spacing: 1px;
                    }
                    .grey {
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="message">
                    ...<br><br>
                    access denied<br><br>
                    <span class="grey">insecure protocol</span><br><br>
                    ...
                </div>
            </body>
            </html>
        `);
    }
    next();
});

app.use(express.static('public'));

// Email submission endpoint with validation
app.post('/api/submit-email',
    emailLimiter,
    [
        body('email')
            .trim()
            .isEmail().withMessage('Invalid email address')
            .normalizeEmail()
            .isLength({ max: 254 }).withMessage('Email too long')
    ],
    async (req, res) => {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        try {
            const { email } = req.body;

            // Get timestamp and anonymized IP (last octet removed for privacy)
            const timestamp = new Date().toISOString();
            const rawIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
            const ip = rawIp.split(',')[0];
            const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.xxx';

            const submission = {
                email,
                timestamp,
                ip: anonymizedIp // Privacy-friendly IP logging
            };

            // Log to console (anonymized)
            console.log('Email submission received:', { timestamp, ipPrefix: anonymizedIp });

        // Save to JSON file (simple storage)
        try {
            let emails = [];
            try {
                const data = await fs.readFile('emails.json', 'utf8');
                emails = JSON.parse(data);
                // Limit file size to prevent DoS
                if (emails.length > 10000) {
                    emails = emails.slice(-9000); // Keep last 9000 entries
                }
            } catch (err) {
                // File doesn't exist yet, start with empty array
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }

            emails.push(submission);
            await fs.writeFile('emails.json', JSON.stringify(emails, null, 2), { mode: 0o600 });
        } catch (fileError) {
            console.error('Error saving to file');
            return res.status(500).json({ error: 'Unable to process request' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Email received'
        });

    } catch (error) {
        console.error('Error processing email');
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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error');
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}`);
});
