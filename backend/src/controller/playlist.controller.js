import { Playlist } from "../models/playlist.model.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.auth.userId;

    const playlist = await Playlist.create({
      name,
      userId,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getUserPlaylists = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const playlists = await Playlist.find({ userId }).populate("songs");
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.auth.userId;

    const playlist = await Playlist.findOne({ _id: playlistId, userId });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: "Song already in playlist" });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.auth.userId;

    const playlist = await Playlist.findOne({ _id: playlistId, userId });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    const playlist = await Playlist.findOneAndDelete({ _id: id, userId });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found or unauthorized" });
    }

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    next(error);
  }
};
