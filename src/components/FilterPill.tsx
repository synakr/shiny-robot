import { Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function FilterPill({ label, active, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 18,
        backgroundColor: active ? "#6C63FF" : "#F1EFFA",
        marginRight: 12,
      }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: active ? "#FFF" : "#4B5563",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
