const io = require('../server').io;
const checkForOrbCollisions = require('./collision').checkForOrbCollisions;
const checkForPlayerCollisions = require('./collision').checkForPlayerCollisions;
const Orb = require('./classes/orbs');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Player = require('./classes/Player');
let orbs = [];
let players = [];
let settings = {
    defailtOrbs: 50,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500
}

initGame();

setInterval(() => {
    if(players.length>0) {
        io.to('game').emit('tock',{
            players,
        })
    }
},33)



io.on('connect',(socket) => {
    let player;
    socket.on('init',(data) => {
        socket.join('game');
        let playerConfig = new PlayerConfig(settings);
        let playerData = new PlayerData(data.playerName,settings);
        player = new Player(socket.id,playerConfig,playerData);
        players.push(playerData);
        setInterval(() => {
            socket.emit('tickTock',{
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            })
        },33)
        socket.emit('initReturn',{
            orbs
        })
    })
    socket.on('tick',(data) => {
        let speed = player.playerConfig.speed;
        let xV = player.playerConfig.xVector = data.xVector;
        let yV = player.playerConfig.yVector = data.yVector;

        if((player.playerData.locX < 5 && player.playerConfig.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
            player.playerData.locY -= speed * yV;
        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
            player.playerData.locX += speed * xV;
        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }
        let capturedOrb =  checkForOrbCollisions(player.playerData,player.playerConfig,orbs,settings);
        capturedOrb
        .then((data) => {
            const orbData = {
                orbIndex: data,
                newOrb: orbs[data]
            }
            io.to('game').emit('updateLeaderBoard', getLeaderBoard());
            io.emit('orbSwitch',orbData);
        })
        .catch((err) => {
            //console.log("No orb collision");
        })  
        let playerDeath = checkForPlayerCollisions(player.playerData,player.playerConfig,players,player.socketId);
        playerDeath
        .then((data) => {
            io.to('game').emit('updateLeaderBoard', getLeaderBoard());
            io.emit('playerDeath',data);
        })
        .catch((err) => {
            
        })
    })
    socket.on('disconnect',(data) =>{
        if(player.playerData) {
            players.forEach((curPlayer,i) => {
                if(curPlayer.uid === player.playerData.uid) {
                    players.splice(i,1);
                    io.to('game').emit('updateLeaderBoard', getLeaderBoard());
                }
            });
        }
    })
})

function getLeaderBoard() {
    players.sort((a,b) => {
        return b.score - a.score;
    })
    let leaderBoard = players.map((curPlayer) => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    })
    return leaderBoard;
}

function initGame() {
    for(i=0;i<settings.defailtOrbs;i++) {
        orbs.push(new Orb(settings));
    }
}


module.exports = io;