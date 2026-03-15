import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, getLikedSongs, toggleLike } from "../controller/user.controller.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.get("/liked-songs", protectRoute, getLikedSongs);
router.post("/like/:songId", protectRoute, toggleLike);

export default router;
