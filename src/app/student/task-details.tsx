import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    ArrowLeft,
    CalendarDays,
    CircleAlert,
    Download,
    FileText,
} from "lucide-react-native";

import { router, useLocalSearchParams } from "expo-router";

export default function TaskDetailsScreen() {
  const params = useLocalSearchParams();

  const title = (params.title as string) || "Task";

  const description =
    (params.description as string) || "No description available.";

  const dueDate = (params.dueDate as string) || "No Deadline";

  const marks = (params.marks as string) || "N/A";

  const batch = (params.batch as string) || "Batch";

  const attachment = (params.attachment as string) || "";

  const status = (params.status as string) || "active";

  function formatDate(dateString: string) {
    if (!dateString || dateString === "No Deadline") {
      return "No Deadline";
    }

    return new Date(dateString).toLocaleString();
  }

  async function openAttachment() {
    if (!attachment) return;

    await Linking.openURL(attachment);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}>
        {/* HEADER */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={26} color="#111827" />
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 14,
                fontSize: 28,
                fontWeight: "800",
                color: "#111827",
              }}>
              Task Details
            </Text>
          </View>
        </View>

        {/* TASK CARD */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            backgroundColor: "#FFF",
            borderRadius: 28,
            padding: 20,
          }}>
          {/* TOP */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "800",
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
                {batch}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: status === "completed" ? "#DCFCE7" : "#FEF3C7",

                paddingHorizontal: 14,

                paddingVertical: 7,

                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: status === "completed" ? "#10B981" : "#D97706",
                }}>
                {status === "completed" ? "Completed" : "Pending"}
              </Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <View
            style={{
              marginTop: 26,
            }}>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 26,
                color: "#4B5563",
              }}>
              {description}
            </Text>
          </View>

          {/* INFO BOXES */}
          <View
            style={{
              marginTop: 26,
              gap: 14,
            }}>
            <InfoCard
              icon={CalendarDays}
              title="Due Date"
              value={formatDate(dueDate)}
              color="#2563EB"
              bg="#DBEAFE"
            />

            <InfoCard
              icon={FileText}
              title="Marks"
              value={`${marks}`}
              color="#7C3AED"
              bg="#F3E8FF"
            />

            <InfoCard
              icon={CircleAlert}
              title="Status"
              value={status === "completed" ? "Completed" : "Pending"}
              color="#F59E0B"
              bg="#FEF3C7"
            />
          </View>

          {/* ATTACHMENT */}
          {attachment ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={openAttachment}
              style={{
                marginTop: 28,
                height: 56,
                borderRadius: 18,
                backgroundColor: "#6C63FF",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Download size={18} color="#FFF" />

              <Text
                style={{
                  marginLeft: 10,
                  color: "#FFF",
                  fontSize: 15,
                  fontWeight: "700",
                }}>
                Open Attachment
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  color,
  bg,
}: {
  icon: any;

  title: string;

  value: string;

  color: string;

  bg: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 18,
        padding: 14,
      }}>
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 14,
        }}>
        <Icon size={20} color={color} />
      </View>

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
    </View>
  );
}
