import type { Metadata } from "next";
import "./globals.css";
const title = "webee | 온도를 지키는 본체, 손안의 스마트벌통 관리";
const description =
  "벌통 안의 온도와 습도, 출입구 관리까지. webee 스마트 벌통과 개폐기로 수정벌 관리에 필요한 정보를 연결합니다.";
export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://webeelab.com"),
  openGraph: {
    title,
    description,
    siteName: "webee",
    locale: "ko_KR",
    type: "website",
    images: ["/images/product/controller.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/product/controller.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          href="/font/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
