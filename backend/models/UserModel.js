import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import validator from "validator";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
})

userSchema.statics.signUp = asyncHandler(async function (name, email, password, pic) {

    if (!name || !email || !password) {
        throw Error("All fields are mandatory to be filled")
    }

    if (!validator.isEmail(email)) {
        throw Error("Email is not valid")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Enter a strong password")
    }

    const exists = await User.findOne({ email });
    if (exists) {
        throw Error("Email already exists")
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const user = await User.create({ name, email, password: hash, pic })
    await user.save();
    return user
})
userSchema.statics.login = asyncHandler(async function (email, password) {

    if (!email || !password) {
        throw Error("All fields are mandatory to be filled")
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw Error("Incorrect email")
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error("Incorrect password")
    }
    return user
})
const User = mongoose.model("User", userSchema)
export default User;