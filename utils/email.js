const nodemailer = require("nodemailer");
const sendEMail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      rejectUnauthorized: false,
    },
  });
  // define email options
  const mailOptions = {
    from: "Shubham Desai <smtp.mailtrap.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEMail;
