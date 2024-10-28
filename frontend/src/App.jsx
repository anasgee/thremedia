import React from 'react'
import { Button,Container } from '@chakra-ui/react';
import {Routes,Route, Navigate} from "react-router-dom";
import PostPage from './pages/PostPage';
import UserPage from './pages/UserPage';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import UpdateProfile from './pages/UpdateProfile';
import Auth from "./pages/Auth"
import {useRecoilValue} from "recoil"
import userAtom from "./atom/userAtom"
import CreatePost from "./components/CreatePost"
import ChatPage from './components/ChatPage';

const App =()=>{
    const user = useRecoilValue(userAtom)
    // const { colorMode, toggleColorMode } = useColorMode()
    return(
        <Container maxW="620px">
       <Header/>
       <Routes>
           <Route path="/" element={user? <HomePage/> : <Navigate to="/auth"/> } />
      
           <Route path="/auth" element={!user ? <Auth/> : <Navigate to= "/"/>} />
           <Route path="/update-profile" element={user ? <UpdateProfile/> : <Navigate to= "/auth"/>} />
           <Route path="/:username" element={user ? (
               <>
               <UserPage/>
               <CreatePost/>
               </>
           ):(<userPage/>)} />
           <Route path="/:username/post/:pid" element={ <PostPage/>}/>
           <Route path="/chat" element={ user ? <ChatPage/>:<Navigate to="/auth"/>}/>
           

       </Routes>
       
       

        </Container>
    )
}

export default App;


