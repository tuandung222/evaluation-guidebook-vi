---
sidebar_position: 6
sidebar_label: 'Mẹo & Thủ thuật'
---

# Mẹo và thủ thuật

## Giảm thiểu các thiên vị đã biết của LLM đóng vai trò giám khảo (LLM-as-a-judge):

- **Thiếu tính nhất quán nội bộ (Lack of internal consistency)**: một giám khảo có thể đưa ra các phán quyết khác nhau nếu bạn prompt nó nhiều lần (nếu temperature khác 0)
	- Bạn có thể giảm thiểu điều này bằng cách sử dụng kỹ thuật prompt tự nhất quán (self-consistency prompting) cho giám khảo của mình, thực hiện prompt nhiều lần và giữ lại kết quả của số đông (majority output).
- **Tự ưu tiên (Self-preference)**: chúng có xu hướng [ưu ái đầu ra của chính mình](https://arxiv.org/abs/2404.13076) khi chấm điểm các câu trả lời.
	- Bạn có thể giảm thiểu điều này bằng cách sử dụng một hội đồng giám khảo (jury).
- **Mù quáng trước các nhiễu loạn đầu vào (Blindness to input perturbation)**: các mô hình thường kém trong việc xác định [đầu vào bị nhiễu loạn](https://arxiv.org/abs/2406.13439) và kéo theo đó là [kém trong việc cung cấp các dải điểm số nhất quán](https://twitter.com/aparnadhinak/status/1748368364395721128) (các thực nghiệm mở rộng về vấn đề này tại [đây](https://github.com/LeonEricsson/llmjudge/blob/main/README.md)). Ví dụ, khi được yêu cầu xếp hạng chất lượng văn bản trên các văn bản đã bị thêm nhiễu theo một tỷ lệ nhất quán, điểm số dự đoán không phản ánh tỷ lệ này.
	- Bạn có thể giảm thiểu điều này bằng cách:
		- Yêu cầu mô hình giải thích lập luận của nó [trước khi đưa ra điểm số](https://twitter.com/seungonekim/status/1749289437165769177).
		- Cung cấp một thang điểm đánh giá mạch lạc trong prompt.
- **Thiên vị vị trí (Position-bias)**: chúng có xu hướng [ưu ái các vị trí câu trả lời cụ thể](https://arxiv.org/abs/2306.05685). Ví dụ, khi thực hiện so sánh cặp (pairwise comparisons), Claude và GPT-3.5 có xu hướng ưu ái lựa chọn đầu tiên hoặc lựa chọn thứ hai một cách khá hệ thống.
	- Bạn có thể giảm thiểu điều này bằng cách:
		- Thay đổi vị trí câu trả lời một cách ngẫu nhiên.
		- Tính toán xác suất log (log-probabilities) của tất cả các lựa chọn khả dĩ để có được câu trả lời được chuẩn hóa.
- **Thiên vị dài dòng (Verbosity-bias)** (hoặc thiên vị độ dài): chúng có xu hướng thích các câu trả lời dài dòng hơn.
	- Bạn có thể giảm thiểu điều này bằng cách [tính đến sự khác biệt về độ dài của câu trả lời](https://arxiv.org/abs/2404.04475).
- **Tính nhất quán đáng tranh cãi [với câu trả lời của con người](https://arxiv.org/abs/2308.15812):**
	- Tuy nhiên, việc [liệu con người không phải chuyên gia có là một điểm chuẩn so sánh tốt cho tuyệt đối mọi đánh giá hay không cũng là điều đáng tranh luận](https://arxiv.org/abs/2202.06935). Đối với một số lĩnh vực cụ thể (y tế, pháp luật, toán học, v.v.), việc phụ thuộc vào những người gán nhãn/người chấm điểm (annotator) không phải chuyên gia cũng là một điểm chuẩn tệ hại tương tự như việc sử dụng trực tiếp LLM.
- **Thiên vị định dạng (Format bias)**: chúng có xu hướng không đánh giá chính xác nếu định dạng prompt [quá khác biệt](https://arxiv.org/abs/2310.17631) so với những gì chúng đã được huấn luyện. Ví dụ, một mô hình được huấn luyện để thực hiện so sánh cặp với một câu trả lời tham chiếu được thêm vào sẽ thất bại nếu câu trả lời đó không được cung cấp, và các lỗi tương tự cũng sẽ xảy ra theo chiều ngược lại.
	- Bạn có thể giảm thiểu điều này bằng cách chú ý đến định dạng prompt huấn luyện (nếu mô hình đã được tinh chỉnh hướng dẫn - instruction tuned) và đảm bảo bạn tuân thủ đúng định dạng đó.

## Lựa chọn các tác vụ phù hợp cho một mô hình giám khảo LLM

Các hệ thống đánh giá bằng LLM (LLM evaluators):
- Thường **kém trong việc phát hiện ảo tưởng (hallucinations)** nói chung, đặc biệt là các ảo tưởng một phần (partial hallucinations - những câu trả lời trông rất gần với nhãn chuẩn/sự thật khách quan (ground truth) nhưng thực tế lại hơi khác biệt) (xem [nghiên cứu này](https://arxiv.org/abs/2305.11747) và [nghiên cứu này](https://arxiv.org/abs/2303.08896)).
- Có độ tương quan từ thấp đến trung bình với người chấm điểm con người đối với tác vụ [tóm tắt](https://arxiv.org/abs/2304.02554) ([ở đây cũng chỉ ra điều này](https://arxiv.org/abs/2303.16634)), [độ trung thực](https://arxiv.org/abs/2307.16877), và không nhất quán tương quan với phán quyết của con người trên diện rộng đối với [một loạt các tác vụ khác nhau](https://arxiv.org/abs/2406.18403).
