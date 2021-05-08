const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const route = require("../src/routes/Index");

const http = require("http").createServer(app);  //모듈 사용
const io = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:3000"],
        methods:["GET","POST"]
    }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", route);

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, uid) => {
        socket.join(roomId);
        console.log(`${roomId}방에 조인`);
        socket.broadcast.to(roomId).emit('user-join', roomId, uid);
    });

    socket.on('send-message', (roomId, uid, message) => {
        socket.broadcast.to(roomId).emit('broadcast-message', uid, message);
    });
    
})
  
http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});