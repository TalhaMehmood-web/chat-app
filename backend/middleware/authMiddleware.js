import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken";


const protect = asyncHandler(async (req, res, next) => {
    let token;

    let authToken = req.headers.authorization || req.headers.Authorization
    try {
        token = authToken.split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findOne(decode.id).select("-password")
        next();
    } catch (error) {
        res.status(401)
        throw Error("not authorized")
    }

    if (!token) {
        res.status(400).json({ message: "Not authorized no token" })
    }
})
export default protect