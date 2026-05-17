// =============================================
// DEVARAKONDI SILKS — PRODUCT DETAIL PAGE (API VERSION)
// =============================================

async function getProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';
  try {
    const res = await fetch(`${window.DS_API_BASE || 'http://localhost:8080'}/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (err) {
    console.error('Failed to get product', err);
    return null;
  }
}

function renderProductDetail(product) {
  if (!product) {
      document.body.innerHTML = '<div style="padding:100px;text-align:center;"><h2>Product not found</h2><a href="collections.html">Back to specific collections</a></div>';
      return;
  }

  // Title / meta
  document.title = `${product.name} | Devarakondi Silks`;

  // Breadcrumb
  const bcCurrent = document.getElementById('bc-product-name');
  if (bcCurrent) bcCurrent.textContent = product.name;

  // Badges
  const badgesRow = document.getElementById('product-badges');
  if (badgesRow) {
    badgesRow.innerHTML = [
      product.isMagga ? `<span class="badge badge-magga">✦ Direct from Magga</span>` : '',
      product.isNew ? `<span class="badge badge-new">New Arrival</span>` : '',
      product.isBestseller ? `<span class="badge badge-hot">Best Seller</span>` : '',
    ].filter(Boolean).join('');
  }

  // Title
  const titleEl = document.getElementById('product-title');
  if (titleEl) titleEl.textContent = product.name;

  // Category
  const catEl = document.getElementById('product-category');
  if (catEl) catEl.textContent = product.category.name;

  // Price
  const priceEl = document.getElementById('product-price');
  if (priceEl) priceEl.textContent = `₹${product.price.toLocaleString('en-IN')}`;

  const origPriceEl = document.getElementById('product-orig-price');
  if (origPriceEl) {
    if (product.originalPrice) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      origPriceEl.innerHTML = `
        <span class="price-original">₹${product.originalPrice.toLocaleString('en-IN')}</span>
        <span class="price-discount">${discount}% off</span>`;
    } else {
      origPriceEl.innerHTML = '';
    }
  }

  // Stock warning
  const stockEl = document.getElementById('product-stock');
  if (stockEl) {
    if (product.stock <= 3 && product.stock > 0) {
      stockEl.innerHTML = `⚡ Only ${product.stock} left in stock — order soon!`;
      stockEl.style.display = 'flex';
    } else if (product.stock <= 0) {
      stockEl.innerHTML = `❌ Out of stock`;
      stockEl.style.display = 'flex';
    } else {
      stockEl.style.display = 'none';
    }
  }

  // Details table
  const detailsMap = {
    'Fabric':   product.fabric,
    'Design':   product.design,
    'Origin':   product.origin,
    'Occasion': product.occasion,
    'Blouse':   'Running blouse included',
    'Length':   '6.3 metres (saree) + 0.8 metres (blouse)',
  };

  const detailsTable = document.getElementById('product-details-table');
  if (detailsTable) {
    detailsTable.innerHTML = Object.entries(detailsMap).map(([k, v]) => `
      <div class="product-detail-row">
        <span class="product-detail-label">${k}</span>
        <span class="product-detail-value">${v}</span>
      </div>`).join('');
  }

  // Description
  const descEl = document.getElementById('product-description');
  if (descEl) descEl.textContent = product.description;

  // Gallery
  const imageUrls = product.images && product.images.length ? product.images.sort((a,b)=>a.sortOrder-b.sortOrder).map(img => img.imageUrl) : ['images/hero-bg.jpg'];
  renderGallery(imageUrls);

  // Action buttons
  const addCartBtn = document.getElementById('add-cart-btn');
  if (addCartBtn) {
    if (product.stock <= 0) {
        addCartBtn.disabled = true;
        addCartBtn.textContent = 'Out of Stock';
    } else {
        addCartBtn.addEventListener('click', () => {
          window.DS?.addToCart(product);
        });
    }
  }

  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    if (product.stock <= 0) {
        buyNowBtn.disabled = true;
    } else {
        buyNowBtn.addEventListener('click', () => {
          window.DS?.addToCart(product);
          window.location.href = 'checkout.html';
        });
    }
  }

  const waBtn = document.getElementById('wa-enquiry-btn');
  if (waBtn) {
    waBtn.dataset.wa = 'product';
    waBtn.dataset.product = product.name;
  }

  // Wishlist button on product page
  const wishBtn = document.getElementById('wishlist-product-btn');
  if (wishBtn) {
    const WL_KEY = 'ds_wishlist';
    function getWishlist() {
      try { return JSON.parse(localStorage.getItem(WL_KEY)) || []; }
      catch { return []; }
    }
    const isWishlisted = getWishlist().some(w => w.id === product.id);
    if (isWishlisted) wishBtn.classList.add('wishlisted');

    wishBtn.addEventListener('click', () => {
      let wl = getWishlist();
      const idx = wl.findIndex(w => w.id === product.id);
      if (idx === -1) {
        const mainImage = product.images && product.images.length > 0
          ? product.images.sort((a,b) => a.sortOrder - b.sortOrder)[0].imageUrl
          : 'images/hero-bg.jpg';
        wl.push({ id: product.id, name: product.name, price: product.price,
          image: mainImage, category: product.category?.name || '' });
        wishBtn.classList.add('wishlisted');
        window.DS?.showToast('♥ Added to Wishlist', 'success');
      } else {
        wl.splice(idx, 1);
        wishBtn.classList.remove('wishlisted');
        window.DS?.showToast('Removed from Wishlist', 'info');
      }
      localStorage.setItem(WL_KEY, JSON.stringify(wl));
      // Update badge
      const count = wl.length;
      document.querySelectorAll('#wishlist-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
      });
    });
  }

  // Track recently viewed
  saveRecentlyViewed(product.id);
}

// ── Gallery ──
function renderGallery(images) {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbsEl = document.getElementById('gallery-thumbs');
  if (!mainImg || !images.length) return;

  mainImg.src = images[0];
  mainImg.alt = 'Saree image';

  // Zoom on click
  const mainWrap = document.getElementById('gallery-main-wrap');
  if (mainWrap) {
    mainWrap.addEventListener('click', () => {
      mainWrap.classList.toggle('zoomed');
    });
  }

  // Thumbnails
  if (thumbsEl) {
    thumbsEl.innerHTML = images.map((src, i) => `
      <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}">
        <img src="${src}" alt="Saree view ${i + 1}" loading="lazy">
      </div>`).join('');

    thumbsEl.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.idx);
        if (mainImg) {
          mainImg.src = images[idx];
          if (mainWrap) mainWrap.classList.remove('zoomed');
        }
        thumbsEl.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }
}

// ── Recently Viewed ──
const RV_KEY = 'ds_recently_viewed_api'; // new key

function saveRecentlyViewed(id) {
  let rv = getRecentlyViewedData();
  rv = rv.filter(i => i !== id);
  rv.unshift(id);
  rv = rv.slice(0, 6);
  localStorage.setItem(RV_KEY, JSON.stringify(rv));
}

function getRecentlyViewedData() {
  try { return JSON.parse(localStorage.getItem(RV_KEY)) || []; }
  catch { return []; }
}

async function renderRecentlyViewed(currentId) {
  const rvIds = getRecentlyViewedData().filter(id => id !== currentId);
  const section = document.getElementById('recently-viewed-section');
  const grid = document.getElementById('recently-viewed-grid');
  if (!section || !grid || rvIds.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }

  // Fetch all RV products
  const rvProducts = [];
  for (const id of rvIds) {
      try {
          const res = await fetch(`${window.DS_API_BASE || 'http://localhost:8080'}/api/products/${id}`);
          if (res.ok) rvProducts.push(await res.json());
      } catch(e) {}
  }

  if (rvProducts.length === 0) { section.style.display = 'none'; return; }

  grid.innerHTML = rvProducts.map(p => {
    const mainImage = p.images && p.images.length > 0 ? p.images.sort((a,b)=>a.sortOrder-b.sortOrder)[0].imageUrl : 'images/hero-bg.jpg';
    return `
    <a href="product.html?id=${p.id}" class="product-card scroll-card-md card-hover" style="text-decoration:none">
      <div class="product-card-img">
        <img src="${mainImage}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${p.category.name}</span>
        <h3 class="product-card-name">${p.name}</h3>
        <div class="product-card-price">
          <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </a>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const product = await getProductFromURL();
  if (product) {
    renderProductDetail(product);
    renderRecentlyViewed(product.id);
  }
});
