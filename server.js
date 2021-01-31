const express = require('express');
const helmet = require('helmet');
const socketio = require('socket.io');
const app = express();
app.use(express.static(__dirname+ '/public'));
const expressServer = app.listen(3000,() => {
    console.log("Server started successfully");
})
app.use(helmet());
const io = socketio(expressServer);
module.exports = {
    app,
    io
}