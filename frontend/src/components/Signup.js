import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { useState, React } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");

    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const navigate = useNavigate();

    function handleClick() {
        setShow(!show)
    }
    function postDetails(pics) {
        if (pics === undefined) {
            setLoading(true)
            toast({
                title: 'Please select an image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "GupShup");
            data.append("cloud_name", "gup-shup");
            fetch("https://api.cloudinary.com/v1_1/gup-shup/image/upload", {
                method: "post",
                body: data,
            }).then(res => res.json())
                .then(data => {
                    setPic(data.url.toString())
                    console.log(data.url.toString());
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false)
                })

        }
        else {
            toast({
                title: 'Please select an image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
    }
    async function submitHandler(ev) {
        ev.preventDefault();
        setLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'All fields are mandatory to be filled',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;

        }
        if (password !== confirmPassword) {
            toast({
                title: 'Password don not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
        try {
            const confiq = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            const { data } = await axios.post("/api/user/signup", { name, email, password, pic }, confiq);
            console.log(data.token);
            toast({
                title: 'Successfully singed up',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem("token", JSON.stringify(data.token))
            navigate("/chats")
            setLoading(false)
        } catch (error) {

            console.log(error);
            if (error.response) {
                console.log('Server responded with status code:', error.response.status);
                console.log("response error", error.response.data);

            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Error creating request:', error.message);
            }
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
            <FormControl marginTop="10px" id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    value={name}
                    placeholder='Enter your name'
                    onChange={(e) => { setName(e.target.value) }}
                />
            </FormControl>
            <FormControl marginTop="10px" id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    value={email}
                    placeholder='Enter your email'
                    onChange={(e) => { setEmail(e.target.value) }}
                />
            </FormControl>
            <FormControl marginTop="10px" id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        value={password}
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
            <FormControl marginTop="10px" id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        value={confirmPassword}
                        type={show ? "text" : "password"}
                        placeholder='Confirm Password'
                        onChange={(e) => { setConfirmPassword(e.target.value) }}
                    />
                    <InputRightElement>
                        <Button h={"1.7rem"} size={"sm"} onClick={handleClick} >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl marginTop="10px" id='pic' isRequired>
                <FormLabel>Upload you picture</FormLabel>
                <Input
                    type='file'
                    accept='image/*'
                    onChange={(e) => { postDetails(e.target.files[0]) }}
                />
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

export default Signup;
