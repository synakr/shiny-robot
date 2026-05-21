import { Tabs } from "expo-router";

import { BarChart3, Home, MoreHorizontal, Users } from "lucide-react-native";

export default function TeacherTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 18,

          height: 82,

          borderRadius: 26,
          backgroundColor: "#FFF",

          paddingTop: 8,
          paddingBottom: 14,

          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 5,
        },

        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#4B5563",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => <MoreHorizontal size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
