import { useEffect } from "react";
import Topbar from "../../components/Topbar";
import { useMusicStore } from "../../stores/useMusicStore";
import FeaturedSection from "./components/FeaturedSection";
import SearchBar from "./components/SearchBar";
import { ScrollArea } from "../../components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "../../stores/usePlayerStore";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    fetchLatestSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
    latestSongs,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
    fetchLatestSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, fetchLatestSongs]);

  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0 &&
      latestSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs, ...latestSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs, latestSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good afternoon
          </h1>
          <SearchBar />
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Latest Hits (iTunes)"
              songs={latestSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};
export default HomePage;
