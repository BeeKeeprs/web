import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight } from "lucide-react";
import ProductGallery from "../../_components/ProductGallery";
import ProductCard from "../../_components/ProductCard";
import CtaBanner from "../../_components/CtaBanner";
import { products, type ProductSlug } from "../../_data/products";

export function generateStaticParams() { return Object.keys(products).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products[slug as ProductSlug];
  return product ? { title: `${product.name} | 아워비`, description: product.intro } : {};
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in products)) notFound();
  const product = products[slug as ProductSlug];
  const other: ProductSlug = slug === "gate" ? "smart-hive" : "gate";
  return <main className={`subpage detail-page detail-${slug}`}>
    <div className="breadcrumb section-wrap"><Link href="/products"><ArrowLeft size={15} /> 제품 전체</Link><ChevronRight size={14} /><span>{product.name}</span></div>
    <section className="detail-hero section-wrap">
      <ProductGallery photos={product.photos} />
      <div className="detail-info" data-reveal><span className="eyebrow">OURBEE PRODUCT / {product.number}</span><h1>{product.name}</h1><p className="detail-headline">{product.headline}</p><p className="detail-intro">{product.intro}</p><div className="detail-highlights">{product.highlights.map((highlight) => <span key={highlight}><Check size={16} />{highlight}</span>)}</div><div className="detail-buy"><div><span>가격</span><strong>문의하기</strong></div><p>농장 환경과 필요한 수량을 확인한 뒤 안내합니다.</p><Link className="button-orange" href={`/contact?product=${slug}`}>우리 농장 적용 문의 <ArrowUpRight size={19} /></Link></div><small>{slug === "gate" ? "제품 갤러리의 이미지는 브랜드 소개서에 수록된 렌더입니다." : "제품 갤러리에는 제품 본체·현장 설치·앱 화면이 포함됩니다."}</small></div>
    </section>

    {slug !== "smart-hive" && <section className="detail-story section-wrap"><div className="section-lead" data-reveal><span className="eyebrow">MADE FOR THE FARM</span><h2>{slug === "smart-hive" ? <>설정은 내가,<br /><em>기록은 차곡차곡.</em></> : <>열고 닫는 일도,<br /><em>농가의 흐름에 맞게.</em></>}</h2><p>{slug === "smart-hive" ? "하루하루 다른 온실 환경을 하나의 고정된 숫자로 다룰 수는 없습니다. 필요한 목표 온도를 농가가 정하고 벌통의 변화를 살펴봅니다." : "농약 살포나 온실 작업이 있는 날, 출입구 관리도 농사 흐름의 한 부분입니다. 스마트개폐기로 출입구를 앱과 연결합니다."}</p><Link className="round-link" href="/app">앱과 데이터 연결 보기 <ArrowUpRight size={18} /></Link></div><div className="detail-story-visual" data-reveal><Image src={slug === "smart-hive" ? "/images/product/app-control.png" : "/images/product/gate-render.png"} alt={slug === "smart-hive" ? "목표 온도 설정 앱 화면" : "스마트개폐기 제품 렌더"} fill sizes="(max-width: 760px) 100vw, 50vw" /></div></section>}

    {slug !== "smart-hive" && <section className="detail-specs"><div className="section-wrap specs-layout"><div data-reveal><span className="eyebrow">PRODUCT DETAILS</span><h2>도입 전에 알아둘 것.</h2><p>농장마다 벌통과 설치 환경이 달라 상담을 통해 맞는 구성을 안내합니다.</p></div><dl data-reveal>{product.details.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl></div></section>}

    {slug === "smart-hive" && <section className="detail-seasonal section-wrap" data-reveal><div className="detail-seasonal-heading"><span className="eyebrow">EXPECTED VALUE</span><h2>벌은 덜 사고,<br /><em>농가 수익을 높이는지 확인합니다.</em></h2><p>겨울철 딸기 실증에 함께할 농가를 모집합니다. 벌 사용 기간과 활동량, 구매비·상품 수확·판매 변화를 함께 기록합니다.</p><Link className="detail-seasonal-cta" href="/pilot#apply">실증농가 모집 내용 보기 <ArrowUpRight size={18} /></Link></div><div className="detail-seasonal-grid"><article className="detail-season-card detail-season-winter"><span className="detail-season-label">01 / WINTER · 겨울</span><h3>벌을 더 오래,<br />더 활발하게.</h3><div className="detail-season-stat"><strong>+68일</strong><span>기존 대비 사용 기간 연장 목표</span></div><div className="detail-season-stat"><strong>+20%</strong><span>기존 대비 활동량 증가 목표</span></div><p>벌 교체가 줄어 구매비가 달라지는지, 상품과 수확에도 도움이 되는지 확인합니다.</p></article><article className="detail-season-card detail-season-summer"><span className="detail-season-label">02 / SUMMER · 여름</span><h3>짧은 사용 기간을 늘려<br />벌 구매비 변화를 확인합니다.</h3><div className="detail-season-stat"><strong>2주 → 45일</strong><span>IR에서 제시한 벌 사용 기간 목표</span></div><div className="detail-season-stat"><strong>65만 → 약 10만 원</strong><span>150평·3개월 벌 구매비 가정 예시</span></div><p>벌 한 상자 6만 5천 원, 교체 횟수 10회 → 약 1.5회를 가정한 계산입니다. 실제 교체 횟수와 비용은 현장에서 확인합니다.</p></article></div><div className="detail-seasonal-summary"><strong>겨울과 여름, 확인할 변화는 같습니다.</strong><span>벌 구매비는 낮추고, 상품 수확 매출은 높일 수 있는지 실증합니다.</span></div><small>아래 수치는 실증 전 목표와 IR 계산을 바탕으로 한 예상치예요. 실제 수익은 농가 환경과 제품·설치·운영 비용을 함께 반영해 확인합니다.</small></section>}

    <section className="related-products section-wrap"><div className="shop-heading"><div><span className="eyebrow">EXPLORE MORE</span><h2>함께 살펴볼 제품.</h2></div><Link className="button-text" href="/products">제품 전체 보기 <ArrowUpRight size={17} /></Link></div><div className="related-card"><ProductCard slug={other} /></div></section>
    <CtaBanner eyebrow="TALK TO OURBEE" title={<>우리 농장에 맞는 구성,<br />함께 찾아봐요.</>} description="재배 작물과 현재 사용 중인 벌통을 알려주세요." href={`/contact?product=${slug}`} label="가격·설치 문의하기" />
  </main>;
}
