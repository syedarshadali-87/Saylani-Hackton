const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(express.json())
app.use(cors());

const nodemailer = require('nodemailer');

// ✅ Setup email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add("hello from server")
    }

    function emailsender(agent) {
        const { name , email} = agent.parameters;
        agent.add(Hello ${name.name}, I will send an email to ${email});
        (async () => {
            try {
              const info = await transporter.sendMail({
                from: '"Syed Arshad Ali" <aliarshad357@gmail.com>',
                to: email,
                subject: "Hello ✔",
                text:Hello ${name.name}, I will send an email to ${email}, // plain‑text body
              });
              console.log("Message sent:", info.messageId);
            } catch (error) {
              console.error("Error sending email:", error);
            }
        })();
    }
//    function emailsender(agent) {
//         const { name , email} = agent.parameters;
//         agent.add(`Hello ${name.name}, I will send an email to ${email}`);
//     }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', hi); 
    intentMap.set('Email Testing', emailsender);
    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});