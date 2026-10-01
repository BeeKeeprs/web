import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { siteUrl } from "./site";
import ScrollMotion from "./_components/ScrollMotion";
import { SiteHeader, SiteFooter } from "./_components/SiteChrome";

const googleAnalyticsId = "G-QLKGH4HHRP";
const googleTagManagerId = "GTM-PH5ZNKVV";
const metaPixelId = "1528209969075771";
const facebookDomainVerification = "pmhi0s1yg2ao4i5a1dlmza59y1u1i9";

const title = "ourbee 아워비 | 벌통의 온도, 농가가 직접 정하다";
const description =
  "농가의 하루에서 시작한 스마트벌통과 스마트개폐기. 목표 온도 설정, 온습도 기록과 출입구 관리를 아워비에서 살펴보세요.";
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
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleTagManagerId}');`}
        </Script>
        <meta
          name="facebook-domain-verification"
          content={facebookDomainVerification}
        />
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" alt="" />`,
          }}
        />
        <a className="skip-link" href="#main-content">본문으로 바로가기</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <ScrollMotion />
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      </body>
    </html>
  );
}
