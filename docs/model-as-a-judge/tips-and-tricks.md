---
sidebar_position: 6
sidebar_label: 'Mẹo & Thủ thuật'
---

# Mẹo và thủ thuật

## Giảm thiểu các thiên kiến đã biết của LLM giám khảo

- **Thiếu nhất quán nội bộ**: Một giám khảo có thể đưa ra phán quyết khác nhau nếu bạn prompt nó nhiều lần (khi temperature khác 0).
	- Giảm thiểu bằng cách dùng self-consistency prompting — prompt nhiều lần và lấy kết quả của đa số (majority output).
- **Tự ưu tiên (self-preference)**: LLM có xu hướng [ưu ái đầu ra của chính mình](https://arxiv.org/abs/2404.13076) khi chấm điểm.
	- Giảm thiểu bằng cách dùng một hội đồng giám khảo (jury).
- **Mù quáng trước nhiễu loạn đầu vào**: Các mô hình thường kém trong việc phát hiện [đầu vào bị nhiễu loạn](https://arxiv.org/abs/2406.13439) và kéo theo đó là [cung cấp dải điểm số không nhất quán](https://twitter.com/aparnadhinak/status/1748368364395721128) (thực nghiệm mở rộng tại [đây](https://github.com/LeonEricsson/llmjudge/blob/main/README.md)). Ví dụ, khi xếp hạng chất lượng văn bản bị thêm nhiễu theo một tỷ lệ nhất quán, điểm số dự đoán không phản ánh tỷ lệ đó.
	- Giảm thiểu bằng cách:
		- Yêu cầu mô hình giải thích lập luận [trước khi đưa ra điểm số](https://twitter.com/seungonekim/status/1749289437165769177).
		- Cung cấp một thang điểm đánh giá mạch lạc trong prompt.
- **Thiên kiến vị trí (position bias)**: LLM có xu hướng [ưu ái vị trí câu trả lời cụ thể](https://arxiv.org/abs/2306.05685). Ví dụ, khi so sánh cặp, Claude và GPT-3.5 có xu hướng ưu ái lựa chọn đầu tiên hoặc thứ hai một cách khá hệ thống.
	- Giảm thiểu bằng cách:
		- Thay đổi vị trí câu trả lời ngẫu nhiên.
		- Tính log-probability của tất cả các lựa chọn khả dĩ để có câu trả lời được chuẩn hóa.
- **Thiên kiến dài dòng (verbosity bias)**: LLM có xu hướng thích câu trả lời dài hơn.
	- Giảm thiểu bằng cách [tính đến sự khác biệt độ dài câu trả lời](https://arxiv.org/abs/2404.04475).
- **Tính nhất quán đáng tranh cãi [với câu trả lời của con người](https://arxiv.org/abs/2308.15812):**
	- Tuy nhiên, [liệu người không chuyên có phải là điểm chuẩn tốt cho mọi đánh giá hay không cũng là điều đáng tranh luận](https://arxiv.org/abs/2202.06935). Với một số lĩnh vực cụ thể (y tế, pháp luật, toán học, v.v.), phụ thuộc vào người gán nhãn không phải chuyên gia cũng là một điểm chuẩn tệ tương tự như dùng trực tiếp LLM.
- **Thiên kiến định dạng (format bias)**: LLM có xu hướng không đánh giá chính xác nếu định dạng prompt [quá khác biệt](https://arxiv.org/abs/2310.17631) so với training. Ví dụ, mô hình được huấn luyện cho pairwise comparison với câu trả lời tham chiếu sẽ thất bại nếu không có tham chiếu, và ngược lại.
	- Giảm thiểu bằng cách chú ý đến định dạng prompt huấn luyện (nếu mô hình đã được instruction-tuned) và tuân thủ đúng định dạng đó.

## Lựa chọn tác vụ phù hợp cho LLM giám khảo

LLM evaluator:
- Thường **kém trong việc phát hiện hallucination**, đặc biệt là partial hallucination — câu trả lời trông rất gần với ground truth nhưng thực tế lại hơi khác biệt (xem [nghiên cứu này](https://arxiv.org/abs/2305.11747) và [nghiên cứu này](https://arxiv.org/abs/2303.08896)).
- Có tương quan từ thấp đến trung bình với người chấm điểm con người đối với tác vụ [tóm tắt](https://arxiv.org/abs/2304.02554) ([ở đây cũng chỉ ra điều này](https://arxiv.org/abs/2303.16634)), [độ trung thực](https://arxiv.org/abs/2307.16877), và không nhất quán tương quan với phán quyết con người trên [nhiều tác vụ khác nhau](https://arxiv.org/abs/2406.18403).
