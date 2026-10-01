import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "../_components/ProductCard";

export const metadata: Metadata = { title: "제품 | 아워비", description: "아워비 스마트벌통과 스마트개폐기를 살펴보세요." };

export default function ProductsPage() {
  return <main className="subpage">
    <section className="catalog-intro section-wrap" data-reveal><span className="eyebrow">THE OURBEE COLLECTION</span><h1>농가의 하루를 생각한<br /><em>두 가지 제품.</em></h1><p>온도와 출입구. 수정벌 관리에 필요한 순간부터 하나씩 바꿉니다.</p></section>
    <section className="section-wrap catalog-grid"><ProductCard slug="smart-hive" /><ProductCard slug="gate" index={1} /></section>
    <section className="catalog-help section-wrap" data-reveal><div><span className="eyebrow">NOT SURE WHAT FITS?</span><h2>우리 농장에는 어떤 구성이 맞을까요?</h2><p>작물, 벌통 형태, 전원과 네트워크 환경을 알려주시면 함께 살펴봅니다.</p></div><Link className="button-orange" href="/contact">제품 구성 문의 <ArrowUpRight size={18} /></Link></section>
  </main>;
}
