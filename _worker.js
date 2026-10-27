// =============================================================
//  _worker.js — Cloudflare Pages (chế độ Advanced)
//  Xử lý đường dẫn /api/proxy; mọi đường dẫn khác trả về tệp tĩnh.
//  Dùng _worker.js để có thể tải lên bằng kéo-thả (không cần thư mục functions).
//
//  Vai trò:
//   - Giấu link Google Apps Script khỏi mã nguồn phía trình duyệt.
//   - Kiểm tra mật khẩu quản trị NGAY TRÊN SERVER.
//
//  Biến môi trường bắt buộc (Cloudflare → Workers & Pages → project →
//  Settings → Variables and Secrets), KHÔNG commit lên GitHub:
//
//   GOOGLE_SHEET_WEBAPP_URL = https://script.google.com/macros/s/xxx/exec
//   ADMIN_PASSWORD_HASH     = SHA-256 của mật khẩu quản trị
//                             (tạo tại https://emn178.github.io/online-tools/sha256.html)
//
//  Sau khi thêm/đổi biến → Deployments → Retry deployment (hoặc push commit mới).
// =============================================================

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function handleProxy(request, env) {

  if (request.method !== 'GET' && request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8', Allow: 'GET, POST' },
    });
  }

  const WEBAPP_URL = env.GOOGLE_SHEET_WEBAPP_URL;
  if (!WEBAPP_URL) {
    return json({ error: 'Server chưa cấu hình GOOGLE_SHEET_WEBAPP_URL trong Cloudflare (Variables and Secrets)' }, 500);
  }

  try {
    // ------------------------- GET -------------------------
    if (request.method === 'GET') {
      const params = new URL(request.url).searchParams;
      params.set('t', Date.now().toString()); // chống cache
      const upstream = await fetch(`${WEBAPP_URL}?${params.toString()}`, { redirect: 'follow' });
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }

    // ------------------------- POST -------------------------
    let body = {};
    try { body = await request.json(); } catch (e) { body = {}; }
    if (!body || typeof body !== 'object') body = {};

    // Đăng nhập quản trị: xử lý tại đây, KHÔNG chuyển tiếp lên Google Script
    if (body.action === 'admin_login') {
      const expected = String(env.ADMIN_PASSWORD_HASH || '').toLowerCase();
      const provided = String(body.passwordHash || '').toLowerCase();
      return json({ success: Boolean(expected) && provided === expected });
    }

    // Các action khác (add, approve, delete, delete_all, toggle_form, save_state...)
    const upstream = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return json({ error: 'Không kết nối được máy chủ dữ liệu' }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/proxy') return handleProxy(request, env);
    return env.ASSETS.fetch(request);
  },
};
