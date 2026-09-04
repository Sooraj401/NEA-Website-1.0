import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Parse body safely whether sent as parsed JSON or raw string
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: 'Malformed JSON payload' });
    }
  }

  const { name, email, category, message, phone, customCategory } = body || {};

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !message?.trim() || !phone?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (Name, Email, Phone, Matter).',
    });
  }

  // Support both SMTP_* and HOSTINGER_* environment variable naming conventions
  const user = process.env.SMTP_USER || process.env.HOSTINGER_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.HOSTINGER_PASSWORD;


  // Prevent Nodemailer "Missing credentials for PLAIN" crash
  if (!user || !pass) {
    console.error('Missing SMTP Credentials:', { user: !!user, pass: !!pass });
    return res.status(500).json({
      success: false,
      message: 'Server email credentials are not configured properly.',
    });
  }

  // Resolve category if "Other" was specified
  const finalCategory =
    category === 'Other' || !category
      ? (customCategory || 'General Inquiry').trim()
      : category.trim();

  // Dynamic SMTP connection (auto-configures Gmail or Hostinger)
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

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Intake Matter</title>
      <style>
        body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { max-width: 600px; margin: 30px auto; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
        .header { padding: 28px 32px; border-bottom: 1px solid #1e293b; text-align: left; }
        .badge { display: inline-block; padding: 4px 10px; background-color: rgba(217, 119, 6, 0.15); border: 1px solid rgba(217, 119, 6, 0.3); color: #f59e0b; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 14px 0 0 0; }
        .body { padding: 28px 32px; color: #cbd5e1; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .data-table td { padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
        .data-label { color: #94a3b8; width: 130px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; font-weight: 600; }
        .data-value { color: #f8fafc; font-weight: 500; }
        .data-value a { color: #d97706; text-decoration: none; }
        .message-box { background-color: #070b14; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-top: 8px; }
        .message-text { color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0; }
        .footer { padding: 20px 32px; background-color: #070b14; border-top: 1px solid #1e293b; text-align: center; }
        .footer p { color: #64748b; font-size: 12px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="badge">Privileged & Confidential Intake</span>
          <h1 class="title">New Case Assessment Inquiry</h1>
        </div>
        <div class="body">
          <table class="data-table">
            <tr>
              <td class="data-label">Full Name</td>
              <td class="data-value">${name}</td>
            </tr>
            <tr>
              <td class="data-label">Contact Email</td>
              <td class="data-value"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td class="data-label">Phone Number</td>
              <td class="data-value">${phone}</td>
            </tr>
            <tr>
              <td class="data-label">Matter Category</td>
              <td class="data-value"><span style="color: #fbbf24; font-weight: 600;">${finalCategory}</span></td>
            </tr>
          </table>

          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600;">Matter Summary</div>
          <div class="message-box">
            <p class="message-text">${message}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} NestEggAssurance (NEA Legal Solutions). Automated Dispatch.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"NEA Intake" <${user}>`,
      to: process.env.COMPANY_EMAIL || process.env.COMPANY_RECEIVE_EMAIL || user,
      replyTo: email,
      subject: `[Confidential Intake] ${finalCategory} - ${name}`,
      html: htmlTemplate,
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Mail delivery error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to dispatch email.' });
  }
}