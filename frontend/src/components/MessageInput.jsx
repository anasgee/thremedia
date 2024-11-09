import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import {IoSendSharp} from "react-icons/io5"
import conversationAtom, { selectedConversationAtom } from '../atom/messageAtom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../hooks/usePreviewImg';


const MessageInput = ({setMessages}) => {
  const [messageText,setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setconversation = useSetRecoilState(conversationAtom);
  const imageRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  
console.log(imgUrl)
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
    
    <Flex alignItems={"center"} gap={2}>
    <form onSubmit={createMessage} style={{ flex: 95 }} >
        <InputGroup>
        <Input onChange={handleChange} value={messageText} w={"full"} placeholder='Type a message'/>
        <InputRightElement onClick={createMessage} cursor={"pointer"}> 
        <IoSendSharp />
        </InputRightElement>
        </InputGroup>
    </form>

    <Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>

      <Modal
				isOpen={imgUrl}
        onClose={()=>{
          onClose();
          setImgUrl("");
        }}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton  />
					<ModalBody>
						<Flex mt={5} w={"full"}>
            <Image
								 src={imgUrl}
								/>
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{/* {!isSending ? ( */}
								<IoSendSharp size={24} cursor={"pointer"}  />
							{/* ) : ( */}
								{/* <Spinner size={"md"} /> */}
							{/* )} */}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>

    </Flex>
  )
}

export default MessageInput