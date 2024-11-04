import React, { useEffect } from 'react'
import { Button,useColorModeValue,Input,Flex,Image,Text,FormControl,Textarea, useDisclosure,CloseButton,Modal,ModalHeader, ModalOverlay,ModalFooter,ModalContent,ModalBody, ModalCloseButton } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import usePreviewImg from '../hooks/usePreviewImg';
import { useRef } from 'react';
import { useState } from 'react';
import { BsFillImageFill } from "react-icons/bs";
import useToast from "../hooks/showToast"
import { useRecoilValue, useRecoilState } from 'recoil';
import userAtom from "../atom/userAtom"
import postAtom from '../atom/postAtom';
import { useParams } from 'react-router-dom';

const MAX_CHAR =500

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText,setPostText] = useState("");
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const {handleImageChange,imgUrl,setImgUrl} = usePreviewImg();
    const [loading,setLoading] = useState(false);
    const [posts,setPosts] = useRecoilState(postAtom);


    const showToast = useToast();
    const user = useRecoilValue(userAtom)
    const imageRef = useRef(null);
   const username = useParams(); 

    const handleTextChange =(e)=>{
            const inputText = e.target.value;
            if(inputText.length>MAX_CHAR){
                const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
            }else{
                setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
            }
    
        }
        const handleCreatePost = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/posts/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
                });
    
                const data = await res.json();
                console.log(data);
                console.log(username);
                console.log(user.username)
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                showToast("Success", "Post created successfully", "success");
               
                if(username === user.username){
                  setPosts([data,...posts])
                }
                onClose();
                setPostText("");
                setImgUrl("");
            } catch (error) {
                showToast("Error", error, "error");
            } finally {
                setLoading(false);
            }
        };
       

  return (
    <div>
      <Button
				position={"fixed"}
				bottom={10}
				right={5}
				bg={useColorModeValue("gray.300", "gray.dark")}
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
			>
				<AddIcon />
			</Button>

{/* Modal */}
<Modal blockScrollOnMount={false} isOpen={isOpen} isCentered onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>


          <FormControl>
							<Textarea
								placeholder='Post content goes here..'
								onChange={handleTextChange}
								value={postText}
							/>
							<Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={useColorModeValue("gray.dark", "gray.300")}>
							{remainingChar}/{MAX_CHAR}
							</Text>

							<Input type='file' hidden ref={imageRef} onChange={ handleImageChange} />

							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt='Selected img' />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={"gray.800"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}


          </ModalBody>

          <ModalFooter>
            <Button isLoading={loading} colorScheme='blue' mr={3} onClick={handleCreatePost}>
              Post
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>


    </div>
  )
}

export default CreatePost
