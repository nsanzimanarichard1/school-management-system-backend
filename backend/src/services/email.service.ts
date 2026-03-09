import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendRegistrationEmail(email: string, name: string, deviceId: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'SchoolHub <noreply@schoolhub.com>',
        to: email,
        subject: 'Registration Successful - Awaiting Device Approval',
        html: `
          <h2>Welcome to SchoolHub, ${name}!</h2>
          <p>Your registration was successful. Your account is currently pending device verification by an administrator.</p>
          <p><strong>Your Device ID:</strong> ${deviceId}</p>
          <p>You will receive another email once your device has been approved. After approval, you can login using your credentials.</p>
          <p>Thank you for your patience!</p>
          <br>
          <p>Best regards,<br>SchoolHub Team</p>
        `
      });
    } catch (error) {
      console.error('Failed to send registration email:', error);
    }
  }

  async sendDeviceApprovalEmail(email: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'SchoolHub <noreply@schoolhub.com>',
        to: email,
        subject: 'Device Approved - You Can Now Login',
        html: `
          <h2>Great News, ${name}!</h2>
          <p>Your device has been approved by the administrator.</p>
          <p>You can now login to your SchoolHub account using your email and password.</p>
          <p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
          <br>
          <p>Best regards,<br>SchoolHub Team</p>
        `
      });
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }
  }
}

export default new EmailService();
