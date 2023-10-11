import Chat from "../models/ChatModel.js"
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
export const accessChat = asyncHandler(async (req, res) => {

    const { userId } = req.body;
    if (!userId) {
        console.log("userId param not send with request");
        res.status(400)
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "-password"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {

        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        console.log(chatData.users[0]);

        try {
            const createdChat = await Chat.create(chatData);
            const findChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            res.status(201).json(findChat);
            console.log(findChat);
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
})

export const getAllChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
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
    if (!req.body.users && !req.body.name) {
        return res.status(400).json("please fill all the fields")
    }
    let users = JSON.parse(req.body.users)
    if (users.length < 2) {
        return res.status(200).json("group must have at least two users")
    }
    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
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