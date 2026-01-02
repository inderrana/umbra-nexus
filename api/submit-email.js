// Serverless function to capture emails
// Works with Vercel, Netlify, etc.

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // CORS headers - restrict to your domain in production
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { email } = req.body;

        // Enhanced email validation
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        
        const trimmedEmail = email.trim();
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Get timestamp and anonymize IP for privacy compliance
        const timestamp = new Date().toISOString();
        const rawIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
        const ip = rawIp.split(',')[0];
        const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.xxx';

        // Log to console (in production, save to database)
        console.log('Email submission:', {
            email: trimmedEmail,
            timestamp,
            ip: anonymizedIp // Privacy-friendly logging
        });

        // Option 1: Send to your email via SendGrid/Mailgun
        // await sendEmail(email);

        // Option 2: Save to database (Supabase, MongoDB, etc.)
        // await saveToDatabase(email, timestamp);

        // Option 3: Send to Google Sheets
        // await appendToSheet(email, timestamp);

        // Option 4: Log to file (for simple deployments)
        // await appendToFile(email, timestamp);

        // For now, just return success
        return res.status(200).json({ 
            success: true, 
            message: 'Email received'
        });

    } catch (error) {
        console.error('Error processing email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Optional: Send email notification
async function sendEmail(submittedEmail) {
    // Using SendGrid example
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // 
    // await sgMail.send({
    //     to: process.env.ADMIN_EMAIL,
    //     from: process.env.FROM_EMAIL,
    //     subject: 'New Email Submission',
    //     text: `New email: ${submittedEmail}`
    // });
}

// Optional: Save to database
async function saveToDatabase(email, timestamp) {
    // Using Supabase example
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(
    //     process.env.SUPABASE_URL,
    //     process.env.SUPABASE_KEY
    // );
    // 
    // await supabase
    //     .from('emails')
    //     .insert([{ email, timestamp }]);
}
