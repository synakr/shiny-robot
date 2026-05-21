import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: any;
  title: string;
  color: string;
  bg: string;
  onPress?: () => void;
};

export default function QuickActionCard({
  icon: Icon,
  title,
  color,
  bg,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 14,
        marginBottom: 2,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}>
        <Icon size={18} color={color} />
      </View>

      <Text
        style={{
          flex: 1,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "600",
          color: "#111827",
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
