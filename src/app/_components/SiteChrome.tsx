import Link from "next/link";
import { Instagram, Leaf } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand-mark" href="/" aria-label="아워비 홈">ourbee<span>.</span></Link>
        <nav className="nav-links" aria-label="주 메뉴">
          <Link href="/products">제품</Link>
          <Link href="/about">브랜드</Link>
          <Link href="/app" aria-label="앱과 데이터"><span className="nav-desktop-label">앱과 데이터</span><span className="nav-mobile-label">앱</span></Link>
          <Link href="/contact">문의하기</Link>
        </nav>
        <div className="nav-note"><Leaf size={16} aria-hidden="true" /><span>농가의 내일을 아워비와 함께</span></div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link className="brand-mark" href="/">ourbee<span>.</span></Link>
        <p>벌과 농가의 내일을 연결합니다.</p>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} OurBee</span>
        <div><Link href="/products">제품</Link><Link href="/app">앱과 데이터</Link><Link href="/about">브랜드</Link><Link href="/contact">문의하기</Link></div>
        <a href="https://www.instagram.com/ourbee.lab/" target="_blank" rel="noreferrer" aria-label="아워비 인스타그램"><Instagram size={18} /></a>
      </div>
    </footer>
  );
}
