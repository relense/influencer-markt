import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.EMAIL_SMTP_KEY,
  },
});

const mailOptions = {
  from: process.env.EMAIL_FROM,
};

export { transporter, mailOptions };
