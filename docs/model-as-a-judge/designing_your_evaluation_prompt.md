---
sidebar_position: 3
sidebar_label: 'Thiết kế Prompt'
---

# Thiết kế prompt đánh giá

## Các mẹo thiết kế prompt tổng quan
Một số hướng dẫn chung chúng tôi ghi nhận được khi tự thiết kế prompt:
- Mô tả rõ ràng nhiệm vụ hiện tại:
  - `Nhiệm vụ của bạn là làm X`.
  - `Bạn sẽ được cung cấp Y`.
- Hướng dẫn rõ ràng về tiêu chí đánh giá, bao gồm cả rubric chi tiết nếu cần:
  - `Bạn nên đánh giá đặc tính Z theo thang điểm từ 1 - 5, trong đó 1 có nghĩa là...`.
  - `Bạn nên đánh giá xem đặc tính Z có xuất hiện trong mẫu Y không. Đặc tính Z được coi là xuất hiện nếu...`.
- Thêm một số bước "lập luận" bổ sung:
  - `Để đánh giá nhiệm vụ này, trước tiên bạn phải đọc kỹ mẫu Y để xác định..., sau đó...`.
- Chỉ định định dạng đầu ra mong muốn (thêm các trường thông tin giúp tăng tính nhất quán):
  - `Câu trả lời phải ở dạng JSON với định dạng {"Score": Điểm số của bạn, "Reasoning": Lập luận dẫn đến điểm số này}`.

Bạn có thể và nên lấy cảm hứng từ các mẫu prompt của [MixEval](https://github.com/huggingface/lighteval/blob/main/src/lighteval/tasks/extended/mix_eval/judge_prompts.pyy) hoặc [MTBench](https://github.com/huggingface/lighteval/blob/main/src/lighteval/tasks/extended/mt_bench/judge_prompt_templates.py).

Một số mẹo bổ sung:
- Pairwise comparison [có tương quan tốt hơn với sở thích con người](https://arxiv.org/abs/2403.16950) so với chấm điểm trực tiếp, và nhìn chung mạnh mẽ hơn.
- Nếu muốn lấy điểm số cụ thể, hãy dùng thang điểm số nguyên và giải thích chi tiết [mỗi điểm số đại diện cho điều gì](https://x.com/seungonekim/status/1749289437165769177), hoặc dùng additive prompt (`cho 1 điểm nếu câu trả lời có đặc điểm này, cộng thêm 1 điểm nếu...` v.v.).
- Dùng một prompt cho mỗi năng lực cần chấm điểm thường cho kết quả tốt và ổn định hơn.

## Cải thiện độ chính xác của đánh giá
Bạn cũng có thể cải thiện độ chính xác qua các kỹ thuật sau (tuy có thể tốn kém hơn):
- **Few-shot examples**: Giống như nhiều tác vụ khác, cung cấp ví dụ mẫu giúp ích cho khả năng lập luận của mô hình — nhưng sẽ làm tăng context length.
- **Văn bản tham chiếu**: Bổ sung vào prompt một tham chiếu nếu có — điều này tăng độ chính xác.
- **Chain-of-Thought (CoT)**: [Cải thiện độ chính xác](https://arxiv.org/abs/2212.08073) nếu bạn yêu cầu mô hình đưa ra chuỗi lập luận **trước khi** cho điểm (cũng được quan sát tại [đây](https://x.com/seungonekim/status/1749289437165769177)).
- **Phân tích đa lượt (multiturn analysis)**: Có thể cải thiện [khả năng phát hiện lỗi thực tế](https://arxiv.org/abs/2305.13281).
- **Dùng hội đồng giám khảo (jury)** — nhiều mô hình giám khảo khác nhau, lấy kết quả tổng hợp: [Mang lại kết quả tốt hơn](https://arxiv.org/abs/2404.18796) so với một mô hình duy nhất.
  - Có thể triển khai với chi phí thấp hơn đáng kể bằng cách dùng nhiều mô hình nhỏ thay vì một mô hình lớn đắt đỏ.
  - Bạn cũng có thể thử dùng một mô hình duy nhất nhưng chạy ở các temperature khác nhau.
- Thú vị là cộng đồng phát hiện ra rằng thêm phần thưởng/hình phạt ảo vào prompt (ví dụ: `hãy trả lời chính xác và bạn sẽ nhận được một chú mèo con`) có thể tăng độ chính xác. Mức hiệu quả có thể khác nhau — hãy điều chỉnh cho phù hợp với nhu cầu của bạn.

Ghi chú về cách viết prompt: Tùy mức độ quan trọng trong use case của bạn, để giảm thiểu thiên kiến, bạn nên tìm hiểu các nghiên cứu trong xã hội học về thiết kế khảo sát tốt. Nếu bạn coi mô hình đánh giá như một giải pháp thay thế cho người chấm điểm con người, bạn cần xem xét các thước đo tương tự: tính inter-annotator agreement, dùng phương pháp luận thiết kế khảo sát để giảm thiểu thiên kiến, v.v.

Tuy nhiên, hầu hết mọi người không thực sự cần một hệ thống đánh giá không thiên lệch, có tính tái lập và chất lượng cao — họ sẽ hài lòng với đánh giá nhanh và tạm ổn qua prompt ở mức chấp nhận được. (Đây cũng là lựa chọn hoàn toàn bình thường! Điều đó chỉ phụ thuộc vào mức độ ảnh hưởng của kết quả đánh giá đối với công việc của bạn).
