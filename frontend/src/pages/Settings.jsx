import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import useShowToast from '../hooks/showToast'
import useLogout from '../hooks/useLogout'

const Settings = () => {
    const toast = useShowToast()
    const logout = useLogout();


    const freezeAccount =async()=>{
       if(! window.confirm("Are you sure to freeze your account?")) return;
        try {

            
            const res = await fetch(`/api/users/freeze`,
            {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                }
            }
            )
            const data = await res.json();
            if(data.success){
                logout()
                toast("Success","Your Account Freezed Successfully")
            }



        } catch (error) {
            toast("error",error.message,"error")
        }
    }


  return (
    <>
    <Text my={1} fontWeight={"bold"}>
        Freeze Your Account
    </Text>
    <Text my={1}>You can unfreeze your account anytime by logging in.</Text>
    <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
        Freeze
    </Button>
</>

  )
}

export default Settings