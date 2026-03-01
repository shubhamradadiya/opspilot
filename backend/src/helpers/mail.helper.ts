import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('MAIL_HOST'),
      port: Number(configService.get<number>('MAIL_PORT')),
      secure: configService.get<string>('MAIL_ENCRYPTION') === 'ssl', // true for 465, false for 587
      auth: {
        user: configService.get<string>('MAIL_USERNAME'),
        pass: configService.get<string>('MAIL_PASSWORD'),
      },
    });

    this.defaultFrom = this.configService.get<string>('MAIL_FROM_ADDRESS') || '';
  }

  /**
   * Render EJS email template with context
   * @param templateName
   * @param context
   * @returns
   */
  async renderTemplate(templateName: string, context: Record<string, unknown>): Promise<string> {
    const templatePath = join(__dirname, '..', 'views', 'emails', `${templateName}.ejs`);
    const templateString = fs.readFileSync(templatePath, 'utf-8');
    return ejs.render(templateString, context);
  }

  /**
   * Send email using rendered template
   * @param to
   * @param subject
   * @param templateName
   * @param context
   * @returns
   */
  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, unknown> = {},
  ): Promise<nodemailer.SentMessageInfo> {
    const html = await this.renderTemplate(templateName, context);

    return this.transporter.sendMail({
      from: this.defaultFrom,
      to,
      subject,
      html,
    });
  }
}
