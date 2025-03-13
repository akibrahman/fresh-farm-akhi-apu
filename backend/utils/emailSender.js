import nodemailer from "nodemailer";
import {
  otpEmailTemplate,
  passwordResetEmailTemplate,
} from "./emailTemplate.js";

// Transporter configuration gmail
const createTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  return transport;
};

// Send the OTP email
const sendOTPEmail = async (user, otp, verifyURL) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: "Welcome <system@elevatemart.com>",
    to: user.email,
    subject: "OTP for email verification",
    html: otpEmailTemplate(user, otp, verifyURL),
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (user, url) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: "Welcome <system@elevatemart.com>",
    to: user.email,
    subject: "Password Reset Email",
    html: passwordResetEmailTemplate(url),
  };

  await transporter.sendMail(mailOptions);
};

export { sendOTPEmail, sendPasswordResetEmail };
