import React from 'react';
import AuthCard from '../components/SignupCard';
import authScreenAtom from "../atom/authscreenatom";
import {useRecoilValue} from "recoil";
import SigninCard from '../components/SigninCard';
  
const Auth = () => {
 const authScreenState = useRecoilValue(authScreenAtom);
   return(
       <>
     {authScreenState === "login" ? <SigninCard/> :<AuthCard/> } 
      </>
   )

}

export default Auth;