import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { PretendardFont } from "@/components/PretendardFont";
import { Tap } from "@/components/Tap";
import { useHiveTelemetryData } from "@/features/hive-status";
import type { DataPoint } from "@/types";
import { COMFORT_MAX, COMFORT_MIN, R, T } from "../theme";

const CHART_H = 84;
const EXTERNAL_COLOR = "#E08A2E";
const EMPTY: DataPoint[] = [];

/**
 * 오늘 리포트 요약
 * - 시간별 내부 온도 흐름과 권장 구간을 지킨 시간을 보여줍니다.
 * - 누르면 기간별 차트·표가 있는 리포트 화면으로 이동합니다.
 */
export function ReportPanel({ hiveId, onOpen }: { hiveId: string; onOpen: () => void }) {
  const query = useHiveTelemetryData({ hiveId, period: "일간", fallbackData: EMPTY });
  const [width, setWidth] = useState(0);

  const points = (query.data ?? [])
    .map((point, index) => ({ index, value: point.internalTemperature }))
    .filter((point): point is { index: number; value: number } => point.value != null && Number.isFinite(point.value));
  const outside = (query.data ?? [])
    .map((point, index) => ({ index, value: point.externalTemperature }))
    .filter((point): point is { index: number; value: number } => point.value != null && Number.isFinite(point.value));
  const outValues = outside.map((point) => point.value);
  const outMin = outValues.length ? Math.min(...outValues) : null;
  const outMax = outValues.length ? Math.max(...outValues) : null;
  const outAvg = outValues.length ? outValues.reduce((sum, value) => sum + value, 0) / outValues.length : null;
  const total = query.data?.length ?? 0;
  const values = points.map((point) => point.value);
  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const comfortHours = values.filter((value) => value >= COMFORT_MIN && value <= COMFORT_MAX).length;

  const lo = Math.floor(Math.min(min ?? COMFORT_MIN, outMin ?? COMFORT_MIN, COMFORT_MIN) - 1);
  const hi = Math.ceil(Math.max(max ?? COMFORT_MAX, outMax ?? COMFORT_MAX, COMFORT_MAX) + 1);
  const x = (index: number) => (total <= 1 ? width / 2 : (index / (total - 1)) * width);
  const y = (value: number) => CHART_H - ((value - lo) / (hi - lo)) * CHART_H;
  const line = points.map((point, i) => `${i ? "L" : "M"} ${x(point.index)} ${y(point.value)}`).join(" ");
  const outLine = outside.map((point, i) => `${i ? "L" : "M"} ${x(point.index)} ${y(point.value)}`).join(" ");
  const gridLevels = [lo + 1, (lo + hi) / 2, hi - 1].map((value) => Math.round(value));

  return (
    <Tap
      accessibilityRole="button"
      accessibilityLabel="리포트 자세히 보기"
      onPress={onOpen}
      style={({ pressed }) => ({ backgroundColor: pressed ? "#FAFBFC" : T.panel, borderRadius: R.panel, padding: 16 })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <PretendardFont weight="bold" style={{ fontSize: 16, color: T.ink }}>오늘의 벌통 리포트</PretendardFont>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <PretendardFont weight="medium" style={{ fontSize: 13, color: T.inkSoft }}>자세히</PretendardFont>
          <Feather name="chevron-right" size={16} color={T.inkSoft} />
        </View>
      </View>

      {query.isLoading && query.isFetching ? (
        <View style={{ height: CHART_H + 60, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={T.inkSoft} />
        </View>
      ) : !values.length ? (
        <View style={{ height: CHART_H + 60, alignItems: "center", justifyContent: "center" }}>
          <PretendardFont style={{ fontSize: 13.5, color: T.muted }}>
            {query.isError ? "기록을 불러오지 못했어요" : "오늘 쌓인 기록이 아직 없어요"}
          </PretendardFont>
        </View>
      ) : (
        <>


          <View style={{ flexDirection: "row", gap: 14, marginTop: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: T.ink }} />
              <PretendardFont weight="semibold" style={{ fontSize: 12.5, color: T.inkSoft }}>내부</PretendardFont>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: EXTERNAL_COLOR }} />
              <PretendardFont weight="semibold" style={{ fontSize: 12.5, color: T.inkSoft }}>외부</PretendardFont>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 14, height: 10, borderRadius: 2, backgroundColor: T.goodSoft }} />
              <PretendardFont weight="semibold" style={{ fontSize: 12.5, color: T.inkSoft }}>권장 24~27°</PretendardFont>
            </View>
          </View>

          <View
            accessible
            accessibilityLabel={`최저 ${min!.toFixed(1)}도, 최고 ${max!.toFixed(1)}도`}
            onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
            style={{ height: CHART_H, marginTop: 10 }}
          >
            {width > 0 ? (
              <Svg width={width} height={CHART_H}>
                {gridLevels.map((level) => (
                  <Line key={level} x1={0} x2={width} y1={y(level)} y2={y(level)} stroke={T.line} strokeWidth={1} />
                ))}
                <Rect x={0} y={y(COMFORT_MAX)} width={width} height={y(COMFORT_MIN) - y(COMFORT_MAX)} fill={T.goodSoft} />
                {gridLevels.map((level) => (
                  <SvgText key={"t" + level} x={2} y={y(level) - 3} fontSize={10.5} fill={T.muted}>{level}°</SvgText>
                ))}
                <Path d={outLine} stroke={EXTERNAL_COLOR} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" fill="none" />
                <Path d={line} stroke={T.ink} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" fill="none" />
                {/* 기록이 한 점뿐이면 선이 그려지지 않으므로 점으로 보여줍니다. */}
                {points.length === 1 ? (
                  <Circle cx={x(points[0].index)} cy={y(points[0].value)} r={4} fill={T.ink} />
                ) : null}
              </Svg>
            ) : null}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
            <PretendardFont style={{ fontSize: 11.5, color: T.muted }}>{query.data?.[0]?.label}</PretendardFont>
            <PretendardFont style={{ fontSize: 11.5, color: T.muted }}>{total > 1 ? query.data?.[total - 1]?.label : ""}</PretendardFont>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: T.line }}>
            {[
              ["내부 평균", avg, T.ink],
              ["외부 최저", outMin, EXTERNAL_COLOR],
              ["외부 최고", outMax, EXTERNAL_COLOR],
            ].map(([label, value, color], index) => (
              <View key={label as string} style={{ flex: 1, alignItems: "center", borderLeftWidth: index ? 1 : 0, borderLeftColor: T.line }}>
                <PretendardFont style={{ fontSize: 11.5, color: T.muted }}>{label as string}</PretendardFont>
                <PretendardFont weight="semibold" style={{ marginTop: 2, fontSize: 15, color: color as string, fontVariant: ["tabular-nums"] }}>
                  {value == null ? "-" : (value as number).toFixed(1) + "°"}
                </PretendardFont>
              </View>
            ))}
          </View>
        </>
      )}
    </Tap>
  );
}
