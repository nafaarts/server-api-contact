const nodemailer = require("nodemailer");

async function sendEmail(data) {
  //   let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "sgz15.cloudhost.id",
    port: 465,
    secure: true,
    auth: {
      user: "noreply@nafaarts.com",
      pass: "nH*?IWEJ}nVH",
    },
  });

  let info = await transporter.sendMail(data);

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return true;
}

module.exports = sendEmail;
