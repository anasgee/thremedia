import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import conversationAtom, { selectedConversationAtom } from '../atom/messageAtom'
import useShowToast from '../hooks/showToast'
import userAtom from '../atom/userAtom'
import messageAlert from "../assets/messageAlet.mp3"
import { useSocket } from '../context/SocketContext'
// import setConversation from ""

const MessageContainer = () => {

  const toast  = useShowToast()
  const currentUser = useRecoilValue(userAtom)

  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationAtom);
  const [loading,setLoading] = useState(true);
  const [messages,setMessages] = useState([]);
  const {socket} = useSocket();
  const endMessageRef = useRef();
console.log(selectedConversation)


useEffect(()=>{

  socket.on("newMessage",(newMessage)=>{
    console.log(newMessage);
    if(selectedConversation._id === newMessage.conversationId )
{
  setMessages((prevMessage)=> [...prevMessage,newMessage]);
}

if(!document.hasFocus()){
  const sound = new Audio(messageAlert);
sound.play();
}
    setConversations((prev)=>{
        const updatedConversation = prev.map((conversation)=>{
          if(conversation._id === newMessage.conversationId){
            return { 
              ...conversation,
              lastMessage:{
                sender:newMessage.sender,
                text:newMessage.text
              }
            }
          }
          return conversation;
        })
        return updatedConversation;
    })
  })

  return () => socket.off("newMessage")

},[socket,selectedConversation,setConversations]);
 

useEffect(()=>{

  const lastMessageIsFromOtherUser = messages[messages.length-1]?.sender !==currentUser._id;

  if(lastMessageIsFromOtherUser){
    socket.emit("markMessageAsSeen",{
      conversationId:selectedConversation._id,
      userId:selectedConversation.userId
    })
  }

  socket.on("messageSeen",({conversationId})=>{

    if(selectedConversation._id === conversationId ){

      setMessages((prev)=>{
        const updatedMessages = prev.map((message)=>{
          if(!message.seen){
             return{
              ...message,
              seen:true
             }
          }
          return message;
        })
        return updatedMessages;
      })

      // setConversations((prev)=> )
    }
  })

},[socket,currentUser._id,messages,selectedConversation]);

useEffect(()=>{
  endMessageRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])


  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setMessages([]); // Reset messages
      try {
        if(selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
  
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }
      
        setMessages(data); // Ensure messages is an array
      } catch (error) {
        toast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
  
    getMessages();
  }, [toast, selectedConversation.userId,selectedConversation.mock]);





  return <Flex
  flex='70'
  bg={useColorModeValue("gray.200", "gray.dark")}
  borderRadius={"md"}
  p={2}
  flexDirection={"column"}
>
  {/* Message header */}
  <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
      <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
      <Text display={"flex"} alignItems={"center"}>
         {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
      </Text>
  </Flex>

  <Divider />
<Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"} >
{ loading && (
  [...Array(5)].map((_,i)=>{
    return <Flex
    alignItems={"center"}
    key={i}
    gap={2}
    p={2}
    borderRadius={"md"}
    alignSelf={i %2===0 ? "flex-start" : "flex-end"}
    >
      {i%2===0 && <SkeletonCircle variant="shine" size={7} /> }
      <Flex flexDir={"column"} gap={2}>
        <Skeleton variant="shine" h={"8px"} w={"250px "}/>
        <Skeleton variant="shine" h={"8px"} w={"250px "}/>
        <Skeleton variant="shine" h={"8px"} w={"250px "}/>
      </Flex>
      {i%2 !==0 && <SkeletonCircle variant="shine" size={7} /> }

    </Flex>
  })
)}

{!loading && messages.map((message)=> <Flex  key={message._id} direction={"column"}
ref={messages.length-1 === messages.indexOf(message) ? endMessageRef:null}
>









  <Message  message= {message} ownMessage={currentUser._id === message.sender}  />
</Flex>
)


}
 

</Flex>

  <MessageInput setMessages={setMessages} />
</Flex>
}

export default MessageContainer