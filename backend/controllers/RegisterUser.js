import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken";

let createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

export const RegisterUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    try {
        const user = await User.signUp(name, email, password, pic)
        // createToken
        const token = createToken(user._id)
        res.status(201).json({ user, token })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id);
        const success = "login successfully"
        res.status(201).json({ email, token, success })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})
export const allUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]

    } : {}

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.status(200).json(users)


})