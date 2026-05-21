import { Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Briefcase, GraduationCap, UserPlus } from "lucide-react-native";

export default function RoleSelectScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8F8F8",
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: "center",
        }}>
        {/* LOGO / TITLE */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 56,
          }}>
          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 30,
              backgroundColor: "#EEE8FF",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 22,
            }}>
            <GraduationCap size={42} color="#6C63FF" />
          </View>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#111827",
            }}>
            Teacher App
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              textAlign: "center",
              color: "#667085",
              lineHeight: 24,
            }}>
            Learning made simple for teachers and students.
          </Text>
        </View>

        {/* BUTTONS */}
        <RoleButton
          onPress={() => router.push("/auth/student-login")}
          icon={GraduationCap}
          title="Continue as Student"
          subtitle="Access notes, tasks & courses"
          color="#6C63FF"
          bg="#EEE8FF"
        />

        <RoleButton
          onPress={() => router.push("/auth/teacher-login")}
          icon={Briefcase}
          title="Continue as Teacher"
          subtitle="Manage students & batches"
          color="#10B981"
          bg="#DCFCE7"
        />

        <RoleButton
          onPress={() => router.push("/auth/admission")}
          icon={UserPlus}
          title="Apply for Admission"
          subtitle="Join a batch and start learning"
          color="#F59E0B"
          bg="#FEF3C7"
        />

        {/* FOOTER */}
        <Text
          style={{
            marginTop: 30,
            textAlign: "center",
            fontSize: 13,
            color: "#98A2B3",
          }}>
          Powered by Your Institute
        </Text>
      </View>
    </SafeAreaView>
  );
}

function RoleButton({
  onPress,
  icon: Icon,
  title,
  subtitle,
  color,
  bg,
}: {
  onPress?: () => void;
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: "#FFF",
          borderRadius: 24,
          padding: 18,
          marginBottom: 16,

          flexDirection: "row",
          alignItems: "center",

          shadowColor: "#000",
          shadowOpacity: 0.03,
          shadowRadius: 6,
          elevation: 2,

          transform: [
            {
              scale: pressed ? 0.98 : 1,
            },
          ],

          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}>
        <Icon size={24} color={color} />
      </View>

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
            marginTop: 4,
            fontSize: 13,
            color: "#667085",
            lineHeight: 20,
          }}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
