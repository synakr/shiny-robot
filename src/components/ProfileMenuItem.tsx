import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: any;
  title: string;
  color: string;
  bg: string;
};

export default function ProfileMenuItem({
  icon: Icon,
  title,
  color,
  bg,
}: Props) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
      }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: bg,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}>
          <Icon size={20} color={color} />
        </View>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#111827",
          }}>
          {title}
        </Text>
      </View>

      <ChevronRight size={20} color="#98A2B3" />
    </TouchableOpacity>
  );
}
