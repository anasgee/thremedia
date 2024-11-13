const {Server} = require("socket.io");
const http = require("http");
const express = require("express");
const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const cors  = require("cors")


const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"https://threadsmedia-one.vercel.app",
        // origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});


const getRecipientSocketId = (recipientId) =>{
    return userSoketMap[recipientId];
} 

const userSoketMap ={};
io.on("connection",(socket)=>{

    // console.log("user connected at " + socket.id);
   try{
    const userId = socket.handshake.query.userId;
   


    // added the user in map and assigned a socket id
    if(userId != "undefined") userSoketMap[userId] = socket.id;

    // sent this user to front end
    io.emit("getOnlineUsers",Object.keys(userSoketMap));



    socket.on("markMessageAsSeen",async({conversationId,userId})=>{
        try {
            await Message.updateMany({conversationId,seen:false},{$set:{seen:true,}});
            await Conversation.updateOne({conversationId},{$set:{"lastMessage.seen":true}})
            io.to(userSoketMap[userId]).emit("messageSeen",{conversationId});
        } catch (error) {
            console.log(error.message)
        }
    })



    socket.on("disconnect",()=>{
        //  console.log("user disconnected " + socket.id);

         // delete the users from map
         delete userSoketMap[userId];

        //  sent online users to front end
         io.emit("getOnlineUsers",Object.keys(userSoketMap));
    })

   }catch(error){
    console.log(error)
   }
})

module.exports = {io,server,app,getRecipientSocketId};


