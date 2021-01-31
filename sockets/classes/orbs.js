class Orbs {
    constructor(settings) {
        this.color = this.randomColor();
        this.locX = Math.floor(Math.random()*settings.worldWidth);
        this.locY = Math.floor(Math.random()*settings.worldHeight);
        this.radius = 5;
    }
    randomColor() {
        const r = Math.floor((Math.random()*200)+50);
        const g = Math.floor((Math.random()*200)+50);
        const b = Math.floor((Math.random()*200)+50);
        return `rgb(${r},${g},${b})`
    }
}

module.exports = Orbs; 