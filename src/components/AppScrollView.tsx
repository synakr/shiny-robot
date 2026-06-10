import { ReactNode } from "react";

import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
} from "react-native";

import { useRefresh } from "@/context/RefreshContext";

type Props = ScrollViewProps & {
  children: ReactNode;
};

export default function AppScrollView({
  children,
  ...props
}: Props) {
  const { refreshing, triggerRefresh } = useRefresh();

  return (
    <ScrollView
      {...props}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={triggerRefresh}
          colors={["#6C63FF"]}
          tintColor="#6C63FF"
        />
      }>
      {children}
    </ScrollView>
  );
}