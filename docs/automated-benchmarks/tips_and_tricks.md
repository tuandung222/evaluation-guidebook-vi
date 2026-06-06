---
sidebar_position: 4
sidebar_label: 'Mẹo & Thủ thuật'
---

# Mẹo và thủ thuật

## Quản lý nhiễm bẩn dữ liệu

Nhìn chung, bạn nên giả định rằng bất kỳ bộ dữ liệu nào công khai trên internet đều đã hoặc sẽ bị nhiễm bẩn (contaminated).

Các giải pháp để giảm thiểu vấn đề này bao gồm:
- Cung cấp một **chuỗi canary (canary string)** trong bộ đánh giá (như trong [BigBench](https://github.com/google/BIG-bench)): đây là một tổ hợp ký tự cụ thể mà những người tạo mô hình có thể tìm kiếm trong bộ dữ liệu huấn luyện của họ để xác định xem liệu bộ dữ liệu đó có chứa dữ liệu đánh giá hay không.
- Cung cấp các bộ đánh giá ở dạng **[mã hóa](https://arxiv.org/abs/2309.16575) hoặc [giới hạn quyền truy cập (gated)](https://huggingface.co/datasets/Idavidrein/gpqa)** để chúng không thể dễ dàng bị quét bởi các trình thu thập thông tin web (web crawlers) - nhờ đó tránh việc vô tình lọt vào các bộ dữ liệu huấn luyện.
- Chạy các **[bộ thử nghiệm động (dynamic benchmarks)](https://arxiv.org/abs/2104.14337)**: các bộ thử nghiệm được cập nhật thường xuyên theo thời gian để mô hình không thể "học thuộc lòng câu trả lời" (tuy nhiên phương pháp này khiến chi phí vũ dựng bộ dữ liệu cao hơn).
- Nếu bạn đang chạy một bộ thử nghiệm, hãy thử **[phát hiện nhiễm bẩn](https://arxiv.org/abs/2311.06233) sau thực tế (post-hoc)** (ví dụ: bằng cách xem xét độ nhiễu loạn của văn bản được sinh ra (perplexity) hoặc thiết kế các phiên bản đối nghịch của prompt - tuy nhiên, không có phương pháp nào là hoàn toàn tuyệt đối để phát hiện nhiễm bẩn dữ liệu).

Tuy nhiên, nhiễm bẩn dữ liệu không đồng nghĩa với việc bộ dữ liệu đó hoàn toàn mất đi giá trị và không mang lại tín hiệu hữu ích nào trong quá trình huấn luyện.

## Các vấn đề thực tế bạn có thể gặp phải

### Mô hình tinh chỉnh (Fine-tuned models), system prompt và chat template

Nhiều mô hình được tinh chỉnh theo chỉ dẫn (instruction-tuned models) sẽ hoạt động rất kém nếu bạn không đảm bảo:
- Thêm system prompt của chúng vào ngay đầu quá trình suy luận (inference).
- Sử dụng chat template (mẫu hội thoại) khi viết prompt (thường là thêm các tiền tố `Assistant` và `User` vào các lượt hội thoại - tìm hiểu thêm về điều này trong [hướng dẫn tuyệt vời này](https://huggingface.co/docs/transformers/main/en/chat_templating)).

Một điều rất quan trọng khác là không được giả định rằng các bộ phân tách từ (tokenizer) khác nhau sẽ hoạt động giống nhau, đặc biệt là đối với chat template. Bạn có thể thấy rõ điều này trong hình ảnh minh họa về khoảng cách token hóa (tokenization spacing) và chat template dưới đây, trích từ [tweet này](https://x.com/danielhanchen/status/1796952220619157694).

![Khoảng cách, tokenization và template](https://pbs.twimg.com/media/GPANfpiasAA9b6F?format=png&name=medium)

### Tokenization

1. **Token hóa ngữ cảnh và các lựa chọn cùng nhau hay riêng biệt**

Khi thực hiện đánh giá trắc nghiệm (MCQA), nhìn chung, bạn nên thực hiện tokenization cho ngữ cảnh (context) cùng với các lựa chọn (choices), vì điều này tạo ra một chuỗi các token tự nhiên và quen thuộc hơn đối với mô hình.

Tuy nhiên, một số tokenizer (chẳng hạn như [tokenizer của Llama](https://github.com/EleutherAI/lm-evaluation-harness/pull/531#issuecomment-1595586257)) không đáp ứng tính chất `enc(context + choice) = enc(context) + enc(choice)` (chúng tự động thêm hoặc bớt khoảng trắng). Điều này khiến việc so sánh xác suất log (log-probabilities) của các lựa chọn trở nên khó khăn, do các token của ngữ cảnh có thể bị "rò rỉ" sang các token của lựa chọn, làm sai lệch kết quả so sánh.

Do đó, nếu mô hình của bạn gặp phải trường hợp này, bạn nên tính toán các token của ngữ cảnh và lựa chọn một cách riêng biệt, sau đó nối chúng lại với nhau sau khi đã loại bỏ các token đặc biệt đánh dấu đầu/cuối câu (start/end of sentence tokens) nếu chúng được tự động thêm vào.

2. **Chú ý đến các token bắt đầu và kết thúc câu**

Một số mô hình, chẳng hạn như dòng mô hình `Gemma`, cực kỳ nhạy cảm với việc [có hay không có các token bắt đầu câu (start of sentence tokens)](https://github.com/EleutherAI/lm-evaluation-harness/pull/1465) khi suy luận. Bạn có thể cần thực hiện một vài thử nghiệm để xem liệu mô hình của mình có gặp tình trạng này hay không, và tự tay thêm các token này khi đánh giá.

Bạn cũng có thể gặp phải trường hợp mô hình không dừng lại ở token kết thúc câu như kỳ vọng (ví dụ: dấu ngắt dòng `\n`), bởi vì mô hình không dự đoán token này đứng riêng lẻ mà gộp chung vào một token ở cấp độ cao hơn (ví dụ: `\n\n` có thể là một token duy nhất, đặc biệt là đối với các mô hình sinh mã nguồn). Trong trường hợp này, bạn có thể cần thêm một bước kiểm tra cụ thể để "quay lui" (backtrack) trên văn bản được tạo ra, nhằm đảm bảo cắt câu ở đúng vị trí trước khi tính toán các thước đo (metrics).

3. **Đa ngôn ngữ và tokenization**

Khi thực hiện các đánh giá đa ngôn ngữ, bạn cũng cần xem xét cách phân tách từ cho văn bản của mình tùy thuộc vào tác vụ đánh giá và thước đo sử dụng. Vì một số ngôn ngữ không dùng khoảng trắng để phân tách từ (ví dụ như tiếng Hàn, tiếng Thái, tiếng Nhật, tiếng Trung), chúng sẽ yêu cầu các tokenizer chuyên biệt cho ngôn ngữ đó để phân tách chính xác. Nếu không, kết quả điểm số của các thước đo như [BLEU](https://github.com/EleutherAI/lm-evaluation-harness/issues/212), điểm F1, v.v. sẽ bị ảnh hưởng tiêu cực.

4. **Đánh giá sinh mã nguồn và token kết thúc câu**

Các mô hình lập trình (code models) thường được huấn luyện với `\n\t` (ngắt dòng + thụt lề) như một token duy nhất. Điều này có nghĩa là khi sinh văn bản, chúng thường tạo ra `\n\t` trong một bước suy luận duy nhất. Nếu một tác vụ định nghĩa `\n` là token kết thúc câu (để dừng việc sinh văn bản), mô hình vẫn sẽ tiếp tục sinh văn bản sau khi tạo ra `\n\t` (nếu được dự đoán là một token duy nhất), vì nó không giống hệt với `\n`. Nhưng thực tế là bạn vẫn muốn mô hình dừng lại. Trong những trường hợp này, bạn cần cập nhật lại các token kết thúc câu của mình, hoặc định nghĩa một cơ chế quay lui (backtrack) trên biểu diễn ký tự của các token mới nhất để dừng và cắt phần văn bản được sinh ra một cách hồi tố (a posteriori).

### Tăng tốc dễ dàng cho các đánh giá trắc nghiệm (MCQA)

Bạn có thể tăng tốc đáng kể tốc độ dự đoán trắc nghiệm (MCQA) nếu đảm bảo rằng mô hình chỉ cần dự đoán một token duy nhất cho tác vụ đó.

Bằng cách này, thay vị phải chạy `number_of_choices` (số lượng lựa chọn) lượt dự đoán (`ngữ cảnh + lựa chọn 1`, `ngữ cảnh + lựa chọn 2`, v.v.), bạn chỉ cần chạy suy luận một lần duy nhất trên phần `ngữ cảnh` và tính toán phân phối xác suất trên toàn bộ từ vựng (vocabulary - vốn sẽ bao gồm cả các lựa chọn dạng một token của bạn) để lấy được các xác suất log cần thiết trong một lượt truyền duy nhất.

(Đó chính là cách chúng tôi thực hiện trong thư viện `lighteval`).

## Kết quả kém bất ngờ trên các đánh giá sinh văn bản (generative evaluations)

Điều đầu tiên bạn cần làm luôn là kiểm tra chi tiết các văn bản do mô hình sinh ra. Một số vấn đề thường gặp cần tìm kiếm khi khắc phục sự cố là:
- Phân tích cú pháp đầu ra (output parsing) quá nghiêm ngặt trước khi tính toán thước đo, dẫn đến việc câu trả lời bị bỏ sót.
  - **Cách khắc phục**: Điều chỉnh lại bộ phân tích cú pháp của bạn.
- Mô hình không thể tuân theo định dạng đầu ra mong muốn trong thiết lập few-shot (thường gặp ở các mô hình gần đây được huấn luyện trên dữ liệu chỉ dẫn, như Llama 3.2 hoặc Qwen 2.5).
  - **Cách khắc phục**: Điều chỉnh định dạng prompt của bạn, hoặc chấp nhận rằng mô hình cần có khả năng tuân theo định dạng đó trong thiết lập few-shot.
- Mô hình quá dông dài (verbose) và không bao giờ đi thẳng vào câu trả lời đúng (thường gặp ở các mô hình hỗ trợ ngữ cảnh dài và là điều chúng tôi quan sát thấy ở các mô hình Qwen và CommandR).
  - **Cách khắc phục**: Tăng độ dài ngữ cảnh tối đa cho phép, thêm chỉ dẫn yêu cầu mô hình trả lời ngắn gọn trong prompt của tác vụ, hoặc chấp nhận rằng mô hình cần có khả năng trả lời một cách cô đọng.
