import { React, useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from "axios";
const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const history = useHistory();
    function handleClick() {
        setShow(!show)
    }
    async function submitHandler(ev) {
        ev.preventDefault();
        setLoading(true)
        if (!email || !password) {
            toast({
                title: 'All fields are mandatory to be filled',
                status: 'warning',
                duration: 2300,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }

        try {
            const confiq = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const { data } = await axios.post("/api/user/login", { email, password }, confiq);
            console.log(data);
            toast({
                title: 'Successfully  logged in',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            history.push("/chats");
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
        }

    }
    return (
        <VStack>

            <FormControl marginTop="10px" id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    onChange={(e) => { setEmail(e.target.value) }}
                />
            </FormControl>
            <FormControl marginTop="10px" id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Password'
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <InputRightElement>
                        <Button h={"1.7rem"} size={"sm"} onClick={handleClick} >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>



            <Button
                colorScheme='blue'
                width={"100%"}
                marginTop={"20px"}
                onClick={submitHandler}
                isLoading={loading}
            >Submit</Button>
        </VStack>
    );
}

export default Login;
