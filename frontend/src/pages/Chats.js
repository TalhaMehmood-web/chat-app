import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SideDrawer from '../components/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { Box } from '@chakra-ui/react';

const Chats = () => {
    const { user } = ChatState()
    return (
        <div style={{ width: "100%" }} >
            {
                user && <SideDrawer />
            }
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
                p={"10px"}

            >
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>

        </div>
    );
}

export default Chats;
