import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import nodemailer from 'nodemailer';

@Processor('email-queue')
export class NotificationProcessor {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
      },
  });

  @Process('send-email')
  async handleSendEmail(job: Job) {
    const { to, subject, text } = job.data;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
   };

    await this.transporter.sendMail(mailOptions);
  }
}
