---
sidebar_position: 1
sidebar_label: 'Suy luận & Đánh giá'
---

# Suy luận và Đánh giá Mô hình

## Giới thiệu
Về cơ bản, LLM hoạt động theo một cơ chế khá đơn giản: nhận một đoạn văn bản đầu vào và dự đoán phần tiếp theo hợp lý nhất.

Quá trình này gồm hai bước.

### Tokenization
Văn bản đầu vào (gọi là *prompt* trong quá trình inference) trước tiên được chia thành các *token* — những đơn vị văn bản nhỏ (có thể là một hoặc vài ký tự, hoặc ở cấp độ từ) — mỗi token được gán một mã số. Toàn bộ tập token mà một mô hình có thể xử lý được gọi là *vocabulary*. *(Xem thêm tại trang [Tokenization](./tokenization.md)).*

### Dự đoán

![](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/llm_tk_1.png?raw=true)

Từ văn bản đầu vào, LLM tạo ra một phân phối xác suất trên toàn bộ từ vựng để dự đoán token tiếp theo. Để tiếp tục sinh văn bản, ta chọn token có xác suất cao nhất (hoặc lấy mẫu ngẫu nhiên để đầu ra đa dạng hơn), rồi đưa token đó vào cuối prompt và lặp lại — cho đến khi gặp điều kiện dừng.

## Bạn muốn dự đoán điều gì?
Đánh giá LLM chủ yếu chia thành 2 dạng:
- Cho trước một prompt và một (hoặc nhiều) câu trả lời: xác suất của (các) câu trả lời đó đối với mô hình là bao nhiêu?
- Cho trước một prompt: mô hình sẽ sinh ra văn bản gì?

### Đánh giá dựa trên Log-likelihood
Với dạng đánh giá này, ta muốn tính xác suất có điều kiện của một hoặc nhiều lựa chọn khi biết prompt — nói cách khác, khả năng (likelihood) mô hình sinh ra một phần tiếp nối cụ thể từ một đầu vào là bao nhiêu?

Quy trình:
- Nối từng lựa chọn vào sau prompt rồi đưa vào LLM. Mô hình trả về logit của mỗi token dựa trên các token đứng trước.
- Chỉ giữ lại các logit cuối (tương ứng với các token của lựa chọn) và áp dụng log softmax để thu được log-probability (có phạm vi `[-inf, 0]` thay vì `[0, 1]`).
- Cộng tổng log-probability của từng token để có xác suất tổng thể cho lựa chọn đó.
- Tùy chọn: chuẩn hóa theo độ dài của lựa chọn.

![](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/llm_logprob.png?raw=true)

Phương pháp này cho phép áp dụng các thước đo sau:
- Tìm câu trả lời được mô hình ưa thích nhất trong nhiều lựa chọn (như trong hình trên). *(Tuy nhiên, cách này có thể cho điểm cao hơn với các mô hình mà nếu sinh tự do sẽ tạo ra từ khác — ví dụ từ `Zygote` trong hình.)*
- Kiểm tra xem xác suất của một lựa chọn duy nhất có lớn hơn 0.5 hay không.
- Nghiên cứu mức độ calibration của mô hình. Một mô hình calibrate tốt là mô hình mà câu trả lời đúng có xác suất cao nhất.
  *(Để tìm hiểu thêm về calibration, bạn có thể đọc [bài báo này](https://arxiv.org/abs/2207.05221) của Anthropic về định nghĩa, cách phát hiện và cách huấn luyện mô hình được calibrate tốt, và [bài báo này](https://arxiv.org/abs/2311.14648) về một số giới hạn có thể gặp phải.)*

### Đánh giá dựa trên Khả năng sinh (Generative evaluations)
Với dạng đánh giá này, ta muốn lấy ra văn bản mô hình sinh ra từ một prompt đầu vào.

Văn bản được sinh theo cơ chế auto-regressive: đưa prompt vào mô hình, chọn token tiếp theo có xác suất cao nhất, rồi lặp lại đến khi gặp điều kiện dừng (đạt độ dài tối đa, gặp stop token, v.v.). Toàn bộ các token mô hình sinh ra sẽ được coi là câu trả lời cho prompt đó.

![](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/llm_gen.png?raw=true)

Sau đó, ta so sánh đoạn văn bản sinh ra với các nhãn chuẩn (ground truth / references) và tính khoảng cách giữa chúng — bằng các thước đo đơn giản như exact match, hoặc phức tạp hơn như BLEU, hoặc dùng model-as-a-judge.

### Đi xa hơn
- ⭐ [Bài viết về các cách đánh giá MMLU khác nhau](https://huggingface.co/blog/open-llm-leaderboard-mmlu) bởi đội ngũ Hugging Face — đáng đọc nếu bạn muốn đi sâu vào sự khác biệt giữa log-likelihood và generative evaluation, cũng như ảnh hưởng của chúng lên điểm số.
	- Các hình minh họa trên được lấy từ bài viết này, do Thom Wolf thực hiện.
- ⭐ [Một bài toán học hóa tuyệt đẹp về các phương thức suy luận trên](https://arxiv.org/abs/2405.14782v2) từ EleutherAI — bạn có thể đọc thẳng phần Phụ lục (Appendix).

## Giới hạn đầu ra của mô hình
Trong nhiều trường hợp, ta muốn đầu ra tuân theo một định dạng cụ thể, chẳng hạn để dễ so sánh với tài liệu tham chiếu.

### Sử dụng prompt
Cách đơn giản nhất là thêm hướng dẫn rất cụ thể vào prompt tác vụ (`Cung cấp câu trả lời bằng chữ số.`, `Không sử dụng từ viết tắt.`, v.v.).

Cách này không phải lúc nào cũng hiệu quả, nhưng thường đủ tốt với các mô hình có năng lực cao. Đó cũng là cách tiếp cận chúng tôi dùng trong bài báo [GAIA](https://huggingface.co/papers/2311.12983) — bạn có thể tìm thấy prompt tác vụ của chúng tôi trong tab Submission của [bảng xếp hạng GAIA](https://huggingface.co/spaces/gaia-benchmark/leaderboard).

### Few-shot và Học trong ngữ cảnh
Cách tiếp theo là giới hạn mô hình qua in-context learning. Bằng cách cung cấp các ví dụ trong prompt (gọi là few-shot prompting), mô hình được định hướng ngầm để tuân theo cấu trúc lặp lại của ví dụ khi xử lý dữ liệu thực tế.

Phương pháp này hoạt động khá hiệu quả cho đến cuối năm 2023. Tuy nhiên, việc áp dụng rộng rãi instruction-tuning và bổ sung dữ liệu hướng dẫn vào giai đoạn tiền huấn luyện dường như đã làm các mô hình gần đây bị thiên lệch đối với một số định dạng đầu ra nhất định — điều được [bài báo này](https://arxiv.org/abs/2407.07890) gọi là "Training on the test task", hay tôi gọi là "overfitting định dạng prompt". Phương pháp này cũng bị giới hạn với các mô hình cũ hơn có context window nhỏ, vì một vài ví dụ few-shot có thể không vừa được.

### Sinh văn bản có cấu trúc
Sinh văn bản có cấu trúc giới hạn đầu ra phải tuân theo một lộ trình cụ thể, được định nghĩa bằng ngữ pháp (grammar) hoặc biểu thức chính quy. Thư viện `outlines` triển khai điều này bằng Finite State Machine (FSM) — một giải pháp rất gọn gàng. (Các cách tiếp cận khác cũng tồn tại, chẳng hạn như interleaved generation cho JSON, nhưng FSM vẫn là phương pháp tôi ưa thích.)

Để hiểu rõ hơn về sinh văn bản có cấu trúc, bạn có thể đọc [bài viết](https://huggingface.co/blog/evaluation-structured-outputs) mà chúng tôi đồng tác giả: sinh có cấu trúc giúp giảm độ biến động của prompt trong đánh giá mô hình, đồng thời làm kết quả và thứ hạng ổn định hơn. Bạn cũng có thể xem [blog outlines](https://blog.dottxt.co/) để biết thêm các triển khai thú vị.

Tuy nhiên, một số [nghiên cứu gần đây](https://arxiv.org/abs/2408.02442) chỉ ra rằng sinh có cấu trúc có thể làm giảm hiệu suất trong một số tác vụ (như reasoning) bằng cách kéo phân phối xác suất đi quá xa so với phân phối tự nhiên của mô hình.

### Đi xa hơn
- ⭐ [Hiểu cách FSM hoạt động trong sinh có cấu trúc](https://blog.dottxt.co/coalescence.html) bởi Outlines — giải thích cực kỳ rõ ràng về cơ chế của họ.
- [Bài báo về phương pháp outlines](https://arxiv.org/abs/2307.09702) — giải thích học thuật chi tiết hơn.
- [Interleaved generation](https://github.com/guidance-ai/guidance?tab=readme-ov-file#guidance-acceleration) — một phương pháp khác để giới hạn đầu ra cho một số định dạng cụ thể.

