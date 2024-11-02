import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import {BsCheck2All} from "react-icons/bs"
import React from 'react'

const Message = ({ownMessage}) => {
  return (
    <>
    
    {ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"}>
				
						{/* <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}> */}
							<Text bg={"blue.800"} maxW={"350px"} p={1} borderRadius={"md"}  color={"white"}>
                                Lorem ipsum dolor sit amet.
                            </Text>
                            <Avatar src='' w={7} h={7}/>
							{/* <Box
								alignSelf={"flex-end"}
								ml={1}
								color={ "blue.400" }
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box> */}
						{/* </Flex> */}
				
                    </Flex>
  ):
  (
    <Flex gap={2}>
				
						{/* <Flex bg={"gray.800"} maxW={"350px"} p={1} borderRadius={"md"}> */}
                            <Avatar src='' w={7} h={7}/>
							<Text bg={"gray.800"} maxW={"350px"} p={1} borderRadius={"md"} color={"white"}>
                                Lorem ipsum dolor sit amet.
                            </Text>
							{/* <Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box> */}
						</Flex>
				
                    // </Flex>
  )
  }
    </>
  )
}

export default Message