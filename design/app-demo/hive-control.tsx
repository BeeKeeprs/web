import { DemoSummaryBanner } from "@/features/hive-home/components/DemoSummaryBanner";
/**
 * 스마트벌통 제어 화면
 * - 위: 벌통 카드 줄과 좌우로 넘기는 상태 패널(벌통 홈과 같은 구성)
 * - 조작: 목표 온도 리모컨과 바로가기(실시간 확인·설정·Wi-Fi)
 * - 벌 교체: 교체 기록 등록·수정·삭제
 * - 리포트: 오늘 내부 온도 요약(누르면 리포트 탭)
 * 전송한 목표 온도는 해당 벌통의 제어 설정을 다시 조회해 확인합니다.
 */
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHideFooterOnScroll } from "@/stores/useFooterVisibility";
import { PretendardFont } from "@/components/PretendardFont";
import { HiveAddSheet } from "@/components/HiveAddSheet";
import { HiveTabBar } from "@/components/hive/HiveTabBar";
import { useAppToast } from "@/components/ToastContext";
import { DeviceWifiSetupSheet } from "@/features/device-wifi-setup";
import { createHiveWifiAdapter } from "@/features/hive-wifi";
import { useOrderedHives, useSyncHiveList } from "@/features/hive";
import { HiveReplacementCard } from "@/features/hive-status";
import {
  HiveCardRail,
  QuickActions,
  HiveStatusPager,
  Panel,
  RemotePanel,
  ReportPanel,
  SectionHeader,
  T,
  useTargetTemperature,
} from "@/features/hive-home";
import type { HiveData } from "@/types/hive-control";

export default function HiveControlScreen() {
  const insets = useSafeAreaInsets();
  // 아래로 스크롤하면 하단 탭바를 숨기고, 위로 당기면 다시 보여줍니다.
  const footerScroll = useHideFooterOnScroll();
  const hiveList = useSyncHiveList();
  const hives = useOrderedHives();
  const [addVisible, setAddVisible] = useState(false);

  // 다른 화면에서 특정 벌통을 눌러 들어오면 그 벌통을 먼저 보여줍니다.
  const { selectedHiveId } = useLocalSearchParams<{ selectedHiveId?: string }>();
  const [selectedId, setSelectedId] = useState(selectedHiveId ?? "");
  useEffect(() => {
    if (selectedHiveId && hives.some((hive) => hive.id === selectedHiveId)) setSelectedId(selectedHiveId);
  }, [selectedHiveId, hives]);

  const hive = hives.find((item) => item.id === selectedId) ?? hives[0];

  return (
    <View style={{ flex: 1, backgroundColor: T.canvas }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={footerScroll.onScroll}
        scrollEventThrottle={footerScroll.scrollEventThrottle}
        refreshControl={<RefreshControl refreshing={hiveList.isRefetching} onRefresh={() => void hiveList.refetch()} />}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: insets.bottom + 120 }}
      >
        <View style={{ paddingBottom: 14 }}>
          <HiveCardRail hives={hives} selectedId={hive?.id ?? ""} onSelect={setSelectedId} onAdd={() => {}} />
        </View>

        {hive ? (
          <>
            <DemoSummaryBanner />
            <HiveStatusPager hives={hives} selectedId={hive.id} onSelect={setSelectedId} />
            <View style={{ paddingHorizontal: 16 }}>
              <ControlBody key={hive.id} hive={hive} />
            </View>
          </>
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            <Panel style={{ alignItems: "center", paddingVertical: 36 }}>
              <PretendardFont weight="bold" style={{ fontSize: 17, color: T.ink }}>
                {hiveList.isLoading ? "벌통을 불러오고 있어요" : "등록된 벌통이 없어요"}
              </PretendardFont>
              <PretendardFont style={{ marginTop: 6, fontSize: 14, color: T.inkSoft }}>위 벌통 추가 카드로 등록해 주세요</PretendardFont>
            </Panel>
          </View>
        )}
      </ScrollView>

      <HiveAddSheet visible={addVisible} onClose={() => setAddVisible(false)} />
    </View>
  );
}

/** 선택한 벌통의 조작과 벌 교체. 벌통이 바뀌면 key로 새로 그려 조작 초안을 비웁니다. */
function ControlBody({ hive }: { hive: HiveData }) {
  const control = useTargetTemperature(hive.id);
  const { show: showToast } = useAppToast();
  const [wifiVisible, setWifiVisible] = useState(false);
  const online = hive.status === "online";
  return (
    <View style={{ gap: 12 }}>
      <View style={{ marginTop: 16 }}>
        <SectionHeader title="리포트" />
      </View>
      <View>
      <View pointerEvents="none">
      <ReportPanel hiveId={hive.id} onOpen={() => {}} />
      </View>
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
      </View>
      <View style={{ marginTop: 16 }}>
        <SectionHeader title="조작" />
      </View>
      <RemotePanel hiveName={hive.name} control={control} />
      <View>
      <View pointerEvents="none">
      <QuickActions
        actions={[
          {
            id: "live",
            label: "실시간 확인",
            caption: online ? `수신 중 · ${hive.lastUpdate}` : "기록 보기",
            icon: "activity",
            active: online,
            emphasis: true,
            onPress: () => router.push({ pathname: "/hive-live", params: { selectedHiveId: hive.id } }),
          },
          { id: "setting", label: "설정", caption: "날씨 지역 등", icon: "settings", onPress: () => router.replace("/hive-setting") },
          { id: "wifi", label: "Wi-Fi", caption: online ? "연결됨" : "연결 바꾸기", icon: "wifi", onPress: () => setWifiVisible(true) },
        ]}
      />
      </View>
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
      </View>
      <DeviceWifiSetupSheet
        visible={wifiVisible}
        onClose={() => setWifiVisible(false)}
        mode="change"
        initialDeviceId={hive.macAddress}
        adapter={createHiveWifiAdapter("change", hive.macAddress)}
        onProvisioned={() => showToast("벌통 Wi-Fi를 바꿨어요.", "success")}
      />

      <View style={{ marginTop: 16 }}>
        <SectionHeader title="벌 교체" />
      </View>
      <HiveReplacementCard hive={hive} />


    </View>
  );
}
