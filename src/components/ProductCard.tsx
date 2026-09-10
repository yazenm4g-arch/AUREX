import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { translations } from '../i18n/translations';
import type { Product } from '../data/products';
import { productStatus } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang, isRtl } = useLang();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();
  const t = translations[lang];
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const name = product.name[lang];
  const priceLabel = `${product.price.toLocaleString('fr-MA')} ${t.currency}`;
  const hasSale = !!product.originalPrice && product.originalPrice > product.price;
  const status = productStatus(product.stock, product.status);
  const available = product.inStock && status !== 'out_of_stock' && status !== 'coming_soon' && product.stock > (items.find(item => item.product.id === product.id)?.quantity || 0);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
        <div className="relative bg-[#F0EBE1] overflow-hidden aspect-[3/4] mb-4">
          {!imgError ? (
            <img
              src={product.images[0]}
              alt={name}
              className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#EDE8E0]">
              <div className="w-16 h-16 rounded-full border border-[#C4A265]/30 flex items-center justify-center mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
                </svg>
              </div>
              <span className="text-[#C4A265]/60 text-xs tracking-widest font-[Outfit]">AUREX</span>
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
              <span className={`text-[10px] tracking-[0.12em] px-2.5 py-1 font-[Outfit] font-medium ${
                product.badge === 'new' ? 'bg-[#1C1C1C] text-[#C4A265]' : 'bg-[#C4A265] text-[#1C1C1C]'
              }`}>
                {product.badge === 'new' ? t.newArrival.toUpperCase() : t.bestseller.toUpperCase()}
              </span>
            </div>
          )}

          {/* Quick add overlay */}
          <div className={`absolute inset-x-0 bottom-0 flex items-center justify-center py-3.5 translate-y-0 transition-transform duration-300 ${hovered ? 'md:translate-y-0' : 'md:translate-y-full'} ${added ? 'bg-[#C4A265]' : 'bg-[#1C1C1C]/90'}`}>
            <button
              onClick={handleAdd}
              onPointerDown={event => event.stopPropagation()}
              disabled={!available}
              className={`text-xs tracking-[0.18em] font-[Outfit] transition-colors ${added ? 'text-[#1C1C1C]' : 'text-white hover:text-[#C4A265]'}`}
            >
              {added ? t.addedToCart.toUpperCase() : status === 'coming_soon' ? 'COMING SOON' : available ? t.addToCart.toUpperCase() : t.outOfStock.toUpperCase()}
            </button>
          </div>
        </div>

      {/* Info */}
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : 'text-left'}>
        <p className="text-[#C4A265]/70 text-[10px] tracking-[0.2em] font-[Outfit] mb-1">{product.ref}</p>
        <Link to={`/product/${product.id}`}>
          <h3
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-[#1C1C1C] text-base font-medium mb-1 hover:text-[#C4A265] transition-colors duration-200"
          >
            {name}
          </h3>
        </Link>
        <p className="text-[#1C1C1C]/70 text-sm font-[Outfit] font-light">
          {hasSale && <span className="line-through text-[#1C1C1C]/35 mr-2">{product.originalPrice?.toLocaleString('fr-MA')} {t.currency}</span>}
          {priceLabel}
        </p>
      </div>
    </article>
  );
}
