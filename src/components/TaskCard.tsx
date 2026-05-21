import { FileText } from "lucide-react-native";
import { Text, View } from "react-native";

type Props = {
  title: string;
  questions: string;
  due: string;
  status: string;
  statusColor: string;
  statusBg: string;
  completed?: boolean;
};

export default function TaskCard({
  title,
  questions,
  due,
  status,
  statusColor,
  statusBg,
  completed,
}: Props) {
  return (
    <View
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
      {/* Icon */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 18,
          backgroundColor: completed ? "#DCFCE7" : "#EEE8FF",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 14,
        }}>
        <FileText size={24} color={completed ? "#10B981" : "#6C63FF"} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#111827",
          }}>
          {title}
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#667085",
          }}>
          {questions}
        </Text>

        <Text
          style={{
            marginTop: 10,
            fontSize: 14,
            color: "#667085",
          }}>
          {due}
        </Text>
      </View>

      {/* Status */}
      <View
        style={{
          backgroundColor: statusBg,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 14,
        }}>
        <Text
          style={{
            color: statusColor,
            fontWeight: "600",
            fontSize: 13,
          }}>
          {status}
        </Text>
      </View>
    </View>
  );
}
