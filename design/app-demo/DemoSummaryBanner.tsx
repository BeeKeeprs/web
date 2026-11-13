import { View } from "react-native";
import { PretendardFont } from "@/components/PretendardFont";

// Homepage demo only. These figures are examples, not live telemetry.
const summary = { maintained: "11시간 30분", recorded: "12시간", rate: "96", exits: "32", increase: "24%" };
const ink = "#1D2529";
const muted = "#69757A";

export function DemoSummaryBanner() {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 14, paddingHorizontal: 20, paddingVertical: 17, borderRadius: 22, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E9E7" }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <PretendardFont weight="bold" style={{ fontSize: 15, color: ink }}>오늘의 요약</PretendardFont>
        <PretendardFont style={{ fontSize: 11, color: muted }}>예시 데이터</PretendardFont>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 11 }}>
        <View style={{ flex: 1 }}>
          <PretendardFont weight="semibold" style={{ fontSize: 13, color: ink }}>권장 온도 유지</PretendardFont>
          <PretendardFont style={{ marginTop: 3, fontSize: 11, color: muted }}>{summary.recorded} 중 {summary.maintained}</PretendardFont>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <PretendardFont weight="bold" style={{ fontSize: 36, lineHeight: 41, letterSpacing: -1.4, color: ink }}>{summary.rate}</PretendardFont>
          <PretendardFont weight="bold" style={{ fontSize: 19, color: ink }}>%</PretendardFont>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, paddingTop: 11, borderTopWidth: 1, borderTopColor: "#EDF0EE" }}>
        <PretendardFont style={{ fontSize: 12, color: muted }}>벌 출입 <PretendardFont weight="bold" style={{ color: ink }}>{summary.exits}회</PretendardFont></PretendardFont>
        <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: "#A8B1AC", marginHorizontal: 9 }} />
        <PretendardFont style={{ fontSize: 12, color: muted }}>전날보다 <PretendardFont weight="bold" style={{ color: "#167A50" }}>↑ {summary.increase}</PretendardFont></PretendardFont>
      </View>
    </View>
  );
}
