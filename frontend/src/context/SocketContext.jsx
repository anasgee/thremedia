import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atom/userAtom";

const SocketContext = createContext();
export  const useSocket = ()=>{
    return useContext(SocketContext);
}

const SocketContextProvider =({children})=>{

    const user= useRecoilValue(userAtom);
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([])

    // console.log(onlineUsers,"Online users")
    // console.log(user?._id)

    useEffect(()=>{

        const socket = io("https://thremedia.vercel.app",{
            query:{
                userId:user?._id
            },
        })

        setSocket(socket);

        socket.on("getOnlineUsers",(users)=>{
            setOnlineUsers(users);
        });
        
        return ()=> socket && socket.close()
    },[user?._id])
    
    return <SocketContext.Provider value={{socket,onlineUsers}}>
        {children}
    </SocketContext.Provider>


}
export default SocketContextProvider;