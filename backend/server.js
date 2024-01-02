import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoutes from "../backend/routes/userRouter.js"
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import { Server } from "socket.io"
import cors from "cors";
import colors from "colors";
const app = express();
app.use(bodyParser.json());
dotenv.config();

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}))
app.use("/api/user", userRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/message", messageRoutes)
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
    console.log("database connected".blue.bold);
})

const server = app.listen(process.env.PORT, process.env.HOST_NAME, () => {
    console.log(`server is running at${process.env.HOST_NAME}:${process.env.PORT}`.yellow.bold);
})
const io = new Server(server, {
    pingTimeout: 60000,

    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },

});
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
