	import React, { useState, useEffect } from 'react'
	import { Flex, Avatar,Text,Image,Box,Divider,Button, Spinner } from '@chakra-ui/react';
	import Actions from '../components/Actions';
	import Comment from "../components/Comment"
	import useToast from "../hooks/showToast";
	import useGetUser from '../hooks/useGetUser';
	import { formatDistanceToNow } from 'date-fns';
	import { DeleteIcon } from '@chakra-ui/icons';
	import { useRecoilValue, useRecoilState } from 'recoil';
	import userAtom from '../atom/userAtom';
	import { useParams, useNavigate } from 'react-router-dom';
	import postAtom from '../atom/postAtom';



	const PostPage = () => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom);
	const { pid } = useParams();
	const navigate = useNavigate();

	const {user,loading} = useGetUser();
	const [post,setPost] = useRecoilState(postAtom);


	const currentPost = post[0];


	useEffect(()=>{
		const getPosts =async ()=>{

			try{
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if(data.error){
					toast("Error",data.error,'error');
				}
				// console.log(data)
				setPost([data]);

				
			}catch(error){
				toast("Error",error.message,'error');

			}
		}
	if (!post || post._id !== pid) {
    getPosts();
  }
	},[toast,pid,post,setPost])


	const handleDeletePost=async(e)=>{
		e.preventDefault();

			try{
				if(!window.confirm('Are you sure to delete this post ? ')) return;
				const res = await fetch(`/api/posts/${currentPost._id}`,{
					method:"DELETE",
					'Content-Type':'application/json'
				});

				const data = await res.json();
				console.log(data);
				toast("Success","Post Deleted Successfully",'success')
				navigate(`/${user.username}`)
				setPost(post.filter((p) => p._id !== post._id));
			}catch(error){
				toast("Error Here", error.message,'error')
				
			}


	}


	if (loading) {
		return (
		<Flex justifyContent={"center"}>
			<Spinner size={"xl"} />
		</Flex>
		);
	}
	
	if (!user) {
		return (
		<Flex justifyContent={"center"}>
			<Text size={"xl"}>User not found</Text>
		</Flex>
		);
	}
	

	if(!currentPost) return null;
	return (
		<>
				<Flex >
					<Flex w={"full"} alignItems={"center"} gap={3}>
			<Avatar src={user?.profilePic} size={"md"} name={user?.name} />
						<Flex alignItems="center"  >
							<Text fontSize={"sm"} fontWeight={"bold"}>
								{user?.username}
							</Text>
							{user?.followers.length >= 10 && <Image src='/verified.png' w={4} h={4} ml={1} />}
						</Flex>
					</Flex>
					<Flex gap={4} alignItems={"center"}>
				<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
				{currentPost?.createdAt ? formatDistanceToNow(new Date(currentPost.createdAt)) : "Loading..."} ago
					{/* {formatDistanceToNow(new Date(post.createdAt)) } ago */}
								</Text>
								{currentUser?._id === user?._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
				</Flex>
				</Flex>
				
	<Text my={3}>{post.text}</Text>

				{currentPost.img && (
					<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
						<Image src={post.img} w={"full"} />
					</Box>
				)} 

				<Flex gap={3} my={3}>
					<Actions post ={currentPost}  />
				</Flex>
		
				<Divider my={4} />

				<Flex justifyContent={"space-between"}>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"2xl"}>👋</Text>
						<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
					</Flex>
					<Button>Get</Button>
				</Flex>

				<Divider my={4} />
			{
			currentPost.replies.map((reply)=>{
					return     <Comment
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}/>
				})
			}
			</>
	)
				}
	export default PostPage;

