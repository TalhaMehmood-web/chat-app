import express from "express";
import protect from "../middleware/authMiddleware.js"
import { RegisterUser, authUser, allUser } from "../controllers/RegisterUser.js";
const router = express.Router();
// router.get("/", (req, res) => {
//     res.status(200).json({ message: "test ok" })
// })
router.post("/signup", RegisterUser)
router.post("/login", authUser)
router.get("/all-user", protect, allUser);

export default router;