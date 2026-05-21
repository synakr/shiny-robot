import { Tabs } from "expo-router";

import {
  BookOpen,
  CheckSquare,
  FileText,
  Home,
  User,
} from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 18,
          height: 78,
          borderRadius: 26,
          backgroundColor: "#FFF",

          paddingTop: 8,
          paddingBottom: 8,

          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 5,

          borderTopWidth: 0,
        },

        tabBarItemStyle: {
          paddingTop: 4,
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
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={21} color={color} />,
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => <FileText size={21} color={color} />,
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => <CheckSquare size={21} color={color} />,
        }}
      />

      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color }) => <BookOpen size={21} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={21} color={color} />,
        }}
      />
    </Tabs>
  );
}
