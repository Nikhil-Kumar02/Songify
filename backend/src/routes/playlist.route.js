import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

router.post("/", protectRoute, createPlaylist);
router.get("/", protectRoute, getUserPlaylists);
router.get("/:id", protectRoute, getPlaylistById);
router.post("/add-song", protectRoute, addSongToPlaylist);
router.post("/remove-song", protectRoute, removeSongFromPlaylist);
router.delete("/:id", protectRoute, deletePlaylist);

export default router;
