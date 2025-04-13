import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer'
import { EmailInfoConfig } from 'src/config/register.config';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
    to: string,
    subject: string,
    html: string
}

@Injectable()
export class EmailService {

    private transporter: Mail

    constructor(@Inject(EmailInfoConfig.KEY) private config: ConfigType<typeof EmailInfoConfig>) {
        this.transporter = nodemailer.createTransport({
            service: config.service,
            auth: config.auth
        })
    }

    async sendEmail(options: EmailOptions): Promise<any> {
        return await this.transporter.sendMail(options)
    }
}

