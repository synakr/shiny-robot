import { Text, View } from "react-native";

type Props = {
  subject: string;
  progress: number;
  color: string;
};

export default function SubjectProgress({ subject, progress, color }: Props) {
  return (
    <View
      style={{
        marginBottom: 16,
      }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#111827",
          }}>
          {subject}
        </Text>

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#667085",
          }}>
          {progress}%
        </Text>
      </View>

      <View
        style={{
          height: 8,
          borderRadius: 20,
          backgroundColor: "#EEF2F6",
          overflow: "hidden",
        }}>
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 20,
          }}
        />
      </View>
    </View>
  );
}
