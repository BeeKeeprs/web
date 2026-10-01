"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ photos }: { photos: readonly { src: string; alt: string; label: string }[] }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <Image src={photos[selected].src} alt={photos[selected].alt} fill sizes="(max-width: 760px) 100vw, 55vw" priority />
        <span className="gallery-caption">{photos[selected].label} <span>{String(selected + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span></span>
      </div>
      {photos.length > 1 && <div className="gallery-thumbs" aria-label="제품 사진 선택">
        {photos.map((photo, index) => <button type="button" key={photo.src} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} aria-label={`${photo.label} 보기`} aria-pressed={selected === index}><Image src={photo.src} alt="" fill sizes="100px" /></button>)}
      </div>}
    </div>
  );
}
