export type Category = 'men' | 'women';
export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';

export interface ProductName {
  fr: string;
  en: string;
  ar: string;
}

export interface ProductDescription {
  fr: string;
  en: string;
  ar: string;
}

export interface ProductSpecs {
  movement: string;
  diameter: string;
  thickness: string;
  waterResistance: string;
  crystal: string;
  strap: string;
  caseMaterial: string;
  dialColor: string;
}

export interface Product {
  id: string;
  ref: string;
  name: ProductName;
  price: number;
  category: Category;
  images: string[];
  description: ProductDescription;
  specs: ProductSpecs;
  badge?: 'new' | 'bestseller';
  newArrival?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  originalPrice?: number;
  inStock: boolean;
  stock: number;
  status?: ProductStatus;
  variant?: string;
}

export const products: Product[] = [
  {
    id: 'p1',
    ref: 'AX-M-001',
    name: { fr: 'Altair I', en: 'Altair I', ar: 'ألتير I' },
    price: 2490,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "L'Altair I incarne la précision à l'état pur. Avec son boîtier en acier satiné et son cadran ardoise, cette montre allie sobriété et caractère pour l'homme moderne.",
      en: "The Altair I embodies pure precision. With its satin steel case and slate dial, this watch combines understated elegance with character for the modern man.",
      ar: "تجسّد ألتير الأول الدقة في أنقى صورها. بهيكلها الفولاذي المصقول وقرصها الداكن، تجمع هذه الساعة بين الأناقة والشخصية للرجل المعاصر.",
    },
    specs: {
      movement: 'Automatique — 25 jewels',
      diameter: '42 mm',
      thickness: '11 mm',
      waterResistance: '100 m',
      crystal: 'Saphir anti-reflets',
      strap: 'Cuir veau noir / Acier',
      caseMaterial: 'Acier inoxydable 316L',
      dialColor: 'Ardoise',
    },
    badge: 'new',
    inStock: true,
    stock: 8,
  },
  {
    id: 'p2',
    ref: 'AX-M-002',
    name: { fr: 'Soleil Noir', en: 'Black Sun', ar: 'الشمس السوداء' },
    price: 3190,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "Le Soleil Noir est une déclaration silencieuse de puissance. Cadran soleil noir, index dorés et boîtier en acier noirci PVD pour un style sans compromis.",
      en: "The Black Sun is a silent declaration of power. Black sunray dial, gold indices, and PVD-blackened steel case for an uncompromising style statement.",
      ar: "الشمس السوداء هي إعلان صامت للقوة. قرص أسود مشعّ، مؤشرات ذهبية وهيكل فولاذي مطليّ بـ PVD لأسلوب لا تنازل فيه.",
    },
    specs: {
      movement: 'Automatique — Miyota 9015',
      diameter: '44 mm',
      thickness: '12 mm',
      waterResistance: '100 m',
      crystal: 'Saphir bombé',
      strap: 'Cuir alcantara noir / NATO',
      caseMaterial: 'Acier PVD noir',
      dialColor: 'Noir soleil',
    },
    badge: 'bestseller',
    inStock: true,
    stock: 5,
  },
  {
    id: 'p3',
    ref: 'AX-M-003',
    name: { fr: 'Orion Acier', en: 'Orion Steel', ar: 'أوريون ستيل' },
    price: 1790,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "L'Orion Acier est la montre du quotidien élevée au rang de luxe abordable. Sobre, robuste et élégant — parfait compagnon du professionnel actif.",
      en: "The Orion Steel elevates everyday wear to accessible luxury. Sober, robust, and elegant — the perfect companion for the active professional.",
      ar: "أوريون ستيل يرفع الساعة اليومية إلى مستوى الفخامة في متناول الجميع. هادئة، متينة وأنيقة — الرفيق المثالي للمهني النشط.",
    },
    specs: {
      movement: 'Quartz Swiss — Ronda 515',
      diameter: '40 mm',
      thickness: '9 mm',
      waterResistance: '50 m',
      crystal: 'Minéral trempé',
      strap: 'Bracelet acier 3 maillons',
      caseMaterial: 'Acier inoxydable 316L',
      dialColor: 'Blanc crème',
    },
    inStock: true,
    stock: 12,
  },
  {
    id: 'p4',
    ref: 'AX-M-004',
    name: { fr: 'Vega Chronos', en: 'Vega Chronos', ar: 'فيغا كرونوس' },
    price: 3890,
    originalPrice: 4290,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "Le Vega Chronos est notre pièce maîtresse. Chronographe automatique avec cadran bleu nuit et lunette en céramique noire, il impose son autorité au premier coup d'œil.",
      en: "The Vega Chronos is our flagship piece. An automatic chronograph with a midnight blue dial and black ceramic bezel, it commands authority at first glance.",
      ar: "فيغا كرونوس هي قطعتنا الرئيسية. كرونوغراف أوتوماتيكي بقرص أزرق ليلي وحافة سيراميك سوداء، يفرض سلطته من النظرة الأولى.",
    },
    specs: {
      movement: 'Chronographe automatique — Seiko NE88',
      diameter: '45 mm',
      thickness: '14 mm',
      waterResistance: '200 m',
      crystal: 'Saphir double anti-reflets',
      strap: 'Caoutchouc bleu / Bracelet acier',
      caseMaterial: 'Titane Grade 5',
      dialColor: 'Bleu nuit',
    },
    inStock: true,
    stock: 3,
  },
  {
    id: 'p5',
    ref: 'AX-W-001',
    name: { fr: 'Vénus Or', en: 'Venus Gold', ar: 'فينوس الذهب' },
    price: 2850,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "Vénus Or est une célébration de la féminité lumineuse. Boîtier plaqué or rose 18k, cadran nacre blanc et bracelet en acier doré pour un éclat intemporel.",
      en: "Venus Gold celebrates radiant femininity. 18k rose gold-plated case, white mother-of-pearl dial, and gold steel bracelet for timeless brilliance.",
      ar: "فينوس الذهب احتفاء بالأنوثة المشرقة. هيكل مطلي بالذهب الوردي 18 قيراطاً، قرص من اللؤلؤ الأبيض وسوار فولاذي ذهبي لبريق لا يعرف الزمن.",
    },
    specs: {
      movement: 'Quartz Swiss — ETA 901.001',
      diameter: '34 mm',
      thickness: '7 mm',
      waterResistance: '30 m',
      crystal: 'Saphir anti-reflets',
      strap: 'Bracelet acier doré / Cuir ivoire',
      caseMaterial: 'Acier plaqué or rose 18k',
      dialColor: 'Nacre blanc',
    },
    badge: 'new',
    inStock: true,
    stock: 6,
  },
  {
    id: 'p6',
    ref: 'AX-W-002',
    name: { fr: 'Cassiopée', en: 'Cassiopeia', ar: 'كاسيوبي' },
    price: 1990,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "Cassiopée est le choix de la femme qui préfère l'élégance à l'ostentation. Minimaliste et raffinée, elle s'adapte à toutes les occasions avec une grâce naturelle.",
      en: "Cassiopeia is the choice of the woman who prefers elegance over ostentation. Minimalist and refined, she adapts to every occasion with natural grace.",
      ar: "كاسيوبي هي خيار المرأة التي تُفضّل الأناقة على الإبهار. بسيطة ومتطورة، تتكيف مع كل مناسبة بنعمة طبيعية.",
    },
    specs: {
      movement: 'Automatique — Miyota 6T33',
      diameter: '36 mm',
      thickness: '9 mm',
      waterResistance: '50 m',
      crystal: 'Saphir sablé',
      strap: 'Cuir grainé blanc / Satin champagne',
      caseMaterial: 'Acier inoxydable 316L',
      dialColor: 'Champagne',
    },
    badge: 'bestseller',
    inStock: true,
    stock: 9,
  },
  {
    id: 'p7',
    ref: 'AX-W-003',
    name: { fr: 'Étoile Rose', en: 'Pink Star', ar: 'النجمة الوردية' },
    price: 2190,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "L'Étoile Rose capte la lumière comme nulle autre. Cadran rosé serti de 8 diamants indices et bracelet milanais en or rose pour une élégance sans effort.",
      en: "The Pink Star catches light like no other. Rose dial set with 8 diamond indices and a rose gold milanese bracelet for effortless elegance.",
      ar: "النجمة الوردية تلتقط الضوء كما لا يفعل أي شيء آخر. قرص وردي مرصّع بـ 8 ألماسات وسوار ميلانيز من الذهب الوردي للأناقة العفوية.",
    },
    specs: {
      movement: 'Quartz Swiss — Ronda 762',
      diameter: '32 mm',
      thickness: '7 mm',
      waterResistance: '30 m',
      crystal: 'Saphir anti-reflets',
      strap: 'Milanais acier rosé / Cuir rosé',
      caseMaterial: 'Acier plaqué or rose',
      dialColor: 'Rose poudré',
    },
    inStock: true,
    stock: 7,
  },
  {
    id: 'p8',
    ref: 'AX-W-004',
    name: { fr: 'Luna Dorée', en: 'Golden Moon', ar: 'القمر الذهبي' },
    price: 2690,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=900&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&h=900&fit=crop&auto=format',
    ],
    description: {
      fr: "Luna Dorée est une ode à la nuit étoilée. Son cadran bleu profond avec phase de lune et boîtier doré créent une pièce de collection d'une beauté poétique.",
      en: "Golden Moon is an ode to the starry night. Its deep blue moonphase dial and gold case create a collector's piece of poetic beauty.",
      ar: "القمر الذهبي قصيدة في الليل المرصّع بالنجوم. قرصها الأزرق العميق بمرحلة القمر وهيكلها الذهبي يخلقان قطعة مجموعة ذات جمال شعري.",
    },
    specs: {
      movement: 'Automatique phase de lune — Seiko NH07',
      diameter: '38 mm',
      thickness: '11 mm',
      waterResistance: '30 m',
      crystal: 'Saphir dôme anti-reflets',
      strap: 'Cuir veau bleu nuit / Milanais doré',
      caseMaterial: 'Acier plaqué or jaune 18k',
      dialColor: 'Bleu nuit / Phase de lune',
    },
    inStock: true,
    stock: 4,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter(p => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(p =>
    p.name.fr.toLowerCase().includes(q) ||
    p.name.en.toLowerCase().includes(q) ||
    p.name.ar.includes(q) ||
    p.ref.toLowerCase().includes(q) ||
    p.description.fr.toLowerCase().includes(q) ||
    p.description.en.toLowerCase().includes(q)
  );
}
