import React, { useState } from 'react'
import UserHeader from '../components/UserHeader'
// import UserPost from '../components/UserPost'
import { useEffect } from 'react';
import useShowToast  from "../hooks/showToast"
import { useParams } from 'react-router-dom';
import { Spinner,Flex } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUser from '../hooks/useGetUser';
import { useRecoilState } from 'recoil';
import postAtom from '../atom/postAtom';

const UserPage = () => {
  // const [user,setUser ] = useState({});
  // const [loading,setLoading] = useState(true);


     const {user,loading} = useGetUser();
     const [fetchingPosts,setFetchingPosts]=useState(true)
     const [posts,setPosts]=useRecoilState(postAtom);
     const { username } = useParams();
     const showToast = useShowToast();


  useEffect(() => {

    const getPosts = async () => {
			if (!user) return;
      setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
        // console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};
  		getPosts();


  }, [showToast,username,user,setPosts]);


if(!user) return null;

  if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
  }
 
if(!user && !loading){ 
    return (
      <Flex justifyContent={"center"}>
      <Text size={"xl"} > User not found </Text>
    </Flex>
    )
  };

  return (
    <>
    {user && (
      <>
      <UserHeader user = {user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}
      {posts.map((post)=>{
        return <Post key={post._id} post = {post} postedBy = {post.postedBy}/>
      })}
      </>
      )}
     
    
    </>
  )
}

export default UserPage
