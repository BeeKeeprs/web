import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { siteUrl } from "./site";

const googleAnalyticsId = "G-QLKGH4HHRP";
const googleTagManagerId = "GTM-PH5ZNKVV";

const title = "ourbee 아워비 | 온도를 지키는 본체, 손안의 스마트벌통 관리";
const description =
  "벌통 안의 온도와 습도, 출입구 관리까지. ourbee 스마트 벌통과 개폐기로 수정벌 관리에 필요한 정보를 연결합니다.";
export const metadata: Metadata = {
  title,
  description,
  metadataBase: siteUrl,
  openGraph: {
    title,
    description,
    siteName: "ourbee",
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
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleTagManagerId}');`}
      </Script>
      <head>
        <link
          rel="preload"
          href="/font/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`}
        </Script>
      </body>
    </html>
  );
}
