import {conf} from "./env";
import mqtt from "mqtt";
const smsClient = require('twilio')(process.env.SMS_ACC_SID, process.env.SMS_AUTH_TOKEN);

// configure host and connect to host
const host = `mqtt://${conf.mqttHost}:${conf.mqttPort}`;
const mqttClient = mqtt.connect(host);
let alarmActive = false;

// logging for connecting to mqtt-broker
mqttClient.on("connect", () => {
    console.log("Client connected");
})

// logging for errors with mqtt-client
mqttClient.on("error", err => {
    console.log("Error: ", err);
})

// subscribe to every topic
for (const topic of conf.mqttAlertTopicSubscribe) {
    mqttClient.subscribe(topic);
}
mqttClient.subscribe(conf.mqttAlarmActiveTopic);

// get and configure SMS receiver and sender
const receiverPhones = process.env.SMS_PHONE_NUMBERS_RECEIVE != null ? process.env.SMS_PHONE_NUMBERS_RECEIVE.split(' ') : [''];
const senderPhone = process.env.SMS_NUMBER_SENDER;

// send sms on incoming mqtt message alert to every receiving phone in config + logging for errors and success
mqttClient.on("message", (topic, message, _) => {
    console.log("Topic / Message: ", topic + " - " + message.toString());
    if (message.toString() === conf.mqttTopicAlertMessageOn && topic !== conf.mqttAlarmActiveTopic && alarmActive) {
        for (const tel of receiverPhones) {
            smsClient.messages.create({
                body: conf.alertMessagePhone,
                from: senderPhone,
                to: tel
            }).then(() => {
                console.log(`SMS send to ${tel}: ` + new Date().toLocaleString('de'));
            }).catch(() => {
                console.log(`Error occurred sending to ${tel}: ` + new Date().toLocaleString('de'));
            });
        }
    } else if (topic === conf.mqttAlarmActiveTopic) {
        alarmActive = Boolean(JSON.parse(message.toString()))
    }
    console.log("Alarm is " + (alarmActive ? "active" : "deactivated"));
})

















