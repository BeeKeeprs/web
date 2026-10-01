import Link from "next/link";
export default function NotFound() {
  return (
    <main className="section-wrap" style={{ paddingTop: 140, paddingBottom: 180 }}>
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1 style={{ marginTop: 20, fontSize: "clamp(44px,6vw,76px)", letterSpacing: "-.06em" }}>길을 잠깐 잃으셨나요?</h1>
      <p style={{ margin: "24px 0 32px", color: "#706d68" }}>찾으시는 페이지가 없습니다. 아워비의 제품부터 다시 살펴보세요.</p>
      <Link className="button-orange" href="/products">제품 보러 가기</Link>
    </main>
  );
}
