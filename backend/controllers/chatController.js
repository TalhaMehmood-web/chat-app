import Chat from "../models/ChatModel.js"
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const { loggedId } = req.params
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: loggedId } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [loggedId, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

export const getAllChats = asyncHandler(async (req, res) => {
    const { loggedId } = req.params
    try {
        Chat.find({
            users: { $elemMatch: { $eq: loggedId } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage").sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "-password"
                })
                res.status(200).json(result);
            })

    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})
export const createGroup = asyncHandler(async (req, res) => {
    const { adminId } = req.params
    if (!req.body.users || !req.body.name) {
        return res.status(400).json("please fill all the fields")
    }
    let users = JSON.parse(req.body.users)
    if (users.length < 1) {
        return res.status(200).json("group must have at least two users")
    }
    const admin = await User.findById(adminId)
    users.push(admin)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: admin
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(201).json(fullGroupChat)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
export const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new: true,
            }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password")
        if (!updatedChat) {
            res.status(400).json("fill all the fields")
        }
        res.status(200).json(updatedChat)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
export const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId && !userId) {
        return res.status(400).json("fill all the fields")
    }
    try {

        const removeUser = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            },
        )
        const newGroup = await Chat.findOne({ _id: removeUser._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        if (!newGroup) {
            return res.status(404).json("Can't add new user")
        }
        res.status(200).json(newGroup)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
export const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId && !userId) {
        return res.status(400).json("fill all the fields")
    }
    try {

        const addedToGroup = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            },
        )
        const newGroup = await Chat.findOne({ _id: addedToGroup._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        if (!newGroup) {
            return res.status(404).json("Can't add new user")
        }
        res.status(200).json(newGroup)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})