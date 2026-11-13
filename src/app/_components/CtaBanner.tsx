import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = {
  title: ReactNode;
  description: string;
  href: string;
  label: string;
  eyebrow?: string;
};

/** The dark-green closing banner shared by the home page, the product list and every product page. */
export default function CtaBanner({ title, description, href, label, eyebrow }: Props) {
  return (
    <section className="last-cta section-wrap">
      <div data-reveal>
        {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
        <h2>{title}</h2>
        <p>{description}</p>
        <Link className="ob-btn" href={href}>{label} <ArrowUpRight size={18} /></Link>
      </div>
      <span className="cta-glow" aria-hidden="true">✳</span>
    </section>
  );
}
