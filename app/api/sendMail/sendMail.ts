import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "anikbanna6@gmail.com",
      pass: "shizxixjrlijowrh"
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