import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight } from "lucide-react";
import ProductGallery from "../../_components/ProductGallery";
import ProductCard from "../../_components/ProductCard";
import FarmEstimate from "../../_components/FarmEstimate";
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

    <section className="detail-story section-wrap"><div className="section-lead" data-reveal><span className="eyebrow">MADE FOR THE FARM</span><h2>{slug === "smart-hive" ? <>설정은 내가,<br /><em>기록은 차곡차곡.</em></> : <>열고 닫는 일도,<br /><em>농가의 흐름에 맞게.</em></>}</h2><p>{slug === "smart-hive" ? "하루하루 다른 온실 환경을 하나의 고정된 숫자로 다룰 수는 없습니다. 필요한 목표 온도를 농가가 정하고 벌통의 변화를 살펴봅니다." : "농약 살포나 온실 작업이 있는 날, 출입구 관리도 농사 흐름의 한 부분입니다. 스마트개폐기로 출입구를 앱과 연결합니다."}</p><Link className="round-link" href="/app">앱과 데이터 연결 보기 <ArrowUpRight size={18} /></Link></div><div className="detail-story-visual" data-reveal><Image src={slug === "smart-hive" ? "/images/product/app-control.png" : "/images/product/gate-render.png"} alt={slug === "smart-hive" ? "목표 온도 설정 앱 화면" : "스마트개폐기 제품 렌더"} fill sizes="(max-width: 760px) 100vw, 50vw" /></div></section>

    <section className="detail-specs"><div className="section-wrap specs-layout"><div data-reveal><span className="eyebrow">PRODUCT DETAILS</span><h2>도입 전에 알아둘 것.</h2><p>농장마다 벌통과 설치 환경이 달라 상담을 통해 맞는 구성을 안내합니다.</p></div><dl data-reveal>{product.details.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl></div></section>

    {slug === "smart-hive" && <section className="detail-expect section-wrap" data-reveal><span className="eyebrow">EXPECTED VALUE</span><h2>기대효과는 농가의 숫자로 생각합니다.</h2><p>사용기간이 늘거나 재구입 횟수가 줄면 벌 구입비 부담이 달라질 수 있습니다. 상품과 수확량이 늘면 추가 매출도 생길 수 있습니다. 아래 계산은 입력한 수량을 바탕으로 한 가정이며, 실제 결과는 농장·계절·작물 조건에 따라 달라집니다.</p><FarmEstimate /><small>실제 순이익은 제품 구입비, 설치비, 전기료, 유지 비용과 판매 비용까지 반영해 계산해야 합니다.</small></section>}

    <section className="related-products section-wrap"><div className="shop-heading"><div><span className="eyebrow">EXPLORE MORE</span><h2>함께 살펴볼 제품.</h2></div><Link className="button-text" href="/products">제품 전체 보기 <ArrowUpRight size={17} /></Link></div><div className="related-card"><ProductCard slug={other} /></div></section>
    <section className="last-cta section-wrap"><div data-reveal><span className="eyebrow eyebrow-light">TALK TO OURBEE</span><h2>우리 농장에 맞는 구성,<br />함께 찾아봐요.</h2><p>재배 작물과 현재 사용 중인 벌통을 알려주세요.</p><Link className="button-orange" href={`/contact?product=${slug}`}>가격·설치 문의하기 <ArrowUpRight size={18} /></Link></div><span className="cta-glow" aria-hidden="true">✳</span></section>
  </main>;
}
