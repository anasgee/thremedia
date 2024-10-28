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
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import {useSetRecoilState}  from "recoil"
  import authScreenAtom from "../atom/authscreenatom"
  import userAtom from "../atom/userAtom"
  import showToast from "../hooks/showToast"
  
const SigninCard = () =>{
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom)
  const [loading,setLoading] = useState(false);

  const [inputs,setInputs] = useState({
    username : "",
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
// console.log



const toast = showToast()
const handleSignin = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });
    const data = await res.json();
    console.log(data);

    if(data.error){
      toast("Error Here",data.error,"error")
      // console.log(data.error)
      return;
    }
    localStorage.setItem("user-threads", JSON.stringify(data));
    setUser(data);
   if(!data.error){
    toast("Success", "Logged in Successfully","success")
    return;
   }
  } catch (error) {
    toast("Error", error, "error");
    console.log(error)
 
  }finally{
    setLoading(false);
  }
};



    return (
      <Flex
      
        align={'center'}
        justify={'center'}
        >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign In
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
            }}>
           
            <Stack spacing={4}>
              

              <FormControl  isRequired>
                <FormLabel>username</FormLabel>
                <Input type="text" id="username" value={inputs.username}  onChange={handleChange } />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'}  id="password"  value={inputs.password}  onChange={handleChange } />
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
                <Button onClick = {handleSignin}
                  loadingText="Signing in"
                  size="lg"
                  isLoading={loading}
                  bg={useColorModeValue("gray.600","gray.700")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue("gray.700" , "gray.800"),
                  }}>
                  Sign in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don't have an account ? <Link  onClick={()=>setAuthScreen("signup")} color={'blue.400'}>Sign up</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }

  export default SigninCard;