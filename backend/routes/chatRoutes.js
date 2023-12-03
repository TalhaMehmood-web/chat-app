import express from "express"
import protect from "../middleware/authMiddleware.js"
import { accessChat, getAllChats, createGroup, renameGroup, addToGroup, removeFromGroup } from "../controllers/chatController.js";
const router = express.Router();

router.post("/", protect, accessChat)
router.post("/group", protect, createGroup)
router.get("/", protect, getAllChats)
router.put("/rename-group", protect, renameGroup)
router.put("/add-to-group", protect, addToGroup)
router.put("/remove-from-group", protect, removeFromGroup)
export default router;
