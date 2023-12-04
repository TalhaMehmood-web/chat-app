import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from '../utils/AxiosConfiq';
import UserList from './UserList';
import { ChatState } from '../context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
const GroupChatModel = ({ children }) => {
    const { user, chats, setChats } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [selectedUser, setSelectedUser] = useState([])

    const toast = useToast();
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            setSearchResult(null)
        }
        try {
            setLoading(true)
            const { data } = await axios.get(`user/all-user?search=${search}`)
            // console.log(data);
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error Occurred',
                description: "Failed to load the chats",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUser) {
            toast({
                title: 'Error Occurred',
                description: "Fill all the fields",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        try {

            const { data } = await axios.post(`chats/group/${user._id}`, {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map(u => u._id))
            })
            // console.log(data)
            setChats([data, ...chats])
            onClose()
            toast({
                title: 'Group created Successfully',
                // description: "Fill all the fields",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            // console.log(error)
            toast({
                title: 'Error Occurred',
                description: `${error.response.data}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }



    }
    const handleGroup = (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            toast({
                title: 'Error Occurred',
                description: "User Already in the group",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
        setSelectedUser([...selectedUser, userToAdd])
    }
    const handleDelete = (user) => {
        setSelectedUser(selectedUser.filter(item => item?._id !== user?._id))
    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"

                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex" flexDir="column" alignItems="center"
                    >
                        <FormControl>
                            <Input placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Search User'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box
                            display={"flex"}
                        >
                            {
                                selectedUser.map(item => {
                                    return <UserBadgeItem

                                        key={item._id}
                                        user={item}
                                        handleFunction={() => handleDelete(item)}

                                    />
                                })
                            }
                        </Box>
                        {
                            loading ? (<Spinner />) : (
                                searchResult?.filter(result => result?._id !== user?._id).slice(0, 4).map(user => {
                                    return <UserList
                                        key={user?._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                })
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel;
