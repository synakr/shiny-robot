import { TextInput, View } from "react-native";

import { LucideIcon } from "lucide-react-native";

type Props = {
  placeholder: string;
  icon: LucideIcon;
  secure?: boolean;
};

export default function AuthInput({ placeholder, icon: Icon, secure }: Props) {
  return (
    <View
      style={{
        height: 56,
        borderRadius: 18,
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 16,

        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
      }}>
      <Icon size={20} color="#98A2B3" />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        secureTextEntry={secure}
        style={{
          flex: 1,
          marginLeft: 12,
          fontSize: 15,
          color: "#111827",
        }}
      />
    </View>
  );
}
