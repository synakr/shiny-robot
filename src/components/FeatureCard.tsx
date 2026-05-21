import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
};

export default function FeatureCard({
  title,
  subtitle,
  icon: Icon,
  color,
}: Props) {
  return (
    <TouchableOpacity
      style={{
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 14,
        marginBottom: 14,
        minHeight: 120,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          backgroundColor: `${color}20`,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Icon size={22} color={color} />
      </View>

      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: "700",
          color: "#111827",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          color,
        }}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}
