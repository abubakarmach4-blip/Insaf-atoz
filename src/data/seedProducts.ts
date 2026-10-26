import { Category, Product } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', nameUr: 'تمام اشیاء', nameEn: 'All Products', iconName: 'Layers' },
  { id: 'engine-oil', nameUr: 'انجن آئل', nameEn: 'Engine Oil', iconName: 'Droplet' },
  { id: 'filters', nameUr: 'فلٹرز', nameEn: 'Filters', iconName: 'Disc' },
  { id: 'gear-oil', nameUr: 'گیئر آئل', nameEn: 'Gear Oil', iconName: 'Settings' },
  { id: 'hydraulic-oil', nameUr: 'ہائڈرولک آئل', nameEn: 'Hydraulic Oil', iconName: 'Gauge' },
  { id: 'polish', nameUr: 'پالش و صفائی', nameEn: 'Polish & Care', iconName: 'Sparkles' },
];

// Helper to create clean vector badge SVG illustrations for products
function createBottleSvg(color: string, capColor: string, labelTitle: string, grade: string, badge: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 360" width="100%" height="100%">
    <defs>
      <linearGradient id="bodyGrad_${grade.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
        <stop offset="60%" stop-color="#121319" stop-opacity="1"/>
        <stop offset="100%" stop-color="#0a0b0e" stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#e6b800"/>
        <stop offset="50%" stop-color="#fff2a3"/>
        <stop offset="100%" stop-color="#b8860b"/>
      </linearGradient>
      <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.8"/>
        <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#f59e0b" flood-opacity="0.25"/>
      </filter>
    </defs>
    <!-- Bottle Handle & Cap -->
    <rect x="135" y="22" width="50" height="28" rx="6" fill="${capColor}" stroke="#1f232e" stroke-width="2"/>
    <rect x="140" y="16" width="40" height="8" rx="3" fill="#ffd700"/>
    <!-- Bottle Body -->
    <path d="M 80,105 C 80,55 125,50 135,50 L 185,50 C 195,50 240,55 240,105 L 245,305 C 245,325 230,335 210,335 L 110,335 C 90,335 75,325 75,305 Z" 
      fill="url(#bodyGrad_${grade.replace(/[^a-zA-Z0-9]/g, '')})" stroke="#2a2e3d" stroke-width="3" filter="url(#dropGlow)" />
    <!-- Handle Cutout -->
    <path d="M 98,110 Q 98,75 125,75 L 125,120 Q 98,125 98,110 Z" fill="#090a0f" opacity="0.9" />
    <!-- Luxury Gold Label Plate -->
    <rect x="95" y="130" width="130" height="150" rx="10" fill="#0c0d12" stroke="url(#goldRibbon)" stroke-width="2"/>
    <rect x="98" y="133" width="124" height="24" rx="4" fill="url(#goldRibbon)"/>
    <text x="160" y="149" font-family="'Cinzel', serif, sans-serif" font-weight="900" font-size="12" fill="#000" text-anchor="middle" letter-spacing="1">ORIGINAL GRADE</text>
    <text x="160" y="185" font-family="sans-serif" font-weight="900" font-size="16" fill="#f8fafc" text-anchor="middle">${labelTitle}</text>
    <text x="160" y="215" font-family="'Cinzel', sans-serif" font-weight="800" font-size="20" fill="#ffd700" text-anchor="middle">${grade}</text>
    <line x1="110" y1="228" x2="210" y2="228" stroke="#334155" stroke-width="1.5"/>
    <text x="160" y="248" font-family="sans-serif" font-weight="700" font-size="11" fill="#38bdf8" text-anchor="middle">${badge}</text>
    <text x="160" y="268" font-family="sans-serif" font-weight="600" font-size="10" fill="#94a3b8" text-anchor="middle">HEAVY TRUCK SPEC</text>
    <!-- Level gauge line on side -->
    <line x1="230" y1="120" x2="230" y2="300" stroke="#f59e0b" stroke-dasharray="4,8" stroke-width="2"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createFilterSvg(color: string, title: string, model: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 360" width="100%" height="100%">
    <defs>
      <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1e2433"/>
        <stop offset="35%" stop-color="${color}"/>
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#0e111a"/>
      </linearGradient>
      <filter id="shadowFilter">
        <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000000" flood-opacity="0.75"/>
        <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#f59e0b" flood-opacity="0.2"/>
      </filter>
    </defs>
    <!-- Base Plate -->
    <ellipse cx="160" cy="300" rx="80" ry="24" fill="#0a0c10" stroke="#ffd700" stroke-width="2"/>
    <!-- Cylinder Body -->
    <path d="M 80,100 L 80,300 C 80,315 240,315 240,300 L 240,100 C 240,85 80,85 80,100 Z" 
      fill="url(#cylinderGrad)" stroke="#2b3245" stroke-width="2.5" filter="url(#shadowFilter)"/>
    <!-- Top Rim -->
    <ellipse cx="160" cy="100" rx="80" ry="22" fill="#151922" stroke="#eab308" stroke-width="3"/>
    <ellipse cx="160" cy="100" rx="40" ry="12" fill="#090a0f" stroke="#475569" stroke-width="2"/>
    <!-- Ribbed Filter Flutes -->
    <line x1="105" y1="120" x2="105" y2="280" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
    <line x1="130" y1="124" x2="130" y2="286" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
    <line x1="160" y1="125" x2="160" y2="288" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
    <line x1="190" y1="124" x2="190" y2="286" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
    <line x1="215" y1="120" x2="215" y2="280" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
    <!-- Label -->
    <rect x="95" y="165" width="130" height="75" rx="6" fill="#090b10" stroke="#ffd700" stroke-width="1.5" opacity="0.95"/>
    <text x="160" y="190" font-family="sans-serif" font-weight="900" font-size="15" fill="#f8fafc" text-anchor="middle">${title}</text>
    <text x="160" y="210" font-family="'Cinzel', sans-serif" font-weight="800" font-size="14" fill="#fbbf24" text-anchor="middle">${model}</text>
    <text x="160" y="228" font-family="sans-serif" font-weight="700" font-size="9" fill="#22c55e" text-anchor="middle">GUARANTEED 100% ORIGINAL</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createDrumSvg(color: string, title: string, spec: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 360" width="100%" height="100%">
    <defs>
      <linearGradient id="drumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="40%" stop-color="${color}"/>
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0b0f17"/>
      </linearGradient>
    </defs>
    <!-- Drum Base -->
    <ellipse cx="160" cy="295" rx="90" ry="24" fill="#090b10" stroke="#f59e0b" stroke-width="2"/>
    <!-- Drum Body -->
    <path d="M 70,90 L 70,295 C 70,312 250,312 250,295 L 250,90 C 250,70 70,70 70,90 Z" 
      fill="url(#drumGrad)" stroke="#1f2937" stroke-width="3"/>
    <!-- Ribs on Heavy Duty Drum -->
    <path d="M 70,140 C 70,155 250,155 250,140" fill="none" stroke="#eab308" stroke-width="4"/>
    <path d="M 70,210 C 70,225 250,225 250,210" fill="none" stroke="#eab308" stroke-width="4"/>
    <!-- Top Rim & Bunghole -->
    <ellipse cx="160" cy="90" rx="90" ry="24" fill="#1e293b" stroke="#ffd700" stroke-width="3"/>
    <circle cx="125" cy="85" r="9" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="195" cy="92" r="6" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
    <!-- Large Front Stencil Label -->
    <rect x="95" y="155" width="130" height="45" rx="5" fill="#090a0f" stroke="#ffd700" stroke-width="1.5"/>
    <text x="160" y="174" font-family="'Cinzel', sans-serif" font-weight="900" font-size="13" fill="#f8fafc" text-anchor="middle">${title}</text>
    <text x="160" y="192" font-family="sans-serif" font-weight="800" font-size="11" fill="#38bdf8" text-anchor="middle">${spec}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Engine Oils (انجن آئل)
  {
    id: 'oil-1',
    nameUr: 'شیل رمولا R4 X 15W-40 (4 لیٹر)',
    nameEn: 'Shell Rimula R4 X 15W-40 (4 Liters)',
    category: 'engine-oil',
    price: 6850,
    originalPrice: 7200,
    brand: 'Shell Rimula',
    specs: '15W-40 CI-4 / 4L Can',
    descriptionUr: 'ٹرک، ٹرالر اور ہیوی ڈیوٹی ڈیزل انجنوں کے لیے شیل کا سب سے زیادہ قابل اعتماد آئل۔ انجن کو طویل سفر میں ٹھنڈا اور محفوظ رکھتا ہے۔',
    descriptionEn: 'Premium heavy-duty diesel engine oil for long-haul trucks, dumpers and trailers. Triple protection against wear, deposits and heat.',
    imageUrl: createBottleSvg('#d97706', '#dc2626', 'SHELL RIMULA', '15W-40 R4X', '4L HEAVY DUTY'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.9,
  },
  {
    id: 'oil-2',
    nameUr: 'کالٹیکس ڈیلو 400 MGX 15W-40 (بڑا کین 10 لیٹر)',
    nameEn: 'Caltex Delo 400 MGX 15W-40 (10 Liters)',
    category: 'engine-oil',
    price: 16500,
    originalPrice: 17200,
    brand: 'Caltex Delo',
    specs: 'API CJ-4 / 10L Can',
    descriptionUr: 'نیشنل ہائی وے اور کوئٹہ کراچی روٹ کے ہیوی ٹرکوں کے لیے خصوصی پائیدار ڈیزل انجن آئل۔ تیل کی کھپت کم کرتا ہے۔',
    descriptionEn: 'High-performance fleet engine oil formulated for on-highway and off-highway heavy-duty diesel engines. Extended drain interval.',
    imageUrl: createBottleSvg('#0284c7', '#2563eb', 'CALTEX DELO', '15W-40 MGX', '10L FLEET CAN'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.8,
  },
  {
    id: 'oil-3',
    nameUr: 'زِک X7000 15W-40 سنتھیٹک (4 لیٹر)',
    nameEn: 'ZIC X7000 Heavy Duty Diesel 15W-40 (4L)',
    category: 'engine-oil',
    price: 6400,
    originalPrice: 6700,
    brand: 'SK ZIC',
    specs: 'VHVI Synthetic / 4L',
    descriptionUr: 'کورین جدید سنتھیٹک ٹیکنالوجی۔ ہینو، اسوزو اور شہزور گاڑیوں کے لیے بہترین انتخاب۔ تیز رفتاری میں زبردست مائلیج۔',
    descriptionEn: 'Fully synthetic heavy-duty diesel engine oil with VHVI technology. Exceptional engine cleanliness and fuel efficiency.',
    imageUrl: createBottleSvg('#dc2626', '#b91c1c', 'SK ZIC X7000', '15W-40 VHVI', '4L SYNTHETIC'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 4.7,
  },
  {
    id: 'oil-4',
    nameUr: 'پی ایس او کارینٹ پلس 20W-50 (4 لیٹر)',
    nameEn: 'PSO Carient Plus 20W-50 (4 Liters)',
    category: 'engine-oil',
    price: 5200,
    originalPrice: 5500,
    brand: 'PSO Pakistan',
    specs: '20W-50 SG/CD / 4 Liters',
    descriptionUr: 'پاکستان اسٹیٹ آئل کا اصل پیکنگ۔ گرم ترین موسم اور بولان کے پہاڑی گھاٹوں میں انجن کے درجہ حرارت کو اعتدال میں رکھتا ہے۔',
    descriptionEn: 'Heavy viscosity motor oil engineered for harsh hot Pakistani climates and mountain pass load conditions.',
    imageUrl: createBottleSvg('#16a34a', '#15803d', 'PSO CARIENT', '20W-50 PLUS', '4L PAKISTAN'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.8,
  },
  {
    id: 'oil-5',
    nameUr: 'شیل رمولا R4 X ڈرم (208 لیٹر بڑی بالٹی / ڈرم)',
    nameEn: 'Shell Rimula R4 X 15W-40 Drum (208L)',
    category: 'engine-oil',
    price: 310000,
    originalPrice: 325000,
    brand: 'Shell Rimula',
    specs: '208L Commercial Drum',
    descriptionUr: 'ٹرک اڈوں اور فلیٹ مالکان کے لیے اصل شیل 208 لیٹر سیل بند ڈرم۔ ہول سیل خصوصی رعایت کے ساتھ۔',
    descriptionEn: 'Full 208-liter factory-sealed commercial drum for fleet operators, transport companies, and truck workshops.',
    imageUrl: createDrumSvg('#b45309', 'SHELL RIMULA', '208L DRUM 15W40'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 5.0,
  },

  // 2. Filters (فلٹرز)
  {
    id: 'filter-1',
    nameUr: 'گارڈ ہیوی ڈیوٹی آئل فلٹر (ہینو 500 / بیڈ فورڈ)',
    nameEn: 'Guard Heavy Duty Oil Filter (Hino / Bedford)',
    category: 'filters',
    price: 1850,
    originalPrice: 2100,
    brand: 'Guard Filters',
    specs: 'High Flow Spin-On / Hino Spec',
    descriptionUr: 'پاکستان کا نمبر 1 گارڈ فلٹر۔ انجن آئل کے باریک ذرات اور کچرے کو فوری روک کر انجن کی عمر بڑھاتا ہے۔',
    descriptionEn: 'Genuine Guard high-capacity heavy-duty spin-on oil filter for commercial trucks and coaches.',
    imageUrl: createFilterSvg('#3b82f6', 'GUARD FILTER', 'HINO 500 OIL'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.9,
  },
  {
    id: 'filter-2',
    nameUr: 'گارڈ ڈیزل واٹر سیپریٹر فلٹر (بڑا سائز)',
    nameEn: 'Guard Diesel Fuel Water Separator Filter',
    category: 'filters',
    price: 2600,
    originalPrice: 2900,
    brand: 'Guard Filters',
    specs: 'Fuel Water Separator / Glass Bowl Base',
    descriptionUr: 'ڈیزل سے پانی اور نمی کو مکمل الگ کرتا ہے۔ ٹرک کے نوزل اور فیول پمپ کو خراب ہونے سے 100% محفوظ رکھتا ہے۔',
    descriptionEn: 'Removes water and impurities from diesel fuel, protecting expensive fuel injection pumps and nozzles.',
    imageUrl: createFilterSvg('#0ea5e9', 'GUARD FUEL', 'WATER SEPARATOR'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.9,
  },
  {
    id: 'filter-3',
    nameUr: 'اسوزو فارورڈ ایئر فلٹر ڈبل جالی دار',
    nameEn: 'Isuzu Forward Heavy Air Filter Element',
    category: 'filters',
    price: 3400,
    originalPrice: 3800,
    brand: 'Isuzu Genuine / OEM',
    specs: 'Reinforced Metal Mesh / Heavy Dust Spec',
    descriptionUr: 'بلوچستان کے گرد آلود راستوں اور کچے راستوں کے لیے مضبوط ڈبل جالی والا اصلی ایئر فلٹر۔',
    descriptionEn: 'Heavy-duty dual mesh air filter engineered for desert and dusty mountain highways.',
    imageUrl: createFilterSvg('#f59e0b', 'ISUZU OEM', 'HEAVY AIR ELEMENT'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 4.7,
  },
  {
    id: 'filter-4',
    nameUr: 'گارڈ آئل فلٹر ٹویوٹا / شہزور / پک اپ',
    nameEn: 'Guard Spin-on Oil Filter (Shahzore / Hilux)',
    category: 'filters',
    price: 1200,
    originalPrice: 1400,
    brand: 'Guard Filters',
    specs: 'OEM Grade Spin-on',
    descriptionUr: 'شہزور، ٹویوٹا ہائی لکس اور چھوٹی کمرشل گاڑیوں کے لیے بہترین پائیدار آئل فلٹر۔',
    descriptionEn: 'Reliable micro-filtration spin-on oil filter for Hyundai Shahzore and light commercial vehicles.',
    imageUrl: createFilterSvg('#10b981', 'GUARD MINI', 'SHAHZORE / HILUX'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 4.8,
  },

  // 3. Gear Oil (گیئر آئل)
  {
    id: 'gear-1',
    nameUr: 'شیل اسپائریکس S2 A 85W-140 ہیوی گیئر آئل (4 لیٹر)',
    nameEn: 'Shell Spirax S2 A 85W-140 Gear & Diff Oil (4L)',
    category: 'gear-oil',
    price: 5800,
    originalPrice: 6200,
    brand: 'Shell Spirax',
    specs: 'API GL-5 / 85W-140 / 4L Can',
    descriptionUr: 'ہیوی ڈیوٹی ٹرکوں کے ڈفرینشل (حوضہ) اور گیئر بکس کے لیے انتہائی دباؤ برداشت کرنے والا اعلیٰ معیار کا گیئر آئل۔',
    descriptionEn: 'High performance GL-5 extreme-pressure gear and axle oil for heavy-duty commercial differentials.',
    imageUrl: createBottleSvg('#7c3aed', '#6d28d9', 'SHELL SPIRAX', '85W-140 GL-5', '4L DIFF & GEAR'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.9,
  },
  {
    id: 'gear-2',
    nameUr: 'کالٹیکس تھوبن GL-5 85W-140 (18 لیٹر بالٹی)',
    nameEn: 'Caltex Thuban GL-5 85W-140 Bucket (18 Liters)',
    category: 'gear-oil',
    price: 24500,
    originalPrice: 26000,
    brand: 'Caltex Thuban',
    specs: 'GL-5 Extreme Pressure / 18L Pail',
    descriptionUr: 'مکمل 18 لیٹر بالٹی۔ بھاری ٹرکوں کے کراؤن ویل، پینین اور بیئرنگز کو ٹوٹ پھوٹ اور رگڑ سے بچاتی ہے۔',
    descriptionEn: 'Heavy commercial 18-liter bucket designed for heavily loaded hypoid gears and truck axles.',
    imageUrl: createDrumSvg('#6d28d9', 'CALTEX THUBAN', '18L BUCKET 85W140'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.8,
  },
  {
    id: 'gear-3',
    nameUr: 'ٹوٹل ٹرانسمیشن گیئر 8 80W-90 (1 لیٹر بوتل)',
    nameEn: 'Total Transmission Gear 8 80W-90 (1 Liter)',
    category: 'gear-oil',
    price: 1650,
    originalPrice: 1800,
    brand: 'Total Energies',
    specs: 'API GL-4 / 1L Bottle',
    descriptionUr: 'مینوئل ٹرانسمیشن اور گیئر باکس کی ہموار تبدیلی کے لیے خصوصی فرانسیسی فارمولیشن۔',
    descriptionEn: 'Synthetic-based manual gearbox lubricant providing ultra-smooth shifting and sync protection.',
    imageUrl: createBottleSvg('#ef4444', '#b91c1c', 'TOTAL GEAR 8', '80W-90 GL-4', '1L BOTTLE'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 4.7,
  },

  // 4. Hydraulic Oil (ہائڈرولک آئل)
  {
    id: 'hyd-1',
    nameUr: 'شیل ٹیلس S2 M 68 ہائڈرولک آئل (20 لیٹر بالٹی)',
    nameEn: 'Shell Tellus S2 M 68 Hydraulic Oil (20L Bucket)',
    category: 'hydraulic-oil',
    price: 23500,
    originalPrice: 25000,
    brand: 'Shell Tellus',
    specs: 'ISO VG 68 Anti-Wear / 20L Pail',
    descriptionUr: 'ڈمپر، ٹرالی، جیک اور لفٹنگ کرینز کے لیے بہترین اینٹی ویئر ہائڈرولک آئل۔ پریشر کبھی گرنے نہیں دیتا۔',
    descriptionEn: 'Industrial-grade anti-wear hydraulic fluid for dumper jacks, cranes and heavy hydraulic pumps.',
    imageUrl: createDrumSvg('#0284c7', 'SHELL TELLUS', '20L PAIL ISO 68'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.9,
  },
  {
    id: 'hyd-2',
    nameUr: 'کالٹیکس رانڈو HD 68 ہائڈرولک آئل (20 لیٹر)',
    nameEn: 'Caltex Rando HD 68 Hydraulic Oil (20 Liters)',
    category: 'hydraulic-oil',
    price: 22800,
    originalPrice: 24200,
    brand: 'Caltex Rando',
    specs: 'ISO 68 Premium Hydraulic / 20L',
    descriptionUr: 'ہائی پریشر پمپوں اور لفٹوں کے لیے مستند تیل۔ فومنگ اور گرمی سے مکمل تحفظ۔',
    descriptionEn: 'Premium quality hydraulic oil designed for high-pressure vane and piston hydraulic systems.',
    imageUrl: createDrumSvg('#059669', 'CALTEX RANDO', '20L PAIL HD 68'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 4.8,
  },
  {
    id: 'hyd-3',
    nameUr: 'شیل ٹیلس 68 ہائڈرولک ڈرم (208 لیٹر)',
    nameEn: 'Shell Tellus S2 M 68 Hydraulic Drum (208L)',
    category: 'hydraulic-oil',
    price: 215000,
    originalPrice: 228000,
    brand: 'Shell Tellus',
    specs: '208L Factory Sealed Drum',
    descriptionUr: 'ڈمپر کمپنیوں، کوئلہ لوڈنگ مشینوں اور بولان مائننگ ٹرکوں کے لیے بڑا ڈرم پیک۔',
    descriptionEn: '208-liter bulk drum for mining dumpers, excavators and heavy industrial hydraulic systems.',
    imageUrl: createDrumSvg('#0369a1', 'SHELL TELLUS', '208L DRUM ISO 68'),
    isPopular: false,
    stockStatus: 'order_basis',
    rating: 5.0,
  },

  // 5. Polish & Care (پالش و صفائی)
  {
    id: 'pol-1',
    nameUr: 'فارمولا 1 کارنوبا ویکس کار و ٹرک پالش (امریکن اصل)',
    nameEn: 'Formula 1 Carnauba High Gloss Paste Wax',
    category: 'polish',
    price: 1450,
    originalPrice: 1650,
    brand: 'Formula 1 USA',
    specs: '230g Solid Paste Wax with Sponge',
    descriptionUr: 'اصلی امریکن فارمولا 1 پالش۔ گاڑی کی باڈی کو شیشے جیسی گہری چمک اور دھوپ، گرد اور بارش سے واٹر پروف تحفظ دیتی ہے۔',
    descriptionEn: 'Pure yellow carnauba wax provides deep brilliant shine and long-lasting bead-up water protection.',
    imageUrl: createBottleSvg('#eab308', '#ca8a04', 'FORMULA 1 WAX', 'HIGH GLOSS', '230G PASTE'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.9,
  },
  {
    id: 'pol-2',
    nameUr: 'کاسمک سپر لیکوڈ کار اینڈ ٹرک پالش (500ml)',
    nameEn: 'Cosmic Super Liquid Polish & Shiner (500ml)',
    category: 'polish',
    price: 850,
    originalPrice: 950,
    brand: 'Cosmic',
    specs: '500ml Liquid Spray Bottle',
    descriptionUr: 'فوری اور آسان پالش۔ ٹرک کی کیبن اور گاڑی کے پینٹ کو چمکدار بنانے کے لیے ڈرائیورز کی پہلی پسند۔',
    descriptionEn: 'Easy-on easy-off liquid body polish delivering instant mirror gloss and anti-static dust shield.',
    imageUrl: createBottleSvg('#ec4899', '#db2777', 'COSMIC POLISH', 'SUPER LIQUID', '500ML BOTTLE'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 4.6,
  },
  {
    id: 'pol-3',
    nameUr: 'ڈیش بورڈ پروٹیکٹر اینڈ ٹائر شائن اسپرے (650ml)',
    nameEn: 'Flamingo Dashboard & Tyre Foam Shine (650ml)',
    category: 'polish',
    price: 750,
    originalPrice: 850,
    brand: 'Flamingo Care',
    specs: '650ml Heavy Aerosol Can',
    descriptionUr: 'ٹرک کے کیبن کے ڈیش بورڈ، چمڑے کی سیٹوں اور ٹائروں کو نکھارنے اور کالے رنگ کو نیا بنانے کے لیے۔',
    descriptionEn: 'Restores natural lustre and deep black gloss on tyres, vinyl dashboard, and rubber trims.',
    imageUrl: createBottleSvg('#64748b', '#0f172a', 'TYRE & DASH', 'FOAM SHINE', '650ML SPRAY'),
    isPopular: true,
    stockStatus: 'in_stock',
    rating: 4.7,
  },
  {
    id: 'pol-4',
    nameUr: 'ہیوی ڈیوٹی مائیکرو فائبر واشنگ و پالش کپڑا (3 پیک)',
    nameEn: 'Heavy Duty Microfiber Detailing Cloth (Pack of 3)',
    category: 'polish',
    price: 650,
    originalPrice: 750,
    brand: 'AutoCare',
    specs: '800 GSM Ultra Thick / 40x40cm',
    descriptionUr: 'بغیر کسی نشان یا اسکریچ کے پالش رگڑنے اور شیشہ صاف کرنے کے لیے موٹا مائیکرو فائبر کپڑا۔',
    descriptionEn: 'Ultra-plush scratch-free lint-free microfiber towels perfect for waxing, drying and buffing.',
    imageUrl: createFilterSvg('#a855f7', 'MICROFIBER', '800 GSM 3-PACK'),
    isPopular: false,
    stockStatus: 'in_stock',
    rating: 4.8,
  },
];
