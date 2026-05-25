import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  onPress?: () => void;
};

export default function FeatureCard({
  title,
  subtitle,
  icon: Icon,
  color,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 13,
        minHeight: 102,

        shadowColor: "#000",
        shadowOpacity: 0.025,
        shadowRadius: 5,
        elevation: 2,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: `${color}16`,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Icon size={20} color={color} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#111827",
          }}>
          {title}
        </Text>

        <Text
          numberOfLines={1}
          style={{
            marginTop: 4,
            fontSize: 12,
            color: "#6B7280",
          }}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
