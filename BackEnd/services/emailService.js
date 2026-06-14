import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: `"ITechSkillsHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your ITechSkillsHub account',
    html: `
      <div style="font-family: 'Sora', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9fb; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1a1a2e; font-size: 22px; margin: 0;">ITechSkillsHub</h2>
          <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">TESDA CSS Training Platform</p>
        </div>

        <div style="background: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid rgba(0,0,0,0.08);">
          <h3 style="color: #1a1a2e; font-size: 18px; margin: 0 0 8px;">Verify your email</h3>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">
            Use the code below to verify your ITechSkillsHub account. This code expires in <strong>10 minutes</strong>.
          </p>

          <div style="background: #f0f0ff; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a2e;">${code}</span>
          </div>

          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 20px;">
          © 2026 ITechSkillsHub — PUP TESDA CSS Training
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}