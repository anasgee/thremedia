import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import {useToast}  from "@chakra-ui/react"
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
  import {useSetRecoilState}  from "recoil"
  import useShowToast from "../hooks/showToast"
  import authScreenAtom from "../atom/authscreenatom"
  import userAtom from "../atom/userAtom"

  
const SignupCard = () =>{
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom)
  const [loading,setLoading] = useState(false);

    const [inputs,setInputs] = useState({
      name : "",
      username : "",
      email : "",
      password : ""
    })
    const [showPassword, setShowPassword] = useState(false);

// functions
const handleChange = (e)=>{
  const {id,value} = e.target;
  setInputs((prev)=>({
    ...prev,
   [ id]:value
  }))
}


const toast = useShowToast()
const handleSignup = async () => {

  setLoading(true);
  try {
    const res = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });
    const data = await res.json();
    // console.log(data)

   
    if(data.error){
      toast("Error Here",data.error,"error")
      // console.log(data.error)
    }
    localStorage.setItem("user-threads", JSON.stringify(data));
    setUser(data);
   if(!data.error){
    toast("Success", "Registered Successfully","success")
    return;
   }
  } catch (error) {
    toast("Error", error, "error");
    // console.log(error)
 
  }finally{
    setLoading(false)
  }
};

// console.log(inputs)
    return (
      <Flex
      
        align={'center'}
        justify={'center'}
        >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={useColorModeValue('black','white')}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}
            w={{
              base:"full",
              sm:"400px"
            }}
            
            >
           
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl  isRequired >
                    <FormLabel>Full Name</FormLabel>
                    <Input id="name" type="text"
                    value={inputs.name}
                    onChange = {handleChange}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired >
                    <FormLabel>username</FormLabel>
                    <Input  id="username" type="text" value={inputs.username}
                    onChange = {handleChange} />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input id="email"  type="email" value={inputs.email}
                    onChange = {handleChange} />
              </FormControl>
              <FormControl  isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} id="password"  value={inputs.password}
                    onChange = {handleChange}  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button onClick={handleSignup}
                  loadingText="Signing Up"
                  size="lg"
                  isLoading = {loading}
                  bg={useColorModeValue("gray.600","gray.700")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue("gray.700" , "gray.800"),
                  }}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a have an account? <Link onClick={()=>setAuthScreen("login")} color={'blue.400'}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }

  export default SignupCard;