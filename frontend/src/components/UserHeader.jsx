import React, { useState } from 'react'
import {VStack, Box,Avatar,Text, Flex} from "@chakra-ui/react";
import {BsInstagram} from "react-icons/bs"
import { Menu, MenuButton, MenuItem, MenuList,Button,Link  } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { Portal } from "@chakra-ui/react";
import {useRecoilValue} from "recoil"
import userAtom from "../atom/userAtom";
import useShowToast from "../hooks/showToast"


import {  NavLink } from 'react-router-dom';

const UserHeader = ({user}) => {
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState(
		Array.isArray(user.followers) ? user.followers.includes(currentUser?._id) : false
	  );	
	const [updating,setUpdating] = useState(false)


const toast  =useShowToast();
  const copyURL  = ()=>{
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(()=>{
		toast('success','Profile Link Copied','success')

    })
  }


  const handleFollowUnfollow =async()=>{

	if(!currentUser){
		toast('error',"Please login first",'error');
	}
	setUpdating(true);
		try{
			const res = await fetch(`/api/users/follow/${user._id}`,{
				method:"POST",
				headers:{
					'Content-Type':'application/json'
				}
			});
			const data = await res.json();

			if(data.error){
				toast('error',data.error,'error')}
				if(following){
					toast('success',`${user.name} unfollowed successfully`,'success')
					user.followers.pop();
				}else{
				
						toast('success',`${user.name} followed successfully`,'success')
						user.followers.push(currentUser?._id);
					
					
				}
				setFollowing(!following);

		}catch(error){
			console.log(error);
			toast('error',error,'error')

		}
		finally{
			setUpdating(false);
		}

  }

  return <VStack gap={4} alignItems={"start"}>

      <Flex justifyContent={"space-between"}  w={"full"}> 
      <Box>
       {user.name}
        <Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.dark"} color={"gray.200"} p={1} borderRadius={"full"}>
							threads.net
						</Text>
					</Flex>
      </Box>
      
<Box>
 {user.profilePic &&  <Avatar name={user.name} src={user.profilePic} />}
 {!user.profilePic &&  <Avatar name={user.name} src={""} />}
</Box>
      </Flex>

	<Text>{user.bio}</Text>
	{currentUser?._id === user._id && (
				<Button isLoading={updating} size={"sm"}>
					<NavLink to='/update-profile' >Update Profile</NavLink>
				</Button>
			)}
			{currentUser?._id !== user._id && (
				<Button onClick={handleFollowUnfollow} isLoading = {updating}  size={"sm"}  >
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}


    
	
    
    <Flex w={"full"} justifyContent={"space-between"} >
      <Flex gap={2} alignItems={"center"} color={"gray.light"} >
        <Text  >
          <Text>{Array.isArray(user.followers) ? user.followers.length : 0} followers</Text>
		  </Text>
        {/* <Text  >
         {user.following.length} followings
        </Text> */}
        <Box  w='1' h='1' bg={"gray.light"} borderRadius={"full"} ></Box>
        <Link to="https://www.instagram.com/anasraza6096" target="_blank" >instagram.com</Link>
        </Flex>

        {/* right flex */}
        <Flex>
					<Box className='icon-container'>
						<Link to="https://www.instagram.com/anasraza6096" target="_blank" ><BsInstagram size={24} cursor={"pointer"} /></Link>
					</Box>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem onClick={copyURL} bg={"gray.dark"} >
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex> 

    </Flex>

    <Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}> Threads</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1px solid gray"}
					justifyContent={"center"}
					color={"gray.light"}
					pb='3'
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}> Replies</Text>
				</Flex>
			</Flex>

  </VStack>
}

export default UserHeader
