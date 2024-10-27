'use client'

import {
  Button,
  Flex,
  
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import {useState, useRef} from "react"
import {useRecoilState} from "recoil"
import userAtom from "../atom/userAtom"
import usePreviewImg from "../hooks/usePreviewImg"
import useShowToast from "../hooks/showToast";
import { useNavigate } from 'react-router-dom'

export default function UserProfileEdit() {
  const [user, setUser] = useRecoilState(userAtom);
  const { handleImageChange, imgUrl,setImgUrl } = usePreviewImg();
	const [updating,setUpdating] = useState(false)

  const showToast = useShowToast();
  const navigate = useNavigate()

      const fileRef = useRef();
      const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
      });


    const handleChange=(e)=>{
        const{id,value}=e.target;
        setInputs(()=>({...inputs,[id]:value}))
    }
// console.log(inputs)

const handleSubmit = async (e) => {
		e.preventDefault();
    setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json(); // updated user object
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      // navigate("/update-profile")
		} catch (error) {
			showToast("Error", error, "error");
		}finally{
    setUpdating(false);

    }
	};
  return (

    <form onSubmit={handleSubmit}>
    <Flex
    
      align={'center'}
      justify={'center'}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>Profile Pic</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src={ imgUrl || user.profilePic} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={()=>fileRef.current.click()} >Change Picture</Button>
              <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
            </Center>
          </Stack>
        </FormControl>
        <FormControl >
          <FormLabel>Full Name</FormLabel>
          <Input id="name" 
            placeholder="Jone Doe"
            _placeholder={{ color: 'gray.500' }}
            type="text" value={inputs.name} onChange={handleChange}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Username</FormLabel>
          <Input id="username" 
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text" value={inputs.username} onChange={handleChange}
          />
        </FormControl>
        
        <FormControl  >
          <FormLabel>Email address</FormLabel>
          <Input id="email"
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email" value={inputs.email} onChange={handleChange}
          />
        </FormControl>
        
        <FormControl >
          <FormLabel>Bio</FormLabel>
          <Input id="bio" 
            placeholder="bio" 
            _placeholder={{ color: 'gray.500' }}
            type="text"  value={inputs.bio} onChange={handleChange}
          />
        </FormControl>

        <FormControl  >
          <FormLabel>Password</FormLabel>
          <Input id="password"
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password" value={inputs.password} onChange={handleChange}
          />
        </FormControl>
        
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
          isLoading = {updating}
            bg={'green.400'}
            color={'white'}
            type="submit"
            w="full"
            _hover={{
              bg: 'green.800',
            }}>
            Update Profile
          </Button>
        </Stack>
      </Stack>
    </Flex>
   </form>
  )
}