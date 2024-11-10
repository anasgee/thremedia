import React from 'react'
import { Avatar,Image,Box, Flex, Text  } from "@chakra-ui/react";
import {Link} from "react-router-dom"
import {BsThreeDots} from "react-icons/bs"
import Actions from "./Actions"
import { useState } from 'react';
import { useEffect } from 'react';
import useShowToast from "../hooks/showToast"
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {useRecoilValue, useRecoilState} from "recoil"
import userAtom from "../atom/userAtom"
import { DeleteIcon } from '@chakra-ui/icons';
import postAtom from '../atom/postAtom';

const Post = ({post,postedBy}) => {

    // const [liked,setLiked]= useState(false);
    const [user,setUser]  = useState(null)
	const toast = useShowToast();
	const [posts,setPosts]= useRecoilState(postAtom);
	
	const navigate = useNavigate();
	const currentUser = useRecoilValue(userAtom);


    useEffect(()=>{
        const getUser = async()=>{
            try{
                const res = await fetch(`/api/users/profile/${postedBy}`);
                const data = await res.json();
                // console.log(data)
                if(data.error){
                    toast("Error Here", error.message,'error')
                    return;
                }
                setUser(data);
            }catch(error){
                toast("Error Here", error.message,'error')
                setUser(null);
            }
        }

        getUser();
    },[postedBy,toast])


	const handleDeletePost =async(e)=>{
		e.preventDefault();

		try{
			if(!window.confirm('Are you sure to delete this post ? ')) return;
			const res = await fetch(`/api/posts/${post._id}`,{
				method:"DELETE",
				'Content-Type':'application/json'
			});

			const data = await res.json();
			// console.log(data);
			toast("Success","Post Deleted Successfully",'success')
			setPosts(posts.filter((p) => p._id !== post._id));
		}catch(error){
			toast("Error Here", error.message,'error')
			
		}


	}

if(!user) return null
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>

        <Avatar size='md' onClick={(e)=>{
                     e.preventDefault();
                     navigate(`/${user.username}`)}} name={user.name} src={user.profilePic} />
					<Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
					<Box position={"relative"} w={"full"}>
                    {post.replies.length === 0 && <Text textAlign={"center"}>😮</Text>}
						{post.replies[0] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left='15px'
								padding={"2px"}
							/>
						)}

						{post.replies[1] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right='-5px'
								padding={"2px"}
							/>
						)}

						{post.replies[2] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left='4px'
								padding={"2px"}
							/>
						)}
					</Box>
              </Flex>
{/* A    Right Side wali post Ka Flex Start */}

<Flex flex={1} flexDirection={"column"} gap={2}>
<Flex justifyContent={"space-between"} w={"full"}>
           <Flex w={"full"} alignItems={"center"}>
	         	<Text fontSize={"sm"} onClick={(e)=>{
                     e.preventDefault();
                     navigate(`/${user.username}`)
                 }} fontWeight={"bold"}>
		    		{user?.username}
				</Text>
				{user.followers.length >= 10 && <Image src='/verified.png' w={4} h={4} ml={1} />}
			</Flex>
            <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>
							{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
			</Flex>
            </Flex>
            <Text fontSize={"sm"}>{post.text}</Text>
            {
                post.img && (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
							<Image src={post.img} w={"full"} />
						</Box>
                )
            }
            <Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
                    
</Flex>



{/*    Right Side wali post Ka Flex End */}
            </Flex>
        </Link>
  )
}

export default Post
