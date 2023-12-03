import { Box, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import axios from '../utils/AxiosConfiq';
import ChatLoading from './ChatLoading';
import UserList from './UserList';
const SideDrawer = () => {
    const { user } = ChatState();
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const toast = useToast();
    const logout = () => {
        localStorage.removeItem("token")
        navigate("/")

    }
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Enter something to search',
                status: 'warning',
                duration: 2500,
                isClosable: true,
                position: "top-right"
            })
        }
        else {
            try {
                setLoading(true)
                const { data } = await axios.get(`user/all-user?search=${search}`)
                setLoading(false)
                setSearchResults(data)
            } catch (error) {
                console.log(error.response)
                toast({
                    title: 'Enter Occured',
                    status: 'warning',
                    duration: 2500,
                    isClosable: true,
                    position: "top-right"
                })

            }
        }
    }
    const accessChat = (userId) => {

    }
    return (
        <>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
                p={"5px 5px"}
                borderRadius={"5px"}
                backgroundColor={"white"}
            >
                <Tooltip hasArrow bg={"gray.600"} label="Search user to chat " placeContent={"bottom-end"} >
                    <Button variant={"ghost"}
                        display={"flex"}
                        alignItems={"center"}
                        onClick={onOpen}
                    >
                        <span className="material-symbols-outlined">
                            search
                        </span>
                        <Text
                            ml={"10px"}
                            fontSize={"xl"}
                            display={{ base: "none", md: "flex" }}
                        >
                            Search User
                        </Text>
                    </Button>

                </Tooltip>

                <Text
                    fontSize={"2xl"}
                    fontFamily={"sans-serif"}

                >
                    GUP-SHUP
                </Text>

                <Box
                    display={"flex"}
                    alignItems={"center"}
                >
                    <Menu >
                        <MenuButton p={1} >
                            <span className="material-symbols-outlined " style={{ marginRight: "5px" }} >
                                notifications
                            </span>
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<span className="material-symbols-outlined">
                            expand_more
                        </span>} >
                            <Avatar size={"sm"} cursor={"pointer"} name={user?.name} src={user?.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user} >
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logout} >Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} pb={2} >
                            <Input
                                placeholder='Search by name or email'
                                value={search}
                                mr={2}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch} >Go</Button>
                        </Box>
                        {
                            loading ? (
                                <ChatLoading />
                            ) : (
                                searchResults?.map((user, index) => (
                                    <UserList
                                        key={user?._id}
                                        user={user}
                                        handleFunction={() => accessChat(user?._id)}
                                    />
                                ))
                            )
                        }
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    );
}

export default SideDrawer;
