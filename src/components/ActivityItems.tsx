import { Text, View } from "react-native";

type Props = {
  icon: any;
  title: string;
  time: string;
  color: string;
  bg: string;
};

export default function ActivityItem({
  icon: Icon,
  title,
  time,
  color,
  bg,
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 16,
      }}>
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 14,
        }}>
        <Icon size={22} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            fontWeight: "700",
            color: "#111827",
          }}>
          {title}
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 14,
            color: "#667085",
          }}>
          {time}
        </Text>
      </View>
    </View>
  );
}
