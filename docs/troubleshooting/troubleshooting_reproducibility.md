---
sidebar_position: 3
sidebar_label: 'Khắc phục lỗi Tái lập'
---

# Khắc phục lỗi tái lập kết quả

Giả sử bạn vừa đọc một báo cáo kỹ thuật gần đây về một mô hình mới rất thú vị và bạn muốn tái lập kết quả của họ trên máy của mình... nhưng bạn lại không thực hiện được?
Hãy cùng tìm hiểu lý do tại sao.

## Khác biệt về mã nguồn (Different code base)
Để tái lập kết quả đánh giá chính xác đến từng chữ số thập phân, trước tiên bạn cần đảm bảo rằng mình đang sử dụng chính xác cùng một mã nguồn (codebase) với bài báo mà bạn muốn tái lập kết quả.

Thông thường, điều này có nghĩa là bạn phải sử dụng mã nguồn đánh giá mặc định do chính các tác giả cung cấp, hoặc một triển khai chuẩn trong các thư viện tham chiếu như `lm_eval` của EleutherAI hoặc `lighteval` của Hugging Face. Tuy nhiên, nếu mã nguồn đánh giá không được cung cấp, thì rất tiếc là bạn khó có thể tái lập kết quả một cách chính xác.

Nếu bạn muốn dễ dàng hiểu những sai lệch nào xảy ra khi sử dụng các triển khai khác nhau, bạn có thể tham khảo [bài viết blog này](https://huggingface.co/blog/open-llm-leaderboard-mmlu) (⭐) mà chúng tôi đã viết cùng đội ngũ đánh giá tại Hugging Face. Bài viết này nghiên cứu các khác biệt mà chúng tôi quan sát được giữa 3 triển khai phổ biến của đánh giá MMLU (trong `lm_eval`, `helm`, và trong triển khai gốc của tác giả), cũng như cách chúng thay đổi điểm số của mô hình như thế nào.

*Ghi chú: Đây chính xác là lý do tại sao đội ngũ Hugging Face quyết định khởi chạy [Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard), nhằm có được sự so sánh thống nhất và đồng nhất giữa điểm số của các mô hình để so sánh với các thử nghiệm nội bộ.*

### Các yếu tố tinh tế khác làm cho việc triển khai có thể khác nhau
Chúng tôi quan sát thấy những điều sau đây rất dễ bị nhầm lẫn, ngay cả khi sử dụng cùng một mã nguồn:
- **Seed ngẫu nhiên (random seeds) khác nhau.**
	- Thông thường, quá trình suy luận (inference) ít bị ảnh hưởng bởi seed ngẫu nhiên hơn so với quá trình huấn luyện. Tuy nhiên, chúng vẫn có thể ảnh hưởng đến một số hoạt động CUDA (xem trang PyTorch về [khả năng tái lập](https://pytorch.org/docs/stable/notes/randomness.html)) và thay đổi dự đoán nếu bạn đang sử dụng chiến lược tạo không tham lam (non-greedy generation strategy). Chúng cũng có thể ảnh hưởng đến prompt nếu bạn đang sử dụng few-shot, cũng như một số hàm tiền xử lý hoặc hậu xử lý.
	  -> Một thay đổi nhỏ cũng có thể dẫn đến sự khác biệt vài điểm phần trăm.
- **Thước đo (metric) thực tế khác nhau.**
  Các thước đo có thể khác nhau trên thực tế ngay cả khi chúng có cùng tên gọi. Một số ví dụ:
	- Nếu triển khai gốc sử dụng `exact match` dựa trên *log-likelihood* (tính toán xác suất log của các câu trả lời khả dĩ khác nhau), và bạn đang sử dụng `exact match` dựa trên *tạo sinh (generative)* (chỉ so sánh câu trả lời được tạo ra một cách tham lam với nhãn chuẩn), bạn sẽ không nhận được cùng một điểm số.
	- Chúng tôi cũng thấy trong các mã nguồn đánh giá, một số tác vụ được định nghĩa là `exact match`, nhưng thực tế lại là `prefix exact match` (chỉ so sánh phần đầu của văn bản được tạo ra với nhãn chuẩn), hoặc `suffix exact match` (ngược lại), hoặc `quasi exact match` (exact match có chuẩn hóa).
	 -> Do đó, bạn không thể chỉ dựa vào tên của thước đo để xác định những gì đang xảy ra, mà cần phải xem trực tiếp mã nguồn.
- **Cách thức chuẩn hóa (normalization) khác nhau.**
	- Để quay lại ví dụ so sánh `exact match` ở trên, trong `lm_eval` phiên bản v1, một số tác vụ chỉ đơn giản được đặt tên là generative `exact match`: từ đó bạn sẽ giả định rằng kết quả dự đoán sẽ được *so sánh nguyên trạng* với nhãn chuẩn.
	  Tuy nhiên, khi nhìn vào mã nguồn, dự đoán sẽ trải qua một bước chuẩn hóa (loại bỏ dấu câu, đồng nhất định dạng số, v.v.) trước khi được so sánh với nhãn chuẩn. Điều này rõ ràng sẽ làm thay đổi kết quả khá nhiều.
	  (Thư viện `lm_eval` v2 hiện đã đưa tên phương thức chuẩn hóa vào trong hầu hết tên của các thước đo.)
	 -> Đây là một trong những điều dễ làm sai nhất, đặc biệt là đối với các tác vụ đòi hỏi nhiều bước chuẩn hóa/hậu xử lý câu trả lời, chẳng hạn như đánh giá toán học (nơi bạn cần trích xuất câu trả lời từ một lời giải thích được tạo ra).

## Prompt khác nhau (Different prompt)
Có 3 yếu tố chính ảnh hưởng đến sự thay đổi của prompt.

### Bản thân prompt (Prompt itself)
Định dạng prompt bạn sử dụng có thể và sẽ làm thay đổi điểm số một cách đáng kể.

Ví dụ, đối với các câu hỏi trắc nghiệm (multi-choice), một số định dạng phổ biến bao gồm các biến thể rất đơn giản khi trình bày các lựa chọn, chẳng hạn như:

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

và dự đoán `A`/`B`/`C`/`D` hoặc `&lt;Choice A/B/C/D&gt;`.

Các prompt này **tương đương về mặt ngữ nghĩa (semantically equivalent)**, vì chúng chứa cùng một nội dung chính xác - nhưng chúng vẫn có thể dẫn đến sự khác biệt *vài điểm phần trăm cho cùng một mô hình*. Chúng tôi đã thực hiện một số thử nghiệm về vấn đề này [ở đây](https://x.com/clefourrier/status/1777319187913875893/photo/1) (bạn sẽ thấy sự khác biệt lên tới 7 điểm cho cùng một mô hình) và một [bài báo khoa học cũng quan sát thấy kết quả tương tự](https://arxiv.org/abs/2310.11324).

Một số tác vụ cũng được bắt đầu bằng một prompt tác vụ (ví dụ: `The following questions are about &lt;topic&gt;`) - sự xuất hiện hoặc vắng mặt của nó cũng sẽ ảnh hưởng đến điểm số.

[Bài báo tuyệt vời này](https://arxiv.org/abs/2407.07890)⭐ cũng nhấn mạnh một tác dụng phụ của việc này: một số mô hình hiện nay được huấn luyện để quá khớp (overfit) với prompt của bộ thử nghiệm (benchmark) và định dạng câu trả lời, dẫn đến việc khả năng thích ứng với các prompt khác tại thời điểm đánh giá bị suy giảm.

Đây là điều chúng tôi quan sát được trên Open LLM Leaderboard 2 đối với các mô hình Llama-3.1. Chúng dự đoán đúng câu trả lời cho các bài đánh giá MATH-Hard của chúng tôi, nhưng lại nhận được điểm số thấp do không thể khớp với mẫu (template) được cung cấp trong few-shot, bởi vì chúng đã bị quá khớp với prompt và định dạng câu trả lời của GSM8K (một bài đánh giá toán học khác).

### System prompt và mẫu hội thoại (chat template)
Các mô hình chat thường đã trải qua quá trình huấn luyện theo chỉ dẫn/sở thích (instruction/preference training) hoặc tinh chỉnh (fine-tuning). Trong giai đoạn này, chúng đã học cách tuân theo các mẫu (template) cụ thể khi suy luận. Ví dụ: mẫu có thể yêu cầu bắt đầu các lượt hội thoại bằng một prompt chung (được gọi là `system prompt`) bắt đầu bằng các token cụ thể (thường là `System: `). Prompt này dùng để cung cấp các hướng dẫn cấp cao cho mô hình, chẳng hạn như tính cách của mô hình (persona) hoặc hướng dẫn chung về phong cách trả lời. Các lượt hội thoại cũng có thể yêu cầu thêm các từ khóa tiền tố vào văn bản, như `User` cho câu hỏi và `Assistant` cho câu trả lời.

Khi sử dụng few-shot, bạn cũng cần lựa chọn xem có muốn các ví dụ được cung cấp dưới dạng hội thoại nhiều lượt (multi-turn) (mô phỏng các lượt của user/assistant) hay cung cấp tất cả cùng một lúc (trong một user prompt duy nhất).

Việc không tuân theo mẫu hội thoại (chat template) mà mô hình mong đợi khi suy luận sẽ làm giảm nghiêm trọng hiệu suất của nó, vì điều đó sẽ đẩy đầu ra của nó ra ngoài không gian xác suất mà nó đã hội tụ.

### Các mẫu few-shot (Few-shots samples)
Có hai điều rất dễ làm sai đối với các mẫu few-shot (xem lại phần suy luận mô hình ở chương Kiến thức chung nếu bạn không chắc chắn nó là gì).

Rõ ràng, bạn cần sử dụng **cùng số lượng mẫu few-shot** như tác vụ tham chiếu của bạn.

Tuy nhiên, bạn cũng cần sử dụng **chính xác cùng các mẫu** như mô hình bạn đang so sánh, vì việc sử dụng các mẫu khác nhau sẽ làm thay đổi kết quả (điều này không quá ngạc nhiên, nếu chúng ta giả định rằng một số mẫu thể hiện tác vụ tốt hơn những mẫu khác). Điều đáng ngạc nhiên hơn có thể là: bạn không chỉ cần sử dụng chính xác cùng các mẫu, mà còn phải trình bày chúng theo **chính xác cùng một thứ tự**. Việc thay đổi thứ tự của cùng các mẫu đã khiến chúng tôi quan sát thấy sự khác biệt lên đến 3 điểm trên một số tập con của MMLU (bạn có thể xem [một số kết quả tại đây](https://huggingface.co/blog/evaluation-structured-outputs), đó là biểu đồ màu thứ ba).

Đây cũng là một điểm mà việc chú ý đến seed ngẫu nhiên là rất quan trọng.

## Các tham số tạo sinh khác nhau (Different generation parameters)
Đối với các đánh giá dạng tạo sinh (generative), các tham số cần chú ý là:
- Đảm bảo bạn đang sử dụng **cùng token kết thúc câu (end of sentence token)**.
- Đảm bảo bạn đang cho phép mô hình của mình **tạo ra cùng số lượng token** cho bài đánh giá.
- Đảm bảo, nếu sử dụng phương pháp lấy mẫu (sampling), bạn đang sử dụng **cùng các tham số seed/temperature**.

## Việc tải mô hình khác nhau (Different model loading)
Một số nguồn gốc của sự khác biệt mà chúng tôi quan sát được bao gồm:
- Sử dụng **phần cứng khác nhau**.
  PyTorch không đảm bảo tính tái lập của các hoạt động không xác định (non-deterministic operations) trên các phần cứng khác nhau.
- Sử dụng **các thư viện khác nhau**.
  Ví dụ: nếu bạn sử dụng `transformers` so với `vllm` làm backend cho việc suy luận, các phép tính ma trận không được quản lý hoàn toàn theo cùng một cách.
- Sử dụng **các kích thước batch (batch sizes) khác nhau**.
  Đã có tài liệu chứng minh trong một số thư viện đánh giá và backend mô hình rằng việc sử dụng kích thước batch khác nhau sẽ thay đổi kết quả suy luận - nếu bạn muốn các đánh giá có khả năng tái lập hoàn toàn, bạn nên cố định kích thước batch, mặc dù điều này không phải lúc nào cũng khả thi do các vấn đề về bộ nhớ.
- Sử dụng **độ chính xác tải (loading precision) khác nhau** cho trọng số mô hình của bạn.
  Sử dụng độ chính xác thấp hơn có thể giảm chi phí bộ nhớ và suy luận, nhưng nó cũng sẽ thay đổi kết quả số học, vì bạn đang sử dụng các phiên bản trọng số khác nhau.
