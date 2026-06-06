# Cẩm nang Đánh giá LLM (LLM Evaluation Guidebook - Vietnamese Translation)

Bản dịch tiếng Việt hoàn chỉnh của cuốn sách **"LLM Evaluation Guidebook"** do Hugging Face biên soạn. Đây là tài liệu hướng dẫn thực tế, toàn diện từ cơ bản đến nâng cao về cách đánh giá các Mô hình Ngôn ngữ Lớn (LLMs).

## Cấu trúc Trang Web Docusaurus

Trang web được thiết lập dưới dạng website Docusaurus 3.10.1 tĩnh với các tính năng:
- **Đa ngữ / Bản địa hóa:** Mặc định ngôn ngữ tiếng Việt (`vi`).
- **Giao diện Glassmorphism:** Chủ đề tối/tím sang trọng dựa trên font chữ Outfit và Inter.
- **Tích hợp Công thức Toán & Sơ đồ:** Hỗ trợ render KaTeX cho công thức toán học và theme Mermaid cho biểu đồ, sơ đồ quy trình.
- **Tự động Deploy:** Deploy trực tiếp lên GitHub Pages qua GitHub Actions.

## Cài đặt và Chạy cục bộ (Local Development)

Đảm bảo bạn đã cài đặt Node.js (phiên bản 18 trở lên).

1. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

2. **Chạy máy chủ thử nghiệm cục bộ:**
   ```bash
   npm run start
   ```
   Trang web sẽ hiển thị tại địa chỉ: `http://localhost:3000/evaluation-guidebook-vi/`

3. **Xây dựng phiên bản Production:**
   ```bash
   npm run build
   ```

4. **Kiểm tra kiểu dữ liệu TypeScript:**
   ```bash
   npm run typecheck
   ```

## Tiêu chuẩn Dịch thuật & Đóng góp

Vui lòng đọc kỹ hướng dẫn trong tệp [AGENT.md](./AGENT.md) trước khi dịch thuật hoặc chỉnh sửa nội dung tài liệu. Quy chuẩn bao gồm:
- Giọng văn chuyên nghiệp, khách quan, tự nhiên trong tiếng Việt kỹ thuật.
- Sử dụng bảng thuật ngữ Glossary thống nhất.
- Hướng dẫn định dạng MDX (YAML frontmatter, GFM Alerts, MDX safety).

## Bản quyền

- Dự án dịch thuật được thực hiện phi lợi nhuận nhằm đóng góp cho cộng đồng AI Việt Nam.
- Tài liệu gốc thuộc bản quyền của Hugging Face.
