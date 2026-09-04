// Determine credentials from either variable naming convention
const user = process.env.SMTP_USER || process.env.HOSTINGER_EMAIL;
const rawPass = process.env.SMTP_PASS || process.env.HOSTINGER_PASSWORD;

// Strip spaces or dashes (often present in Google App Passwords)
const pass = rawPass ? rawPass.replace(/[\s-]/g, '') : '';

// Validate before attempting to connect
if (!user || !pass) {
  console.error("Missing SMTP Credentials:", { user: !!user, pass: !!pass });
  return res.status(500).json({ 
    success: false, 
    message: "Server email credentials are not configured properly." 
  });
}

const isGmail = user.endsWith('@gmail.com');

const transporter = nodemailer.createTransport(
  isGmail
    ? {
        service: 'gmail',
        auth: { user, pass },
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: true,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      }
);