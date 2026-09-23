// api/service.js
// Connect React frontend to Django backend
// Set VITE_API_URL in .env.local for local dev, or in Netlify env vars for production

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = {
  // ─── Products ─────────────────────────────────────
  async getProducts(category = '') {
    const url = category
      ? `${BASE_URL}/products/?category=${category}`
      : `${BASE_URL}/products/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}/`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  // ─── Categories ───────────────────────────────────
  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories/`);
    return res.json();
  },

  // ─── Orders ───────────────────────────────────────
  async createOrder(cartItems, total, customerInfo = {}) {
    const payload = {
      customer_name: customerInfo.name || '',
      customer_phone: customerInfo.phone || '+91 8675554222',
      customer_address: customerInfo.address || '',
      total_amount: total,
      whatsapp_message: buildWhatsappMessage(cartItems, total),
      items: cartItems.map(item => ({
        product_name: item.p.name,
        price: item.p.price,
        quantity: item.qty,
        color: item.color || '',
        size: item.size || '',
      })),
    };

    const res = await fetch(`${BASE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Order failed');
    return res.json();
  },

  // ─── Health Check ─────────────────────────────────
  async ping() {
    const res = await fetch(`${BASE_URL}/health/`);
    return res.json();
  },
};

export function buildWhatsappMessage(cartItems, total) {
  let msg = `🛒 *New Order — Knit and Melt*\n━━━━━━━━━━━━━━\n\n`;
  cartItems.forEach((it, i) => {
    msg += `*${i + 1}. ${it.p.name}*\n`;
    if (it.color) msg += `   🎨 Colour: ${it.color}\n`;
    if (it.size)  msg += `   📐 Size: ${it.size}\n`;
    msg += `   📦 Qty: ${it.qty}\n`;
    msg += `   💰 ₹${it.p.price} × ${it.qty} = ₹${it.p.price * it.qty}\n\n`;
  });
  msg += `━━━━━━━━━━━━━━\n💎 *Total: ₹${total}*\n\n📍 Knit and Melt, Ooty\nThank you! 🙏`;
  return msg;
}

export default api;
