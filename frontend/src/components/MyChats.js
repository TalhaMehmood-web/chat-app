import React, { useEffect } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from '../utils/AxiosConfiq';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModel from './GroupChatModel';
const MyChats = ({ fetchAgain }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast()



    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await axios.get(`chats/${user?._id}`)
                setChats(data);

            } catch (error) {
                toast({
                    title: 'Failed To Load the chats',
                    status: 'warning',
                    duration: 2500,
                    isClosable: true,
                    position: "top-right"
                })
            }

        }
        fetchChats()
    }, [setChats, toast, user?._id, fetchAgain]);
    // console.log(chats)
    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            // h={"100vh"}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModel>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModel>
            </Box>
            <Box
                d="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {
                    chats ? (
                        <Stack overflowY="scroll">
                            {chats.map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Text>
                                        {
                                            !chat.isGroupChat ? (
                                                getSender(user, chat.users)
                                            ) : (
                                                chat.chatName
                                            )
                                        }
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )
                }
            </Box>
        </Box>
    );
}

export default MyChats;
