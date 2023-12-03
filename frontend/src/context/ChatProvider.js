import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));

        if (token) {
            const userData = jwtDecode(token);
            setUser(userData);
        } else {
            setUser(null);
            navigate("/");
        }
    }, [navigate]);

    return <ChatContext.Provider value={{ user, setUser }}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
