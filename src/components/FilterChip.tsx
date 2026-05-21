import { Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  active?: boolean;
};

export default function FilterChip({ label, active }: Props) {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: active ? "#6C63FF" : "#F1F3F7",
        marginRight: 10,
      }}>
      <Text
        style={{
          color: active ? "#FFF" : "#667085",
          fontSize: 13,
          fontWeight: "600",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
