import { useToast } from '@chakra-ui/react'
import {useCallback} from "react";

const useShowToast = () => {
     const toast = useToast();
     const showToast = useCallback ((title,description,status)=>{
      toast({
          title,
          description,
          status,
          isClosable:true,
          duration:2000,
          position: "top-left", 
         
      })
   },[toast])
  return showToast
}

export default useShowToast
