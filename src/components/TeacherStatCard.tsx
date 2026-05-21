import { Text, View } from "react-native";

type Props = {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  bg: string;
};

export default function TeacherStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  bg,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 22,
        paddingVertical: 16,
        paddingHorizontal: 10,
        alignItems: "center",
        marginHorizontal: 4,
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
          fontSize: 12,
          color: "#667085",
          fontWeight: "600",
          textAlign: "center",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 24,
          fontWeight: "800",
          color: "#111827",
        }}>
        {value}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          color,
          fontWeight: "700",
          textAlign: "center",
        }}>
        {subtitle}
      </Text>
    </View>
  );
}
