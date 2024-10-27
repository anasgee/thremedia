import React from 'react'
import {Flex,Image,useColorMode, Link} from "@chakra-ui/react"
import {useRecoilValue} from "recoil";
import {AiFillHome} from 'react-icons/ai'
import {RxAvatar} from 'react-icons/rx'
import userAtom from "../atom/userAtom"
import {Link as RouterLink} from "react-router-dom"




const Header = () => {
    const {colorMode,toggleColorMode} = useColorMode();
    const user = useRecoilValue(userAtom);




  return (
    <div>
      <Flex  justifyContent={"space-between"}  mt={6} mb='12' >
      {user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}

    
        <Image onClick ={toggleColorMode}
        width='30px'
        height='3 0px'
        cursor={"pointer"}
        alt="logo"
        src={colorMode=== 'dark' ? "/light-logo.svg" : "threads.svg"}
        />   

{user && (

					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
		

	
			)}



    </Flex>

    </div>
  )
}

export default Header
