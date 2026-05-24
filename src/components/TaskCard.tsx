import { FileText } from "lucide-react-native";

import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;

  questions: string;

  due: string;

  status: string;

  statusColor: string;

  statusBg: string;

  completed?: boolean;

  onPress?: () => void;
};

export default function TaskCard({
  title,
  questions,
  due,
  status,
  statusColor,
  statusBg,
  completed,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 14,
        marginTop: 14,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      {/* ICON */}
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 18,
          backgroundColor: completed ? "#DCFCE7" : "#EEE8FF",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 14,
        }}>
        <FileText size={24} color={completed ? "#10B981" : "#6C63FF"} />
      </View>

      {/* CONTENT */}
      <View
        style={{
          flex: 1,
          paddingRight: 10,
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#111827",
          }}>
          {title}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#667085",
          }}>
          {questions}
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#98A2B3",
          }}>
          {due}
        </Text>
      </View>

      {/* STATUS */}
      <View
        style={{
          backgroundColor: statusBg,
          paddingHorizontal: 13,
          paddingVertical: 7,
          borderRadius: 14,
          alignSelf: "flex-start",
        }}>
        <Text
          style={{
            color: statusColor,
            fontWeight: "700",
            fontSize: 12,
          }}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
