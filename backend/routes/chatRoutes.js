import express from "express"
import protect from "../middleware/authMiddleware.js"
import { accessChat, getAllChats, createGroup, renameGroup, addToGroup, removeFromGroup } from "../controllers/chatController.js";
const router = express.Router();

router.post("/:loggedId", protect, accessChat)
router.post("/group/:adminId", protect, createGroup)
router.get("/:loggedId", protect, getAllChats)
router.put("/rename-group", protect, renameGroup)
router.put("/add-to-group", protect, addToGroup)
router.put("/remove-from-group", protect, removeFromGroup)
export default router;
