import { Plus } from "lucide-react";
import { useMusicStore } from "../stores/useMusicStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface AddToPlaylistDialogProps {
  songId: string;
}

const AddToPlaylistDialog = ({ songId }: AddToPlaylistDialogProps) => {
  const { playlists, addSongToPlaylist } = useMusicStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-full bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-900 ml-2"
          title="Add to Playlist"
        >
          <Plus className="size-4 text-zinc-400 hover:text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-60 mt-4">
          <div className="space-y-2">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  className="w-full flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md transition-colors text-left"
                  onClick={() => addSongToPlaylist(playlist._id, songId)}
                >
                  <img
                    src={playlist.imageUrl}
                    alt={playlist.name}
                    className="size-10 rounded object-cover"
                  />
                  <span className="font-medium">{playlist.name}</span>
                </button>
              ))
            ) : (
              <p className="text-center text-zinc-400 py-4">No playlists yet. Create one in the sidebar!</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistDialog;
