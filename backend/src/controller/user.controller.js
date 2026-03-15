import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages: ", error)
    next(error);
  }
};

export const getLikedSongs = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId }).populate("likedSongs");
    res.status(200).json(user.likedSongs);
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isLiked = user.likedSongs.includes(songId);

    if (isLiked) {
      user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId);
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();
    res.status(200).json({ liked: !isLiked });
  } catch (error) {
    next(error);
  }
};
