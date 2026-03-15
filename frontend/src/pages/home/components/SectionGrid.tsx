import { Button } from "../../../components/ui/button";
import { Song } from "../../../types";
import PlayButton from "./PlayButton";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Heart } from "lucide-react";
import { useMusicStore } from "../../../stores/useMusicStore";
import { cn } from "../../../lib/utils";
import AddToPlaylistDialog from "../../../components/AddToPlaylistDialog";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  const { toggleLike, likedSongs } = useMusicStore();

  if (isLoading) {
    return <SectionGridSkeleton />;
  }

  return (
    <div className="mb-">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-00 hover:text-white cursor-pointer" 
        >
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <PlayButton song={song} />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(song._id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-900"
              >
                <Heart
                  className={cn(
                    "size-4 transition-colors",
                    likedSongs.some((s) => s._id === song._id)
                      ? "fill-emerald-500 text-emerald-500"
                      : "text-zinc-400"
                  )}
                />
              </button>
              <AddToPlaylistDialog songId={song._id} />
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
