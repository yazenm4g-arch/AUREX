import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { translations } from '../i18n/translations';
import { useProducts } from '../context/ProductContext';
import { productStatus } from '../lib/supabase';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, isRtl } = useLang();
  const { addToCart } = useCart();
  const t = translations[lang];
  const navigate = useNavigate();
  const { products } = useProducts();

  const product = products.find(item => item.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex flex-col items-center justify-center gap-4">
        <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#1C1C1C]">{t.notFound}</p>
        <Link to="/" className="text-[#C4A265] text-sm font-[Outfit] underline">{t.backHome}</Link>
      </div>
    );
  }

  const name = product.name[lang];
  const description = product.description[lang];
  const priceLabel = `${product.price.toLocaleString('fr-MA')} ${t.currency}`;
  const hasSale = !!product.originalPrice && product.originalPrice > product.price;
  const status = productStatus(product.stock, product.status);
  const purchasable = product.inStock && status !== 'out_of_stock' && status !== 'coming_soon';

  const specRows = [
    { key: t.movement, val: product.specs.movement },
    { key: t.diameter, val: product.specs.diameter },
    { key: t.thickness, val: product.specs.thickness },
    { key: t.waterResistance, val: product.specs.waterResistance },
    { key: t.crystal, val: product.specs.crystal },
    { key: t.caseMaterial, val: product.specs.caseMaterial },
    { key: t.dialColor, val: product.specs.dialColor },
    { key: t.strap, val: product.specs.strap },
    { key: t.ref, val: product.ref },
  ];

  function handleAdd() {
    if (!product) return;
    if (!purchasable || qty > product.stock) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (!product) return;
    if (!purchasable || qty > product.stock) return;
    addToCart(product, qty);
    navigate('/checkout');
  }

  return (
    <div className="bg-[#F7F4EF] min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs font-[Outfit] text-[#1C1C1C]/40">
          <Link to="/" className="hover:text-[#C4A265] transition-colors">
            {lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home'}
          </Link>
          <span>/</span>
          <Link to={`/${product.category}`} className="hover:text-[#C4A265] transition-colors capitalize">
            {product.category === 'men' ? t.men : t.women}
          </Link>
          <span>/</span>
          <span className="text-[#1C1C1C]/70">{name}</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

          {/* Images */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="bg-[#EDE8E0] aspect-[4/5] overflow-hidden relative">
              {!imgError ? (
                <img
                  src={product.images[selectedImg]}
                  alt={name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-[#C4A265]/30 flex items-center justify-center mb-4">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
                    </svg>
                  </div>
                  <span className="text-[#C4A265]/50 text-sm tracking-widest font-[Outfit]">AUREX</span>
                </div>
              )}
              {product.badge && (
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
                  <span className={`text-[10px] tracking-[0.12em] px-3 py-1.5 font-[Outfit] font-medium ${
                    product.badge === 'new' ? 'bg-[#1C1C1C] text-[#C4A265]' : 'bg-[#C4A265] text-[#1C1C1C]'
                  }`}>
                    {product.badge === 'new' ? t.newArrival.toUpperCase() : t.bestseller.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImg(i); setImgError(false); }}
                    className={`w-20 h-24 bg-[#EDE8E0] overflow-hidden border-2 transition-colors ${selectedImg === i ? 'border-[#C4A265]' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <p className="text-[#C4A265]/70 text-xs tracking-[0.2em] font-[Outfit] mb-2">{product.ref}</p>

            <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl md:text-4xl font-semibold text-[#1C1C1C] mb-4 leading-tight">
              {name}
            </h1>

            <p className="text-2xl md:text-3xl font-[Outfit] font-light text-[#1C1C1C] mb-6">
              {hasSale && <span className="text-base md:text-lg line-through text-[#1C1C1C]/35 mr-3">{product.originalPrice?.toLocaleString('fr-MA')} {t.currency}</span>}
              {priceLabel}
            </p>

            {/* Stock */}
            <div className={`flex items-center gap-2 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className="text-sm font-[Outfit] text-[#1C1C1C]/60">
                {status === 'coming_soon' ? 'Coming soon' : status === 'low_stock' ? `Low stock (${product.stock})` : purchasable ? t.inStock : t.outOfStock}
              </span>
            </div>

            <p className="text-[#1C1C1C]/70 font-[Outfit] font-light leading-relaxed mb-8 text-sm md:text-base">
              {description}
            </p>

            {/* Qty selector */}
            <div className={`flex items-center gap-4 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs tracking-[0.15em] font-[Outfit] text-[#1C1C1C]/60 uppercase">{t.qty}</span>
              <div className="flex items-center border border-[#1C1C1C]/15">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/></svg>
                </button>
                <span className="w-12 text-center text-sm font-[Outfit]">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  disabled={!purchasable || qty >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>

            {/* Add to cart / Buy now */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={handleAdd}
                disabled={!purchasable}
                className={`flex-1 py-4 text-sm tracking-[0.15em] font-[Outfit] font-medium transition-all duration-200 ${
                  added
                    ? 'bg-[#C4A265] text-[#1C1C1C]'
                      : purchasable
                      ? 'bg-[#1C1C1C] text-white hover:bg-[#C4A265] hover:text-[#1C1C1C]'
                      : 'bg-[#1C1C1C]/20 text-[#1C1C1C]/40 cursor-not-allowed'
                }`}
              >
                {added ? t.addedToCart.toUpperCase() : status === 'coming_soon' ? 'COMING SOON' : t.addToCart.toUpperCase()}
              </button>
              {purchasable && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 text-sm tracking-[0.15em] font-[Outfit] font-medium border border-[#C4A265] text-[#C4A265] hover:bg-[#C4A265] hover:text-[#1C1C1C] transition-colors duration-200"
                >
                  {lang === 'ar' ? 'اطلب الآن' : lang === 'fr' ? 'Commander maintenant' : 'Buy Now'}
                </button>
              )}
            </div>

            {/* Trust icons */}
            <div className={`flex items-center gap-6 text-xs text-[#1C1C1C]/40 font-[Outfit] pt-6 border-t border-[#1C1C1C]/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {t.authenticity}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                {t.cashOnDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16 md:mt-20 border-t border-[#1C1C1C]/10 pt-12">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-semibold text-[#1C1C1C] mb-8">
            {t.specifications}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {specRows.map((row, i) => (
              <div key={row.key} className={`flex justify-between py-3.5 px-1 border-b border-[#1C1C1C]/8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="text-[#1C1C1C]/50 text-sm font-[Outfit] tracking-wide">{row.key}</span>
                <span className="text-[#1C1C1C] text-sm font-[Outfit] font-medium text-right max-w-[60%]">{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
