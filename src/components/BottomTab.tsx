import { Text, TouchableOpacity, View } from "react-native";

type Tab = {
  icon: any;
  label: string;
  active?: boolean;
};

type Props = {
  tabs: Tab[];
};

function TabItem({ icon: Icon, label, active }: Tab) {
  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
      }}>
      <Icon size={22} color={active ? "#6C63FF" : "#4B5563"} />

      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          color: active ? "#6C63FF" : "#4B5563",
          fontWeight: active ? "700" : "500",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function BottomTab({ tabs }: Props) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 18,
        left: 16,
        right: 16,
        backgroundColor: "#FFF",
        borderRadius: 26,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 5,
      }}>
      {tabs.map((tab, index) => (
        <TabItem key={index} {...tab} />
      ))}
    </View>
  );
}
