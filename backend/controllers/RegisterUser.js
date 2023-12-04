import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken";

let createToken = (_id, name, email, pic) => {
    return jwt.sign({ _id: _id, name, email, pic }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

export const RegisterUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    try {
        const user = await User.signUp(name, email, password, pic)
        // createToken
        const token = createToken(user._id, user.name, user.email, user.pic)
        res.status(201).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token
            })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.login(email, password)
        const token = createToken(user._id, user.name, user.email, user.pic);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token,
        })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})
export const allUser = asyncHandler(async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]

        } : {}

        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
        res.status(200).json(users)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})