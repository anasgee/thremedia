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

    console.log(onlineUsers,"Online users")
    // console.log(user?._id)

    useEffect(()=>{
        // console.log("UseEffect Running correctly")

        // const socket = io("https://thremedia.vercel.app",{
        const socket = io("http://localhost:5000",{
        // const socket = io("/",{
            query:{
                userId:user?._id,
            },
        })

        setSocket(socket);
        // console.log(socket)

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