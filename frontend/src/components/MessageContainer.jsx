import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import Message from './Message'
import MessageInput from './MessageInput'

const MessageContainer = () => {
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
{ false && (
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
 <Message ownMessage={true}/>
 <Message ownMessage={true}/>
 <Message ownMessage={false}/>
 <Message ownMessage={false}/>

</Flex>

  <MessageInput />
</Flex>
}

export default MessageContainer