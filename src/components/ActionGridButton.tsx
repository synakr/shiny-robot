import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: any;
  label: string;
  color: string;
  bg: string;
};

export default function ActionGridButton({
  icon: Icon,
  label,
  color,
  bg,
}: Props) {
  return (
    <TouchableOpacity
      style={{
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}>
        <Icon size={20} color={color} />
      </View>

      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: "#111827",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
