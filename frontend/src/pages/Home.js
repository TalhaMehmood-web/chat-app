import React from 'react';
import {
    Container, Box, Text, Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from "@chakra-ui/react"
import Signup from '../components/Signup.js';
import Login from '../components/Login.js';

const Home = () => {
    return (
        <Container maxW={"xl"} centerContent>
            <Box
                bg={"white"}
                padding={3}
                borderRadius={"lg"}
                borderWidth={"1px"}
                display={"flex"}
                margin={"40px 0px 15px 0px"}
                width={"100%"}
                justifyContent={"center"}
                alignItems={"center"}>

                <Text className='header' fontSize={"4xl"} fontFamily={"work sans"}>GUP-SHUP</Text>
            </Box>
            <Box bg={"white"}
                borderRadius={"lg"}
                borderWidth={"1px"}
                width={"100%"}
                p={4}>
                <Tabs variant='soft-rounded' >
                    <TabList>
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>Sign Up</Tab>

                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>

                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}

export default Home;
