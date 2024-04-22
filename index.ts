import {conf} from "./env";
import mqtt from "mqtt";

const smsClient = require('twilio')(process.env.SMS_ACC_SID, process.env.SMS_AUTH_TOKEN);
const mailService = require('@sendgrid/mail');


const host = `mqtt://${conf.mqttHost}:${conf.mqttPort}`;
const mqttClient = mqtt.connect(host);

// configure mail client
mailService.setApiKey(process.env.SENDGRID_API_KEY);

mqttClient.on("connect", () => {
    console.log("Client connected");
})

mqttClient.on("error", err => {
    console.log("Error: ", err);
})

for (const topic of conf.mqttAlertTopicSubscribe) {
    mqttClient.subscribe(topic);
}

function configureReceiverSenders(envToSplit: string | undefined) {
    if (envToSplit != null) {
        return envToSplit.split(' ');
    } else {
        return ['']
    }
}

// get and configure SMS receiver and sender
const receiverPhones = configureReceiverSenders(process.env.SMS_PHONE_NUMBERS_RECEIVE)
const senderPhone = process.env.SMS_NUMBER_SENDER;

// get and configure EMAIL receiver and sender
// const receiverEmails = configureReceiverSenders(process.env.RECEIVER_EMAILS);
// const senderEmail = process.env.SENDER_EMAILS;

// send sms and email on incoming mqtt message alert
mqttClient.on("message", (topic, message, _) => {
    console.log("Message: ", topic + " - " + message.toString());
    if (message.toString() == "true") {
        console.log("alarm active", "sending messages");
        for (const tel of receiverPhones) {
            smsClient.messages.create({
                body: conf.alertMessagePhone,
                from: senderPhone,
                to: tel
            }).then(() => {
                console.log(`SMS send to ${tel}: ` + new Date().toLocaleString('de'))
            }).catch(() => {
                console.log(`Error occurred sending to ${tel}: ` + new Date().toLocaleString('de'))
            });
        }
        // for (const mail of receiverEmails) {
        //     mailService.send({
        //         from: process.env.SENDER_EMAIL,
        //         to: mail,
        //         subject: conf.alertSubjectEmail,
        //         text: conf.alertTextEmail
        //     }).then(() => {
        //         console.log(`Email send to ${mail}: ` + new Date().toLocaleString('de'))
        //     }).catch((err) => {
        //         console.log('error', err)
        //         // console.log(`Error occurred sending email to ${mail}: ` + new Date().toLocaleString('de'))
        //     })
        // }
    }
})