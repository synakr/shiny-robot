import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "800",
          color: "#111827",
        }}>
        More Page
      </Text>
    </SafeAreaView>
  );
}
