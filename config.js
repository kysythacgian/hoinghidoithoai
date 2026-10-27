// =============================================================
//  CONFIG.JS — Cấu hình hiển thị của ứng dụng Quản trị Hội nghị
//  Chỉ chứa các giá trị KHÔNG nhạy cảm (tiêu đề, nhãn, thời gian...).
//
//  ⚠️ Link Google Apps Script (WEBAPP_URL) và hash mật khẩu quản trị
//  (ADMIN_PASSWORD_HASH) KHÔNG còn nằm ở đây nữa — vì file này chạy
//  ở trình duyệt nên ai xem "View Page Source" cũng đọc được.
//
//  Hai giá trị đó giờ được cấu hình trong Cloudflare Pages:
//    Workers & Pages → (project) → Settings → Variables and Secrets
//      GOOGLE_SHEET_WEBAPP_URL = https://script.google.com/macros/s/xxx/exec
//      ADMIN_PASSWORD_HASH     = <SHA-256 của mật khẩu quản trị>
//  Tạo hash tại: https://emn178.github.io/online-tools/sha256.html
//  Sau khi thêm/sửa biến môi trường → tạo lại bản triển khai (Retry deployment / push commit mới).
//
//  Toàn bộ ứng dụng giờ gọi qua /api/proxy (xem functions/api/proxy.js) thay vì
//  gọi thẳng WEBAPP_URL, nên WEBAPP_URL không bao giờ lộ ra client.
// =============================================================

const APP_CONFIG = {

    // ----------------------------------------------------------
    //  1. ĐƯỜNG DẪN API NỘI BỘ (proxy trên Cloudflare Pages)
    //     KHÔNG sửa dòng này — đây là API route của chính app,
    //     không phải link Google Script.
    // ----------------------------------------------------------
    WEBAPP_URL: '/api/proxy',

    // ----------------------------------------------------------
    //  2. LIÊN KẾT ĐIỀU HƯỚNG
    // ----------------------------------------------------------
    HOME_URL: 'index.html',          // Trang chủ (Về trang chủ / bottom nav)

    // ----------------------------------------------------------
    //  3. TIÊU ĐỀ & NỘI DUNG HIỂN THỊ
    // ----------------------------------------------------------
    APP_TITLE:    'Duyệt Ý Kiến',
    APP_SUBTITLE: 'Quản lý phát biểu tại hội nghị đối thoại',
    LOGIN_TITLE:  'Quản trị viên',
    LOGIN_SUB:    'Đăng nhập để quản lý ý kiến hội nghị đối thoại',

    // ----------------------------------------------------------
    //  4. PHẢN HỒI MẶC ĐỊNH KHI "TIẾP NHẬN" Ý KIẾN
    // ----------------------------------------------------------
    DEFAULT_CT_FEEDBACK: 'Đã tiếp nhận ý kiến, chủ toạ sẽ trả lời khi kết luận',

    // ----------------------------------------------------------
    //  5. TẦN SUẤT TỰ ĐỘNG LÀM MỚI DANH SÁCH (mili-giây)
    //     12000 = 12 giây
    // ----------------------------------------------------------
    AUTO_REFRESH_MS: 12000,

};
