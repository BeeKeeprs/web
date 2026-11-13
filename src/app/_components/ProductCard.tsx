import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Fragment, type CSSProperties } from "react";
import { products, type ProductSlug } from "../_data/products";

export default function ProductCard({ slug, index = 0, describe = false }: { slug: ProductSlug; index?: number; describe?: boolean }) {
  const product = products[slug];
  return (
    <Link href={`/products/${slug}`} className={`shop-card shop-card-${slug}`} data-reveal style={{ "--delay": `${index * 140}ms` } as CSSProperties}>
      <div className="shop-card-media">
        <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 700px) 100vw, 50vw" />
        {describe ? <h3 className="shop-card-title">{product.name}</h3> : <span className="shop-card-index">OURBEE / {product.number}</span>}
        <span className="shop-card-arrow"><ArrowUpRight size={24} aria-hidden="true" /></span>
      </div>
      <div className="shop-card-info">
        {describe ? (
          <div><p className="shop-card-features">{product.features.map((feature, i) => <Fragment key={feature}><span>{feature}{i < product.features.length - 1 ? "," : ""}</span>{i < product.features.length - 1 ? " " : ""}</Fragment>)}</p></div>
        ) : (
          <>
            <div><span className="overline">{product.english}</span><h3>{product.name}</h3><p>{product.headline}</p></div>
            <strong>가격 문의하기</strong>
          </>
        )}
      </div>
    </Link>
  );
}
