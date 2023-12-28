import asyncHandler from "express-async-handler";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js";
export const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});
export const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId, userId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: userId,
        content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});