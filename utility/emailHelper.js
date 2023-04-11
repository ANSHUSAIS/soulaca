const nodemailer = require("nodemailer");
const mailHelper = async (option) => {
    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS, 
        },
      });

      const message = {
        from:option.from, 
        to: option.to, 
        subject:option.subject ,
        text:option.text , 
        html: option.html, 
      }
      await transporter.sendMail(message);
}
module.exports = mailHelper