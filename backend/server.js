import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRoutes from "../backend/routes/userRouter.js"
import chatRoutes from "./routes/chatRoutes.js";
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
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
    console.log("database connected".blue.bold);
})

app.listen(process.env.PORT, process.env.HOST_NAME, () => {
    console.log(`server is running at${process.env.HOST_NAME}:${process.env.PORT}`.yellow.bold);
})