const { v4: uuidv4 } = require('uuid');

class PlayerData {
    constructor(playerName,settings) {
        this.uid = uuidv4();
        this.name = playerName;
        this.locX = Math.floor(settings.worldWidth*Math.random()+10);
        this.locY = Math.floor(settings.worldHeight*Math.random()+10);
        this.radius = settings.defaultSize;
        this.color = this.randomColor();
        this.score = 0;
        this.orbsAbsorbed = 0;
    }
    randomColor() {
        const r = Math.floor((Math.random()*200)+50);
        const g = Math.floor((Math.random()*200)+50);
        const b = Math.floor((Math.random()*200)+50);
        return `rgb(${r},${g},${b})`
    }
}
module.exports = PlayerData;