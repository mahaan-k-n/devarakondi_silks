// =============================================
// DEVARAKONDI SILKS — PRODUCT DATA & COLLECTIONS (API VERSION)
// =============================================

// Filter & sort state
let state = {
  category: null,
  fabric: [],
  occasion: [],
  priceMin: 0,
  priceMax: 100000,
  sort: 'new',
  page: 0,
  perPage: 12,
  filterNew: false,
};

// Global reference for other scripts if needed, but primarily we rely on API
window.PRODUCTS = [];

async function fetchProducts() {
  const params = new URLSearchParams({
    page: state.page,
    size: state.perPage,
    sort: state.sort
  });

  if (state.category) params.append('category', state.category);
  if (state.filterNew) params.append('new', 'true');
  if (state.fabric.length > 0) params.append('fabric', state.fabric[0]);
  if (state.occasion.length > 0) params.append('occasion', state.occasion[0]);
  if (state.priceMin > 0) params.append('minPrice', state.priceMin);
  if (state.priceMax < 100000) params.append('maxPrice', state.priceMax);

  try {
    const res = await fetch(`http://localhost:8080/api/products?${params.toString()}`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch products', err);
    return { content: [], totalElements: 0, last: true };
  }
}

async function renderProducts(append = false) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (!append) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:var(--sp-16);">Loading...</div>';
  }

  const data = await fetchProducts();
  const visible = data.content;
  
  if (!append) {
    window.PRODUCTS = visible;
  } else {
    window.PRODUCTS = [...window.PRODUCTS, ...visible];
  }

  const countEl = document.getElementById('product-count');
  if (countEl) countEl.textContent = `${data.totalElements} products`;

  if (visible.length === 0 && !append) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:var(--sp-16);color:var(--color-text-muted)">
      <p style="font-size:2rem;margin-bottom:var(--sp-4)">🪡</p>
      <p>No sarees match your filters. Try adjusting.</p>
    </div>`;
    return;
  }

  const html = visible.map(p => renderProductCard(p)).join('');
  if (append) {
    grid.insertAdjacentHTML('beforeend', html);
  } else {
    grid.innerHTML = html;
  }

  // Load more button
  const loadMoreWrap = document.getElementById('load-more-wrap');
  if (loadMoreWrap) {
    loadMoreWrap.style.display = data.last ? 'none' : 'block';
  }

  // Attach card events
  grid.querySelectorAll('.product-card').forEach(card => {
    // Only attach if not already attached (can check a class, but for simplicity we re-attach to the new ones)
    if (card.dataset.initialized) return;
    card.dataset.initialized = 'true';
    
    const idx = parseInt(card.dataset.id);
    const product = window.PRODUCTS.find(p => p.id === idx);
    if (!product) return;

    card.querySelector('.quick-view-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      window.DS?.openQuickPreview(product);
    });

    card.querySelector('.add-cart-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (product.stock > 0) window.DS?.addToCart(product);
    });

    card.querySelector('.wishlist-card-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(product, card.querySelector('.wishlist-card-btn'));
    });

    card.addEventListener('click', () => {
      window.location.href = `product.html?id=${product.id}`;
    });
  });

  // Trigger scroll reveal on new cards
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }});
    }, { threshold: 0.1 });
    io.observe(el);
  });
}

function renderProductCard(p) {
  const discount = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

  const wishlist = getWishlist();
  const isWishlisted = wishlist.some(w => w.id === p.id);

  // Stock display
  let stockBadge = '';
  let stockFooter = '';
  if (p.stock <= 0) {
    stockBadge = `<span class="badge badge-soldout">Sold Out</span>`;
    stockFooter = `<span class="product-card-stock soldout">❌ Sold Out</span>`;
  } else if (p.stock <= 3) {
    stockBadge = `<span class="badge badge-stock">Only ${p.stock} left</span>`;
    stockFooter = `<span class="product-card-stock">⚡ Only ${p.stock} left</span>`;
  }

  const badges = [
    p.isNew ? `<span class="badge badge-new">New</span>` : '',
    p.isBestseller ? `<span class="badge badge-hot">Best Seller</span>` : '',
    p.isMagga ? `<span class="badge badge-magga">Direct Magga</span>` : '',
    stockBadge,
  ].filter(Boolean).join('');

  const mainImage = p.images && p.images.length > 0 ? p.images[0].imageUrl : 'images/hero-bg.jpg';

  return `
  <div class="product-card reveal fade-up" data-id="${p.id}">
    <div class="product-card-img">
      <img src="${mainImage}" alt="${p.name}" loading="lazy">
      <div class="product-card-badges">${badges}</div>
      <button class="wishlist-card-btn ${isWishlisted ? 'wishlisted' : ''}" data-wish-id="${p.id}" title="Wishlist" aria-label="Add to wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="product-card-quick">
        <button class="btn btn-outline btn-sm quick-view-btn" style="flex:1">Quick View</button>
        <button class="btn btn-primary btn-sm add-cart-btn" style="flex:1" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</button>
      </div>
    </div>
    <div class="product-card-body">
      <span class="product-card-category">${p.category.name}</span>
      <h3 class="product-card-name">${p.name}</h3>
      <div class="product-card-price">
        <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
        ${p.originalPrice ? `<span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
        ${discount > 0 ? `<span class="price-discount">${discount}% off</span>` : ''}
      </div>
      ${stockFooter}
    </div>
  </div>`;
}

function initFilters() {
  document.querySelectorAll('.filter-checkbox input').forEach(input => {
    input.addEventListener('change', () => {
      const group = input.dataset.group;
      const val = input.value;
      if (group === 'fabric') {
        if (input.checked) state.fabric.push(val);
        else state.fabric = state.fabric.filter(v => v !== val);
      } else if (group === 'occasion') {
        if (input.checked) state.occasion.push(val);
        else state.occasion = state.occasion.filter(v => v !== val);
      }
      state.page = 0;
      renderProducts();
    });
  });

  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  [priceMin, priceMax].forEach(el => {
    if (!el) return;
    el.addEventListener('change', () => {
      state.priceMin = parseInt(priceMin?.value) || 0;
      state.priceMax = parseInt(priceMax?.value) || 100000;
      state.page = 0;
      renderProducts();
    });
  });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      state.page = 0;
      renderProducts();
    });
  }

  const clearBtn = document.getElementById('filter-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state = { category: state.category, fabric: [], occasion: [], priceMin: 0, priceMax: 100000, sort: 'new', page: 0, perPage: 12, filterNew: false };
      document.querySelectorAll('.filter-checkbox input').forEach(i => i.checked = false);
      if (priceMin) priceMin.value = '';
      if (priceMax) priceMax.value = '';
      if (sortSelect) sortSelect.value = 'new';
      renderProducts();
    });
  }

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      state.page += 1;
      renderProducts(true);
    });
  }

  // Mobile filter drawer logic
  const filterToggle = document.getElementById('filter-toggle');
  const filterDrawer = document.getElementById('filter-drawer');
  const filterDrawerClose = document.getElementById('filter-drawer-close');
  const filterOverlay = document.getElementById('filter-overlay');

  if (filterToggle && filterDrawer) {
    filterToggle.addEventListener('click', () => {
      filterDrawer.classList.add('open');
      if (filterOverlay) filterOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      filterDrawer.classList.remove('open');
      if (filterOverlay) filterOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (filterDrawerClose) filterDrawerClose.addEventListener('click', closeDrawer);
    if (filterOverlay) filterOverlay.addEventListener('click', closeDrawer);
  }
}

function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  const isNew = params.get('filter') === 'new';

  if (cat) {
    const heading = document.getElementById('collection-heading');
    const pageTitle = document.getElementById('page-title');
    const catLabel = cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (heading) heading.textContent = catLabel;
    if (pageTitle) pageTitle.textContent = catLabel;
    state.category = cat;
    // Highlight matching nav link
    document.querySelectorAll('#main-nav a').forEach(a => {
      a.classList.remove('nav-active');
      if (a.href.includes(`category=${cat}`)) a.classList.add('nav-active');
    });
  }
  if (isNew) {
    const heading = document.getElementById('collection-heading');
    const pageTitle = document.getElementById('page-title');
    if (heading) heading.textContent = 'New Arrivals';
    if (pageTitle) pageTitle.textContent = '✨ New Arrivals';
    state.filterNew = true;
    state.sort = 'new';
    document.querySelectorAll('#main-nav a').forEach(a => {
      a.classList.remove('nav-active');
      if (a.href.includes('filter=new')) a.classList.add('nav-active');
    });
  }
}

// ── Wishlist helpers ──
const WL_KEY = 'ds_wishlist';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WL_KEY)) || []; }
  catch { return []; }
}

function toggleWishlist(product, btn) {
  let wl = getWishlist();
  const idx = wl.findIndex(w => w.id === product.id);
  if (idx === -1) {
    wl.push({ id: product.id, name: product.name, price: product.price,
      image: product.images?.[0]?.imageUrl || 'images/hero-bg.jpg',
      category: product.category?.name || '' });
    btn.classList.add('wishlisted');
    btn.querySelector('svg path').setAttribute('fill', 'currentColor');
    window.DS?.showToast(`♥ Added to Wishlist`, 'success');
  } else {
    wl.splice(idx, 1);
    btn.classList.remove('wishlisted');
    btn.querySelector('svg path').setAttribute('fill', 'none');
    window.DS?.showToast(`Removed from Wishlist`, 'info');
  }
  localStorage.setItem(WL_KEY, JSON.stringify(wl));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('#wishlist-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFromURL();
  initFilters();
  renderProducts();
  updateWishlistBadge();
});

