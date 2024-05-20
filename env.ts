import 'dotenv/config.js'

export const conf = {
    mqttHost: "192.168.2.180",
    mqttPort: "1883",
    mqttAlertTopicSubscribe : [
        "Alarmanlage/Bewegungssensor/Haustür"
    ],
    mqttTopicAlertMessageOn: "true",
    mqttTopicAlertMessageOff: "false",
    alertMessagePhone: 'Warnung! Bewegung am Gebäude entdeckt!',
}