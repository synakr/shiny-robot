import { Text, TouchableOpacity, View } from "react-native";

import { ChevronDown } from "lucide-react-native";

type Props = {
  label: string;
  value: string;
};

export default function SelectBox({ label, value }: Props) {
  return (
    <View
      style={{
        marginBottom: 18,
      }}>
      <Text
        style={{
          marginBottom: 10,
          fontSize: 14,
          fontWeight: "700",
          color: "#111827",
        }}>
        {label}
      </Text>

      <TouchableOpacity
        style={{
          height: 54,
          borderRadius: 18,
          backgroundColor: "#FFF",
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          shadowColor: "#000",
          shadowOpacity: 0.02,
          shadowRadius: 4,
          elevation: 1,
        }}>
        <Text
          style={{
            fontSize: 15,
            color: "#111827",
          }}>
          {value}
        </Text>

        <ChevronDown size={20} color="#667085" />
      </TouchableOpacity>
    </View>
  );
}
