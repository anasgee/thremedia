import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
import {BsCheck2All} from "react-icons/bs"
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atom/messageAtom'
import userAtom from '../atom/userAtom'
// import { formatDistanceToNow, formatDuration } from 'date-fns'

const Message = ({ownMessage,message}) => {
	const [selectedConversation,setSelectedConversation ] = useRecoilState(selectedConversationAtom);
	const [imgLoaded,setImgLoaded] = useState(false);

	const user = useRecoilValue(userAtom)








  return (
    <>
    
    {ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"}>
				
						{message.text && (
							<Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
							<Text color={"white"}>
                               {message.text}
							   {/* <span style={{fontSize:"6px"}}>{message.createdAt} </span> */}
                            </Text>
							<Box
								alignSelf={"flex-end"}
								ml={1}
								 color={message.seen? "blue.400":""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
						)}


                        {message.img && !imgLoaded && (
							<Flex mt={5} w={"300px"} h={"200px"} >
								<Image src={message.img} hidden onLoad={()=>setImgLoaded(true)} />
								<Skeleton w={"300px"} h={"200px"} /> 
							</Flex>)
							}

							{message.img && imgLoaded && (
							<Flex mt={5} w={"200px"}>
								<Image
								 src={message.img}
								borderRadius={4}
								alt='Message img'
								/>
								<Box
								alignSelf={"flex-end"}
								ml={1}
								 color={message.seen? "blue.400":""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>

							</Flex>
						)}
                            <Avatar src={user.profilePic} w={7} h={7}/>
				
                    </Flex>
  ):
  (
    <Flex gap={2}>
				
						{/* <Flex bg={"gray.800"} maxW={"350px"} p={1} borderRadius={"md"}> */}
						<Avatar src={selectedConversation.userProfilePic} w={7} h={7}/>
						{/* {message.text && ( */}
						{message.text && (
							<Text bg={"gray.800"} maxW={"350px"} p={1} borderRadius={"md"} color={"white"}>
                                {message.text}
                            </Text>
						)}
							

							{/* { true && ( */}

							{message.img && !imgLoaded && (
							<Flex mt={5} w={"200px"} h={"200px"} >
								<Image src={message.img} hidden onLoad={()=>setImgLoaded(true)} />
								<Skeleton w={"300px"} h={"200px"} /> 
							</Flex>)
							}

							{message.img && imgLoaded && (
							<Flex mt={5} w={"200px"}>
								<Image
								 src={message.img}
								borderRadius={4}
								alt='Message img'
								/>

							</Flex>
						)}

							{/* <Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box> */}
						</Flex>
				
  )
  }
    </>
  )
}

export default Message