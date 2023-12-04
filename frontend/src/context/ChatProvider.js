import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const tokenString = localStorage.getItem("token");
    const token = tokenString ? JSON.parse(tokenString) : null;

    useEffect(() => {
        if (token) {
            const userData = jwtDecode(token);
            setUser(userData);
        } else {
            setUser(null);
            navigate("/");
        }
    }, [navigate, token]);

    // console.log("token2", token);
    // console.log(user);

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
