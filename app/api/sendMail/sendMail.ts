import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const transport = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

type SendEMailDto = {
    sender : Mail.Address,
    receiver: Mail.Address,
    subject: string,
    message: string
}
export const sendEmail = async (dto: SendEMailDto) =>{
    
    const {sender, receiver, subject, message} = dto;
    return await transport.sendMail({
        from: sender,
        to: receiver,
        subject,
        html: message,
        text: message,
    })
}