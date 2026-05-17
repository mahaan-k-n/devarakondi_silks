// =============================================
// DEVARAKONDI SILKS — MAIN JS
// =============================================

// ── Scroll Reveal ──
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

// ── Sticky Header ──
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const isHeroPage = document.querySelector('.hero-section');

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      if (isHeroPage) header.classList.remove('transparent');
    } else {
      header.classList.remove('scrolled');
      if (isHeroPage) header.classList.add('transparent');
    }
  }

  if (isHeroPage) header.classList.add('transparent');
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

// ── Mobile Nav ──
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!hamburger || !mobileNav) return;

  function openNav() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeNav() : openNav();
  });

  if (overlay) overlay.addEventListener('click', closeNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
}

// ── Cart (localStorage) ──
const CART_KEY = 'ds_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) { existing.qty += 1; }
  else { 
    // Handle differences between static JSON structure and API structure
    const mainImage = product.images && product.images.length > 0 ? product.images.sort((a,b)=>a.sortOrder-b.sortOrder)[0].imageUrl : product.image || 'images/hero-bg.jpg';
    const categoryName = product.category?.name || product.category || 'Unknown Category';

    cart.push({ 
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      category: categoryName,
      qty: 1 
    }); 
  }
  saveCart(cart);
  showToast(`✓ "${product.name}" added to cart`, 'success');
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.classList.toggle('active', total > 0);
  });
  document.querySelectorAll('.cart-count-text').forEach(el => {
    el.textContent = total > 0 ? `(${total})` : '';
  });
}

// ── Toast ──
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-enter';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

// ── WhatsApp ──
function buildWALink(message) {
  const isWholesale = message.includes('wholesale') || message.includes('Wholesale');
  const phone = isWholesale ? '919972957102' : '919901228084';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function initWhatsApp() {
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const type = el.dataset.wa;
      let msg = 'Hello, I am interested in Devarakondi Silks.';
      if (type === 'wholesale') {
        msg = `🙏 *Wholesale Enquiry — Devarakondi Silks*

Hello! I am reaching out regarding wholesale opportunities for your premium silk sarees.

I am interested in:
✅ Your wholesale catalogue & pricing
✅ Minimum order quantity (MOQ)
✅ Exclusive designs for retailers/boutiques
✅ Bulk order delivery timelines

I look forward to connecting with you soon!

Thank you 🙏`;
      } else if (type === 'product') {
        const name = el.dataset.product || '';
        msg = `Hello, I am interested in the "${name}" saree. Please share more details and availability.`;
      }
      window.open(buildWALink(msg), '_blank');
    });
  });

  // Floating WA
  const waFloat = document.querySelector('.wa-float-btn');
  if (waFloat) {
    waFloat.href = buildWALink('Hello, I am interested in Devarakondi Silks. Please help me.');
  }
}

// ── Hero Parallax ──
function initHeroParallax() {
  const hero = document.querySelector('.hero-bg');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.35}px)`;
  }, { passive: true });
}

// ── Accordion ──
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close all in same group
      const group = item.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-body').classList.remove('open');
        });
      }

      if (!isOpen) {
        item.classList.add('open');
        body.classList.add('open');
      }
    });
  });
}

// ── Smooth scroll for anchor links ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Best Sellers horizontal scroll arrows ──
function initScrollArrows() {
  document.querySelectorAll('.scroll-section').forEach(section => {
    const row = section.querySelector('.scroll-row');
    const prevBtn = section.querySelector('.scroll-prev');
    const nextBtn = section.querySelector('.scroll-next');
    if (!row || !prevBtn || !nextBtn) return;

    const scrollAmount = () => row.clientWidth * 0.75;

    prevBtn.addEventListener('click', () => {
      row.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      row.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    row.addEventListener('scroll', () => {
      prevBtn.style.opacity = row.scrollLeft > 20 ? '1' : '0.3';
      nextBtn.style.opacity = (row.scrollLeft + row.clientWidth < row.scrollWidth - 20) ? '1' : '0.3';
    }, { passive: true });
  });
}

// ── Quick preview modal ──
function initQuickPreview() {
  const backdrop = document.querySelector('.modal-backdrop');
  const closeBtn = document.querySelector('.modal-close');
  if (!backdrop) return;

  function closeModal() {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openQuickPreview(product) {
  const backdrop = document.querySelector('.modal-backdrop');
  if (!backdrop) return;

  const img = backdrop.querySelector('.modal-img-side img');
  const name = backdrop.querySelector('.modal-product-name');
  const cat = backdrop.querySelector('.modal-product-cat');
  const price = backdrop.querySelector('.modal-product-price');
  const origPrice = backdrop.querySelector('.modal-product-orig');
  const link = backdrop.querySelector('.modal-view-btn');
  const addBtn = backdrop.querySelector('.modal-add-btn');
  const waBtn = backdrop.querySelector('.modal-wa-btn');

  const mainImage = product.images && product.images.length > 0 ? product.images.sort((a,b)=>a.sortOrder-b.sortOrder)[0].imageUrl : 'images/hero-bg.jpg';

  if (img) img.src = mainImage;
  if (name) name.textContent = product.name;
  if (cat) cat.textContent = product.category?.name || product.category;
  if (price) price.textContent = `₹${product.price.toLocaleString('en-IN')}`;
  if (origPrice) origPrice.textContent = product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : '';
  if (link) link.href = `product.html?id=${product.id}`;
  if (addBtn) addBtn.onclick = () => { addToCart(product); };
  if (waBtn) {
    waBtn.dataset.wa = 'product';
    waBtn.dataset.product = product.name;
  }

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  const content = backdrop.querySelector('.modal-content');
  if (content) {
    content.classList.remove('modal-animate');
    void content.offsetWidth;
    content.classList.add('modal-animate');
  }
}

// ── Auth Navigation ──
function initAuthNav() {
  const token = localStorage.getItem('ds_token');
  const userStr = localStorage.getItem('ds_user');
  const navContainer = document.querySelector('.header-actions');
  const mobileNavContainer = document.getElementById('mobile-nav');
  
  // Desktop header
  if (navContainer) {
    const existing = document.getElementById('auth-header-btn');
    if (existing) existing.remove();
    
    // If we are on account.html and it already has a hardcoded button, skip inserting a new one
    if (document.getElementById('account-btn')) return;

    const accountBtn = document.createElement('a');
    accountBtn.id = 'auth-header-btn';
    accountBtn.style.fontSize = '12px';
    accountBtn.style.fontWeight = 'bold';
    accountBtn.style.letterSpacing = '0.1em';
    accountBtn.style.marginRight = 'var(--sp-2)';
    accountBtn.style.textDecoration = 'none';
    
    if (token && userStr) {
      accountBtn.textContent = 'MY ACCOUNT';
      accountBtn.href = 'account.html';
      accountBtn.style.color = 'var(--color-primary)';
    } else {
      accountBtn.textContent = 'LOGIN';
      accountBtn.href = 'login.html';
      accountBtn.style.color = 'var(--color-text-muted)';
    }
    
    const wishlistBtn = document.getElementById('wishlist-header-btn');
    if (wishlistBtn) {
      navContainer.insertBefore(accountBtn, wishlistBtn);
    } else {
      navContainer.prepend(accountBtn);
    }
  }
  
  // Mobile nav
  if (mobileNavContainer) {
    const existingMobile = document.getElementById('auth-mobile-btn');
    if (existingMobile) existingMobile.remove();
    
    const mobileAccountBtn = document.createElement('a');
    mobileAccountBtn.id = 'auth-mobile-btn';
    
    if (token && userStr) {
      mobileAccountBtn.textContent = '👤 My Account';
      mobileAccountBtn.href = 'account.html';
    } else {
      mobileAccountBtn.textContent = '👤 Login / Sign Up';
      mobileAccountBtn.href = 'login.html';
    }
    
    const wishlistLink = Array.from(mobileNavContainer.querySelectorAll('a')).find(a => a.href.includes('wishlist.html'));
    if (wishlistLink) {
      mobileNavContainer.insertBefore(mobileAccountBtn, wishlistLink);
    }
  }
}

// ── Init all ──
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyHeader();
  initMobileNav();
  initWhatsApp();
  initHeroParallax();
  initAccordions();
  initSmoothScroll();
  initScrollArrows();
  initQuickPreview();
  updateCartBadge();
  initAuthNav();
});

// Export for other modules
window.DS = { addToCart, showToast, openQuickPreview, getCart, saveCart, buildWALink };
