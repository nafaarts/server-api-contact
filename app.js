require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const sendEmail = require("./mail");
const request = require("request");
const { response } = require("express");

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.use(morgan("dev"));

app.post("/contact", async (req, res) => {
  let date = new Date();
  let template = `
    <div>
      <h2>An Email From Your Contact Page</h2>
      <hr>
      <ul style="list-style:none; padding: 0">
        <li>Name : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
        <li>Date : ${date}</li>
        <li>Message : ${req.body.message}</li>
      </ul>
    </div>
  `;

  let data = {
    from: '"Nfalldh Page\'s" <noreply@nafaarts.com>',
    to: "nfalldh@gmail.com, naufal@nafaarts.com",
    subject: "You've got a new email!",
    // text: req.body.text,
    html: template,
  };

  let email = await sendEmail(data).catch(() => {
    res.sendStatus(500);
  });

  res.send({
    message: "email has been sent!",
    status: 20,
  });
});

app.post("/testCaptcha", (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ) {
    res.status(403);
    return res.json({
      msg: "please select captcha!",
      status: 403,
    });
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    console.log(body);

    if (body.success !== undefined && !body.success) {
      res.status(403);
      return res.json({
        msg: "please select captcha!",
        status: 403,
      });
    }

    res.status(200);
    return res.json({
      msg: "verfication passed!",
      status: 200,
    });
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404 Not Found</h1>");
});

app.listen(port, () => {
  console.log(`Server running....`);
});
