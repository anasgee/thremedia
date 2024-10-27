import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import useShowToast from "./showToast";



const useGetUser = ()=>{

    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    const {username} = useParams();
    const toast = useShowToast();


    useEffect(() => {
  
		const getUsers = async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        console.log(data)

        if(data.error){
          toast("Error", data.error, "error");
          return;
        }
        setUser(data);
			} catch (error) {
				toast("Error", error.message, "error");
		
			} finally{
        setLoading(false);
      }
        };
        getUsers();
    },[username,toast]);

return {loading,user}
}

export default useGetUser;