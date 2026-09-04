import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Ensure CORS and options request handling if mobile sends preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Fallback body parser in case the payload was parsed as string
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: 'Malformed JSON payload' });
    }
  }

  const { name, email, category, message, phone, customCategory } = body || {};

  // Check required fields with trim
  if (!name?.trim() || !email?.trim() || !message?.trim() || !phone?.trim()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in all required fields (Name, Email, Phone, Matter).' 
    });
  }

  const finalCategory = 
    category === 'Other' || !category 
      ? (customCategory || 'General Inquiry') 
      : category;

  // Determine host and user safely
  const smtpUser = process.env.SMTP_USER || process.env.HOSTINGER_EMAIL || '';
  const smtpPass = (process.env.SMTP_PASS || process.env.HOSTINGER_PASSWORD || '').replace(/[\s-]/g, '');
  const smtpHost = process.env.SMTP_HOST || (smtpUser.endsWith('@gmail.com') ? 'smtp.gmail.com' : 'smtp.hostinger.com');
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; background-color: #0b0f19; font-family: sans-serif; }
        .wrapper { max-width: 600px; margin: 20px auto; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; padding: 24px; color: #cbd5e1; }
        .title { color: #f59e0b; font-size: 18px; margin-bottom: 16px; font-weight: bold; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .data-table td { padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
        .label { color: #94a3b8; width: 130px; font-size: 12px; text-transform: uppercase; }
        .val { color: #fff; font-weight: 500; }
        .msg { background-color: #070b14; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; color: #e2e8f0; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="title">New Case Assessment Inquiry</div>
        <table class="data-table">
          <tr><td class="label">Full Name</td><td class="val">${name}</td></tr>
          <tr><td class="label">Email</td><td class="val"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
          <tr><td class="label">Phone</td><td class="val">${phone}</td></tr>
          <tr><td class="label">Category</td><td class="val">${finalCategory}</td></tr>
        </table>
        <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Matter Summary</div>
        <div class="msg">${message}</div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"NEA Intake" <${smtpUser}>`,
      to: process.env.COMPANY_EMAIL || process.env.COMPANY_RECEIVE_EMAIL || smtpUser,
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