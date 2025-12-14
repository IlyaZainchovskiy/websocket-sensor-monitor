const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const TemperatureSensor = require('./sensor');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const mySensor = new TemperatureSensor();
let currentTemp = 0;

mySensor.on('data', (temp) => {
    currentTemp = temp;
    broadcastData({ type: 'UPDATE', value: temp });
});

mySensor.start();

wss.on('connection', (ws) => {
    console.log('Новий клієнт підключився');

    ws.send(JSON.stringify({ type: 'UPDATE', value: currentTemp }));

    ws.on('close', () => {
        console.log('Клієнт відключився');
    });
});

function broadcastData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

server.listen(PORT, () => {
    console.log(`\n--- Сервер запущено ---`);
});