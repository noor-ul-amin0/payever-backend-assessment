import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_AUTH_USER,
        pass: process.env.MAILTRAP_AUTH_PASS,
      },
    });
  }

  async sendWelcomeEmail(userEmail: string): Promise<void> {
    try {
      // Send the welcome email
      await this.transporter.sendMail({
        from: process.env.MAILTRAP_FROM,
        to: userEmail,
        subject: 'Welcome to our application',
        html: `
          <h1>Welcome to our application</h1>
          <p>Thank you for joining us!</p>
          <p>Feel free to explore and enjoy our services.</p>
        `,
      });
    } catch (error) {
      // Handle any error that occurred while sending the email
      console.error('Error sending welcome email:', error);
    }
  }
}
