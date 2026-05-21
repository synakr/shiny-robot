import { Download } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  type: string;
  size: string;
  date: string;
  color: string;
  badge?: string;
};

export default function NotesCard({
  title,
  type,
  size,
  date,
  color,
  badge,
}: Props) {
  return (
    <View
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
            <View
              style={{
                marginLeft: 8,
                backgroundColor: "#EEE8FF",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  color: "#6C63FF",
                  fontSize: 11,
                  fontWeight: "700",
                }}>
                {badge}
              </Text>
            </View>
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
      </View>

      {/* Download */}
      <TouchableOpacity
        style={{
          marginLeft: 10,
        }}>
        <Download size={22} color="#667085" />
      </TouchableOpacity>
    </View>
  );
}
