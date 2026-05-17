// =============================================
// DEVARAKONDI SILKS — CHECKOUT (API VERSION)
// =============================================

let currentStep = 1;
let currentOrderResponse = null;

function goToStep(step) {
  currentStep = step;

  document.querySelectorAll('.checkout-step-panel').forEach((panel, i) => {
    panel.style.display = i + 1 === step ? 'block' : 'none';
  });

  document.querySelectorAll('.step-indicator').forEach((ind, i) => {
    ind.classList.remove('active', 'done');
    if (i + 1 < step) ind.classList.add('done');
    if (i + 1 === step) ind.classList.add('active');
  });

  document.querySelectorAll('.step-connector').forEach((conn, i) => {
    conn.classList.toggle('done', i + 1 < step);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  const fields = ['name', 'phone', 'email', 'address', 'city', 'pincode', 'state'];
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(`field-${id}`);
    const err = document.getElementById(`err-${id}`);
    if (!el) return;
    const val = el.value.trim();
    let msg = '';

    if (!val) {
      if (id !== 'email') msg = 'This field is required'; // email is optional
    } else if (id === 'phone' && !/^[6-9]\d{9}$/.test(val)) {
      msg = 'Enter a valid 10-digit mobile number';
    } else if (id === 'email' && val && !/^\S+@\S+\.\S+$/.test(val)) {
      msg = 'Enter a valid email address';
    } else if (id === 'pincode' && !/^\d{6}$/.test(val)) {
      msg = 'Enter a valid 6-digit pincode';
    }

    if (msg) {
      el.classList.add('error');
      if (err) { err.textContent = msg; err.style.display = 'block'; }
      valid = false;
    } else {
      el.classList.remove('error');
      if (err) { err.textContent = ''; err.style.display = 'none'; }
    }
  });

  return valid;
}

function renderOrderSummary() {
  const cart = window.DS?.getCart() || [];
  const itemsEl = document.getElementById('order-items');
  const subtotalEl = document.getElementById('order-subtotal');
  const shippingEl = document.getElementById('order-shipping');
  const totalEl = document.getElementById('order-total');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p style="color:var(--color-text-muted);font-size:var(--fs-sm);padding:var(--sp-4) 0">
      Your cart is empty. <a href="collections.html" style="color:var(--color-gold)">Browse collections</a>
    </p>`;
  } else {
    itemsEl.innerHTML = cart.map((item, idx) => `
      <div class="order-item" style="border-bottom:1px solid rgba(255,255,255,0.07); padding-bottom: 12px; margin-bottom: 12px;">
        <div class="order-item-img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div style="flex:1">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-detail">${item.category}</div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <button onclick="cartChangeQty(${idx}, -1)" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--color-gold);background:transparent;color:var(--color-gold);cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;">−</button>
            <span style="color:var(--color-text-primary);font-weight:600;min-width:20px;text-align:center;">${item.qty}</span>
            <button onclick="cartChangeQty(${idx}, 1)" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--color-gold);background:transparent;color:var(--color-gold);cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;">+</button>
            <span class="order-item-price" style="margin-left:auto;">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
            <button onclick="cartRemoveItem(${idx})" title="Remove item" style="background:transparent;border:none;cursor:pointer;color:#e05c5c;margin-left:6px;padding:4px;border-radius:4px;line-height:1;transition:background 0.2s;" onmouseover="this.style.background='rgba(224,92,92,0.1)'" onmouseout="this.style.background='transparent'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>`).join('');
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 199;
  let total = subtotal + shipping;
  if(cart.length === 0) total = 0;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
}

function cartChangeQty(idx, delta) {
  const cart = window.DS?.getCart() || [];
  if (!cart[idx]) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  window.DS?.saveCart(cart);
  renderOrderSummary();
}

function cartRemoveItem(idx) {
  const cart = window.DS?.getCart() || [];
  cart.splice(idx, 1);
  window.DS?.saveCart(cart);
  renderOrderSummary();
}

function initOrderSummary() {
  renderOrderSummary();
}


function initPaymentToggle() {
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      const method = option.dataset.method;
      document.querySelectorAll('.payment-detail').forEach(d => d.style.display = 'none');
      const detail = document.getElementById(`pay-${method}`);
      if (detail) detail.style.display = 'block';
    });
  });

  // Select first by default
  const first = document.querySelector('.payment-option');
  if (first) first.click();
}

async function handlePlaceOrder() {
  const cart = window.DS?.getCart() || [];
  if (cart.length === 0) {
    window.DS?.showToast('Your cart is empty!', 'error');
    return;
  }

  const btn = document.getElementById('place-order-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Processing...`;
  }

  // Gather payload
  const selectedPayment = document.querySelector('.payment-option.selected')?.dataset.method || 'online';
  
  const payload = {
    customerName: document.getElementById('field-name').value.trim(),
    phone: document.getElementById('field-phone').value.trim(),
    email: document.getElementById('field-email').value.trim() || null,
    address: document.getElementById('field-address').value.trim(),
    city: document.getElementById('field-city').value.trim(),
    pincode: document.getElementById('field-pincode').value.trim(),
    state: document.getElementById('field-state').value.trim(),
    paymentMethod: selectedPayment === 'cod' ? 'COD' : 'RAZORPAY',
    items: cart.map(item => ({
      productId: item.id,
      quantity: item.qty
    }))
  };

  try {
    const res = await fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to place order');
    }

    currentOrderResponse = await res.json();

    if (payload.paymentMethod === 'RAZORPAY') {
        const options = {
            "key": "rzp_test_SknLe92pLg24yi", // Live Test Key
            "amount": currentOrderResponse.total * 100, 
            "currency": "INR",
            "name": "Devarakondi Silks",
            "description": "Premium Silk Sarees",
            "order_id": currentOrderResponse.paymentId, 
            "handler": async function (response){
                console.log("Razorpay Payment ID:", response.razorpay_payment_id);
                // Fire backend verify endpoint securely
                try {
                    const verifyRes = await fetch('http://localhost:8080/api/orders/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    
                    if (verifyRes.ok) {
                        handlePaymentSuccess();
                    } else {
                        window.DS?.showToast("Payment signature invalid.", "error");
                        const btn = document.getElementById('place-order-btn');
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = `Place Order →`;
                        }
                    }
                } catch (err) {
                    window.DS?.showToast("Server error. Please check your network.", "error");
                }
            },
            "prefill": {
                "name": payload.customerName,
                "email": payload.email || "",
                "contact": payload.phone
            },
            "theme": {
                "color": "#7A1C2E"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
            window.DS?.showToast("Payment Failed or Cancelled. Please try again.", "error");
            const btn = document.getElementById('place-order-btn');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `Place Order →`;
            }
        });
        rzp1.open();
    } else {
        // COD logic
        handlePaymentSuccess();
    }
  } catch (e) {
      window.DS?.showToast(e.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Place Order`;
      }
  }
}

function handlePaymentSuccess() {
    // Populate success step
    const successNum = document.getElementById('success-order-num');
    if (successNum && currentOrderResponse) {
        successNum.textContent = `Order #${currentOrderResponse.orderNumber}`;
    }

    goToStep(3);
    localStorage.removeItem('ds_cart');
    window.DS?.updateCartBadge?.();
}

function initCheckout() {
  // Pre-fill user details if logged in
  const userStr = localStorage.getItem('ds_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.name) document.getElementById('field-name').value = user.name;
      if (user.email) document.getElementById('field-email').value = user.email;
    } catch(e) {}
  }

  // Step 1 next
  const step1Next = document.getElementById('step1-next');
  if (step1Next) {
    step1Next.addEventListener('click', () => {
      if (validateStep1()) goToStep(2);
    });
  }

  // Step 2 back
  const step2Back = document.getElementById('step2-back');
  if (step2Back) step2Back.addEventListener('click', () => goToStep(1));

  // Place order
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) placeOrderBtn.addEventListener('click', handlePlaceOrder);

  // Form real-time validation clear
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const err = document.getElementById(`err-${input.id.replace('field-', '')}`);
      if (err) err.style.display = 'none';
    });
  });

  initPaymentToggle();
  initOrderSummary();
  goToStep(1);
}

document.addEventListener('DOMContentLoaded', initCheckout);
