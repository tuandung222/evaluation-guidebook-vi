---
sidebar_position: 1
sidebar_label: 'Suy luận & Đánh giá'
---

# Suy luận và Đánh giá Mô hình

## Giới thiệu
Các mô hình ngôn ngữ lớn (LLM) hiện nay hoạt động theo một cách khá đơn giản: nhận một đoạn văn bản đầu vào và học cách dự đoán phần tiếp theo hợp lý nhất.

Quá trình này được thực hiện qua hai bước.

### Tokenization (Mã hóa từ)
Văn bản đầu vào (được gọi là *prompt* trong quá trình suy luận) trước tiên được chia thành các *token* - những đơn vị văn bản nhỏ (có thể là một hoặc vài ký tự, hoặc ở cấp độ từ) - mỗi token được liên kết với một mã số. Toàn bộ dải token mà một mô hình có thể phân tích được gọi là *từ vựng* (vocabulary) của nó. *(Để hiểu sâu hơn về chủ đề này, hãy đọc trang [Tokenization](./tokenization.md))*.

### Dự đoán (Prediction)

![](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/llm_tk_1.png?raw=true)

Từ văn bản đầu vào này, LLM sẽ tạo ra một phân phối xác suất của các token tiếp theo có khả năng xảy ra cao nhất trên toàn bộ từ vựng của nó. Để tiếp tục sinh văn bản, chúng ta có thể lấy token có xác suất cao nhất (hoặc thêm một chút ngẫu nhiên để đầu ra thú vị hơn) làm token tiếp theo, sau đó lặp lại thao tác này bằng cách đưa token mới vào cuối prompt, v.v.

## Bạn muốn dự đoán điều gì?
Đánh giá (evaluation) LLM hầu hết được chia thành 2 danh mục chính:
- Cho trước một prompt và một (hoặc nhiều) câu trả lời, xác suất của (các) câu trả lời đó đối với mô hình là bao nhiêu?
- Cho trước một prompt, mô hình sẽ sinh ra văn bản gì?

### Đánh giá dựa trên Log-likelihood
Đối với đánh giá log-likelihood, chúng ta muốn tính xác suất có điều kiện của một hoặc nhiều lựa chọn khi biết prompt - nói cách khác, khả năng (likelihood) mô hình sinh ra một phần tiếp nối cụ thể từ một đầu vào là bao nhiêu?

Do đó:
- Chúng ta nối từng lựa chọn vào sau prompt rồi đưa vào LLM. Mô hình sẽ trả về logits của mỗi token dựa trên các token đứng trước.
- Chúng ta chỉ giữ lại các logits cuối cùng (tương ứng với các token của lựa chọn) và áp dụng hàm log softmax để thu được xác suất log (log-probabilities) (có phạm vi từ `[-inf, 0]` thay vì `[0-1]`).
- Sau đó, chúng ta cộng tổng các xác suất log của từng token để có xác suất log tổng thể cho lựa chọn đó.
- Cuối cùng, chúng ta có thể áp dụng chuẩn hóa dựa trên độ dài của lựa chọn.

![](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/llm_logprob.png?raw=true)

Phương pháp này cho phép áp dụng các thước đo (metric) sau:
- Tìm câu trả lời ưu tiên của mô hình trong số nhiều lựa chọn (như trong hình trên). (*Tuy nhiên, điều này có thể mang lại lợi thế điểm số cho các mô hình mà lẽ ra khi sinh tự do sẽ tạo ra từ khác, chẳng hạn như từ `Zygote` trong hình.*)
- Kiểm tra xem xác suất của một lựa chọn duy nhất có lớn hơn 0.5 hay không.
- Nghiên cứu mức độ chuẩn định (calibration) của mô hình. Một mô hình được chuẩn định tốt là mô hình mà các câu trả lời đúng có xác suất cao nhất.
  *(Để tìm hiểu thêm về chuẩn định, bạn có thể tham khảo [bài báo này](https://arxiv.org/abs/2207.05221) từ Anthropic về định nghĩa, cách phát hiện và cách huấn luyện mô hình chuẩn định tốt, và [bài báo này](https://arxiv.org/abs/2311.14648) về một số giới hạn khả thi của việc chuẩn định).*

### Đánh giá dựa trên Khả năng sinh (Generative evaluations)
Đối với đánh giá dựa trên khả năng sinh, chúng ta muốn lấy ra văn bản được mô hình tạo ra từ một prompt đầu vào.

Văn bản này được tạo ra theo cơ chế tự hồi quy (auto-regressive): chúng ta đưa prompt vào mô hình, tìm token tiếp theo có khả năng xảy ra cao nhất, chọn nó làm "token đầu tiên được mô hình chọn", rồi lặp lại quá trình này cho đến khi gặp điều kiện dừng sinh (đạt độ dài tối đa, gặp token dừng đặc biệt, v.v.). Toàn bộ các token do mô hình sinh ra sẽ được coi là câu trả lời của nó cho prompt đó.

![](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/llm_gen.png?raw=true)

Sau đó, chúng ta có thể so sánh đoạn văn bản sinh ra này với các nhãn chuẩn (ground truth / references) và tính toán khoảng cách giữa chúng (bằng các thước đo đơn giản như khớp chính xác - exact match, các thước đo phức tạp hơn như BLEU, hoặc sử dụng mô hình đóng vai trò giám khảo - model-as-a-judge).

### Đi xa hơn
- ⭐ [Bài viết về các cách khác nhau để đánh giá MMLU](https://huggingface.co/blog/open-llm-leaderboard-mmlu) bởi đội ngũ của chúng tôi tại Hugging Face. Tôi khuyên bạn nên đọc bài viết này nếu muốn đi sâu hơn vào sự khác biệt giữa đánh giá log-likelihood đa lựa chọn và đánh giá dựa trên khả năng sinh, bao gồm cả ý nghĩa của chúng đối với sự thay đổi điểm số.
	- Các hình minh họa trên được lấy từ bài viết này và do Thom Wolf thực hiện.
- ⭐ [Một bài toán học hóa tuyệt đẹp về các phương thức suy luận trên](https://arxiv.org/abs/2405.14782v2) từ EleutherAI. Bạn có thể chuyển thẳng đến phần Phụ lục (Appendix).

## Giới hạn đầu ra của mô hình (Constraining model outputs)
Trong nhiều trường hợp, chúng ta muốn đầu ra của mô hình tuân theo một định dạng cụ thể, ví dụ để dễ dàng so sánh với một tài liệu tham khảo.

### Sử dụng prompt
Cách đơn giản nhất là thêm một prompt tác vụ chứa các hướng dẫn rất cụ thể về cách mô hình trả lời (`Cung cấp câu trả lời bằng chữ số.`, `Không sử dụng từ viết tắt.`, v.v.).

Cách này không phải lúc nào cũng hiệu quả, nhưng thường đủ tốt đối với các mô hình có năng lực cao. Đó là cách tiếp cận chúng tôi đã sử dụng trong bài báo [GAIA](https://huggingface.co/papers/2311.12983), và bạn có thể tìm thấy prompt tác vụ của chúng tôi trong tab Submission của [bảng xếp hạng GAIA](https://huggingface.co/spaces/gaia-benchmark/leaderboard) nếu muốn tham khảo thêm ý tưởng.

### Few-shot và Học trong ngữ cảnh
Cách tiếp theo là giới hạn mô hình thông qua "học trong ngữ cảnh" (in-context learning). Bằng cách cung cấp các ví dụ trong prompt (được gọi là `few-shot prompting`), mô hình sẽ được định hướng một cách ngầm định để tuân theo cấu trúc lặp lại của ví dụ đối với mẫu dữ liệu thực tế.

Đây là một phương pháp hoạt động khá hiệu quả cho đến cuối năm 2023! Tuy nhiên, việc áp dụng rộng rãi các phương pháp tinh chỉnh hướng dẫn (instruction-tuning) và bổ sung dữ liệu hướng dẫn vào các giai đoạn sau của tiền huấn luyện mô hình (tiền huấn luyện liên tục - continuous pre-training) dường như đã làm các mô hình gần đây bị thiên lệch đối với một số định dạng đầu ra nhất định (điều được gọi [ở đây](https://arxiv.org/abs/2407.07890) là `Huấn luyện trên tác vụ kiểm thử` - Training on the test task, hoặc tôi gọi là `overfitting định dạng prompt`). Phương pháp này cũng bị hạn chế đối với các mô hình cũ hơn có kích thước ngữ cảnh nhỏ hơn, vì một vài ví dụ few-shot có thể không khớp được vào cửa sổ ngữ cảnh.

### Sinh văn bản có cấu trúc (Structured text generation)
Sinh văn bản có cấu trúc giới hạn các đầu ra phải tuân theo một lộ trình cụ thể, được định nghĩa ví dụ bằng một ngữ pháp (grammar) hoặc biểu thức chính quy (regular expressions). Thư viện `outlines` triển khai việc này bằng cách sử dụng các máy trạng thái hữu hạn (FSM - Finite State Machine), một giải pháp rất gọn gàng. (Các cách tiếp cận khác cũng tồn tại, chẳng hạn như sử dụng sinh xen kẽ - interleaved generation cho sinh cấu trúc json, nhưng FSM vẫn là phương pháp ưa thích của tôi).

Để hiểu rõ hơn về những gì diễn ra khi sinh văn bản có cấu trúc, bạn có thể đọc [bài viết](https://huggingface.co/blog/evaluation-structured-outputs) mà chúng tôi đồng tác giả: sinh văn bản có cấu trúc giúp giảm độ biến động của prompt trong đánh giá mô hình, đồng thời giúp kết quả và thứ hạng ổn định hơn. Bạn cũng có thể xem [blog outlines](https://blog.dottxt.co/) để biết thêm các cách triển khai thú vị và các quan sát liên quan đến sinh văn bản có cấu trúc.

Tuy nhiên, một số [nghiên cứu](https://arxiv.org/abs/2408.02442) gần đây chỉ ra rằng sinh cấu trúc có thể làm giảm hiệu suất của mô hình trong một số tác vụ (như lập luận - reasoning) bằng cách kéo phân phối tiên nghiệm (prior) đi quá xa so với phân phối xác suất mong đợi.

### Đi xa hơn
- ⭐ [Hiểu cách hoạt động của Máy trạng thái hữu hạn khi sinh cấu trúc](https://blog.dottxt.co/coalescence.html) bởi Outlines. Hướng dẫn cực kỳ rõ ràng về cách phương pháp của họ hoạt động!
- [Bài báo về phương pháp outlines](https://arxiv.org/abs/2307.09702), giải thích mang tính học thuật chi tiết hơn về cơ chế trên.
- [Interleaved generation](https://github.com/guidance-ai/guidance?tab=readme-ov-file#guidance-acceleration), một phương pháp khác để giới hạn các thế hệ sinh đối với một số định dạng đầu ra cụ thể.
