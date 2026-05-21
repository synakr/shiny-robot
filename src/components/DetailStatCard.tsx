import { Text, View } from "react-native";

type Props = {
  title: string;
  value: string;
  color: string;
  bg: string;
};

export default function DetailStatCard({ title, value, color, bg }: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 18,
        paddingVertical: 14,
        alignItems: "center",
        marginHorizontal: 4,
      }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color,
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 20,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}
