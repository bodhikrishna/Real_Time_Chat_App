//Node Server which will handle socket io connections.
const express=require('express');
const app=express();
// const io= require('socket.io')(8000)
// const cors=require('cors');
// app.use(cors({
//     origin: "http://127.0.0.1:5500",
//     methods:["GET","POST"]
// }))


const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});
io.listen(8000);


const users={};

io.on('connection',socket=>{
    //if any new user joins , let other users connceted to the server know
    socket.on('new-user-joined',name=>{
        // console.log("new user",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
    //if someone sends a message , broadcast it to other people
    socket.on('send',message=>{
        socket.broadcast.emit('recieve',{message: message, name: users[socket.id]}); 
    });
    
    //if someone leaves the chat let others know
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]); 
        delete users[socket.id];
    });




})
