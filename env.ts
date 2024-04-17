import 'dotenv/config.js'

export const conf = {
    mqttHost: "192.168.2.180",
    mqttPort: "1883",
    mqttTopicSubscribe : [
        "Gebaeude1/Alarm/isActive",
        "Test"
    ],
}