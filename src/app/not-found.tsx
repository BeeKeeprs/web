import Link from "next/link";
export default function NotFound() {
  return (
    <main className="section-pad">
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p style={{ margin: "24px 0" }}>
        벌통 조회와 기기 관리는 휴대폰 앱에서 이용해 주세요.
      </p>
      <Link className="button" href="/">
        제품 소개로 돌아가기
      </Link>
    </main>
  );
}
