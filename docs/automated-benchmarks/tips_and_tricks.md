---
sidebar_position: 4
sidebar_label: 'Mẹo & Thủ thuật'
---

# Mẹo và thủ thuật

## Quản lý nhiễm bẩn dữ liệu

Nhìn chung, hãy giả định rằng bất kỳ bộ dữ liệu nào công khai trên internet đều đã hoặc sẽ bị nhiễm bẩn.

Một số giải pháp để giảm thiểu vấn đề này:
- Nhúng **chuỗi canary** vào bộ đánh giá (như trong [BigBench](https://github.com/google/BIG-bench)): đây là một tổ hợp ký tự đặc biệt mà người tạo mô hình có thể tìm kiếm trong tập huấn luyện để xác định xem dữ liệu đánh giá có bị lọt vào không.
- Cung cấp bộ đánh giá ở dạng **[mã hóa](https://arxiv.org/abs/2309.16575) hoặc [có kiểm soát truy cập (gated)](https://huggingface.co/datasets/Idavidrein/gpqa)** để web crawler không thể quét dễ dàng — từ đó tránh bị lọt vào tập huấn luyện.
- Dùng **[benchmark động](https://arxiv.org/abs/2104.14337)**: các benchmark được cập nhật thường xuyên để mô hình không thể "học thuộc lòng" câu trả lời (tuy nhiên cách này làm tăng chi phí xây dựng bộ dữ liệu).
- Nếu bạn đang chạy một benchmark, hãy thử **[phát hiện nhiễm bẩn sau thực tế](https://arxiv.org/abs/2311.06233)** — ví dụ bằng cách xem xét perplexity của văn bản sinh ra hoặc thiết kế các biến thể đối nghịch của prompt (tuy nhiên, không có phương pháp nào là hoàn toàn chắc chắn).

Dù vậy, nhiễm bẩn dữ liệu không đồng nghĩa với việc bộ dữ liệu đó hoàn toàn mất giá trị — nó vẫn có thể cung cấp tín hiệu hữu ích trong quá trình huấn luyện.

## Các vấn đề thực tế thường gặp

### Mô hình fine-tuned, system prompt và chat template

Nhiều instruction-tuned model sẽ hoạt động rất kém nếu bạn không đảm bảo:
- Thêm system prompt của chúng vào đầu quá trình inference.
- Sử dụng chat template khi viết prompt (thường là thêm tiền tố `Assistant` và `User` vào các lượt hội thoại — xem [hướng dẫn chi tiết này](https://huggingface.co/docs/transformers/main/en/chat_templating)).

Một điều quan trọng nữa: đừng giả định rằng các tokenizer khác nhau sẽ hoạt động giống nhau, đặc biệt với chat template. Bạn có thể thấy rõ điều này trong minh họa về tokenization spacing và chat template bên dưới, trích từ [tweet này](https://x.com/danielhanchen/status/1796952220619157694).

![Khoảng cách, tokenization và template](https://pbs.twimg.com/media/GPANfpiasAA9b6F?format=png&name=medium)

### Tokenization

1. **Tokenize ngữ cảnh và lựa chọn cùng nhau hay riêng biệt**

Khi đánh giá trắc nghiệm (MCQA), thông thường bạn nên tokenize ngữ cảnh cùng với lựa chọn, vì chuỗi token tạo ra sẽ tự nhiên và quen thuộc hơn với mô hình.

Tuy nhiên, một số tokenizer (chẳng hạn như [tokenizer của Llama](https://github.com/EleutherAI/lm-evaluation-harness/pull/531#issuecomment-1595586257)) không thỏa mãn `enc(context + choice) = enc(context) + enc(choice)` — chúng tự động thêm hoặc bớt khoảng trắng. Điều này khiến việc so sánh log-probability của các lựa chọn trở nên khó chính xác, vì token của ngữ cảnh có thể "rò rỉ" sang token của lựa chọn.

Trong trường hợp này, nên tokenize ngữ cảnh và lựa chọn riêng biệt, sau đó nối lại sau khi đã bỏ các special token (start/end of sentence) được tự động thêm vào.

2. **Lưu ý các token bắt đầu và kết thúc câu**

Một số mô hình, như dòng `Gemma`, rất nhạy cảm với việc [có hay không có start-of-sentence token](https://github.com/EleutherAI/lm-evaluation-harness/pull/1465) trong inference. Bạn có thể cần thử nghiệm để xác định mô hình của mình có gặp tình trạng này không, rồi tự tay thêm các token này khi đánh giá.

Bạn cũng có thể gặp tình trạng mô hình không dừng ở stop token như kỳ vọng (ví dụ: dấu ngắt dòng `\n`), vì mô hình dự đoán `\n` không phải là token riêng mà gộp chung vào token cấp cao hơn (ví dụ: `\n\n` có thể là một token — đặc biệt phổ biến với các mô hình sinh code). Trong trường hợp này, bạn có thể cần thêm bước kiểm tra để "backtrack" trên văn bản vừa sinh ra và cắt đúng vị trí trước khi tính thước đo.

3. **Đa ngôn ngữ và tokenization**

Với đánh giá đa ngôn ngữ, cần chú ý cách phân tách từ tùy theo ngôn ngữ và thước đo sử dụng. Một số ngôn ngữ không dùng khoảng trắng để phân tách từ (tiếng Hàn, Thái, Nhật, Trung) — cần dùng tokenizer chuyên biệt. Nếu không, điểm của các thước đo như [BLEU](https://github.com/EleutherAI/lm-evaluation-harness/issues/212), F1, v.v. sẽ bị ảnh hưởng tiêu cực.

4. **Đánh giá sinh code và stop token**

Các model lập trình thường được huấn luyện với `\n\t` (ngắt dòng + thụt lề) là một token duy nhất. Khi sinh văn bản, chúng thường tạo `\n\t` trong một bước. Nếu tác vụ định nghĩa `\n` là stop token để dừng sinh, mô hình vẫn sẽ tiếp tục sau khi sinh `\n\t` — vì nó không khớp chính xác với `\n`. Trong những trường hợp này, bạn cần cập nhật stop token, hoặc thêm cơ chế backtrack trên chuỗi ký tự của các token mới nhất để dừng và cắt văn bản sinh ra đúng chỗ.

### Tăng tốc đánh giá trắc nghiệm (MCQA)

Bạn có thể tăng tốc đáng kể bằng cách đảm bảo mô hình chỉ cần dự đoán một token duy nhất cho tác vụ đó.

Thay vì phải chạy `số_lượng_lựa_chọn` lượt dự đoán (`context + choice 1`, `context + choice 2`, v.v.), bạn chỉ cần inference một lần trên phần `context` và tính phân phối xác suất trên toàn bộ vocabulary — vốn đã bao gồm cả các lựa chọn dạng một token — để lấy log-probability cần thiết trong một lượt duy nhất.

*(Đó chính là cách chúng tôi triển khai trong thư viện `lighteval`.)*

## Kết quả kém bất ngờ trên đánh giá generative

Bước đầu tiên luôn là kiểm tra chi tiết văn bản mô hình sinh ra. Một số vấn đề thường gặp:
- Output parsing quá nghiêm ngặt trước khi tính thước đo, khiến câu trả lời đúng bị bỏ sót.
  - **Khắc phục**: Điều chỉnh lại parser của bạn.
- Mô hình không tuân theo định dạng đầu ra mong muốn trong few-shot (thường gặp với các mô hình gần đây được huấn luyện trên dữ liệu instruction, như Llama 3.2 hoặc Qwen 2.5).
  - **Khắc phục**: Điều chỉnh định dạng prompt, hoặc chấp nhận rằng mô hình cần có khả năng tuân theo định dạng đó trong few-shot.
- Mô hình quá dài dòng (verbose) và không bao giờ đi thẳng vào câu trả lời (thường gặp với các mô hình hỗ trợ context dài — chúng tôi quan sát thấy điều này với Qwen và CommandR).
  - **Khắc phục**: Tăng độ dài context tối đa, thêm chỉ dẫn yêu cầu trả lời ngắn gọn trong prompt, hoặc chấp nhận rằng mô hình cần có khả năng trả lời cô đọng.
