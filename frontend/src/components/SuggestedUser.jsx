import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import useShowToast from '../hooks/showToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atom/userAtom';
import useFollowUnfollow from '../hooks/useFollowUnfollow';

const SuggestedUser = ({user}) => {

    const currentUser  = useRecoilValue(userAtom);
    
   const {handleFollowUnfollow,updating,following} = useFollowUnfollow(user);

    const toast  = useShowToast();


    //     e.preventDefault()
    //     setUpdating(true)
        
    //    try {
        
    //     const res  = await fetch(`/api/users/follow/${user._id}`,{
    //         method:"POST",
    //         headers:{
    //         "Content-Type":"application/json"
    //         }
    //     });

    //     const data = await res.json();
    //     if(data.error){
    //             toast("error",data.error,"error");
    //     }
    //     if(following){
    //         user.followers.pop();
    //         toast("Success",`${user.name} unFollowed Successfully`,"success");
    //     }
    //     else{
    //         toast("Success",`${user.name} Followed Successfully`,"success");
    //         user.followers.push(currentUser._id);

    //     }
    //     setFollowing(!following);


    //    } catch (error) {
    //     toast("error",error.message,"error");
        
    //    }finally{
    //     setUpdating(false)
    //    }
        
    // }


    // const following = false;
  
  return (
     <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
			
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username} 
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnfollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex> 
  )
}

export default SuggestedUser