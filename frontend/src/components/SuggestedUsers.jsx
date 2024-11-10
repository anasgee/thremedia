import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import SuggestedUser from './SuggestedUser';

const SuggestedUsers = () => {
    const [loading,setLoading]  = useState(false);
    const [suggestedUsers , setSuggestedUsers] = useState([]);



  return (
   <>
   <Text mb={4} fontWeight={"bold"}>
        Suggested Users
   </Text>
   <Flex direction={"column"} gap={4}>




    {!loading && [1,2,3,4,5,6,7].map((user)=> <SuggestedUser key={user._id} user={user} />)}

    {
        loading && [...Array(5)].map((_,i)=>{
            return <Flex key={i} gap={2} alignItems={"Center"} p={"1"} borderRadius={"md"}>
               <Box>
                <SkeletonCircle size={10}/> 
               </Box>
               <Flex w={"full"} flexDirection={"column"} gap={1}>
                <Skeleton h={"8px"} w={"80px"}/>
                <Skeleton h={"8px"} w={"90px"}/>
               </Flex>
               <Flex>
                <Skeleton w={"40px"} h={"20px"}/>
               </Flex>
            </Flex>
        })
    }
   </Flex>
   </>
  )
}

export default SuggestedUsers