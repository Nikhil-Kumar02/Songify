import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMusicStore } from "../../stores/useMusicStore";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { Clock, Pause, Play, Trash2 } from "lucide-react";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { formatDuration } from "../album/AlbumPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { fetchPlaylistById, currentPlaylist, isLoading, removeSongFromPlaylist, deletePlaylist } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (playlistId) fetchPlaylistById(playlistId);
  }, [fetchPlaylistById, playlistId]);

  if (isLoading || !currentPlaylist) return null;

  const handlePlayPlaylist = () => {
    if (currentPlaylist.songs.length === 0) return;

    const isCurrentPlaylistPlaying = currentPlaylist.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentPlaylistPlaying) togglePlay();
    else {
      playAlbum(currentPlaylist.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    playAlbum(currentPlaylist.songs, index);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentPlaylist.imageUrl}
                alt={currentPlaylist.name}
                className="w-[240px] h-[240px] shadow-xl rounded object-cover"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlist</p>
                <h1 className="text-7xl font-bold my-4">{currentPlaylist.name}</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">You</span>
                  <span>• {currentPlaylist.songs.length} songs</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayPlaylist}
                size="icon"
                disabled={currentPlaylist.songs.length === 0}
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying && currentPlaylist.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-red-500 transition-colors"
                onClick={() => {
                  if (confirm("Delete this playlist?")) {
                    deletePlaylist(currentPlaylist._id);
                    navigate("/");
                  }
                }}
              >
                <Trash2 className="size-6" />
              </Button>
            </div>

            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Added Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentPlaylist.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-emerald-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">{index + 1}</span>
                          )}
                          {!isCurrentSong && <Play className="h-4 w-4 hidden group-hover:block" />}
                        </div>

                        <div className="flex items-center gap-3">
                          <img src={song.imageUrl} alt={song.title} className="size-10 object-cover" />
                          <div>
                            <div className={`font-medium text-white`}>{song.title}</div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">{song.createdAt.split("T")[0]}</div>
                        <div className="flex items-center gap-4">
                          <span>{formatDuration(song.duration)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSongFromPlaylist(currentPlaylist._id, song._id);
                            }}
                            className="text-zinc-400 hover:text-red-500 hidden group-hover:block"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {currentPlaylist.songs.length === 0 && (
                    <div className="text-center py-10 text-zinc-500">
                      No songs in this playlist yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistPage;
