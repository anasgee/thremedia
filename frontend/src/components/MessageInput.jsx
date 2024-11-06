import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React, { useState } from 'react'
import {IoSendSharp} from "react-icons/io5"
import conversationAtom, { selectedConversationAtom } from '../atom/messageAtom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';


const MessageInput = ({setMessages}) => {
  const [messageText,setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setconversation = useSetRecoilState(conversationAtom);

  const handleChange = (e)=>{
      setMessageText(e.target.value);
  }

  const createMessage = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch( `/api/messages`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          message:messageText,
          recepientId:selectedConversation.userId
        })
      })
      const data = await res.json();
      setMessages((message)=>[...message,data])
      setconversation(prevConv =>{
        const updatedConversation = prevConv.map((conversation)=>{
          if(conversation._id===selectedConversation._id){
            return {
              ...conversation,
              lastMessage:{
                text:messageText,
                sender:data.sender
              }

            }
          }
          return conversation
        })
        return updatedConversation
      })

      setMessageText("")

      // if(data.error){
      //   console.log(data.error);
      // }
     
    } catch (error) {
      console.log(error)
    }


  }
  return (
    <form onSubmit={createMessage} >
        <InputGroup>
        <Input onChange={handleChange} value={messageText} w={"full"} placeholder='Type a message'/>
        <InputRightElement onClick={createMessage} cursor={"pointer"}  > 
        <IoSendSharp />
        </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput