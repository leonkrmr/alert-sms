import {conf} from "./env";
import mqtt from "mqtt";
const smsClient = require('twilio')(process.env.SMS_ACC_SID, process.env.SMS_AUTH_TOKEN);
// import nodemailer from 'nodemailer';


const host = `mqtt://${conf.mqttHost}:${conf.mqttPort}`;
const mqttClient = mqtt.connect(host);

mqttClient.on("connect", () => {
    console.log("Client connected");
})

mqttClient.on("error", err => {
    console.log("Error: ", err);
})

for (const topic of conf.mqttTopicSubscribe) {
    mqttClient.subscribe(topic);
}

// configure mail client TODO build mail client
// const mailTransporter = nodemailer.createTransport({
//     host:
// })

// get and configure SMS receiver and sender
const envSms = process.env.SMS_PHONE_NUMBERS_RECEIVE;
let receiverPhones: string[] | null = null;
if (envSms != null) {
    receiverPhones = envSms.split(" ");
}
const senderPhone = process.env.SMS_NUMBER_SENDER;

// get and configure EMAIL receiver and sender
const envEmails = process.env.RECEIVER_EMAILS;
let receiverEmails: string[] | null = null
if (envEmails != null) {
    receiverEmails = envEmails.split(" ");
}
const senderEmail = process.env.SENDER_EMAILS;

mqttClient.on("message", (topic, message, _) => {
    console.log("Message: ", topic + " - " + message.toString());
    if (message.toString() == "true") {
        console.log("alarm active", "sending message");
        if (receiverPhones != null && senderPhone != null) {
            for (const tel of receiverPhones) {
                smsClient.messages.create({
                    body: "This is a test message",
                    from: senderPhone,
                    to: tel
                }).then(() => {
                    console.log("SMS send: " + new Date().toLocaleString('de'))
                }).catch(() => {
                    console.log("Error occurred: " + new Date().toLocaleString('de'))
                });
            }
        }
        if (receiverEmails != null && senderEmail != null) {

        }
    }
})