import { atom } from "recoil";



const conversationAtom = atom({
    key:"conversationAtom",
    default:[]
})

const selectedConversationAtom  = atom({
    key:"selectedConversationAtom",
    default:{
        _id:"",
        username:"",
        userProfilePic:"",
        userId:""

    }
})



export default conversationAtom;
export {selectedConversationAtom};