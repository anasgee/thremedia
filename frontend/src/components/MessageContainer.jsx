import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atom/messageAtom'
import useShowToast from '../hooks/showToast'
import userAtom from '../atom/userAtom'

const MessageContainer = () => {

  const toast  = useShowToast()
  const currentUser = useRecoilValue(userAtom)

  const [selectedConversation,setSelectedConversation]  = useRecoilState(selectedConversationAtom);
  const [loading,setLoading] = useState(true);
  const [messages,setMessages] = useState([]);




  useEffect(()=>{
    const getMessages = async()=>{

      try {
        const res= await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();

        if(data.error){
          toast("Error",data.error,'error')
        }
        setMessages(data);
         console.log(data)
      } catch (error) {
        toast("Error",error.message,'error')
        
      }finally{
        setLoading(false);
      }


    }

    getMessages();
  },[toast,setSelectedConversation])





  return <Flex
  flex='70'
  bg={useColorModeValue("gray.200", "gray.dark")}
  borderRadius={"md"}
  p={2}
  flexDirection={"column"}
>
  {/* Message header */}
  <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
      <Avatar src="" size={"sm"} />
      <Text display={"flex"} alignItems={"center"}>
         Anas <Image src='/verified.png' w={4} h={4} ml={1} />
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

{!loading && (

messages.map((message)=>{
  <Message   key={message._id} message= {message} ownMessage={currentUser._id === message.sender}  />
})
)

}
 

</Flex>

  <MessageInput />
</Flex>
}

export default MessageContainer