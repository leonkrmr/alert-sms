import 'dotenv/config.js'

export const conf = {
    mqttHost: "192.168.178.32",
    mqttPort: "1883",
    mqttAlertTopicSubscribe : [
        "Alarmanlage/Bewegungssensor/Haustür",
    ],
    mqttAlarmActiveTopic: "Alarmanlage",
    mqttTopicAlertMessageOn: "true",
    mqttTopicAlertMessageOff: "false",
    alertMessagePhone: 'Warnung! Bewegung am Gebäude entdeckt!',
}