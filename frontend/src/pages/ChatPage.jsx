import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
// import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/showToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { GiConversation } from "react-icons/gi";
import conversationAtom, {
  selectedConversationAtom,
} from "../atom/messageAtom";
import userAtom from "../atom/userAtom";

const ChatPage = () => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchText, setSearchText] = useState("");

  // console.log(searchText)

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  const handleSearchConversation = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      // console.log(searchedUser._id)
	  const searchedUserId = searchedUser._id;
	  const currentUserId  = currentUser._id;
  
      if (searchedUser.error) {
        showToast("Error",searchedUser.error, "error");
        return;
      }

      const messageYourself = searchedUserId===currentUserId;

      if (messageYourself) {
        showToast("Error", "You cannot send message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]?._id === searchedUserId
      );
	console.log(conversations.map((conversation)=>conversation.participants[0]?._id))

      if (conversationAlreadyExists) {
      return  setSelectedConversation({
          _id: conversationAlreadyExists?._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
          
        });
       
      }

      const mockConversation = {
      	mock:true,
      	lastMessage:{
      		text:"",
      		sender:"",
      	},
      	_id: Date.now(),
      	participants:
      	[
      		{
      		_id:searchedUser._id,
      		username:searchedUser.username,
      		profilePic:searchedUser.profilePic,
      	},
      	]
      };	
      console.log(mockConversation)
      setConversations((prevConv) => [...prevConv,mockConversation])

      // const mockConversation = {
      // 	mock: true,
      // 	lastMessage: {
      // 		text: "",
      // 		sender: "",
      // 	},
      // 	_id: Date.now(),
      // 	participants: [
      // 		{
      // 			_id: searchedUser._id,
      // 			username: searchedUser.username,
      // 			profilePic: searchedUser.profilePic,
      // 		},
      // 	],
      // };
      // setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error.message + error, "error");
      console.log(error);
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>

          <form onSubmit={handleSearchConversation}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleSearchConversation}
                isLoading={searchingUser}
              >
                {/* <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}> */}
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => {
              return (
                <Conversation
                  key={conversation._id}
                  conversation={conversation}
                />
              );
            })}

          {/* Posts Conversations.,.,.,.,.,.,.,..,.,.,.,.,.,. */}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
