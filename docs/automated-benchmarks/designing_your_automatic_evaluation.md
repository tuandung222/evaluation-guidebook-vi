---
sidebar_position: 2
sidebar_label: 'Thiết kế Đánh giá'
---

# Thiết kế đánh giá tự động của bạn

## Lựa chọn bộ dữ liệu
Để đánh giá, bạn có thể chọn một bộ dữ liệu sẵn có (xem ví dụ tại [Một số bộ dữ liệu đánh giá](/docs/automated-benchmarks/some_evaluation_datasets)) hoặc tự xây dựng bộ dữ liệu riêng. Điều quan trọng cần ghi nhớ trong suốt quá trình này: **kết quả đánh giá của bạn chỉ tốt bằng chính bộ dữ liệu đánh giá đó**.

### Lựa chọn bộ dữ liệu sẵn có
Bạn cần xem xét kỹ các thành phần của nó.

#### Quy trình xây dựng
- **Ai là người tạo ra các mẫu?**
  Theo thứ tự ưu tiên của tôi: bộ dữ liệu do chuyên gia xây dựng > do người chấm điểm được trả phí ~ crowdsourced > từ Mechanical Turk (MTurk).
  Hãy tìm data card, nơi cung cấp thông tin nhân khẩu học của người gán nhãn — điều này quan trọng để hiểu sự đa dạng ngôn ngữ của bộ dữ liệu.

- **Các mẫu có được kiểm tra lại bởi người chấm điểm khác hoặc tác giả không?**
  Bạn cần biết:
	- inter-annotator agreement có cao không (những người chấm điểm có đồng thuận không?)
	- và/hoặc toàn bộ dữ liệu đã được tác giả xem lại chưa.
  Điều này đặc biệt quan trọng với các bộ dữ liệu được xây dựng qua AWS Mechanical Turk, nơi người chấm điểm thường được trả thấp và không nhất thiết là người bản ngữ — nếu không kiểm tra kỹ, bạn có thể gặp lỗi chính tả, lỗi ngữ pháp, hoặc câu hỏi vô lý.

- **Người chấm điểm có được cung cấp hướng dẫn rõ ràng không?**
  Nói cách khác, bộ dữ liệu có nhất quán không?

#### Các mẫu dữ liệu
Hãy lấy ngẫu nhiên 50 mẫu và kiểm tra thủ công:
- *Về chất lượng*:
	- Prompt có rõ ràng, không mơ hồ không?
	- Câu trả lời có chính xác không? (*Ví dụ: TriviaQA chứa nhiều câu trả lời hợp lệ cho mỗi câu hỏi, đôi khi mâu thuẫn nhau.*)
	- Có bị thiếu thông tin không? (*Ví dụ: MMLU thiếu sơ đồ tham chiếu trong một số câu hỏi.*)
- *Về mức độ liên quan đến tác vụ của bạn*:
	- Đây có phải loại câu hỏi bạn muốn đánh giá không?
	- Các ví dụ có liên quan đến use case của bạn không?

Bạn cũng cần biết tổng số mẫu trong bộ dữ liệu — 100 mẫu thường là mức tối thiểu để kết quả có ý nghĩa thống kê.

### Tự xây dựng bộ dữ liệu
Có 3 hướng chính khi tự xây dựng bộ dữ liệu.

#### Thu thập dữ liệu sẵn có
Bạn có thể thu thập dữ liệu từ nhiều nguồn để đánh giá một năng lực liên quan đến tác vụ. Nhiều benchmark được xây dựng theo cách này — tổng hợp các bộ dữ liệu đánh giá của con người (như MATH, LSAT, v.v.). Trong trường hợp này, hãy thực hiện các bước kiểm tra như trên.

#### Sử dụng người chấm điểm con người
Có một chương riêng về chủ đề này trong phần `Đánh giá bằng con người`, xem [Sử dụng người chấm điểm con người](../human-evaluation/using_human_annotators.md).

#### Sử dụng dữ liệu tổng hợp
- **Dùng LLM**
  Bạn có thể tham khảo bài blog [Cosmopedia](https://huggingface.co/blog/cosmopedia) rất thú vị của các đồng nghiệp Hugging Face! Bài viết chủ yếu nói về cách tạo bộ dữ liệu huấn luyện tổng hợp, nhưng các kỹ thuật tương tự hoàn toàn có thể áp dụng cho đánh giá.
  Hãy đảm bảo kiểm tra/lọc/xem xét thủ công bộ dữ liệu sau đó (theo các bước đã nêu ở trên).

- **Dùng kỹ thuật dựa trên quy tắc**
  Nếu tác vụ của bạn cho phép, đây là cách tuyệt vời để có nguồn mẫu gần như vô hạn và tránh nhiễm bẩn dữ liệu!
  Một số ví dụ: [NPHardEval](https://arxiv.org/abs/2312.14890), [DyVal](https://arxiv.org/abs/2309.17167), [MuSR](https://arxiv.org/abs/2310.16049), [BabiQA](https://arxiv.org/abs/1502.05698), v.v.

## Lựa chọn phương pháp inference
Bạn cần chọn loại inference phù hợp với tác vụ.

Dùng **log-probability** (MCQA) phù hợp với các câu hỏi trắc nghiệm — thường để kiểm tra kiến thức hoặc khả năng phân biệt từ đồng âm/nghĩa mơ hồ.
- **Ưu điểm**:
	- Đảm bảo tất cả mô hình đều có quyền truy cập vào câu trả lời chính xác.
	- Cung cấp tín hiệu về "độ tin cậy" (confidence) và mức độ calibration của mô hình.
	- Đánh giá nhanh, đặc biệt khi chỉ cần dự đoán một token (A/B/C/D, Có/Không, v.v.).
	- Cho phép thu tín hiệu hiệu suất ngay cả từ các mô hình nhỏ.
- **Nhược điểm**:
	- Đánh giá hơi quá cao các mô hình nhỏ — nếu để sinh tự do, chúng có thể sinh ra nội dung ngoài phạm vi các lựa chọn có sẵn.
	- Một số mô hình [có xu hướng thiên vị các lựa chọn theo vị trí xuất hiện](https://arxiv.org/abs/2309.03882), có thể dẫn đến kết quả không khách quan.

Dùng **generative** (sinh văn bản tự do - QA) phù hợp với bất kỳ tác vụ nào bạn muốn kiểm tra độ trôi chảy, khả năng lập luận, hoặc năng lực trả lời câu hỏi thực tế.
- **Ưu điểm**:
	- Phản ánh chân thực khả năng LLM tạo ra văn bản trôi chảy — đây là điều người dùng thực sự quan tâm.
- **Nhược điểm**:
	- Chấm điểm phức tạp hơn (xem phần `thước đo` bên dưới).
	- Thường tốn kém hơn so với đánh giá log-likelihood, đặc biệt khi có sampling.

## Lựa chọn prompt
Prompt xác định:
- lượng thông tin cung cấp cho mô hình về tác vụ.
- cách thông tin được trình bày cho mô hình.

Một prompt MCQA hoặc QA thông thường gồm:
- prompt tác vụ (tùy chọn): giới thiệu tác vụ.
- ngữ cảnh: cung cấp thông tin bổ sung cho câu hỏi.
	- *Ví dụ: Với tác vụ tóm tắt hoặc trích xuất thông tin, bạn có thể cung cấp nguồn nội dung.*
- câu hỏi: phần cốt lõi của prompt.
- trong trường hợp trắc nghiệm: các lựa chọn trả lời.
- các từ nối (`Câu hỏi`, `Ngữ cảnh`, `Lựa chọn`, ...)

Khi thiết kế prompt, cần lưu ý:
- Ngay cả những thay đổi nhỏ trong các prompt có ngữ nghĩa tương đương cũng có thể làm kết quả thay đổi đáng kể (xem phần `Prompt khác nhau` trong [Khắc phục lỗi tái lập kết quả](/docs/troubleshooting/troubleshooting_reproducibility)), và định dạng prompt có thể tạo lợi thế hoặc bất lợi cho một số mô hình cụ thể.
	- **Cách giảm thiểu**:
		- Cách tốn kém: chạy lại đánh giá nhiều lần với các biến thể prompt khác nhau.
		- Cách ít tốn kém hơn: chạy một lần với các định dạng prompt khác nhau, phân bổ cho các mẫu có độ khó tương đương.
- Bạn có thể cung cấp ví dụ (few-shot) để giúp mô hình tuân theo định dạng mong muốn — việc thêm từ nối cũng giúp ích trong trường hợp này.
- Nhưng các mô hình hiện nay có xu hướng bị overfitting với các định dạng prompt cụ thể.
	- [Bài báo này](https://arxiv.org/abs/2407.07890) phân tích rõ vấn đề này, chỉ ra cách một số mô hình có thể đạt điểm cao quá thực tế vì đã overfit với **định dạng** của tập kiểm thử.
	- Trên Open LLM Leaderboard 2, chúng tôi nhận thấy Llama 3.2 và Qwen 2.5 không còn tuân theo định dạng few-shot được cung cấp vì lý do này.
- Với nhiều thước đo, bạn cần đầu ra phải được giới hạn nghiêm ngặt.
  *Xem thêm trong phần `Giới hạn đầu ra của mô hình` của trang [Suy luận và đánh giá mô hình](../general-knowledge/model_inference_and_evaluation.md).*

## Lựa chọn thước đo
Nếu đánh giá dựa trên **log-probability**, thước đo rất đơn giản: bạn muốn xem xét accuracy (tần suất lựa chọn có xác suất cao nhất chính là đáp án đúng). Cần chuẩn hóa theo độ dài (ký tự, token hoặc PMI). Bạn cũng có thể xem xét perplexity, recall hoặc F1.

Với đánh giá dựa trên **khả năng sinh**, dải thước đo rộng hơn nhiều.
Bạn cần:
1. Quyết định có chuẩn hóa văn bản sinh ra trước khi so sánh không.
	- Các phương pháp chuẩn hóa có thể [thiếu công bằng nếu không được thiết kế tốt](https://huggingface.co/blog/open-llm-leaderboard-drop), nhưng thường vẫn cung cấp tín hiệu tốt ở cấp độ tác vụ.
	- Chúng đặc biệt quan trọng với các tác vụ như đánh giá toán học — nơi bạn cần trích xuất kết quả từ đầu ra được định dạng.
	- Chúng cũng cần thiết nếu bạn dùng Chain of Thought, vì bạn cần tách phần lập luận ra khỏi kết quả thực tế.
2. Quyết định cách so sánh văn bản sinh ra với nhãn chuẩn.
   Bạn có thể dùng bất kỳ thước đo nào từ matching (exact match, prefix match, v.v.) đến các thước đo cho tóm tắt và dịch thuật (ROUGE, BLEU, n-gram ký tự). Xem danh sách đầy đủ các thước đo [tại đây](https://github.com/huggingface/lighteval/wiki/Metric-List).

Tổng quát hơn, khi chọn thước đo, hãy suy nghĩ về mục đích thực sự của tác vụ. Với một số lĩnh vực (y tế, chatbot công khai), bạn không chỉ muốn đo hiệu suất trung bình mà còn cần cách đánh giá **hiệu suất tệ nhất** (về chất lượng y khoa, về tính độc hại, v.v.). (*Đọc thêm trong [bài viết này](https://ehudreiter.com/2024/07/10/challenges-in-evaluating-llms/)*)

## Kiểm thử chức năng: một hướng tiếp cận thú vị
Trong lĩnh vực lập trình, bạn muốn đánh giá code sinh ra không chỉ về ngữ nghĩa mà cả về chức năng thực tế. Cách tốt để làm điều này là kiểm tra xem code sinh ra từ prompt có vượt qua được một bộ unit tests được thiết kế cho tác vụ đó không.

Hướng tiếp cận này rất hứa hẹn vì:
- Cho phép tạo ra test cases dễ hơn (trong nhiều trường hợp, có thể dùng kỹ thuật dựa trên quy tắc).
- Qua đó giảm thiểu overfitting.
- Kiểm tra mô hình trên các năng lực chức năng cụ thể.

Tuy nhiên, cần nhiều sáng tạo hơn khi muốn áp dụng ý tưởng này sang ngôn ngữ văn bản thông thường!

Một ví dụ điển hình là IFEval — benchmark kiểm tra xem mô hình có tuân theo hướng dẫn không. Nó hoạt động bằng cách đưa ra các hướng dẫn định dạng (*Thêm số lượng dấu đầu dòng này. Chỉ viết hoa một câu.* v.v.) và kiểm tra nghiêm ngặt xem định dạng có được tuân thủ không. Rõ ràng cần nhiều nghiên cứu hơn để mở rộng ý tưởng này sang các đặc điểm văn bản khác!
