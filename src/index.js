"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const startServer = (port) => {
    return new ws_1.WebSocketServer({
        port: port
    });
};
const server = startServer(1234);
server.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log(`server received ${data}`);
    });
    ws.send('message received');
});
// const webSocket: WebSocket = new WebSocket('ws://localhost:1234')
// webSocket.on('open', function open() {
//     webSocket.send('Some message')
// })
// webSocket.on('message', function message(data: any) {
//     console.log(`client received ${data}`)
// })
