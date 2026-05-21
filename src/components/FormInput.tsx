import { Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  placeholder: string;
  multiline?: boolean;
};

export default function FormInput({ label, placeholder, multiline }: Props) {
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

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={{
          minHeight: multiline ? 120 : 54,
          borderRadius: 18,
          backgroundColor: "#FFF",
          paddingHorizontal: 16,
          paddingTop: multiline ? 16 : 0,
          fontSize: 15,
          color: "#111827",
          shadowColor: "#000",
          shadowOpacity: 0.02,
          shadowRadius: 4,
          elevation: 1,
        }}
      />
    </View>
  );
}
