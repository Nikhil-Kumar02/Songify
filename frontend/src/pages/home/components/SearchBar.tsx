import { Input } from "../../../components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMusicStore } from "../../../stores/useMusicStore";
import { usePlayerStore } from "../../../stores/usePlayerStore";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { searchSongs, searchResults, isLoading } = useMusicStore();
  const { setCurrentSong } = usePlayerStore();
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchSongs(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchSongs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto mb-6" ref={containerRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <Input
          placeholder="Search for songs, artists..."
          className="bg-zinc-800/50 border-none pl-10 h-10 ring-1 ring-zinc-700 focus-visible:ring-emerald-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {showResults && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-md shadow-2xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-zinc-400">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md cursor-pointer transition-colors group"
                  onClick={() => {
                    setCurrentSong(song);
                    setShowResults(false);
                  }}
                >
                  <img src={song.imageUrl} alt={song.title} className="size-10 rounded-sm object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-emerald-500">{song.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-zinc-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
