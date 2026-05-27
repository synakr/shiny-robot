import {
    ActivityIndicator,
    Image,
    Linking,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    ArrowDown,
    ArrowUp,
    ExternalLink,
    PlayCircle,
} from "lucide-react-native";

type Props = {
  playlist: any;

  videos: any[];

  expanded: boolean;

  loading: boolean;

  onToggle: () => void;
};

export default function PlaylistAccordion({
  playlist,
  videos,
  expanded,
  loading,
  onToggle,
}: Props) {
  async function handleVideoPress(videoId: string) {
    await Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  }

  return (
    <View
      style={{
        marginBottom: 18,
      }}>
      {/* PLAYLIST CARD */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onToggle}
        style={{
          backgroundColor: "#111827",
          borderRadius: 28,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 4,
        }}>
        {/* THUMBNAIL */}
        {videos[0]?.thumbnail ? (
          <Image
            source={{
              uri: videos[0]?.thumbnail,
            }}
            style={{
              width: 108,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#222",
            }}
          />
        ) : (
          <View
            style={{
              width: 108,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#2A2A2A",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <PlayCircle size={26} color="#6B7280" />
          </View>
        )}

        {/* INFO */}
        <View
          style={{
            flex: 1,
            marginLeft: 14,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: "#D1D5DB",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}>
            Playlist
          </Text>

          <Text
            numberOfLines={2}
            style={{
              marginTop: 6,
              fontSize: 17,
              fontWeight: "800",
              color: "#FFF",
              lineHeight: 24,
            }}>
            {playlist.title}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "#9CA3AF",
            }}>
            {videos.length} Videos
          </Text>
        </View>

        {/* ICON */}
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: "rgba(255,255,255,0.12)",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {expanded ? (
            <ArrowUp size={18} color="#FFF" />
          ) : (
            <ArrowDown size={18} color="#FFF" />
          )}
        </View>
      </TouchableOpacity>

      {/* VIDEOS */}
      {expanded && (
        <View
          style={{
            marginTop: 14,
          }}>
          {loading ? (
            <View
              style={{
                paddingVertical: 30,
                alignItems: "center",
              }}>
              <ActivityIndicator color="#DC2626" />
            </View>
          ) : (
            videos.map((video, idx) => (
              <VideoCard
                key={idx}
                title={video.title}
                thumbnail={video.thumbnail}
                onPress={() => handleVideoPress(video.id)}
              />
            ))
          )}
        </View>
      )}
    </View>
  );
}

function VideoCard({ title, thumbnail, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
      }}>
      {/* THUMBNAIL */}
      <View>
        <Image
          source={{
            uri: thumbnail,
          }}
          style={{
            width: 96,
            height: 62,
            borderRadius: 14,
            backgroundColor: "#EEE",
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "rgba(0,0,0,0.55)",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <PlayCircle size={16} color="#FFF" />
          </View>
        </View>
      </View>

      {/* INFO */}
      <View
        style={{
          flex: 1,
          marginLeft: 12,
        }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#111827",
            lineHeight: 20,
          }}>
          {title}
        </Text>
      </View>

      <ExternalLink size={16} color="#DC2626" />
    </TouchableOpacity>
  );
}
