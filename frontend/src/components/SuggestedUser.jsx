import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom';

const SuggestedUser = ({user}) => {

    const following = false;
    const updating = true;
  return (
     <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user.username}`}>
				{/* <Avatar src={user.profilePic} /> */}
				<Avatar src="" />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{/* {user.username} */} Anas
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{/* {user.name} */}Anas Raza
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				// onClick={handleFollow}
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