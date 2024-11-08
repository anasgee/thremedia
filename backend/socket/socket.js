const {Server} = require("socket.io");
const http = require("http");
const express = require("express");


const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});


const getRecipientSocketId = (recipientId) =>{
    return userSoketMap[recipientId];
} 

const userSoketMap ={};
io.on("connection",(socket)=>{

    console.log("user connected at " + socket.id);
    const userId = socket.handshake.query.userId;
   


    // added the user in map and assigned a socket id
    if(userId != "undefined") userSoketMap[userId] = socket.id;

    // sent this user to front end
    io.emit("getOnlineUsers",Object.keys(userSoketMap));

    socket.on("disconnect",()=>{
         console.log("user disconnected " + socket.id);

         // delete the users from map
         delete userSoketMap[userId];

        //  sent online users to front end
         io.emit("getOnlineUsers",Object.keys(userSoketMap));
    })
})

module.exports = {io,server,app,getRecipientSocketId};


