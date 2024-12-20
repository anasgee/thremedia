const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { getRecipientSocketId, io } = require("../socket/socket");
const v2 = require('cloudinary');
const cloudinary = v2;

const createMessage = async(req,res)=>{


    const {recepientId,message} = req.body;
    let {img} = req.body;
    const senderId = req.user._id;

try {
    let conversation = await Conversation.findOne({
        participants :{$all:[senderId,recepientId]}})

        if(!conversation){
            const newConversation = new Conversation({
                participants:[senderId,recepientId],
                lastMessage:{
                    text:message,
                    sender:senderId
                }
            })
        await newConversation.save();
        }
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img)
            img = uploadResponse.secure_url
        }
        const newMessage  =new Message({
            conversationId:conversation._id,
            text:message,
            sender:senderId,
            img,
        })
        await Promise.all([
            newMessage.save( ),
            conversation.updateOne({
                lastMessage:{
                    text:message,
                    sender:senderId
                }  
            })
        ])
    const recipientSocketId = getRecipientSocketId(recepientId);
    // console.log(recipientSocketId);
    io.to(recipientSocketId).emit("newMessage",newMessage);

res.status(201).json(newMessage);
} catch (error) {
res.status(500).json({error:error.message});
    
}
}


const getMessages = async(req,res)=>{

    const {otherUserId}= req.params;
    const userId = req.user._id;

   try {
    const conversation = await Conversation.findOne({
        participants:{$all:[userId,otherUserId]}


    })
    if(!conversation){
        return res.status(404).json({error:"Conversation not Found"})
        
    }
  
    const messages = await Message.find({
        conversationId:conversation._id,
        
    }).sort({createdAt:1}); //last message
if(!messages){
    return res.status(404).json({error:"Conversation not Found"})

}
    res.status(200).json(messages);
   

   } catch (error) {
    res.status(500).json({error:error.message})
   }
}


const getConversations = async(req,res)=>{

    const userId = req.user._id;

try {
    
    let converstaions = await Conversation.find({participants:userId}).populate({
        path:"participants",
        select:"username profilePic",
    })

    converstaions.forEach(conversation=>{
        conversation.participants = conversation.participants.filter(participant=>participant._id.toString() !==userId.toString())
    })

    res.status(200).json(converstaions);

} catch (error) {
    res.status(500).json({error:error.message});
    
}

}

module.exports = {createMessage,getConversations,getMessages}
