// Serverless function to capture emails
// Works with Vercel, Netlify, etc.

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { email } = req.body;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Get timestamp
        const timestamp = new Date().toISOString();
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Log to console (in production, save to database)
        console.log('Email submission:', {
            email,
            timestamp,
            ip: ip?.split(',')[0]
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
    //     subject: 'New Hell.com Email Submission',
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
