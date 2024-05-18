import 'dotenv/config.js'

export const conf = {
    mqttHost: "192.168.2.180",
    mqttPort: "1883",
    mqttAlertTopicSubscribe : [
        "Gebaeude1/Alarm/isActive",
        "Test"
    ],
    alertMessagePhone: 'Warnung! Bewegung am Gebäude entdeckt!',
}