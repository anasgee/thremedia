import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser';
import useShowToast from '../hooks/showToast';

const SuggestedUsers = () => {
    const [loading,setLoading]  = useState(false);
    const [suggestedUsers , setSuggestedUsers] = useState([]);
    const toast  = useShowToast();




    useEffect(()=>{
        const getSuggestedUsers = async()=>{
            setLoading(true)
          try {
            const res = await fetch( "/api/users/suggested");

            const data = await res.json();
                if(data.error){
            toast("error",data.error,"error")

                }
            setSuggestedUsers(data);

          } catch (error) {
            toast("Error",error.message,"error")
          }finally{
            setLoading(false)
          }
        }
        getSuggestedUsers()
    },[toast])



  return (
   <>
   <Text mb={4} fontWeight={"bold"}>
        Suggested Users
   </Text>
   <Flex direction={"column"} gap={4}>




    {!loading && suggestedUsers.map((user)=> <SuggestedUser key={user._id} user={user} />)}

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