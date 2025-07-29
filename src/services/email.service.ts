import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(SMTP_PORT || '587'),
      secure: (SMTP_PORT || '587') === '465', // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"Recovery App" <${SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${options.to}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const template = this.getWelcomeTemplate(userName);

    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    userEmail: string,
    resetToken: string
  ): Promise<void> {
    const template = this.getPasswordResetTemplate(resetToken);

    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send recovery milestone email
   */
  async sendMilestoneEmail(
    userEmail: string,
    userName: string,
    milestone: string
  ): Promise<void> {
    const template = this.getMilestoneTemplate(userName, milestone);

    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send daily check-in reminder
   */
  async sendCheckInReminder(
    userEmail: string,
    userName: string
  ): Promise<void> {
    const template = this.getCheckInReminderTemplate(userName);

    await this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Welcome email template
   */
  private getWelcomeTemplate(userName: string): EmailTemplate {
    return {
      subject: 'Welcome to Your Recovery Journey',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome, ${userName}!</h2>
          <p>Thank you for joining your personalized recovery journey. We're here to support you every step of the way.</p>
          <p>Your recovery dashboard is now ready with:</p>
          <ul>
            <li>Personalized recovery milestones</li>
            <li>Daily check-in reminders</li>
            <li>Progress tracking</li>
            <li>24/7 support resources</li>
          </ul>
          <p>Start your journey today!</p>
          <p>Best regards,<br>The Recovery Team</p>
        </div>
      `,
      text: `Welcome ${userName}! Thank you for joining your personalized recovery journey. Your dashboard is ready with milestones, check-ins, and progress tracking.`,
    };
  }

  /**
   * Password reset email template
   */
  private getPasswordResetTemplate(resetToken: string): EmailTemplate {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return {
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You requested a password reset for your recovery account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
      text: `Password Reset Request: Click here to reset your password: ${resetUrl}`,
    };
  }

  /**
   * Milestone email template
   */
  private getMilestoneTemplate(
    userName: string,
    milestone: string
  ): EmailTemplate {
    return {
      subject: 'Congratulations! You\'ve Reached a Milestone',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Congratulations, ${userName}!</h2>
          <p>You've reached an important milestone in your recovery journey:</p>
          <h3 style="color: #059669;">${milestone}</h3>
          <p>Keep up the great work! Your dedication is paying off.</p>
          <p>Continue tracking your progress in your dashboard.</p>
          <p>Best regards,<br>The Recovery Team</p>
        </div>
      `,
      text: `Congratulations ${userName}! You've reached the milestone: ${milestone}. Keep up the great work!`,
    };
  }

  /**
   * Check-in reminder email template
   */
  private getCheckInReminderTemplate(userName: string): EmailTemplate {
    return {
      subject: 'Daily Recovery Check-in Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Good morning, ${userName}!</h2>
          <p>It's time for your daily recovery check-in.</p>
          <p>Take a moment to:</p>
          <ul>
            <li>Track your symptoms</li>
            <li>Update your progress</li>
            <li>Review today's milestones</li>
          </ul>
          <p>Your daily check-in helps us provide better support.</p>
          <p>Best regards,<br>The Recovery Team</p>
        </div>
      `,
      text: `Good morning ${userName}! It's time for your daily recovery check-in. Track your symptoms and progress today.`,
    };
  }
}

export const emailService = new EmailService();
