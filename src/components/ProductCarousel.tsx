import { useRef, useState } from 'react';
import { Link } from 'react-router';
import ProductCard from './ProductCard';
import type { Product } from '../data/products';

interface ProductCarouselProps {
  products: Product[];
  label: string;
  viewAllHref?: string;
  dark?: boolean;
}

export default function ProductCarousel({ products, label, viewAllHref, dark = false }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, scroll: 0 });

  function scrollBy(direction: number) {
    trackRef.current?.scrollBy({ left: direction * Math.min(trackRef.current.clientWidth * 0.82, 460), behavior: 'smooth' });
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!trackRef.current) return;
    if ((event.target as HTMLElement).closest('a, button')) return;
    setDragging(true);
    dragStart.current = { x: event.clientX, scroll: trackRef.current.scrollLeft };
    trackRef.current.setPointerCapture(event.pointerId);
  }

  function drag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !trackRef.current) return;
    trackRef.current.scrollLeft = dragStart.current.scroll - (event.clientX - dragStart.current.x);
  }

  return (
    <section className={`${dark ? 'bg-[#1C1C1C]' : 'bg-[#F7F4EF]'} py-16 md:py-20 overflow-hidden`}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 min-w-0">
        <div className="flex items-end justify-between gap-5 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#C4A265]" />
              <span className="text-[#C4A265] text-xs tracking-[0.3em] font-[Outfit] uppercase">AUREX</span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className={`text-3xl md:text-4xl font-semibold ${dark ? 'text-white' : 'text-[#1C1C1C]'}`}>
              {label}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {viewAllHref && <Link to={viewAllHref} className={`hidden sm:inline text-xs tracking-[0.15em] font-[Outfit] ${dark ? 'text-white/50 hover:text-[#C4A265]' : 'text-[#1C1C1C]/50 hover:text-[#C4A265]'}`}>VIEW ALL</Link>}
            <button type="button" onClick={() => scrollBy(-1)} aria-label={`Previous ${label}`} className={`w-10 h-10 border flex items-center justify-center ${dark ? 'border-white/20 text-white hover:border-[#C4A265] hover:text-[#C4A265]' : 'border-[#1C1C1C]/15 text-[#1C1C1C] hover:border-[#C4A265] hover:text-[#C4A265]'}`}>
              <span aria-hidden="true">&#8592;</span>
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label={`Next ${label}`} className={`w-10 h-10 border flex items-center justify-center ${dark ? 'border-white/20 text-white hover:border-[#C4A265] hover:text-[#C4A265]' : 'border-[#1C1C1C]/15 text-[#1C1C1C] hover:border-[#C4A265] hover:text-[#C4A265]'}`}>
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
        </div>
        <div
          ref={trackRef}
          className={`flex gap-4 md:gap-6 overflow-x-auto overscroll-x-contain pb-4 select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
        >
          {products.map(product => (
            <div key={product.id} className="w-[78vw] sm:w-[280px] lg:w-[300px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {viewAllHref && <Link to={viewAllHref} className={`sm:hidden inline-block mt-2 text-xs tracking-[0.15em] font-[Outfit] ${dark ? 'text-white/50' : 'text-[#1C1C1C]/50'}`}>VIEW ALL &#8594;</Link>}
      </div>
    </section>
  );
}