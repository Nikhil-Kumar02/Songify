import { Album, Music } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useAuthStore } from "../../stores/useAuthSore";
import DashBoardStats from "./components/DashBoardStats";
import Header from "./components/Header";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "../../stores/useMusicStore";

const AdminPage = () => {
  const { isAdmin, isLoading, checkAdminStatus } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    checkAdminStatus();
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [checkAdminStatus, fetchAlbums, fetchSongs, fetchStats]);

  if (!isAdmin && !isLoading) {
    return <div>Unauthorized</div>;
  }
  console.log("isAdmin:", isAdmin, "isLoading:", isLoading);
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <Header />

      <DashBoardStats />

      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700"
          >
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-zinc-700"
          >
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
