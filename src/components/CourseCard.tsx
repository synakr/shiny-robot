import { Text, View } from "react-native";

type Props = {
  title: string;
  subjects: string;
  progress: number;
  color: string;
  imageBg: string;
};

export default function CourseCard({
  title,
  subjects,
  progress,
  color,
  imageBg,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 14,
        marginBottom: 16,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
      }}>
      {/* Thumbnail */}
      <View
        style={{
          width: 100,
          height: 140,
          borderRadius: 22,
          backgroundColor: imageBg,
          marginRight: 14,
        }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#111827",
              lineHeight: 24,
            }}>
            {title}
          </Text>

          <Text
            style={{
              marginTop: 12,
              fontSize: 14,
              lineHeight: 24,
              color: "#667085",
            }}>
            {subjects}
          </Text>
        </View>

        {/* Progress */}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 15,
                color: "#374151",
                fontWeight: "600",
              }}>
              Progress
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: "#111827",
                fontWeight: "800",
              }}>
              {progress}%
            </Text>
          </View>

          <View
            style={{
              height: 8,
              borderRadius: 20,
              backgroundColor: "#ECECF2",
              overflow: "hidden",
            }}>
            <View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: color,
                borderRadius: 20,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
