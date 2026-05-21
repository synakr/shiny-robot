import { Text, View } from "react-native";

type Props = {
  icon: any;
  value: string;
  label: string;
  color: string;
  bg: string;
};

export default function StatCard({
  icon: Icon,
  value,
  label,
  color,
  bg,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}>
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}>
        <Icon size={24} color={color} />
      </View>

      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          color: "#667085",
        }}>
        {label}
      </Text>
    </View>
  );
}
