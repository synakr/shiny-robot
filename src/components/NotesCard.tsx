import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Download, ExternalLink } from "lucide-react-native";

import { isDownloaded, openNote } from "@/services/offlineNotes";

type Props = {
  title: string;
  type: string;
  size: string;
  date: string;
  color: string;

  file_name: string | null;
  file_url: string | null;

  badge?: string;
};

export default function NotesCard({
  title,
  type,
  size,
  date,
  color,
  badge,
  file_name,
  file_url,
}: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function checkDownloaded() {
      if (!file_name) return;

      const exists = await isDownloaded(file_name);
      setDownloaded(exists);
    }

    checkDownloaded();
  }, [file_name]);

  async function handlePress() {
    if (!file_name || !file_url || downloading) return;

    try {
      setDownloading(true);

      await openNote(file_url, file_name);

      const exists = await isDownloaded(file_name);
      setDownloaded(exists);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Unable to open file",
        "Please check your internet connection or install a compatible application.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={downloading}
      onPress={handlePress}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 14,
        marginBottom: 14,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      {/* Thumbnail */}
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: color,
          marginRight: 14,
        }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#111827",
            lineHeight: 24,
          }}>
          {title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            flexWrap: "wrap",
          }}>
          <Text
            style={{
              fontSize: 13,
              color: "#667085",
            }}>
            {type}
          </Text>

          <Text
            style={{
              marginHorizontal: 6,
              color: "#98A2B3",
            }}>
            •
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "#667085",
            }}>
            {size}
          </Text>

          {badge && (
            <Text
              style={{
                color: "#6C63FF",
                fontSize: 11,
                fontWeight: "700",
              }}>
              {badge}
            </Text>
          )}
        </View>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#667085",
          }}>
          {date}
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 12,
            fontWeight: "600",
            color: downloaded ? "#16A34A" : "#667085",
          }}>
          {downloaded ? "Available offline" : "Tap to download"}
        </Text>
      </View>

      <View
        style={{
          marginLeft: 10,
          width: 38,
          height: 38,
          justifyContent: "center",
          alignItems: "center",
        }}>
        {downloading ? (
          <ActivityIndicator size="small" color="#6C63FF" />
        ) : downloaded ? (
          <ExternalLink size={22} color="#16A34A" />
        ) : (
          <Download size={22} color="#667085" />
        )}
      </View>
    </TouchableOpacity>
  );
}
