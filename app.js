/* ============================================================
   LUXORA — App logic
   In-memory state only (no localStorage) — SPA hash routing
   keeps cart state alive across "pages" without reloads.
   ============================================================ */

/* ---------- State ---------- */
const state = {
  cart: [],               // { id, size, qty }
  wishlist: new Set(),
  route: '#/',
  shop: { category:'all', sort:'featured', maxPrice:650, tags:new Set() },
  pd: { size:null, qty:1, tab:'details', thumb:0 },
  promo: { applied:false, code:'' }
};

const SHIPPING = 14;
const TAX_RATE = 0.07;

/* ---------- Helpers ---------- */
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const fmt = n => `$${n.toFixed(2)}`;
const byId = id => document.getElementById(id);

function cartLines(){
  return state.cart.map(l => ({...l, product: getProduct(l.id)})).filter(l => l.product);
}
function cartCount(){ return state.cart.reduce((n,l) => n + l.qty, 0); }
function cartSubtotal(){ return cartLines().reduce((s,l) => s + l.product.price * l.qty, 0); }

function addToCart(id, size, qty=1){
  const existing = state.cart.find(l => l.id === id && l.size === size);
  if(existing){ existing.qty += qty; }
  else{ state.cart.push({ id, size, qty }); }
  refreshCartUI();
  showToast(`${getProduct(id).name} added to bag`);
  pulseCartBadge();
}
function removeFromCart(id, size){
  state.cart = state.cart.filter(l => !(l.id === id && l.size === size));
  refreshCartUI();
  if(state.route === '#/cart') renderCartView();
}
function setQty(id, size, qty){
  const line = state.cart.find(l => l.id === id && l.size === size);
  if(!line) return;
  line.qty = Math.max(1, qty);
  refreshCartUI();
  if(state.route === '#/cart') renderCartView();
}

function refreshCartUI(){
  const count = cartCount();
  $$('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  });
  renderDrawer();
}
function pulseCartBadge(){
  $$('.cart-count').forEach(el => { el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); });
}

/* ---------- Toast ---------- */
function showToast(msg){
  const region = byId('toast-region');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M5 13l4 4L19 7"/></svg><span>${msg}</span>`;
  region.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(()=>el.remove(), 400); }, 2600);
}

/* ---------- Cart Drawer ---------- */
function renderDrawer(){
  const body = byId('drawer-body');
  const foot = byId('drawer-foot');
  const lines = cartLines();
  if(lines.length === 0){
    body.innerHTML = `<div class="drawer-empty"><p>Your bag is empty.</p></div>`;
    foot.innerHTML = `<a href="#/shop" class="btn btn-outline btn-block" onclick="closeDrawer()"><span>Continue shopping</span></a>`;
    return;
  }
  body.innerHTML = lines.map(l => `
    <div class="drawer-item">
      <div class="thumb">${iconSVG(l.product.icon)}</div>
      <div>
        <div class="name">${l.product.name}</div>
        <div class="meta">Size ${l.size} &middot; Qty ${l.qty}</div>
        <div class="price">${fmt(l.product.price * l.qty)}</div>
      </div>
      <button class="btn-icon" title="Remove" onclick="removeFromCart('${l.id}','${l.size}')">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>`).join('');
  foot.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${fmt(cartSubtotal())}</span></div>
    <a href="#/checkout" class="btn btn-block" style="margin-top:14px" onclick="closeDrawer()"><span>Checkout</span></a>
    <a href="#/cart" class="btn btn-outline btn-block" style="margin-top:10px" onclick="closeDrawer()"><span>View bag</span></a>`;
}
function openDrawer(){ byId('cart-drawer').classList.add('open'); byId('drawer-overlay').classList.add('open'); }
function closeDrawer(){ byId('cart-drawer').classList.remove('open'); byId('drawer-overlay').classList.remove('open'); }

/* ============================================================
   ICON ART for hero / brand story
   ============================================================ */
function heroArt(){
  return `<svg viewBox="0 0 100 100" class="hero-silhouette-svg" aria-hidden="true">
    <path d="M40 8 L36 22 L26 34 L22 90 L78 90 L74 34 L64 22 L60 8 Z M40 8 Q50 16 60 8 M36 22 Q50 30 64 22"
      fill="none" stroke="#d4af6a" stroke-width="0.6" opacity="0.9"/>
  </svg>`;
}

/* ============================================================
   PRODUCT CARD
   ============================================================ */
function productCardHTML(p){
  const wished = state.wishlist.has(p.id);
  return `
  <article class="product-card">
    <div class="thumb" onclick="navigate('#/product/${p.id}')">
      ${p.tag ? `<span class="tag ${p.tag.toLowerCase()}">${p.tag}</span>` : ''}
      <button class="wish ${wished?'active':''}" onclick="event.stopPropagation(); toggleWish('${p.id}', this)" title="Save">
        <svg viewBox="0 0 24 24" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4.5 5.6 4A5.6 5.6 0 0112 7.3 5.6 5.6 0 0118.4 4C22 4.5 23.6 8 22 11.7 19.5 16.4 12 21 12 21z"/></svg>
      </button>
      <div class="art">${iconSVG(p.icon)}</div>
      <div class="quickadd">
        <button onclick="event.stopPropagation(); quickAdd('${p.id}')">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" fill="none" width="14" height="14"><path d="M6 2l1.5 4M18 2l-1.5 4M3 8h18l-2 11H5L3 8zM9 12v4M15 12v4"/></svg>
          Quick add
        </button>
      </div>
    </div>
    <a href="#/product/${p.id}" class="cat-label">${CATEGORIES[p.category].label}</a>
    <a href="#/product/${p.id}" class="name">${p.name}</a>
    <div class="price-row">
      <span class="price">${fmt(p.price)}</span>
      ${p.originalPrice ? `<span class="price old">${fmt(p.originalPrice)}</span>` : ''}
    </div>
  </article>`;
}
function toggleWish(id, btn){
  if(state.wishlist.has(id)){ state.wishlist.delete(id); btn.classList.remove('active'); }
  else{ state.wishlist.add(id); btn.classList.add('active'); showToast('Saved to wishlist'); }
}
function quickAdd(id){
  const p = getProduct(id);
  addToCart(id, p.sizes[Math.floor(p.sizes.length/2)], 1);
}

/* ============================================================
   HOME VIEW
   ============================================================ */
function renderHome(){
  const newArrivals = PRODUCTS.filter(p => p.tag === 'New').slice(0,8);
  const bestsellers = PRODUCTS.filter(p => p.tag === 'Bestseller').slice(0,6);

  byId('view-home').innerHTML = `
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <span class="eyebrow hero-eyebrow">Autumn / Winter Collection</span>
        <h1 class="display">
          <span class="hero-line"><span>Tailored for</span></span>
          <span class="hero-line"><span>the <em>modern</em> muse.</span></span>
        </h1>
        <p class="hero-sub">Considered clothing and accessories, cut from honest materials and finished by hand. Luxora is fashion built to be worn, not just owned.</p>
        <div class="hero-cta">
          <a href="#/shop" class="btn btn-light"><span>Shop the collection</span></a>
          <a href="#/about" class="btn-icon" title="Our story" style="border-color:rgba(246,241,231,.4)">
            <svg viewBox="0 0 24 24" stroke="#f6f1e7" stroke-width="1.4" fill="none"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
      <div class="hero-scroll"><span class="dash"></span> Scroll to explore</div>
    </section>

    <div class="marquee"><div class="marquee-track">
      ${'<span>New Season</span><span>Free Shipping Over $150</span><span>Handcrafted Details</span><span>30-Day Returns</span>'.repeat(2)}
    </div></div>

    <section class="section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="txt">
            <span class="eyebrow">Shop by category</span>
            <h2 class="display">Find your silhouette</h2>
          </div>
        </div>
        <div class="cat-grid reveal-stagger">
          ${Object.entries(CATEGORIES).map(([key,c]) => `
            <a href="#/shop/${key}" class="cat-card">
              <div class="cat-bg" style="background:${catGradient(key)}"></div>
              <div class="cat-icon">${iconSVG(c.icon)}</div>
              <div>
                <h3>${c.label}</h3>
                <span class="cat-count">${PRODUCTS.filter(p=>p.category===key).length} pieces</span>
              </div>
              <span class="cat-arrow"><svg viewBox="0 0 24 24" stroke-width="1.6" fill="none"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
            </a>`).join('')}
        </div>
      </div>
    </section>

    <section class="section section-tight">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="txt">
            <span class="eyebrow">Just landed</span>
            <h2 class="display">New arrivals</h2>
          </div>
          <a href="#/shop" class="btn btn-outline"><span>View all</span></a>
        </div>
        <div class="rail-scroll reveal">
          ${newArrivals.map(p => productCardHTML(p)).join('')}
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="wrap split">
        <div class="visual reveal">${iconSVG('coat')}</div>
        <div class="reveal">
          <span class="eyebrow">Since 2014</span>
          <h2 class="display" style="margin-top:16px">Made slowly,<br/>on purpose.</h2>
          <p class="lede" style="margin-top:22px">Every Luxora piece begins with a fabric we'd wear ourselves. We work with a small circle of ateliers in Italy and Portugal who still cut, stitch and finish by hand — because speed was never the point.</p>
          <svg class="stitch" viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M0 7 L300 7"/></svg>
          <div class="stat-row">
            <div class="stat"><b>11</b><span>Years crafting</span></div>
            <div class="stat"><b>48</b><span>Artisan partners</span></div>
            <div class="stat"><b>120k</b><span>Pieces homed</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-tight">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="txt">
            <span class="eyebrow">Client favourites</span>
            <h2 class="display">Bestsellers</h2>
          </div>
        </div>
        <div class="product-grid reveal-stagger">
          ${bestsellers.map(p => productCardHTML(p)).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="testi-wrap reveal" id="testi-wrap">
          <span class="eyebrow" style="justify-content:center">In their words</span>
          <div class="testi-track" style="margin-top:26px"></div>
          <div class="testi-dots"></div>
        </div>
      </div>
    </section>

    <section class="section section-plum">
      <div class="wrap newsletter reveal">
        <span class="eyebrow" style="justify-content:center">Stay in the loop</span>
        <h2 class="display" style="margin-top:16px">Join the Luxora list</h2>
        <p class="lede" style="margin-top:14px">Early access to new collections and private sales. No noise, just the good stuff.</p>
        <form class="newsletter-form" onsubmit="handleNewsletter(event)">
          <input type="email" placeholder="Your email address" required />
          <button type="submit"><span>Subscribe</span>
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" fill="none" width="14" height="14"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </form>
        <p class="newsletter-note">By subscribing you agree to our Privacy Policy.</p>
        <p class="newsletter-success" id="news-success">You're on the list — welcome to Luxora.</p>
      </div>
    </section>
  `;
  mountTestimonials();
  observeReveals(byId('view-home'));
}

function catGradient(key){
  const map = {
    women: 'linear-gradient(155deg, #4a2c3a, #1c1512)',
    men: 'linear-gradient(155deg, #1c1512, #33202b)',
    accessories: 'linear-gradient(155deg, #b68a4e, #33202b)',
    footwear: 'linear-gradient(155deg, #33202b, #1c1512 70%)'
  };
  return map[key] || map.women;
}

const TESTIMONIALS = [
  { quote:'The wool coat still looks new after two winters of daily wear. That is the whole pitch, honestly.', who:'Amara O. — Verified buyer' },
  { quote:'I have never had a brand nail sizing this consistently across categories. Every order fits first try.', who:'Daniyal K. — Verified buyer' },
  { quote:'Understated in the best way. My Luxora pieces are the ones I reach for when I actually want to look put together.', who:'Farah S. — Verified buyer' }
];
let testiIndex = 0, testiTimer = null;
function mountTestimonials(){
  const track = $('.testi-track');
  if(!track) return;
  track.innerHTML = TESTIMONIALS.map((t,i) => `
    <div class="testi-slide ${i===0?'active':''}" data-i="${i}">
      <p>&ldquo;${t.quote}&rdquo;</p>
      <div class="who">${t.who}</div>
    </div>`).join('');
  const dots = $('.testi-dots');
  dots.innerHTML = TESTIMONIALS.map((_,i) => `<button class="${i===0?'active':''}" onclick="setTesti(${i})"></button>`).join('');
  clearInterval(testiTimer);
  testiTimer = setInterval(() => setTesti((testiIndex+1) % TESTIMONIALS.length), 5000);
}
function setTesti(i){
  testiIndex = i;
  $$('.testi-slide').forEach((el,idx) => el.classList.toggle('active', idx===i));
  $$('.testi-dots button').forEach((el,idx) => el.classList.toggle('active', idx===i));
}
function handleNewsletter(e){
  e.preventDefault();
  byId('news-success').classList.add('show');
  e.target.reset();
}

/* ============================================================
   SHOP VIEW
   ============================================================ */
function renderShop(category){
  state.shop.category = category || 'all';
  byId('view-shop').innerHTML = `
    <div class="page-head">
      <div class="wrap in">
        <div class="breadcrumb"><a href="#/">Home</a> &nbsp;/&nbsp; Shop</div>
        <h1 class="display" id="shop-title">All Products</h1>
      </div>
    </div>
    <section class="section section-tight">
      <div class="wrap shop-layout">
        <aside class="filters">
          <div class="filter-group">
            <h4>Category</h4>
            <div id="filter-cats"></div>
          </div>
          <div class="filter-group">
            <h4>Highlights</h4>
            <div id="filter-tags"></div>
          </div>
          <div class="filter-group" style="border-bottom:none">
            <h4>Max price: <span id="price-out">$650</span></h4>
            <div class="price-range">
              <input type="range" min="80" max="650" value="650" id="price-slider" oninput="onPriceChange(this.value)"/>
            </div>
          </div>
          <button class="clear-filters" onclick="clearFilters()">Clear all filters</button>
        </aside>
        <div>
          <div class="chip-row" id="chip-row"></div>
          <div class="shop-toolbar">
            <span class="result-count" id="result-count"></span>
            <select class="sort-select" id="sort-select" onchange="onSortChange(this.value)">
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div class="product-grid" id="shop-grid"></div>
        </div>
      </div>
    </section>
  `;
  renderFilters();
  applyShopFilters();
}
function renderFilters(){
  const catsEl = byId('filter-cats');
  catsEl.innerHTML = ['all', ...Object.keys(CATEGORIES)].map(key => {
    const label = key === 'all' ? 'All Products' : CATEGORIES[key].label;
    const count = key === 'all' ? PRODUCTS.length : PRODUCTS.filter(p=>p.category===key).length;
    return `<label class="filter-check">
      <input type="radio" name="cat" ${state.shop.category===key?'checked':''} onchange="setShopCategory('${key}')"/>
      <span class="box"></span><span class="lbl">${label}</span><span class="count">${count}</span>
    </label>`;
  }).join('');

  const tagsEl = byId('filter-tags');
  ['New','Bestseller','Sale'].forEach(()=>{});
  tagsEl.innerHTML = ['New','Bestseller','Sale'].map(tag => `
    <label class="filter-check">
      <input type="checkbox" ${state.shop.tags.has(tag)?'checked':''} onchange="toggleTag('${tag}')"/>
      <span class="box"></span><span class="lbl">${tag}</span>
    </label>`).join('');
}
function setShopCategory(key){ state.shop.category = key; navigate(key==='all' ? '#/shop' : `#/shop/${key}`, true); applyShopFilters(true); }
function toggleTag(tag){
  if(state.shop.tags.has(tag)) state.shop.tags.delete(tag); else state.shop.tags.add(tag);
  applyShopFilters();
}
function onPriceChange(v){ state.shop.maxPrice = Number(v); byId('price-out').textContent = `$${v}`; applyShopFilters(); }
function onSortChange(v){ state.shop.sort = v; applyShopFilters(); }
function clearFilters(){
  state.shop = { category:'all', sort:'featured', maxPrice:650, tags:new Set() };
  navigate('#/shop', true);
  renderFilters();
  byId('price-slider').value = 650;
  byId('price-out').textContent = '$650';
  byId('sort-select').value = 'featured';
  applyShopFilters(true);
}
function applyShopFilters(skipFilterRerender){
  let list = PRODUCTS.slice();
  if(state.shop.category !== 'all') list = list.filter(p => p.category === state.shop.category);
  if(state.shop.tags.size) list = list.filter(p => p.tag && state.shop.tags.has(p.tag));
  list = list.filter(p => p.price <= state.shop.maxPrice);
  switch(state.shop.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
  }
  byId('shop-title').textContent = state.shop.category==='all' ? 'All Products' : CATEGORIES[state.shop.category].label;
  byId('result-count').textContent = `${list.length} product${list.length!==1?'s':''}`;
  byId('shop-grid').innerHTML = list.length ? list.map(p=>productCardHTML(p)).join('') : `
    <div class="empty-state" style="grid-column:1/-1">
      <h3 class="display">No pieces match yet</h3>
      <p>Try widening your filters or clearing them.</p>
      <button class="btn btn-outline" onclick="clearFilters()"><span>Clear filters</span></button>
    </div>`;

  byId('chip-row').innerHTML = ['all', ...Object.keys(CATEGORIES)].map(key => `
    <button class="chip ${state.shop.category===key?'active':''}" onclick="setShopCategory('${key}')">
      ${key==='all' ? 'All' : CATEGORIES[key].label}
    </button>`).join('');
  if(!skipFilterRerender) renderFilters();
}

/* ============================================================
   PRODUCT DETAIL VIEW
   ============================================================ */
function renderProduct(id){
  const p = getProduct(id);
  if(!p){ navigate('#/shop'); return; }
  state.pd = { size:null, qty:1, tab:'details', thumb:0 };
  const stars = Array.from({length:5}, (_,i) => `<svg viewBox="0 0 20 20"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6L10 1z" ${i < Math.round(p.rating) ? '' : 'fill="none" stroke="var(--gold)" stroke-width="1"'}/></svg>`).join('');

  byId('view-product').innerHTML = `
    <div class="page-head" style="padding-bottom:0">
      <div class="wrap in">
        <div class="breadcrumb"><a href="#/">Home</a> / <a href="#/shop/${p.category}">${CATEGORIES[p.category].label}</a> / ${p.name}</div>
      </div>
    </div>
    <section class="section section-tight">
      <div class="wrap pd-layout">
        <div>
          <div class="pd-gallery-main" id="pd-main">${iconSVG(p.icon)}</div>
          <div class="pd-thumbs">
            ${[0,1,2].map(i => `<button class="${i===0?'active':''}" onclick="setPdThumb(${i}, this)">${iconSVG(p.icon)}</button>`).join('')}
          </div>
        </div>
        <div class="pd-info reveal">
          <span class="cat-label">${CATEGORIES[p.category].label}${p.tag ? ' &middot; ' + p.tag : ''}</span>
          <h1 class="display">${p.name}</h1>
          <div class="pd-rating">
            <span class="stars">${stars}</span>
            <span class="count">${p.rating.toFixed(1)} (${p.reviews} reviews)</span>
          </div>
          <div class="pd-price">
            ${fmt(p.price)}
            ${p.originalPrice ? `<span class="old">${fmt(p.originalPrice)}</span>` : ''}
          </div>
          <p class="lede pd-desc">${p.desc}</p>

          <div class="pd-select-row">
            <h4>Size <span id="size-req" style="color:var(--error);font-weight:400;text-transform:none;letter-spacing:0"></span></h4>
            <div class="size-grid" id="size-grid">
              ${p.sizes.map(s => `<button class="size-opt" onclick="setPdSize('${s}', this)">${s}</button>`).join('')}
            </div>
          </div>

          <div class="pd-select-row">
            <h4>Quantity</h4>
            <div class="qty-stepper">
              <button onclick="stepPdQty(-1)">−</button>
              <span id="pd-qty">1</span>
              <button onclick="stepPdQty(1)">+</button>
            </div>
          </div>

          <div class="pd-actions">
            <button class="btn btn-block" onclick="handleAddToCart('${p.id}')"><span>
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" fill="none" width="15" height="15"><path d="M6 2l1.5 4M18 2l-1.5 4M3 8h18l-2 11H5L3 8zM9 12v4M15 12v4"/></svg>
              Add to bag
            </span></button>
            <button class="btn-icon" onclick="toggleWish('${p.id}', this)" title="Save">
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" fill="none"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4.5 5.6 4A5.6 5.6 0 0112 7.3 5.6 5.6 0 0118.4 4C22 4.5 23.6 8 22 11.7 19.5 16.4 12 21 12 21z"/></svg>
            </button>
          </div>
          <div class="added-flash" id="added-flash">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" width="16" height="16"><path d="M5 13l4 4L19 7"/></svg>
            Added to your bag
          </div>

          <ul class="pd-meta-list">
            <li><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M3 12l6 6L21 6"/></svg> Free shipping on orders over $150</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M3 12l6 6L21 6"/></svg> 30-day returns, no questions asked</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M3 12l6 6L21 6"/></svg> Handcrafted in small batches</li>
          </ul>

          <div class="pd-tabs">
            <div class="tab-btns">
              <button class="active" onclick="setPdTab('details', this)">Details</button>
              <button onclick="setPdTab('shipping', this)">Shipping</button>
              <button onclick="setPdTab('care', this)">Care</button>
            </div>
            <div class="tab-panel active" data-tab="details">${p.desc} Composition and fit are consistent across sizes; please refer to the size grid above for measurements.</div>
            <div class="tab-panel" data-tab="shipping">Orders placed before 2pm ship the same day. Standard delivery takes 3–5 business days; express options are available at checkout. This is a demo store — no real orders are processed.</div>
            <div class="tab-panel" data-tab="care">Dry clean recommended for structured pieces. Knitwear should be hand-washed cold and dried flat. Store on padded hangers to preserve shoulder shape.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-tight">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="txt"><span class="eyebrow">You may also like</span><h2 class="display">Complete the look</h2></div>
        </div>
        <div class="rail-scroll reveal">
          ${related(p).map(rp => productCardHTML(rp)).join('')}
        </div>
      </div>
    </section>
  `;
  observeReveals(byId('view-product'));
  window.scrollTo({top:0, behavior:'instant'});
}
function setPdThumb(i, el){ $$('.pd-thumbs button').forEach(b=>b.classList.remove('active')); el.classList.add('active'); }
function setPdSize(s, el){
  state.pd.size = s;
  $$('#size-grid .size-opt').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  byId('size-req').textContent = '';
}
function stepPdQty(d){
  state.pd.qty = Math.max(1, state.pd.qty + d);
  byId('pd-qty').textContent = state.pd.qty;
}
function setPdTab(tab, el){
  $$('.tab-btns button').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  $$('.tab-panel').forEach(p=>p.classList.toggle('active', p.dataset.tab===tab));
}
function handleAddToCart(id){
  if(!state.pd.size){
    byId('size-req').textContent = '— please select a size';
    byId('size-grid').scrollIntoView({block:'center', behavior:'smooth'});
    return;
  }
  addToCart(id, state.pd.size, state.pd.qty);
  const flash = byId('added-flash');
  flash.classList.add('show');
  setTimeout(()=>flash.classList.remove('show'), 2200);
}

/* ============================================================
   CART VIEW
   ============================================================ */
function renderCartView(){
  const lines = cartLines();
  const sub = cartSubtotal();
  const discount = state.promo.applied ? sub * 0.1 : 0;
  const shipping = lines.length ? (sub - discount >= 150 ? 0 : SHIPPING) : 0;
  const tax = (sub - discount) * TAX_RATE;
  const total = sub - discount + shipping + tax;

  byId('view-cart').innerHTML = `
    <div class="page-head">
      <div class="wrap in">
        <div class="breadcrumb"><a href="#/">Home</a> / Shopping Bag</div>
        <h1 class="display">Your Bag</h1>
      </div>
    </div>
    <section class="section section-tight">
      <div class="wrap">
        ${lines.length === 0 ? `
          <div class="empty-state">
            <h3 class="display">Your bag is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <a href="#/shop" class="btn"><span>Start shopping</span></a>
          </div>` : `
          <div class="cart-layout">
            <div id="cart-items">
              ${lines.map(l => `
                <div class="cart-item">
                  <div class="thumb">${iconSVG(l.product.icon)}</div>
                  <div>
                    <a href="#/product/${l.product.id}" class="name">${l.product.name}</a>
                    <div class="meta">${CATEGORIES[l.product.category].label} &middot; Size ${l.size}</div>
                    <div class="price">${fmt(l.product.price)}</div>
                  </div>
                  <div class="right-col">
                    <div class="qty-stepper">
                      <button onclick="setQty('${l.id}','${l.size}', ${l.qty-1})">−</button>
                      <span>${l.qty}</span>
                      <button onclick="setQty('${l.id}','${l.size}', ${l.qty+1})">+</button>
                    </div>
                    <button class="remove" onclick="removeFromCart('${l.id}','${l.size}')">Remove</button>
                  </div>
                </div>`).join('')}
            </div>
            <div class="summary-card">
              <h3 class="display" style="font-size:20px;margin-bottom:20px">Order Summary</h3>
              <div class="promo-row">
                <input type="text" placeholder="Promo code (try LUXORA10)" id="promo-input" value="${state.promo.code}"/>
                <button onclick="applyPromo()">Apply</button>
              </div>
              <div class="promo-msg ${state.promo.applied?'ok':''}" id="promo-msg">${state.promo.applied ? 'LUXORA10 applied — 10% off' : ''}</div>
              <div class="summary-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
              ${discount>0 ? `<div class="summary-row"><span>Discount</span><span>−${fmt(discount)}</span></div>` : ''}
              <div class="summary-row"><span>Shipping</span><span>${shipping===0?'Free':fmt(shipping)}</span></div>
              <div class="summary-row"><span>Estimated tax</span><span>${fmt(tax)}</span></div>
              <div class="summary-row total"><span>Total</span><span>${fmt(total)}</span></div>
              <a href="#/checkout" class="btn btn-block" style="margin-top:22px"><span>Proceed to checkout</span></a>
              <a href="#/shop" class="btn btn-outline btn-block" style="margin-top:12px"><span>Continue shopping</span></a>
            </div>
          </div>`}
      </div>
    </section>
  `;
}
function applyPromo(){
  const val = byId('promo-input').value.trim().toUpperCase();
  const msg = byId('promo-msg');
  if(val === 'LUXORA10'){
    state.promo = { applied:true, code:val };
    msg.textContent = 'LUXORA10 applied — 10% off';
    msg.className = 'promo-msg ok';
  } else {
    state.promo = { applied:false, code:val };
    msg.textContent = 'That code is not valid';
    msg.className = 'promo-msg err';
  }
  renderCartView();
}

/* ============================================================
   CHECKOUT VIEW
   ============================================================ */
function renderCheckout(){
  const lines = cartLines();
  if(lines.length === 0 && !state.orderPlaced){
    byId('view-checkout').innerHTML = `
      <section class="section" style="padding-top:calc(var(--nav-h) + 60px)">
        <div class="wrap empty-state">
          <h3 class="display">Nothing to check out</h3>
          <p>Add a few pieces to your bag first.</p>
          <a href="#/shop" class="btn"><span>Shop the collection</span></a>
        </div>
      </section>`;
    return;
  }
  const sub = cartSubtotal();
  const discount = state.promo.applied ? sub * 0.1 : 0;
  const shipping = sub - discount >= 150 ? 0 : SHIPPING;
  const tax = (sub - discount) * TAX_RATE;
  const total = sub - discount + shipping + tax;

  byId('view-checkout').innerHTML = `
    <div class="page-head">
      <div class="wrap in">
        <div class="breadcrumb"><a href="#/">Home</a> / <a href="#/cart">Bag</a> / Checkout</div>
        <h1 class="display">Checkout</h1>
      </div>
    </div>
    <section class="section section-tight">
      <div class="wrap">
        <div class="co-steps">
          <div class="co-step active"><div class="num">1</div><span>Shipping</span></div>
          <div class="co-step"><div class="num">2</div><span>Payment</span></div>
          <div class="co-step"><div class="num">3</div><span>Review</span></div>
        </div>
        <div class="checkout-layout">
          <form id="checkout-form" novalidate onsubmit="placeOrder(event)">
            <div class="form-section">
              <h4>Contact & Shipping</h4>
              <div class="form-grid">
                <div class="form-field"><label>Full name</label><input name="fullname" required/><span class="err-msg"></span></div>
                <div class="form-field"><label>Email</label><input type="email" name="email" required/><span class="err-msg"></span></div>
                <div class="form-field full"><label>Address</label><input name="address" required/><span class="err-msg"></span></div>
                <div class="form-field"><label>City</label><input name="city" required/><span class="err-msg"></span></div>
                <div class="form-field"><label>Postal code</label><input name="postal" required/><span class="err-msg"></span></div>
                <div class="form-field full"><label>Country</label>
                  <select name="country">
                    <option>Pakistan</option><option>United States</option><option>United Kingdom</option>
                    <option>United Arab Emirates</option><option>Canada</option><option>Australia</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="form-section">
              <h4>Payment details <span style="color:var(--ink-45);font-weight:400;text-transform:none;letter-spacing:0">(demo — no real charge)</span></h4>
              <div class="form-grid">
                <div class="form-field full"><label>Card number</label><input name="card" placeholder="4242 4242 4242 4242" required/><span class="err-msg"></span></div>
                <div class="form-field"><label>Expiry (MM/YY)</label><input name="expiry" placeholder="08/29" required/><span class="err-msg"></span></div>
                <div class="form-field"><label>CVC</label><input name="cvc" placeholder="123" required/><span class="err-msg"></span></div>
              </div>
            </div>
            <div class="co-footer-nav">
              <a href="#/cart" class="back-link">← Back to bag</a>
              <button type="submit" class="btn"><span>Place order — ${fmt(total)}</span></button>
            </div>
          </form>
          <div class="summary-card">
            <h3 class="display" style="font-size:20px;margin-bottom:20px">Order Summary</h3>
            ${lines.map(l => `
              <div style="display:flex;justify-content:space-between;gap:10px;font-size:13px;padding:9px 0;border-bottom:1px solid var(--line)">
                <span>${l.product.name} &times;${l.qty} <span style="color:var(--ink-45)">(${l.size})</span></span>
                <span>${fmt(l.product.price*l.qty)}</span>
              </div>`).join('')}
            <div class="summary-row" style="margin-top:10px"><span>Subtotal</span><span>${fmt(sub)}</span></div>
            ${discount>0 ? `<div class="summary-row"><span>Discount</span><span>−${fmt(discount)}</span></div>` : ''}
            <div class="summary-row"><span>Shipping</span><span>${shipping===0?'Free':fmt(shipping)}</span></div>
            <div class="summary-row"><span>Estimated tax</span><span>${fmt(tax)}</span></div>
            <div class="summary-row total"><span>Total</span><span>${fmt(total)}</span></div>
          </div>
        </div>
      </div>
    </section>
  `;
}
function validateField(input){
  const wrap = input.closest('.form-field');
  const err = wrap.querySelector('.err-msg');
  let msg = '';
  if(input.hasAttribute('required') && !input.value.trim()) msg = 'Required';
  else if(input.name === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = 'Enter a valid email';
  else if(input.name === 'card' && input.value && input.value.replace(/\s/g,'').length < 12) msg = 'Enter a valid card number';
  else if(input.name === 'expiry' && input.value && !/^\d{2}\/\d{2}$/.test(input.value)) msg = 'Use MM/YY';
  else if(input.name === 'cvc' && input.value && !/^\d{3,4}$/.test(input.value)) msg = '3–4 digits';
  input.classList.toggle('invalid', !!msg);
  err.textContent = msg;
  return !msg;
}
function placeOrder(e){
  e.preventDefault();
  const form = e.target;
  const inputs = $$('input[required], input[name=card], input[name=expiry], input[name=cvc], input[name=email]', form);
  let valid = true;
  inputs.forEach(input => { if(!validateField(input)) valid = false; });
  if(!valid){ form.querySelector('.invalid')?.focus(); return; }

  const orderNum = 'LX-' + Math.floor(100000 + Math.random()*899999);
  state.orderPlaced = orderNum;
  state.cart = [];
  state.promo = { applied:false, code:'' };
  refreshCartUI();

  byId('view-checkout').innerHTML = `
    <section class="section co-success">
      <div class="wrap">
        <div class="icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg></div>
        <span class="eyebrow" style="justify-content:center">Order confirmed</span>
        <h1 class="display" style="margin-top:16px">Thank you for shopping with Luxora</h1>
        <p class="lede" style="max-width:480px;margin:18px auto 0">A confirmation has been sent to your email. This is a demo order — nothing was actually charged or shipped.</p>
        <div class="order-num">${orderNum}</div>
        <div style="margin-top:40px"><a href="#/shop" class="btn"><span>Continue shopping</span></a></div>
      </div>
    </section>`;
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ============================================================
   ABOUT VIEW
   ============================================================ */
function renderAbout(){
  byId('view-about').innerHTML = `
    <div class="page-head">
      <div class="wrap in">
        <div class="breadcrumb"><a href="#/">Home</a> / About</div>
        <h1 class="display">Our Story</h1>
      </div>
    </div>
    <section class="section">
      <div class="wrap split">
        <div class="reveal">
          <span class="eyebrow">Founded in Lahore, 2014</span>
          <h2 class="display" style="margin-top:16px">Fashion that respects your time.</h2>
          <p class="lede" style="margin-top:20px">Luxora began as a single tailoring counter with one promise: fewer, better things. Over a decade later, that promise hasn't changed — we still design in small batches, work directly with artisan workshops, and refuse to chase every trend that passes through.</p>
          <p class="lede" style="margin-top:16px">Every collection is built around fabric first. We source wool from mills in Biella, leather from tanneries in Portugal, and silk from long-standing partners in Como — then we design around what the material wants to do.</p>
        </div>
        <div class="visual reveal">${iconSVG('gown')}</div>
      </div>
    </section>
    <section class="section section-dark">
      <div class="wrap">
        <div class="counter-row reveal-stagger">
          <div class="counter"><b>2014</b><span>Founded</span></div>
          <div class="counter"><b>48</b><span>Artisan partners</span></div>
          <div class="counter"><b>120k+</b><span>Pieces homed</span></div>
          <div class="counter"><b>19</b><span>Countries shipped</span></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-head reveal">
          <div class="txt"><span class="eyebrow">What we stand for</span><h2 class="display">Our values</h2></div>
        </div>
        <div class="value-grid reveal-stagger">
          <div class="value-card">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z"/></svg>
            <h3>Made to last</h3>
            <p>We build for years of wear, not one season — resoleable, repairable, and finished to be lived in.</p>
          </div>
          <div class="value-card">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><path d="M12 21C7 17 3 13.5 3 9a5 5 0 019-3 5 5 0 019 3c0 4.5-4 8-9 12z"/></svg>
            <h3>Honest materials</h3>
            <p>Full traceability on every fabric and hide we use, sourced from partners we've worked with for years.</p>
          </div>
          <div class="value-card">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            <h3>Slow by design</h3>
            <p>Smaller runs mean less waste, better fit, and a collection that doesn't feel disposable.</p>
          </div>
        </div>
      </div>
    </section>
  `;
  observeReveals(byId('view-about'));
}

/* ============================================================
   ROUTER
   ============================================================ */
const ROUTES = {
  '#/':            { view:'view-home',     render: renderHome },
  '#/shop':        { view:'view-shop',     render: () => renderShop('all') },
  '#/about':       { view:'view-about',    render: renderAbout },
  '#/cart':        { view:'view-cart',     render: renderCartView },
  '#/checkout':    { view:'view-checkout', render: renderCheckout }
};
function navigate(hash, silent){
  if(!silent) window.location.hash = hash;
}
function resolveRoute(){
  let hash = window.location.hash || '#/';
  state.route = hash;
  closeDrawer();

  let match, param;
  if(hash.startsWith('#/shop/')){ match = ROUTES['#/shop']; param = hash.replace('#/shop/',''); }
  else if(hash.startsWith('#/product/')){ match = { view:'view-product', render: renderProduct }; param = hash.replace('#/product/',''); }
  else { match = ROUTES[hash] || ROUTES['#/']; }

  $$('.view').forEach(v => v.classList.remove('active'));
  const el = byId(match.view);
  el.classList.add('active');
  match.render(param);

  $$('.nav-link').forEach(a => {
    const target = a.getAttribute('href');
    a.classList.toggle('active', target === hash || (target==='#/shop' && hash.startsWith('#/shop')));
  });

  document.body.classList.toggle('theme-dark-hero', hash === '#/');
  window.scrollTo({top:0, behavior:'instant'});
}

/* ============================================================
   SCROLL REVEAL + NAV SOLID STATE
   ============================================================ */
let observer;
function observeReveals(root){
  if(observer) observer.disconnect();
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold:0.15 });
  $$('.reveal, .reveal-stagger, .stitch', root).forEach(el => observer.observe(el));
}
function initNavScroll(){
  const nav = byId('site-nav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
}

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('hashchange', resolveRoute);
window.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  resolveRoute();
  refreshCartUI();

  byId('cart-btn').addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
  byId('drawer-close').addEventListener('click', closeDrawer);
  byId('drawer-overlay').addEventListener('click', closeDrawer);
  byId('burger-btn').addEventListener('click', () => document.body.classList.toggle('menu-open'));

  document.addEventListener('blur', e => {
    if(e.target.matches && e.target.matches('#checkout-form input')) validateField(e.target);
  }, true);
});
