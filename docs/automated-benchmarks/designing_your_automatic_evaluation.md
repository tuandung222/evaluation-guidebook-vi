---
sidebar_position: 2
sidebar_label: 'Thiết kế Đánh giá'
---

# Thiết kế đánh giá tự động của bạn

## Lựa chọn bộ dữ liệu
Đối với việc đánh giá (evaluation), bạn có thể chọn một bộ dữ liệu (dataset) hiện có (xem ví dụ tại [Một số bộ dữ liệu đánh giá](/docs/automated-benchmarks/some_evaluation_datasets)) hoặc tự thiết kế bộ dữ liệu của riêng mình. Trong suốt quá trình này, điều cực kỳ quan trọng cần ghi nhớ là **kết quả đánh giá của bạn chỉ tốt bằng chính bộ dữ liệu đánh giá đó**.

### Lựa chọn một bộ dữ liệu hiện có
Bạn bắt buộc phải xem xét kỹ các thành phần của nó.

#### Quy trình xây dựng
- **Ai là người tạo ra các mẫu (samples) thực tế?**
  Theo tôi: bộ dữ liệu do chuyên gia xây dựng &gt; bộ dữ liệu do người chấm điểm được trả phí ~ bộ dữ liệu từ cộng đồng (crowdsourced) &gt; bộ dữ liệu từ Mechanical Turk (MTurk).
  Bạn cũng nên tìm kiếm thẻ dữ liệu (data card), nơi cung cấp thông tin nhân khẩu học của người gán nhãn/người chấm điểm (annotator) - điều này có thể quan trọng để hiểu được sự đa dạng ngôn ngữ của bộ dữ liệu.

- **Các mẫu có được kiểm tra lại bởi những người chấm điểm khác hoặc bởi các tác giả hay không?**
  Bạn cần biết:
	- độ đồng thuận giữa các người chấm điểm (inter-annotator agreement) trên các mẫu có cao không (= những người chấm điểm có đồng quan điểm hay không?)
	- và/hoặc liệu toàn bộ dữ liệu đã được các tác giả kiểm tra lại hay chưa.
  Điều này đặc biệt quan trọng đối với các bộ dữ liệu được xây dựng với sự trợ giúp của những người chấm điểm được trả lương thấp và thường không phải là người bản xứ của ngôn ngữ mục tiêu (ví dụ như AWS Mechanical Turk), vì nếu không bạn có thể gặp các lỗi chính tả/lỗi ngữ pháp/câu hỏi vô lý.

- **Người chấm điểm có được cung cấp hướng dẫn xây dựng dữ liệu rõ ràng không?**
  Nói cách khác, bộ dữ liệu của bạn có tính nhất quán hay không?

#### Các mẫu dữ liệu
Hãy lấy ngẫu nhiên 50 mẫu và kiểm tra thủ công:
- *Về chất lượng*:
	- các prompt có rõ ràng và không bị mơ hồ hay không?
	- câu trả lời có chính xác không? (*Ví dụ: TriviaQA chứa nhiều câu trả lời chuẩn (trường aliases) cho mỗi câu hỏi, đôi khi các câu trả lời này mâu thuẫn nhau.*)
	- có bị thiếu thông tin không? (*Ví dụ: MMLU bị thiếu các sơ đồ tham chiếu trong một số câu hỏi.*)
- *Về mức độ liên quan đến tác vụ của bạn*:
	- đây có phải là loại câu hỏi mà bạn thực sự muốn đánh giá trên LLM hay không?
	- các ví dụ này có liên quan đến trường hợp sử dụng (use case) của bạn không?

Bạn cũng cần biết có bao nhiêu mẫu trong bộ dữ liệu (để đảm bảo kết quả có ý nghĩa về mặt thống kê - 100 mẫu thường là mức tối thiểu cho các bộ thử nghiệm tự động).

### Tự thiết kế bộ dữ liệu của riêng bạn
Bạn có thể đi theo 3 hướng khi tự thiết kế bộ dữ liệu của riêng mình.

#### Thu thập dữ liệu hiện có
Bạn có thể thu thập dữ liệu hiện có từ nhiều nguồn khác nhau để đánh giá một năng lực liên quan đến tác vụ của bạn. Ví dụ, nhiều bộ dữ liệu đánh giá được xây dựng bằng cách thu thập các bộ dữ liệu đánh giá của con người (chẳng hạn như MATH, LSAT, v.v.). Trong trường hợp này, hãy làm theo các bước kiểm tra ở trên.

#### Sử dụng người chấm điểm con người
Có một chương riêng về việc sử dụng người chấm điểm con người trong phần `Đánh giá bằng con người`, xem [Sử dụng người chấm điểm con người](../human-evaluation/using_human_annotators.md).

#### Sử dụng dữ liệu tổng hợp (synthetic data)
- **Sử dụng LLM**
  Về chủ đề này, bạn có thể tham khảo bài viết blog [Cosmopedia](https://huggingface.co/blog/cosmopedia) rất thú vị của các đồng nghiệp tại Hugging Face! Bài viết chủ yếu nghiên cứu cách tạo bộ dữ liệu huấn luyện tổng hợp, nhưng các kỹ thuật tương tự hoàn toàn có thể được áp dụng cho việc đánh giá.
  Hãy đảm bảo kiểm tra/lọc/kiểm duyệt thủ công bộ dữ liệu của bạn sau đó (theo các bước nêu trên).

- **Sử dụng các kỹ thuật dựa trên quy tắc (rule-based)**
  Nếu tác vụ của bạn cho phép, đây là một cách tuyệt vời để có được nguồn cung cấp mẫu gần như vô hạn và tránh nhiễm bẩn dữ liệu (data contamination)!
  Để biết một số ví dụ, bạn có thể tham khảo [NPHardEval](https://arxiv.org/abs/2312.14890), [DyVal](https://arxiv.org/abs/2309.17167), [MuSR](https://arxiv.org/abs/2310.16049), [BabiQA](https://arxiv.org/abs/1502.05698), v.v.

## Lựa chọn phương pháp suy luận (inference)
Bạn sẽ cần chọn loại phương pháp suy luận (inference) mà mình cần.

Sử dụng xác suất log (log-probabilities) (MCQA, câu hỏi trắc nghiệm nhiều lựa chọn) rất tốt cho các câu hỏi trắc nghiệm (thường dùng để kiểm tra kiến thức của mô hình hoặc khả năng phân biệt từ đồng âm/nghĩa mơ hồ).
- **Ưu điểm**:
	- Đảm bảo rằng tất cả các mô hình đều có quyền truy cập vào câu trả lời chính xác.
	- Cung cấp một chỉ số đại diện cho "độ tin cậy" (confidence) và mức độ chuẩn định (calibration) của mô hình.
	- Đánh giá nhanh, đặc biệt là khi chúng ta chỉ yêu cầu mô hình dự đoán một token (A/B/C/D cho các chỉ số lựa chọn, hoặc Có/Không, v.v.).
	- Cho phép thu được tín hiệu về hiệu suất tác vụ của các mô hình nhỏ.
- **Nhược điểm**:
	- Đánh giá hơi quá cao các mô hình nhỏ vốn có thể sinh ra thứ gì đó nằm ngoài phạm vi các lựa chọn có sẵn nếu để chúng tự sinh tự do.
	- Một số mô hình [có xu hướng ưu tiên các lựa chọn cụ thể dựa trên thứ tự xuất hiện của chúng](https://arxiv.org/abs/2309.03882), điều này có thể dẫn đến kết quả đánh giá thiếu khách quan.

Sử dụng khả năng sinh (sinh văn bản tự do - QA) rất tốt cho bất kỳ tác vụ nào bạn muốn kiểm tra độ trôi chảy, khả năng lập luận hoặc khả năng thực tế của mô hình trong việc trả lời câu hỏi.
- **Ưu điểm**:
	- Phản ánh thực tế khả năng của LLM trong việc tạo ra văn bản trôi chảy, đây hầu hết là điều người dùng thực sự quan tâm.
- **Nhược điểm**:
	- Có thể khó chấm điểm hơn (xem phần `thước đo` bên dưới).
	- Thường đắt hơn một chút so với đánh giá log-likelihood, đặc biệt là nếu chúng bao gồm quá trình lấy mẫu (sampling).

## Lựa chọn prompt
Prompt sẽ định nghĩa:
- lượng thông tin được cung cấp cho mô hình về tác vụ.
- cách thông tin này được trình bày cho mô hình.

Một prompt cho tác vụ MCQA hoặc QA thông thường bao gồm các thành phần sau:
- prompt tác vụ (tùy chọn): giới thiệu tác vụ của bạn.
- ngữ cảnh: cung cấp ngữ cảnh bổ sung cho câu hỏi của bạn.
	- *Ví dụ: Đối với tác vụ tóm tắt hoặc trích xuất thông tin, bạn có thể cung cấp một nguồn nội dung.*
- câu hỏi: phần cốt lõi của prompt.
- trong trường hợp đánh giá trắc nghiệm, bạn có thể thêm các tùy chọn lựa chọn.
- các từ nối (`Câu hỏi`, `Ngữ cảnh`, `Lựa chọn`, ...)

Khi định nghĩa prompt, bạn cần lưu ý rằng:
- Ngay cả những thay đổi nhỏ trong các prompt có ngữ nghĩa tương đương cũng có thể làm kết quả thay đổi đáng kể (xem Phần `Prompt khác nhau` trong [Khắc phục lỗi tái lập kết quả](/docs/troubleshooting/troubleshooting_reproducibility)), và các định dạng prompt có thể tạo lợi thế hoặc bất lợi cho các mô hình cụ thể.
	- **Cách giảm thiểu**:
		- Cách tốn kém là chạy lại đánh giá nhiều lần với các biến thể prompt khác nhau.
		- Cách ít tốn kém hơn là chạy đánh giá một lần bằng cách phân bổ các định dạng prompt khác nhau cho các mẫu có độ khó tương đương.
- Bạn có thể cung cấp các ví dụ cho mô hình để giúp nó tuân theo định dạng mong muốn (sử dụng các ví dụ few-shot), và việc thêm các từ nối sẽ giúp ích cho việc này nói chung.
- Nhưng các mô hình hiện nay có xu hướng bị quá khớp (overfitting) với các định dạng prompt cụ thể.
	- [Bài báo này](https://arxiv.org/abs/2407.07890) viết rất hay về chủ đề này, chỉ ra cụ thể cách một số mô hình có thể nhận điểm số cao quá mức thực tế vì chúng đã quá khớp với **định dạng** của tập kiểm thử.
	- Trên bảng xếp hạng Open LLM Leaderboard 2, chúng tôi đã quan sát thấy Llama 3.2 và Qwen 2.5 không còn tuân theo định dạng của prompt được cung cấp trong thiết lập few-shot vì lý do này.
- Đối với nhiều thước đo, bạn cần một đầu ra hoặc thế hệ sinh bị giới hạn nghiêm ngặt.
  *Bạn có thể tìm hiểu thêm về điều này trong phần `Giới hạn đầu ra của mô hình` của trang [Suy luận và đánh giá mô hình](../general-knowledge/model_inference_and_evaluation.md).*

## Lựa chọn thước đo (metric)
Nếu bạn đánh giá dựa trên **log-probabilities**, thước đo của bạn sẽ rất đơn giản: bạn sẽ muốn xem xét độ chính xác (accuracy - tần suất lựa chọn có khả năng xảy ra cao nhất chính là lựa chọn đúng). Điều quan trọng là phải chuẩn hóa nó theo độ dài (bằng ký tự, token hoặc PMI). Bạn cũng có thể xem xét perplexity, recall hoặc f1 score.

Đối với đánh giá dựa trên **khả năng sinh**, dải thước đo của bạn sẽ rộng hơn nhiều.
Bạn sẽ cần:
1. Quyết định xem bạn sẽ so sánh trực tiếp các văn bản sinh ra như hiện trạng, hay cần chuẩn hóa chúng trước.
	- Các phương pháp chuẩn hóa có thể [thiếu công bằng nếu không được thiết kế tốt](https://huggingface.co/blog/open-llm-leaderboard-drop), nhưng nhìn chung chúng vẫn cung cấp tín hiệu tốt ở cấp độ tác vụ.
	- Chúng cực kỳ quan trọng đối với các tác vụ cụ thể, chẳng hạn như đánh giá toán học, nơi bạn cần trích xuất kết quả từ các đầu ra được định dạng.
	- Chúng cũng sẽ quan trọng nếu bạn muốn đánh giá với các cơ chế bổ sung để tăng độ chính xác như Chuỗi lập luận từng bước (Chain of Thought), vì bạn sẽ cần loại bỏ phần lập luận ra khỏi kết quả thực tế.
2. Quyết định cách bạn so sánh văn bản sinh ra với nhãn chuẩn.
   Bạn có thể sử dụng bất kỳ thước đo nào từ các thước đo dựa trên sự trùng khớp (khớp chính xác - exact match, khớp tiền tố - prefix match, v.v.) cho đến các thước đo tóm tắt và dịch thuật (ROUGE, BLEU, so sánh n-gram ký tự). Để biết danh sách các thước đo hiện có, bạn có thể xem [tại đây](https://github.com/huggingface/lighteval/wiki/Metric-List). Tôi sẽ bổ sung một phần về việc nên sử dụng thước đo nào khi nào sau.

Tổng quát hơn, khi chọn thước đo, bạn cần lưu ý mục đích thực sự của tác vụ là gì. Đối với một số lĩnh vực (ví dụ: y tế, chatbot tương tác công khai), bạn không chỉ muốn đo lường hiệu suất trung bình mà còn cần một cách để đánh giá **hiệu suất tệ nhất** có thể gặp phải (về chất lượng y khoa của đầu ra, về tính độc hại, v.v.). (*Để đi xa hơn, hãy tham khảo [bài viết này](https://ehudreiter.com/2024/07/10/challenges-in-evaluating-llms/)*)

## Các tác vụ mới thông minh: còn kiểm thử chức năng (functional testing) thì sao?
Trong lĩnh vực lập trình (code), bạn muốn đánh giá các chương trình được tạo ra không chỉ về mặt ngữ nghĩa mà còn về chức năng thực tế của chúng. Do đó, một cách tốt để làm việc này là kiểm tra xem mã được sinh ra từ prompt có vượt qua được một bộ các ca kiểm thử đơn vị (unit-tests) được thiết kế cho tác vụ đó hay không.

Cách tiếp cận chức năng này cực kỳ hứa hẹn vì nó:
- Cho phép tạo ra các ca kiểm thử dễ dàng hơn (trong nhiều trường hợp, bạn có thể tạo ra các ca kiểm thử dựa trên quy tắc).
- Từ đó giảm thiểu hiện tượng quá khớp (overfitting).
- Kiểm tra các mô hình trên các năng lực hoạt động cụ thể.

Tuy nhiên, đây là một cách tiếp cận đòi hỏi sự sáng tạo lớn khi chuyển dịch sang ngôn ngữ dạng văn bản thông thường!

Một ví dụ điển hình cho việc này là IFEval, một bộ thử nghiệm đánh giá kiểm tra xem các mô hình có thể tuân theo hướng dẫn hay không. Nó hoạt động bằng cách tạo ra một số hướng dẫn định dạng (*Thêm số lượng dấu đầu dòng này. Chỉ viết hoa một câu.* v.v.) và kiểm tra nghiêm ngặt xem định dạng đó có được tuân thủ hay không. Rõ ràng là chúng ta cần nhiều nghiên cứu hơn nữa để mở rộng ý tưởng này sang các đặc điểm phân tích văn bản khác!
