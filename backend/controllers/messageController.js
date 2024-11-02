const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");


const createMessage = async(req,res)=>{


    const {recepientId,message} = req.body;
    const senderId = req.user._id;

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
        const newMessage  =new Message({
            conversationId:conversation._id,
            text:message,
            sender:senderId
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

res.status(201).json(newMessage);


}


module.exports = {createMessage}
