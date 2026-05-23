import { IndianRupee, MessageCircle, Phone, Trophy } from "lucide-react-native";

import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  name: string;

  className: string;

  batchName?: string;

  batchId?: string;

  attendance: string;

  tasksCompleted?: number;

  performanceScore?: number;

  rank?: number;

  payment: string;

  paid?: boolean;

  phone?: string;

  parentPhone?: string;

  onPress?: () => void;
};

export default function StudentCard({
  name,
  className,
  batchName,
  batchId,
  attendance,
  tasksCompleted,
  performanceScore,
  rank,
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
        borderRadius: 24,
        padding: 16,
        marginBottom: 14,
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
        {/* AVATAR */}
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: "#EEE8FF",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#6C63FF",
            }}>
            {name.charAt(0)}
          </Text>
        </View>

        {/* INFO */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
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
            Class {className} • {batchName}
          </Text>

          <Text
            style={{
              marginTop: 3,
              fontSize: 12,
              color: "#98A2B3",
            }}>
            {batchId}
          </Text>
        </View>

        {/* PAYMENT */}
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
          marginTop: 18,
        }}>
        <InfoBox title="Attendance" value={`${attendance}%`} />

        <InfoBox title="Tasks" value={`${tasksCompleted || 0}`} />

        <InfoBox title="Score" value={`${performanceScore || 0}`} />

        <RankBox rank={rank || 0} />
      </View>

      {/* ACTIONS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
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
          fontSize: 11,
          color: "#98A2B3",
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 15,
          fontWeight: "700",
          color: "#111827",
        }}>
        {value}
      </Text>
    </View>
  );
}

function RankBox({ rank }: { rank: number }) {
  return (
    <View
      style={{
        width: 58,
        alignItems: "center",
      }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          backgroundColor: "#FEF3C7",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Trophy size={16} color="#F59E0B" />
      </View>

      <Text
        style={{
          marginTop: 5,
          fontSize: 12,
          fontWeight: "800",
          color: "#111827",
        }}>
        #{rank}
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
        height: 38,
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
