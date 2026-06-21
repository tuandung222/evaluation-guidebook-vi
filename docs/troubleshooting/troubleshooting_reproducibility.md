---
sidebar_position: 3
sidebar_label: 'Khắc phục lỗi Tái lập'
---

# Khắc phục lỗi tái lập kết quả

Giả sử bạn vừa đọc một báo cáo kỹ thuật về một mô hình mới thú vị và muốn tái lập kết quả của họ... nhưng không thể? Hãy cùng tìm hiểu nguyên nhân.

## Khác biệt về codebase
Để tái lập kết quả đánh giá chính xác đến từng chữ số, trước tiên bạn phải dùng đúng codebase của bài báo muốn tái lập.

Thông thường, điều này có nghĩa là dùng mã đánh giá do tác giả cung cấp, hoặc một triển khai chuẩn trong các thư viện tham chiếu như `lm_eval` của EleutherAI hay `lighteval` của Hugging Face. Nếu mã đánh giá không được công bố, rất tiếc là bạn khó có thể tái lập kết quả chính xác.

Để hiểu rõ những sai lệch nào xảy ra khi dùng các triển khai khác nhau, bạn có thể đọc [bài viết blog này](https://huggingface.co/blog/open-llm-leaderboard-mmlu) (⭐) của đội Hugging Face — nghiên cứu về sự khác biệt giữa 3 triển khai phổ biến của MMLU và ảnh hưởng của chúng đến điểm số.

*Ghi chú: Đây chính là lý do đội Hugging Face khởi chạy [Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) — để có sự so sánh nhất quán giữa các mô hình.*

### Các yếu tố tinh tế khác dễ gây sai lệch
Ngay cả khi dùng cùng một codebase, những điều sau đây rất dễ bị nhầm:
- **Random seed khác nhau.**
	- Quá trình inference thường ít bị ảnh hưởng bởi seed hơn so với huấn luyện. Tuy nhiên, seed vẫn có thể ảnh hưởng đến một số CUDA operation (xem trang PyTorch về [reproducibility](https://pytorch.org/docs/stable/notes/randomness.html)) và thay đổi dự đoán nếu bạn dùng non-greedy generation. Chúng cũng ảnh hưởng đến prompt nếu dùng few-shot, và một số hàm tiền xử lý/hậu xử lý.
	  -> Một thay đổi nhỏ cũng có thể dẫn đến sai lệch vài điểm phần trăm.
- **Thước đo thực tế khác nhau.**
  Các thước đo có thể khác nhau dù cùng tên. Ví dụ:
	- Nếu triển khai gốc dùng `exact match` dựa trên *log-likelihood* (tính xác suất log của các câu trả lời có thể), còn bạn dùng `exact match` dựa trên *generative* (chỉ so sánh câu trả lời sinh ra với nhãn chuẩn), kết quả sẽ khác nhau.
	- Trong thực tế, một số tác vụ định nghĩa là `exact match` nhưng thực ra là `prefix exact match` (chỉ so sánh phần đầu), `suffix exact match` (ngược lại), hay `quasi exact match` (có chuẩn hóa).
	 -> Vì vậy, đừng chỉ dựa vào tên thước đo — hãy đọc trực tiếp code.
- **Chuẩn hóa khác nhau.**
	- Trong `lm_eval` v1, một số tác vụ được đặt tên đơn giản là generative `exact match`, khiến bạn nghĩ kết quả sẽ được so sánh nguyên trạng với nhãn chuẩn.
	  Tuy nhiên, nhìn vào code, dự đoán thực tế trải qua bước chuẩn hóa (bỏ dấu câu, đồng nhất định dạng số, v.v.) trước khi so sánh — điều này rõ ràng ảnh hưởng đáng kể đến kết quả.
	  (`lm_eval` v2 hiện đã đưa tên phương thức chuẩn hóa vào hầu hết tên thước đo.)
	 -> Đây là một trong những điều dễ làm sai nhất, đặc biệt với các tác vụ đòi hỏi nhiều bước chuẩn hóa/hậu xử lý câu trả lời, chẳng hạn như đánh giá toán học (cần trích xuất câu trả lời từ lời giải thích được sinh ra).

## Prompt khác nhau
Có 3 yếu tố chính ảnh hưởng đến sự thay đổi của prompt.

### Bản thân prompt
Định dạng prompt bạn dùng sẽ ảnh hưởng đáng kể đến điểm số.

Ví dụ, với câu hỏi trắc nghiệm (multiple-choice), các biến thể phổ biến khi trình bày lựa chọn bao gồm:

```
Question: <text of the question>
Choices:
```
```markdown
| A. <Choice A> | (A) <Choice A> | <Choice A> | 
| B. <Choice B> | (B) <Choice B> | <Choice B> | 
| C. <Choice C> | (C) <Choice C> | <Choice C> | 
| D. <Choice D> | (D) <Choice D> | <Choice D> | 
```
```
Answer: 
```

và dự đoán `A`/`B`/`C`/`D` hoặc `<Choice A/B/C/D>`.

Các prompt này **tương đương về mặt ngữ nghĩa** vì chứa cùng nội dung — nhưng vẫn có thể dẫn đến sai lệch *vài điểm phần trăm trên cùng một mô hình*. Chúng tôi đã thực nghiệm về vấn đề này [ở đây](https://x.com/clefourrier/status/1777319187913875893/photo/1) (sai lệch lên đến 7 điểm cho cùng một mô hình) và [một bài báo khoa học cũng ghi nhận điều tương tự](https://arxiv.org/abs/2310.11324).

Một số tác vụ còn bắt đầu bằng task prompt (ví dụ: `The following questions are about <topic>`) — sự có mặt hay vắng mặt của nó cũng ảnh hưởng đến điểm số.

[Bài báo xuất sắc này](https://arxiv.org/abs/2407.07890) ⭐ còn chỉ ra một hệ quả đáng lo: một số mô hình hiện nay đã overfit với prompt và định dạng câu trả lời của benchmark, làm giảm khả năng thích nghi với các prompt khác khi đánh giá.

Chúng tôi quan sát điều này trên Open LLM Leaderboard 2 với các mô hình Llama-3.1: chúng dự đoán đúng câu trả lời MATH-Hard nhưng nhận điểm thấp vì không thể khớp với template few-shot — do đã overfit với định dạng câu trả lời của GSM8K.

### System prompt và chat template
Các mô hình chat thường đã qua instruction/preference training hoặc fine-tuning, trong đó chúng học cách tuân theo các template cụ thể. Ví dụ: template có thể yêu cầu bắt đầu hội thoại bằng `system prompt` với các token đặc biệt (thường là `System: `), dùng để cung cấp hướng dẫn cấp cao cho mô hình (persona, phong cách trả lời...). Các lượt hội thoại cũng có thể cần thêm tiền tố như `User` và `Assistant`.

Khi dùng few-shot, bạn cũng cần quyết định: cung cấp các ví dụ dưới dạng multi-turn (mô phỏng lượt user/assistant) hay gộp tất cả vào một user prompt duy nhất.

Không tuân theo chat template mà mô hình mong đợi sẽ làm giảm nghiêm trọng hiệu suất — vì điều đó đẩy đầu ra ra ngoài không gian xác suất mà mô hình đã hội tụ trong quá trình huấn luyện.

### Các mẫu few-shot
Có hai điều rất dễ làm sai với few-shot (xem lại phần inference ở chương Kiến thức chung nếu chưa rõ).

Rõ ràng, bạn cần dùng **cùng số lượng mẫu few-shot** như tác vụ tham chiếu.

Nhưng bạn cũng cần dùng **chính xác cùng các mẫu** — dùng mẫu khác sẽ làm thay đổi kết quả (vì một số mẫu thể hiện tác vụ tốt hơn). Điều đáng ngạc nhiên hơn: bạn không chỉ cần cùng mẫu mà còn phải trình bày chúng **theo đúng thứ tự**. Thay đổi thứ tự của cùng các mẫu khiến chúng tôi quan sát thấy sai lệch lên đến 3 điểm trên một số tập con MMLU (xem [kết quả tại đây](https://huggingface.co/blog/evaluation-structured-outputs), biểu đồ màu thứ ba).

Đây cũng là lý do cần chú ý đến random seed.

## Tham số sinh khác nhau
Với các đánh giá generative, cần chú ý:
- Đảm bảo dùng **cùng end-of-sentence token**.
- Đảm bảo cho phép mô hình **sinh cùng số lượng token**.
- Nếu dùng sampling, đảm bảo dùng **cùng seed/temperature**.

## Cách tải mô hình khác nhau
Một số nguồn gốc sai lệch chúng tôi quan sát được:
- **Phần cứng khác nhau.**
  PyTorch không đảm bảo reproducibility của các non-deterministic operation trên phần cứng khác nhau.
- **Thư viện khác nhau.**
  Ví dụ: dùng `transformers` so với `vllm` làm inference backend — các phép nhân ma trận không được quản lý hoàn toàn theo cùng một cách.
- **Batch size khác nhau.**
  Đã có tài liệu chứng minh trong một số thư viện đánh giá và inference backend rằng batch size khác nhau sẽ làm thay đổi kết quả. Nếu muốn reproducibility hoàn toàn, bạn nên cố định batch size — dù điều này không phải lúc nào cũng khả thi do giới hạn bộ nhớ.
- **Loading precision khác nhau** cho trọng số mô hình.
  Dùng precision thấp hơn giảm chi phí bộ nhớ và inference, nhưng cũng thay đổi kết quả số học vì bạn đang dùng các phiên bản trọng số khác nhau.
