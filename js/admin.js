let adminSecret = localStorage.getItem('ds_admin_secret');

if (adminSecret) {
    verifyAndLoad(adminSecret);
}

async function login() {
    const key = document.getElementById('secret-key').value;
    await verifyAndLoad(key);
}

function logout() {
    localStorage.removeItem('ds_admin_secret');
    window.location.reload();
}

async function verifyAndLoad(key) {
    try {
        const res = await fetch('http://localhost:8080/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: key })
        });

        if (res.ok) {
            localStorage.setItem('ds_admin_secret', key);
            adminSecret = key;
            document.getElementById('auth-view').style.display = 'none';
            document.getElementById('dashboard-view').style.display = 'block';
            loadOrders();
            loadProducts();
        } else {
            document.getElementById('auth-error').style.display = 'block';
            localStorage.removeItem('ds_admin_secret');
            document.getElementById('auth-view').style.display = 'block';
            document.getElementById('dashboard-view').style.display = 'none';
        }
    } catch (e) {
        alert("Failed to connect to backend server");
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

async function loadOrders() {
    const table = document.getElementById('orders-table').querySelector('tbody');
    try {
        const res = await fetch('http://localhost:8080/api/admin/orders', {
            headers: { 'X-Admin-Secret': adminSecret }
        });
        const orders = await res.json();
        
        if (orders.length === 0) {
            table.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;">No orders yet</td></tr>`;
            return;
        }
        
        table.innerHTML = orders.map(o => {
            const items = (o.items || []).map(i =>
                `<span style="display:inline-block;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);border-radius:4px;padding:2px 7px;font-size:0.75em;margin:2px;color:#C9A84C;">
                    ${i.product?.name || 'Item'} × ${i.quantity}
                </span>`
            ).join('');

            const statusColors = {
                'PENDING': '#f59e0b',
                'CONFIRMED': '#3b82f6',
                'SHIPPED': '#8b5cf6',
                'DELIVERED': '#10b981',
                'CANCELLED': '#ef4444'
            };
            const color = statusColors[o.status] || '#888';

            return `
            <tr>
                <td><strong style="color:#C9A84C;">${o.orderNumber}</strong><br>
                    <span style="font-size:0.75em;color:#888;">${new Date(o.createdAt).toLocaleString('en-IN')}</span>
                </td>
                <td>
                    ${o.customerName}<br>
                    <span style="font-size:0.8em;color:#aaa;">${o.phone}</span><br>
                    <span style="font-size:0.8em;color:#aaa;">${o.city}, ${o.state}</span>
                </td>
                <td><div style="margin-top:2px;">${items || '<span style="color:#888;font-size:0.8em;">—</span>'}</div></td>
                <td><span style="background:${color}22;color:${color};border:1px solid ${color}55;border-radius:20px;padding:3px 10px;font-size:0.8em;font-weight:600;">${o.status}</span></td>
                <td style="font-size:0.85em;">${o.paymentMethod}</td>
                <td><strong style="color:#fff;">₹${Number(o.total).toLocaleString('en-IN')}</strong></td>
            </tr>`;
        }).join('');
    } catch (e) {
        table.innerHTML = `<tr><td colspan="6" style="color:#ef4444;">Failed to load orders. Is backend running?</td></tr>`;
    }
}

async function loadProducts() {
    const table = document.getElementById('products-table').querySelector('tbody');
    try {
        const res = await fetch('http://localhost:8080/api/products?size=100'); // public endpoint
        const data = await res.json();
        
        table.innerHTML = data.content.map(p => {
            const isLowStock = p.stock <= 3;
            const stockColor = p.stock === 0 ? '#ef4444' : isLowStock ? '#f59e0b' : '#10b981';
            const stockLabel = p.stock === 0 ? 'OUT OF STOCK' : isLowStock ? 'LOW STOCK' : '';
            return `
            <tr>
                <td style="color:#888;font-size:0.85em;">${p.id}</td>
                <td><strong>${p.name}</strong><br><span style="font-size:0.8em;color:#888">${p.category.name}</span></td>
                <td>₹${Number(p.price).toLocaleString('en-IN')}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                        <input type="number" id="stock-${p.id}" value="${p.stock}" min="0" style="width:60px;padding:4px;background:#1a1a2e;border:1px solid #333;color:#fff;border-radius:4px;">
                        ${stockLabel ? `<span style="font-size:0.7em;font-weight:700;color:${stockColor};">${stockLabel}</span>` : ''}
                    </div>
                </td>
                <td>
                    <button class="btn" style="padding:4px 10px;font-size:0.8em;" onclick="updateStock(${p.id})">Update</button>
                    <button class="btn btn-danger" style="padding:4px 10px;font-size:0.8em;margin-left:4px;" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>`;
        }).join('');
    } catch (e) {
        table.innerHTML = `<tr><td colspan="5">Failed to load products</td></tr>`;
    }
}

async function updateStock(id) {
    const newStock = document.getElementById(`stock-${id}`).value;
    try {
        const res = await fetch(`http://localhost:8080/api/admin/products/${id}/stock`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'X-Admin-Secret': adminSecret
            },
            body: JSON.stringify({ stock: parseInt(newStock) })
        });
        if (res.ok) {
            alert('Stock updated successfully!');
            loadProducts();
        } else {
            alert('Failed to update stock');
        }
    } catch (e) {
        alert('Error updating stock');
    }
}

async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
        const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: { 'X-Admin-Secret': adminSecret }
        });
        if (res.ok) {
            alert('Product deleted successfully!');
            loadProducts();
        } else {
            alert('Failed to delete product');
        }
    } catch (e) {
        alert('Error deleting product');
    }
}

async function submitNewProduct() {
    const name = document.getElementById('new-name').value;
    const price = document.getElementById('new-price').value;
    const stock = document.getElementById('new-stock').value;
    const category = document.getElementById('new-category').value;
    const image = document.getElementById('new-image').value || 'images/hero2.jpg';
    const description = document.getElementById('new-desc').value || 'New authentic silk saree.';

    if (!name || !price || !stock) {
        alert("Please fill in Name, Price, and Stock.");
        return;
    }

    const payload = {
        name: name,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(category),
        imageUrl: image,
        description: description
    };

    try {
        const res = await fetch('http://localhost:8080/api/admin/products', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Admin-Secret': adminSecret
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Product added successfully!");
            document.getElementById('new-name').value = '';
            document.getElementById('new-price').value = '';
            document.getElementById('new-stock').value = '';
            document.getElementById('new-image').value = '';
            document.getElementById('new-desc').value = '';
            document.getElementById('add-product-form').style.display = 'none';
            loadProducts();
        } else {
            alert("Failed to add product");
        }
    } catch(e) {
        alert("Network error adding product");
    }
}
