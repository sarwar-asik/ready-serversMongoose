import nodemailer from 'nodemailer';
import config from '../config';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

export type IEmailOptions = {
  email: string;
  subject: string;
  html: any;
  text?: string;
};
export async function sendEmailFunc(options: IEmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.smtp_host,
      port: parseInt(config.smtp.smtp_port as string),
      // secure: false,
      auth: {
        user: config.smtp.smtp_mail,
        pass: config.smtp.smtp_password,
      },
    });

    await transporter.sendMail({
      from: config.smtp.smtp_mail,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not sent');
  }
}
