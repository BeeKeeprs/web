import Image from "next/image";

export default function ProductMotion() {
  return (
    <div className="hero-story-product">
      <Image src="/images/product/hive-gate-pair-v4.webp" alt="아워비 스마트벌통과 스마트개폐기" fill priority sizes="(max-width: 760px) 92vw, 55vw" />
    </div>
  );
}
