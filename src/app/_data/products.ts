export const products = {
  "smart-hive": {
    slug: "smart-hive",
    number: "01",
    name: "아워비 스마트벌통",
    english: "SMART HIVE",
    headline: "벌통의 목표 온도, 농가가 직접 정하다.",
    intro: "농가가 앱에서 목표 온도를 정하면 벌통의 냉각 장치가 그 설정에 맞춰 작동합니다. 내외부 온습도와 시간별 변화는 앱에서 살펴봅니다.",
    image: "/images/product/hive-studio.png",
    imageAlt: "아워비 스마트벌통 제품 이미지",
    photos: [
      { src: "/images/product/hive-studio.png", alt: "아워비 스마트벌통 제품 이미지", label: "제품 이미지" },
      { src: "/images/product/controller.png", alt: "아워비 스마트벌통 제어 본체", label: "제품 본체" },
      { src: "/images/product/installed-front.png", alt: "온실에 설치된 스마트벌통", label: "현장 설치" },
      { src: "/images/product/installed-side.png", alt: "온실에 설치된 스마트벌통의 측면", label: "설치 모습" },
      { src: "/images/product/app-control.png", alt: "목표 온도 설정 앱 화면", label: "앱 화면" },
    ],
    highlights: ["목표 온도 직접 설정", "자동 정온 제어", "앱에서 온습도 기록"],
    details: [
      ["관리 방식", "농가가 앱에서 목표 온도를 설정하면 벌통이 냉각 장치를 자동으로 제어합니다."],
      ["확인할 수 있는 것", "벌통 안팎의 온도·습도와 시간별 기록을 앱에서 확인합니다."],
      ["설치 전 확인", "벌통 형태, 설치 위치, 전원과 네트워크 환경을 확인합니다."],
    ],
  },
  gate: {
    slug: "gate",
    number: "02",
    name: "아워비 스마트개폐기",
    english: "SMART GATE",
    headline: "벌통 출입구도, 손안에서 관리하다.",
    intro: "출입구를 즉시 열고 닫거나 시간을 예약하는 일을 앱과 연결합니다. 개폐기에서 받은 출입량과 온습도 기록은 활동 리포트로 살펴볼 수 있습니다.",
    image: "/images/product/gate-studio.png",
    imageAlt: "아워비 스마트개폐기 제품 이미지",
    photos: [
      { src: "/images/product/gate-studio.png", alt: "아워비 스마트개폐기 제품 이미지", label: "제품 이미지" },
      { src: "/images/product/gate-render.png", alt: "아워비 스마트개폐기 제품 렌더", label: "제품 렌더" },
    ],
    highlights: ["즉시·시간 예약 개폐", "온라인·NFC 카드", "출입량 기반 활동 기록"],
    details: [
      ["관리 방식", "앱의 개폐 카드로 즉시 또는 예약 시간에 출입구를 관리합니다. 온라인·NFC 모드에 따라 적용 방식이 다릅니다."],
      ["앱과 데이터", "개폐기에서 받은 출입량·온습도 기록을 앱의 활동 리포트에서 살펴볼 수 있습니다."],
      ["설치 전 확인", "사용 중인 벌통 출입구의 구조와 크기를 확인합니다."],
      ["농약 살포 시", "개폐기 사용이 벌통 이동이나 농약 안전 조치를 대신하지는 않습니다. 살포 계획에 맞는 관리 방법을 상담해 주세요."],
    ],
  },
} as const;

export type ProductSlug = keyof typeof products;
