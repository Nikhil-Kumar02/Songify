import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { Album, Playlist, Song, Stats } from "../types";
import toast from "react-hot-toast";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  latestSongs: Song[];
  searchResults: Song[];
  likedSongs: Song[];
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchLatestSongs: () => Promise<void>;
  searchSongs: (query: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  toggleLike: (songId: string) => Promise<void>;
  fetchLikedSongs: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  latestSongs: [],
  searchResults: [],
  likedSongs: [],
  playlists: [],
  currentPlaylist: null,
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);

      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      console.log("Error in deleteSong", error);
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album: " + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch songs" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch stats" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch albums" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch album" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/public/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch featured songs" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/public/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch 'Made For You' songs" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/public/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch trending songs" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLatestSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      // iTunes Search API for recent arrivals/popular
      const response = await axios.get("https://itunes.apple.com/search?term=latest&entity=song&limit=10");
      const songs: Song[] = response.data.results.map((item: any) => ({
        _id: `itunes-${item.trackId}`,
        title: item.trackName,
        artist: item.artistName,
        albumId: null,
        imageUrl: item.artworkUrl100,
        audioUrl: item.previewUrl,
        duration: Math.floor(item.trackTimeMillis / 1000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      set({ latestSongs: songs });
    } catch (error: any) {
      set({ error: "Failed to fetch latest songs from iTunes" });
    } finally {
      set({ isLoading: false });
    }
  },

  searchSongs: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`);
      const songs: Song[] = response.data.results.map((item: any) => ({
        _id: `itunes-${item.trackId}`,
        title: item.trackName,
        artist: item.artistName,
        albumId: null,
        imageUrl: item.artworkUrl100,
        audioUrl: item.previewUrl,
        duration: Math.floor(item.trackTimeMillis / 1000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      set({ searchResults: songs });
    } catch (error: any) {
      set({ error: "Search failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLikedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/liked-songs");
      set({ likedSongs: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch liked songs" });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleLike: async (songId: string) => {
    try {
      const response = await axiosInstance.post(`/users/like/${songId}`);
      if (response.data.liked) {
        toast.success("Added to Liked Songs");
      } else {
        toast.success("Removed from Liked Songs");
      }
      // Refresh liked songs list
      const updatedLiked = await axiosInstance.get("/users/liked-songs");
      set({ likedSongs: updatedLiked.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to update liked songs");
    }
  },

  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists");
      set({ playlists: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch playlists" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      set({ currentPlaylist: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message || "Failed to fetch playlist" });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/playlists", { name });
      set((state) => ({ playlists: [...state.playlists, response.data] }));
      toast.success("Playlist created");
    } catch (error: any) {
      toast.error("Failed to create playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistId, songId) => {
    try {
      await axiosInstance.post("/playlists/add-song", { playlistId, songId });
      toast.success("Added to playlist");
      // Refresh playlists
      const response = await axiosInstance.get("/playlists");
      set({ playlists: response.data });
    } catch (error: any) {
      toast.error("Failed to add song to playlist");
    }
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    try {
      await axiosInstance.post("/playlists/remove-song", { playlistId, songId });
      toast.success("Removed from playlist");
      // Refresh playlists
      const response = await axiosInstance.get("/playlists");
      set({ playlists: response.data });
    } catch (error: any) {
      toast.error("Failed to remove song from playlist");
    }
  },

  deletePlaylist: async (id) => {
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p._id !== id),
      }));
      toast.success("Playlist deleted");
    } catch (error: any) {
      toast.error("Failed to delete playlist");
    }
  },
}));
