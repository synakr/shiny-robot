
import { IndianRupee, MessageCircle, Phone } from "lucide-react-native";

import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  name: string;

  className: string;

  attendance: string;

  payment: string;

  paid?: boolean;

  batchName?: string;

  phone?: string;

  parentPhone?: string;

  onPress?: () => void;
};

export default function StudentCard({
  name,
  className,
  attendance,
  payment,
  paid,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
        {/* Avatar */}
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            backgroundColor: "#EEE8FF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#6C63FF",
            }}>
            {name.charAt(0)}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#111827",
            }}>
            {name}
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#667085",
            }}>
            {className}
          </Text>
        </View>

        {/* Payment Badge */}
        <View
          style={{
            backgroundColor: paid ? "#DCFCE7" : "#FEF3C7",

            paddingHorizontal: 12,

            paddingVertical: 6,

            borderRadius: 12,
          }}>
          <Text
            style={{
              color: paid ? "#10B981" : "#D97706",

              fontSize: 12,

              fontWeight: "700",
            }}>
            {payment}
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
        }}>
        <InfoBox title="Attendance" value={attendance} />

        <InfoBox title="Tasks" value="12/15" />

        <InfoBox title="Performance" value="85%" />
      </View>

      {/* ACTIONS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 14,
          gap: 10,
        }}>
        <ActionButton icon={Phone} label="Call" />

        <ActionButton icon={MessageCircle} label="Message" />

        <ActionButton icon={IndianRupee} label="Payment" />
      </View>
    </TouchableOpacity>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;

  value: string;
}) {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Text
        style={{
          fontSize: 12,
          color: "#98A2B3",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 15,
          fontWeight: "700",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}

function ActionButton({
  icon: Icon,
  label,
}: {
  icon: any;

  label: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flex: 1,
        height: 36,
        borderRadius: 14,
        backgroundColor: "#F3F4F6",

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",
      }}>
      <Icon size={16} color="#4B5563" />

      <Text
        style={{
          marginLeft: 6,
          fontSize: 12,
          fontWeight: "600",
          color: "#4B5563",
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
