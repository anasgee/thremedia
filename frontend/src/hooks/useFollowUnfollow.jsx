import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import useShowToast from "./showToast";


const useFollowUnfollow = (user) => {
    const currentUser  = useRecoilValue(userAtom);

    const [following,setFollowing]  = useState(user.followers.includes(currentUser._id));
    const [updating,setUpdating]  =useState(false)

    const toast  = useShowToast();



    const handleFollowUnfollow =async()=>{

        if(!currentUser){
            toast('error',"Please login first",'error');
        }
        setUpdating(true);
            try{
                const res = await fetch(`/api/users/follow/${user._id}`,{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    }
                });
                const data = await res.json();
    
                if(data.error){
                    toast('error',data.error,'error')}
                    if(following){
                        toast('success',`${user.name} unfollowed successfully`,'success')
                        user.followers.pop();
                    }else{
                    
                            toast('success',`${user.name} followed successfully`,'success')
                            user.followers.push(currentUser?._id);
                        
                        
                    }
                    setFollowing(!following);
    
            }catch(error){
                // console.log(error);
                toast('error',error,'error')
    
            }
            finally{
                setUpdating(false);
            }
    
      }
    
    



  return {handleFollowUnfollow,updating,following}
}

export default useFollowUnfollow