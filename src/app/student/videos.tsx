import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  PlayCircle
} from "lucide-react-native";

import { router } from "expo-router";

import { getPlaylistVideos } from "@/services/youtube";

import { useAuthStore } from "@/store/authStore";

import PlaylistAccordion from "@/components/PlaylistAccordion";
import { getPlaylistsForStudent } from "@/services/student-playlists";

export default function VideosScreen() {
  const { student } = useAuthStore();

  const [playlists, setPlaylists] = useState<any[]>([]);

  const [playlistVideos, setPlaylistVideos] = useState<Record<string, any[]>>(
    {},
  );

  const [expandedPlaylists, setExpandedPlaylists] = useState<
    Record<string, boolean>
  >({});

  const [loadingPlaylists, setLoadingPlaylists] = useState<
    Record<string, boolean>
  >({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlaylists() {
      try {
        if (!student) {
          setLoading(false);

          return;
        }

        setLoading(true);

        const playlistResponse = await getPlaylistsForStudent(student);

        if (!playlistResponse.success) {
          Alert.alert("Error", "Failed to load playlists.");

          return;
        }

        const allPlaylists = playlistResponse.data || [];

        setPlaylists(allPlaylists);
      } catch (error) {
        console.log(error);

        Alert.alert("Error", "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadPlaylists();
  }, [student]);

  async function loadPlaylistVideos(playlist: any) {
    try {
      // ALREADY CACHED
      if (playlistVideos[playlist.id]) {
        return;
      }

      // START LOADING
      setLoadingPlaylists((prev) => ({
        ...prev,

        [playlist.id]: true,
      }));

      const response = await getPlaylistVideos(playlist.playlist_url);

      if (response.success) {
        setPlaylistVideos((prev) => ({
          ...prev,

          [playlist.id]: response.data || [],
        }));
      } else {
        Alert.alert("Error", response.error || "Failed to load videos.");
      }
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Could not load playlist.");
    } finally {
      // STOP LOADING
      setLoadingPlaylists((prev) => ({
        ...prev,

        [playlist.id]: false,
      }));
    }
  }

  async function handlePlaylistPress(playlist: any) {
    const isExpanded = expandedPlaylists[playlist.id];

    // TOGGLE
    setExpandedPlaylists((prev) => ({
      ...prev,

      [playlist.id]: !isExpanded,
    }));

    // FETCH IF NOT CACHED
    if (!playlistVideos[playlist.id]) {
      await loadPlaylistVideos(playlist);
    }
  }

  async function handleVideoPress(videoId: string) {
    try {
      await Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
    } catch (error) {
      Alert.alert("Error", "Could not open video.");
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}>
        {/* HEADER */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 14,
                fontSize: 28,
                fontWeight: "800",
                color: "#111827",
                flex: 1,
              }}>
              Videos
            </Text>
          </View>
        </View>

        {/* LOADING */}
        {loading ? (
          <View
            style={{
              marginTop: 80,
              alignItems: "center",
            }}>
            <ActivityIndicator size="large" color="#DC2626" />
          </View>
        ) : playlists.length === 0 ? (
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 40,
              backgroundColor: "#FFF",
              borderRadius: 28,
              padding: 34,
              alignItems: "center",
            }}>
            <PlayCircle size={48} color="#98A2B3" />

            <Text
              style={{
                marginTop: 16,
                fontSize: 18,
                fontWeight: "800",
                color: "#111827",
              }}>
              No Playlists Found
            </Text>
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 24,
            }}>
            {playlists.map((playlist, index) => {
              const videos = playlistVideos[playlist.id] || [];

              const expanded = expandedPlaylists[playlist.id];

              const playlistLoading = loadingPlaylists[playlist.id];

              return (
                <PlaylistAccordion
                  key={index}
                  playlist={playlist}
                  videos={videos}
                  expanded={expanded}
                  loading={playlistLoading}
                  onToggle={() => handlePlaylistPress(playlist)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
