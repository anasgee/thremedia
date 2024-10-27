import React,{useEffect,useState} from 'react'
import {Flex, Spinner,Box} from "@chakra-ui/react"
import useToast from "../hooks/showToast"
import Post from "../components/Post";









const HomePage = () => {
  const [posts,setPosts]=useState([]);
  const [loading,setLoading] = useState(false);
const toast = useToast();  

  useEffect(()=>{
    const getFeed = async()=>{
      setLoading(true)
      try{
        const res = await fetch("/api/posts/feed");
        const data =await res.json();
        console.log(data);
        if(data.error){

          toast('error',data.error,'error')
        }
        setPosts(data);
      }catch(error){
        toast('error',error.message,'error')
      }finally{
        setLoading(false);
      }
    }
    getFeed();
  
  },[toast]);

  return (
   <Flex gap='10' alignItems={"flex-start"}>
			<Box flex={70}>
       {!loading && posts.length ===0 && <h1>Follow some users to see the posts</h1>}
      {loading && <Flex justifyContent='center' >
    <Spinner size='xl'  />
    </Flex>}
    {posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}

    </Box>
    </Flex>

 
  )
}

export default HomePage
