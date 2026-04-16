import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || 'test',
    pass: process.env.SMTP_PASS || 'test',
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'test') {
    // Development mode / no credentials — just log instead of crashing
    console.log(`[EMAIL DEV LOG] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Cal.com" <noreply@cal.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Error sending email:', err);
  }
};
