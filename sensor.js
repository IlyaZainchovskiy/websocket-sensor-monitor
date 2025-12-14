const EventEmitter = require('events');

class TemperatureSensor extends EventEmitter {
    constructor() {
        super();
        this.minTemp = 15; 
        this.maxTemp = 45; 
        this.isActive = false;
    }

    
    getRandomTemperature() {
        return (Math.random() * (this.maxTemp - this.minTemp) + this.minTemp).toFixed(1);
    }

    start() {
        this.isActive = true;
        this.loop();
    }

    loop() {
        if (!this.isActive) return;

        const temp = this.getRandomTemperature();
        
        this.emit('data', temp);

        const delay = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
        
        console.log(`[Sensor] Нове значення: ${temp}°C. Наступне оновлення через ${delay}мс`);

        setTimeout(() => this.loop(), delay);
    }

    stop() {
        this.isActive = false;
    }
}

module.exports = TemperatureSensor;