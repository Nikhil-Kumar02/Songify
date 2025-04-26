// src/routes/public-song.route.js
import express from "express";
import { 
  getFeaturedSongs, 
  getMadeForYouSongs, 
  getTrendingSongs 
} from "../controller/song.controller.js";

const router = express.Router();

// Public routes - no protectRoute, no requireAdmin
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
export default router;
