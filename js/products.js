/* ============================================================
   LUXORA — Product data & icon artwork
   Each product renders as a minimal duotone line-illustration
   (no external images — keeps the repo dependency-free).
   ============================================================ */

/* ---------- Line-art icon library (viewBox 0 0 100 100) ---------- */
const ICONS = {
  dress: `<path d="M40 8 L36 22 L26 34 L22 90 L78 90 L74 34 L64 22 L60 8 Z M40 8 Q50 16 60 8 M36 22 Q50 30 64 22" stroke-linejoin="round"/>`,
  gown: `<path d="M42 6 L38 20 L30 30 L20 94 L80 94 L70 30 L62 20 L58 6 Z M38 20 Q50 28 62 20 M50 30 L50 60 M35 55 Q50 65 65 55" stroke-linejoin="round"/>`,
  coat: `<path d="M32 14 L20 26 L26 40 L26 92 L74 92 L74 40 L80 26 L68 14 L50 24 L32 14 Z M50 24 L50 92 M32 14 L38 92 M68 14 L62 92" stroke-linejoin="round"/>`,
  jacket: `<path d="M30 16 L18 28 L24 40 L24 88 L76 88 L76 40 L82 28 L70 16 L50 26 L30 16 Z M50 26 L50 46 M38 40 L38 88 M62 40 L62 88" stroke-linejoin="round"/>`,
  blazer: `<path d="M30 14 L18 26 L24 38 L24 90 L76 90 L76 38 L82 26 L70 14 L52 24 L48 24 L30 14 Z M48 24 L38 90 M52 24 L62 90 M40 50 L36 62 L42 60 Z" stroke-linejoin="round"/>`,
  shirt: `<path d="M36 12 L20 22 L26 36 L34 30 L34 90 L66 90 L66 30 L74 36 L80 22 L64 12 L56 18 L44 18 Z M44 18 Q50 24 56 18" stroke-linejoin="round"/>`,
  blouse: `<path d="M38 12 L22 22 L28 34 L36 28 L36 88 L64 88 L64 28 L72 34 L78 22 L62 12 L54 20 L46 20 Z M50 20 L50 40" stroke-linejoin="round"/>`,
  sweater: `<path d="M32 16 L18 26 L24 38 L32 32 L32 90 L68 90 L68 32 L76 38 L82 26 L68 16 L58 22 L42 22 Z M32 32 L68 32" stroke-linejoin="round"/>`,
  trousers: `<path d="M30 10 L28 92 L42 92 L50 40 L58 92 L72 92 L70 10 Z M30 10 L70 10 M30 24 L70 24" stroke-linejoin="round"/>`,
  skirt: `<path d="M34 14 L22 90 L78 90 L66 14 Z M34 14 L66 14 M40 14 L36 90 M60 14 L64 90" stroke-linejoin="round"/>`,
  vest: `<path d="M34 14 L22 24 L28 36 L34 30 L34 90 L66 90 L66 30 L72 36 L78 24 L66 14 L50 22 L34 14 Z" stroke-linejoin="round"/>`,
  bag: `<path d="M26 36 L26 88 L74 88 L74 36 Z M36 36 L36 22 Q36 10 50 10 Q64 10 64 22 L64 36 M26 50 L74 50" stroke-linejoin="round"/>`,
  crossbody: `<path d="M30 40 L30 84 L70 84 L70 40 Z M22 12 L40 40 M78 12 L60 40 M30 58 L70 58" stroke-linejoin="round"/>`,
  belt: `<path d="M10 50 L90 50 M40 32 L60 32 L64 50 L60 68 L40 68 L36 50 Z M46 42 L46 58 M54 42 L54 58" stroke-linejoin="round"/>`,
  sunglasses: `<path d="M18 42 Q18 34 30 34 L42 34 Q46 34 46 40 L46 52 Q46 60 34 60 Q22 60 22 50 Z M54 42 Q54 34 66 34 L78 34 Q82 34 82 40 L82 52 Q82 60 70 60 Q58 60 58 50 Z M46 40 L54 40 M18 40 L10 36 M82 40 L90 36" stroke-linejoin="round"/>`,
  watch: `<circle cx="50" cy="50" r="22"/><path d="M50 34 L50 50 L60 56 M42 12 L58 12 L58 28 L42 28 Z M42 72 L58 72 L58 88 L42 88 Z" stroke-linejoin="round"/>`,
  necklace: `<path d="M22 16 Q22 60 50 64 Q78 60 78 16 M50 64 L50 78" stroke-linejoin="round"/><circle cx="50" cy="82" r="8"/>`,
  earrings: `<circle cx="34" cy="24" r="6"/><path d="M34 30 L34 50 Q34 60 44 60" stroke-linejoin="round"/><circle cx="66" cy="24" r="6"/><path d="M66 30 L66 50 Q66 60 56 60" stroke-linejoin="round"/>`,
  scarf: `<path d="M14 30 Q50 10 86 30 Q70 40 50 34 Q30 40 14 30 Z M50 34 L44 90 M50 34 L56 90" stroke-linejoin="round"/>`,
  gloves: `<path d="M32 46 L32 20 Q32 14 37 14 Q42 14 42 20 L42 40 M42 38 L42 16 Q42 10 47 10 Q52 10 52 16 L52 40 M52 38 L52 18 Q52 12 57 12 Q62 12 62 18 L62 40 M62 40 L62 24 Q62 18 67 18 Q72 18 72 24 L72 48 L68 90 L36 90 L32 46 Q28 44 28 54 L30 66" stroke-linejoin="round"/>`,
  heel: `<path d="M14 66 Q14 54 30 50 L64 42 L64 30 Q64 24 70 24 L76 24 L76 40 L80 46 L84 78 L74 90 L18 90 Q10 90 14 80 Z" stroke-linejoin="round"/>`,
  sandal: `<path d="M14 78 Q14 84 22 84 L80 84 Q88 84 86 74 L78 40 L20 40 Z M30 40 L26 16 M50 40 L48 12 M68 40 L70 16" stroke-linejoin="round"/>`,
  sneaker: `<path d="M10 72 L10 82 Q10 88 18 88 L86 88 Q92 88 90 80 L86 70 Q78 66 70 68 L58 60 L28 44 L14 50 Q8 56 10 72 Z M28 44 L36 60 M46 40 L52 58 M58 60 L66 66" stroke-linejoin="round"/>`,
  loafer: `<path d="M8 68 Q8 58 22 56 L60 50 Q70 48 76 40 L84 44 L92 74 Q94 84 82 86 L18 86 Q8 86 8 76 Z M30 56 L36 68 L26 70 Z" stroke-linejoin="round"/>`,
  boot: `<path d="M32 10 L32 56 L20 66 Q10 72 12 82 Q14 88 24 88 L86 88 Q92 88 90 80 L84 60 L68 52 L68 10 Z M32 30 L68 30 M32 44 L68 44" stroke-linejoin="round"/>`,
  derby: `<path d="M10 70 Q10 60 24 58 L58 52 Q68 50 74 42 L84 46 L92 74 Q94 84 82 86 L16 86 Q8 86 10 76 Z M40 52 L44 62 M56 50 L58 60" stroke-linejoin="round"/>`,
  hat: `<ellipse cx="50" cy="72" rx="42" ry="8"/><path d="M28 72 Q28 30 50 26 Q72 30 72 72 M50 26 Q50 14 50 10" stroke-linejoin="round"/>`
};

function iconSVG(type, extra=''){
  const path = ICONS[type] || ICONS.dress;
  return `<svg viewBox="0 0 100 100" class="${extra}" aria-hidden="true">${path}</svg>`;
}

/* ---------- Category meta ---------- */
const CATEGORIES = {
  women:       { label:'Women',       icon:'dress',  blurb:'Tailoring & eveningwear cut for movement' },
  men:         { label:'Men',         icon:'blazer', blurb:'Considered menswear, quietly confident' },
  accessories: { label:'Accessories', icon:'bag',     blurb:'The finishing details' },
  footwear:    { label:'Footwear',    icon:'heel',    blurb:'Handlasted soles, city-ready' }
};

/* ---------- Products ---------- */
const PRODUCTS = [
  // WOMEN
  { id:'w1', name:'Silk Wrap Dress', category:'women', icon:'dress', price:248, tag:'New', rating:4.8, reviews:126, sizes:['XS','S','M','L','XL'], desc:'Cut from mulberry silk, this wrap dress falls in a soft bias drape and ties at the waist for a considered, adjustable fit. Finished with a hand-rolled hem.' },
  { id:'w2', name:'Tailored Wool Coat', category:'women', icon:'coat', price:498, tag:'Bestseller', rating:4.9, reviews:214, sizes:['XS','S','M','L','XL'], desc:'A double-breasted silhouette in Italian virgin wool, structured through the shoulder and cinched with a self-belt. Built to outlast the season.' },
  { id:'w3', name:'Pleated Midi Skirt', category:'women', icon:'skirt', price:168, tag:null, rating:4.6, reviews:88, sizes:['XS','S','M','L'], desc:'Knife-pleated satin-back crepe that catches the light with every step. Sits high at the waist with a concealed side zip.' },
  { id:'w4', name:'Cashmere Crewneck', category:'women', icon:'sweater', price:228, originalPrice:280, tag:'Sale', rating:4.7, reviews:302, sizes:['XS','S','M','L','XL'], desc:'Two-ply Mongolian cashmere, fully fashioned for a clean seam line. A wardrobe constant in a relaxed, easy fit.' },
  { id:'w5', name:'Linen Tailored Blazer', category:'women', icon:'blazer', price:312, tag:null, rating:4.5, reviews:64, sizes:['XS','S','M','L','XL'], desc:'Unstructured tailoring in washed linen, cut with soft shoulders and a single button closure for warm-weather layering.' },
  { id:'w6', name:'Satin Slip Blouse', category:'women', icon:'blouse', price:148, tag:'New', rating:4.4, reviews:41, sizes:['XS','S','M','L'], desc:'A fluid satin blouse with a bias-cut back and covered buttons — dresses up or down without trying too hard.' },
  { id:'w7', name:'Draped Evening Gown', category:'women', icon:'gown', price:612, tag:'Bestseller', rating:5.0, reviews:57, sizes:['XS','S','M','L'], desc:'Floor-length crepe gown with hand-draped bodice and a subtle train. Made to order in our Milan atelier.' },
  { id:'w8', name:'High-Waist Trousers', category:'women', icon:'trousers', price:198, tag:null, rating:4.6, reviews:133, sizes:['XS','S','M','L','XL'], desc:'Wide-leg trousers in a fluid wool blend with a fully lined waistband for an uninterrupted line.' },
  { id:'w9', name:'Quilted Puffer Jacket', category:'women', icon:'jacket', price:342, tag:null, rating:4.3, reviews:29, sizes:['XS','S','M','L','XL'], desc:'Lightweight down-fill puffer with a matte finish and stand collar. Warmth without the bulk.' },

  // MEN
  { id:'m1', name:'Merino Wool Sweater', category:'men', icon:'sweater', price:218, tag:null, rating:4.6, reviews:97, sizes:['S','M','L','XL','XXL'], desc:'Fine-gauge merino in a classic crewneck, engineered to layer cleanly under tailoring or worn alone.' },
  { id:'m2', name:'Tailored Suit Jacket', category:'men', icon:'blazer', price:528, tag:'Bestseller', rating:4.9, reviews:188, sizes:['S','M','L','XL','XXL'], desc:'Half-canvassed construction in a mid-weight wool twill, cut with a soft shoulder and nipped waist.' },
  { id:'m3', name:'Oxford Cotton Shirt', category:'men', icon:'shirt', price:128, tag:'New', rating:4.5, reviews:143, sizes:['S','M','L','XL','XXL'], desc:'A permanent-collar Oxford in long-staple cotton, garment-washed for a broken-in feel from the first wear.' },
  { id:'m4', name:'Slim Chino Trousers', category:'men', icon:'trousers', price:158, tag:null, rating:4.4, reviews:76, sizes:['S','M','L','XL'], desc:'A tapered chino in brushed cotton twill with a touch of stretch for all-day movement.' },
  { id:'m5', name:'Leather Bomber Jacket', category:'men', icon:'jacket', price:468, tag:null, rating:4.7, reviews:52, sizes:['S','M','L','XL'], desc:'Full-grain lambskin bomber with a quilted lining and ribbed hem — ages beautifully with wear.' },
  { id:'m6', name:'Cashmere Overcoat', category:'men', icon:'coat', price:598, tag:'Bestseller', rating:4.9, reviews:167, sizes:['S','M','L','XL','XXL'], desc:'A single-breasted overcoat in pure cashmere, cut long with a deep back vent for ease of movement.' },
  { id:'m7', name:'Linen Casual Shirt', category:'men', icon:'blouse', price:138, originalPrice:168, tag:'Sale', rating:4.3, reviews:39, sizes:['S','M','L','XL'], desc:'Relaxed-fit linen shirt with a camp collar, built for warm days and low-key evenings.' },
  { id:'m8', name:'Tailored Wool Trousers', category:'men', icon:'trousers', price:212, tag:null, rating:4.5, reviews:81, sizes:['S','M','L','XL','XXL'], desc:'Flat-front trousers in a fine wool suiting cloth with a clean, uncuffed hem.' },
  { id:'m9', name:'Quilted Gilet', category:'men', icon:'vest', price:188, tag:null, rating:4.2, reviews:34, sizes:['S','M','L','XL'], desc:'A packable quilted vest with a stand collar — the layer you reach for between seasons.' },

  // ACCESSORIES
  { id:'a1', name:'Structured Leather Tote', category:'accessories', icon:'bag', price:328, tag:'Bestseller', rating:4.8, reviews:201, sizes:['One Size'], desc:'Vegetable-tanned leather tote with a reinforced base and interior zip pocket. Develops a rich patina over time.' },
  { id:'a2', name:'Gold Chain Necklace', category:'accessories', icon:'necklace', price:198, tag:'New', rating:4.6, reviews:58, sizes:['One Size'], desc:'18k gold-vermeil curb chain, finished with a lobster clasp. Layers beautifully with finer chains.' },
  { id:'a3', name:'Silk Twill Scarf', category:'accessories', icon:'scarf', price:118, tag:null, rating:4.5, reviews:73, sizes:['One Size'], desc:'Hand-rolled edges on printed silk twill — a signature finishing piece for bag, neck, or hair.' },
  { id:'a4', name:'Tortoiseshell Sunglasses', category:'accessories', icon:'sunglasses', price:168, tag:null, rating:4.4, reviews:112, sizes:['One Size'], desc:'Acetate frames in a classic tortoiseshell finish with polarised UV400 lenses.' },
  { id:'a5', name:'Structured Crossbody Bag', category:'accessories', icon:'crossbody', price:248, tag:null, rating:4.6, reviews:64, sizes:['One Size'], desc:'A compact crossbody in pebbled leather with an adjustable strap and magnetic flap closure.' },
  { id:'a6', name:'Pearl Drop Earrings', category:'accessories', icon:'earrings', price:148, tag:'New', rating:4.7, reviews:45, sizes:['One Size'], desc:'Freshwater pearls suspended from polished gold-vermeil hooks — a quiet everyday luxury.' },
  { id:'a7', name:'Full-Grain Leather Belt', category:'accessories', icon:'belt', price:98, tag:null, rating:4.5, reviews:99, sizes:['S','M','L'], desc:'A 3.5cm belt in full-grain leather with a solid brass buckle, built to be resoled and re-strapped for years.' },
  { id:'a8', name:'Classic Analog Watch', category:'accessories', icon:'watch', price:412, tag:'Bestseller', rating:4.9, reviews:156, sizes:['One Size'], desc:'A 38mm stainless case with sapphire crystal and a hand-stitched leather strap. Swiss movement.' },
  { id:'a9', name:'Cashmere Gloves', category:'accessories', icon:'gloves', price:88, originalPrice:110, tag:'Sale', rating:4.3, reviews:27, sizes:['S','M','L'], desc:'Lined cashmere gloves with a ribbed cuff — the last accessory you put on before the door.' },

  // FOOTWEAR
  { id:'f1', name:'Pointed Leather Heels', category:'footwear', icon:'heel', price:268, tag:'Bestseller', rating:4.7, reviews:178, sizes:['36','37','38','39','40'], desc:'A 75mm heel in supple nappa leather with a pointed toe and cushioned footbed for all-day wear.' },
  { id:'f2', name:'Suede Ankle Boots', category:'footwear', icon:'boot', price:298, tag:null, rating:4.6, reviews:92, sizes:['36','37','38','39','40','41'], desc:'Block-heel ankle boots in brushed suede with a side zip and stacked leather heel.' },
  { id:'f3', name:'Minimalist Leather Sneakers', category:'footwear', icon:'sneaker', price:218, tag:'New', rating:4.5, reviews:61, sizes:['38','39','40','41','42','43'], desc:'A low-profile sneaker in smooth calfskin with a natural rubber sole — dressed down, never sloppy.' },
  { id:'f4', name:'Woven Leather Loafers', category:'footwear', icon:'loafer', price:248, tag:null, rating:4.6, reviews:84, sizes:['39','40','41','42','43','44'], desc:'Hand-woven leather uppers on a flexible leather sole. Slips on, stays on.' },
  { id:'f5', name:'Strappy Heeled Sandals', category:'footwear', icon:'sandal', price:188, tag:null, rating:4.3, reviews:38, sizes:['36','37','38','39','40'], desc:'Fine leather straps and an adjustable ankle buckle on a sculpted 60mm heel.' },
  { id:'f6', name:'Chelsea Boots', category:'footwear', icon:'boot', price:312, tag:'Bestseller', rating:4.8, reviews:141, sizes:['39','40','41','42','43','44'], desc:'Elastic-gusset Chelsea boots in burnished leather with a Goodyear-welted sole for resoling.' },
  { id:'f7', name:'Espadrille Wedges', category:'footwear', icon:'sandal', price:158, originalPrice:190, tag:'Sale', rating:4.2, reviews:47, sizes:['36','37','38','39','40'], desc:'Jute-wrapped wedge sandals in canvas with an ankle tie — warm-weather essential.' },
  { id:'f8', name:'Classic Derby Shoes', category:'footwear', icon:'derby', price:228, tag:null, rating:4.5, reviews:69, sizes:['40','41','42','43','44','45'], desc:'Open-laced derbies in polished calfskin with a leather sole and stitched welt.' },
  { id:'f9', name:'Knee-High Leather Boots', category:'footwear', icon:'boot', price:348, tag:'New', rating:4.7, reviews:53, sizes:['36','37','38','39','40'], desc:'A close-fitting knee-high boot in stretch leather with a stacked block heel and inside zip.' }
];

function getProduct(id){ return PRODUCTS.find(p => p.id === id); }
function related(product, n=4){
  return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, n);
}
