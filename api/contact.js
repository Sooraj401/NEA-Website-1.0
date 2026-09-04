import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, category, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Configure transporter (SMTP credentials from environment variables)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // App password if using Gmail
    },
  });

  // Minimal, high-end branded HTML email template
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Intake Matter</title>
      <style>
        body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; }
        .header { padding: 32px; border-bottom: 1px solid #1e293b; text-align: left; }
        .badge { display: inline-block; padding: 4px 10px; background-color: rgba(217, 119, 6, 0.15); border: 1px solid rgba(217, 119, 6, 0.3); color: #f59e0b; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 16px 0 0 0; }
        .body { padding: 32px; color: #cbd5e1; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .data-table td { padding: 12px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
        .data-label { color: #94a3b8; width: 140px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; font-weight: 600; }
        .data-value { color: #f8fafc; font-weight: 500; }
        .data-value a { color: #d97706; text-decoration: none; }
        .message-box { background-color: #070b14; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-top: 10px; }
        .message-text { color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0; }
        .footer { padding: 24px 32px; background-color: #070b14; border-top: 1px solid #1e293b; text-align: center; }
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
              <td class="data-label">Matter Category</td>
              <td class="data-value"><span style="color: #fbbf24; font-weight: 600;">${category || 'General Counsel'}</span></td>
            </tr>
          </table>

          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">Matter Summary</div>
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
      from: `"NEA Intake" <${process.env.SMTP_USER}>`,
      to: process.env.COMPANY_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Confidential Intake] ${category} - ${name}`,
      html: htmlTemplate,
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Mail delivery failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to dispatch email.' });
  }
}