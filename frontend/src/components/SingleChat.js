import React, { useCallback, useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender } from "../config/ChatLogics"
import ProfileModel from './ProfileModel';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from '../utils/AxiosConfiq';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";


import { useRef } from 'react';
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const toast = useToast();
    const ENDPOINT = "http://localhost:5000";
    var selectedChatCompareRef = useRef();
    const socketRef = useRef();

    const fetchMessages = useCallback(async () => {
        if (!selectedChat) return;

        try {

            setLoading(true);

            const { data } = await axios.get(
                `/message/all-message/${selectedChat._id}`
            );
            setMessages(data);
            setLoading(false);

            socketRef.current.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }, [selectedChat, toast, socketRef])
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socketRef.current.emit("stop typing", selectedChat._id);
            try {
                setNewMessage("");
                const { data } = await axios.post(
                    "/message/send-message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                        userId: user._id
                    },

                );
                socketRef.current.emit("new message", data);
                setMessages([...messages, data]);
                // console.log(data);

            } catch (error) {
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };



    useEffect(() => {
        socketRef.current = io(ENDPOINT);
        socketRef.current.emit("setup", user);
        socketRef.current.on("connected", () => setSocketConnected(true));
        socketRef.current.on("typing", () => setIsTyping(true));
        socketRef.current.on("stop typing", () => setIsTyping(false));

        return () => {

            socketRef.current.disconnect();
        };
    }, [ENDPOINT, user]);


    useEffect(() => {

        fetchMessages();
        selectedChatCompareRef.current = selectedChat;
    }, [selectedChat, toast, fetchMessages, socketRef, selectedChatCompareRef])
    useEffect(() => {
        socketRef.current.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompareRef.current ||
                selectedChatCompareRef.current._id !== newMessageReceived.chat._id
            ) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!isTyping) {
            setIsTyping(true);
            socketRef.current.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 2000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && isTyping) {
                socketRef.current.emit("stop typing", selectedChat._id);
                setIsTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {
                                !selectedChat.isGroupChat ? (<>
                                    {
                                        getSender(user, selectedChat.users)
                                    }
                                    <ProfileModel user={selectedChat.users[1]} />

                                </>) : (
                                    <>  {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchMessages={fetchMessages}
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </>
                                )}

                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : (
                                <div style={{
                                    display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none"
                                }}>
                                    <ScrollableChat messages={messages} />
                                </div>
                            )}

                            <FormControl
                                onKeyDown={sendMessage}
                                id="first-name"
                                isRequired
                                mt={3}
                            >
                                {isTyping ? (
                                    <p
                                        style={{
                                            margin: "2px 0px 5px 10px ",
                                            color: "gray"
                                        }}
                                    >
                                        typing...
                                    </p>

                                ) : (
                                    <></>
                                )}
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                />
                            </FormControl>

                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    );
}

export default SingleChat;
