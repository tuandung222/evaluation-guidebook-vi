---
sidebar_position: 3
sidebar_label: 'Thiết kế Prompt'
---

# Thiết kế prompt đánh giá

## Các mẹo thiết kế prompt tổng quan
Một số hướng dẫn chung chúng tôi ghi nhận được trên mạng khi tự thiết kế prompt là:
- Cung cấp mô tả rõ ràng về nhiệm vụ hiện tại:
  - `Nhiệm vụ của bạn là làm X`.
  - `Bạn sẽ được cung cấp Y`.
- Cung cấp hướng dẫn rõ ràng về tiêu chí đánh giá (evaluation criteria), bao gồm cả hệ thống chấm điểm chi tiết nếu cần:
  - `Bạn nên đánh giá đặc tính Z theo thang điểm từ 1 - 5, trong đó 1 có nghĩa là...`.
  - `Bạn nên đánh giá xem đặc tính Z có xuất hiện trong mẫu Y hay không. Đặc tính Z được coi là xuất hiện nếu...`.
- Cung cấp một số bước đánh giá mang tính "lập luận" bổ sung:
  - `Để đánh giá nhiệm vụ này, trước tiên bạn phải đảm bảo đọc kỹ mẫu Y để xác định..., sau đó...`.
- Chỉ định định dạng đầu ra (output format) mong muốn (việc thêm các trường thông tin sẽ giúp tăng tính nhất quán):
  - `Câu trả lời của bạn phải được cung cấp dưới dạng JSON, với định dạng sau {"Score": Điểm số của bạn, "Reasoning": Lập luận dẫn dắt bạn đến điểm số này}`.

Bạn có thể và nên lấy cảm hứng từ các mẫu prompt của [MixEval](https://github.com/huggingface/lighteval/blob/main/src/lighteval/tasks/extended/mix_eval/judge_prompts.pyy) hoặc [MTBench](https://github.com/huggingface/lighteval/blob/main/src/lighteval/tasks/extended/mt_bench/judge_prompt_templates.py).

Một số mẹo nhỏ khác:
- So sánh cặp (pairwise comparison) [có mức độ tương quan tốt hơn với sở thích của con người](https://arxiv.org/abs/2403.16950) so với việc chấm điểm trực tiếp, và nhìn chung hoạt động mạnh mẽ hơn.
- Nếu bạn thực sự muốn lấy điểm số, hãy sử dụng thang điểm số nguyên và đảm bảo cung cấp giải thích chi tiết cho việc [mỗi điểm số đại diện cho điều gì](https://x.com/seungonekim/status/1749289437165769177), hoặc sử dụng prompt dạng cộng điểm (additive prompt) (`cho 1 điểm nếu câu trả lời có đặc điểm này, cộng thêm 1 điểm nếu...` v.v.).
- Việc sử dụng một prompt cho mỗi khả năng cần chấm điểm có xu hướng mang lại kết quả tốt hơn và ổn định hơn.

## Cải thiện độ chính xác của đánh giá
Bạn cũng có thể cải thiện độ chính xác bằng cách sử dụng các kỹ thuật sau đây (mặc dù có thể tốn kém chi phí hơn):
- **Ví dụ few-shot**: Giống như trong nhiều nhiệm vụ khác, nếu bạn cung cấp các ví dụ mẫu, điều đó có thể giúp ích cho khả năng lập luận của mô hình. Tuy nhiên, điều này sẽ làm tăng độ dài ngữ cảnh (context length) của bạn.
- **Văn bản tham chiếu (reference)**: Bạn cũng có thể bổ sung vào prompt một văn bản tham chiếu nếu có, điều này giúp tăng độ chính xác.
- **Chuỗi suy nghĩ/lập luận từng bước (CoT - Chain-of-Thought)**: [Cải thiện độ chính xác](https://arxiv.org/abs/2212.08073) nếu bạn yêu cầu mô hình đưa ra chuỗi lập luận của nó **trước khi** đưa ra điểm số (cũng được quan sát thấy ở [đây](https://x.com/seungonekim/status/1749289437165769177)).
- **Phân tích hội thoại nhiều lượt (multiturn analysis)**: Có thể cải thiện [khả năng phát hiện lỗi thực tế (factual error)](https://arxiv.org/abs/2305.13281).
- Sử dụng **một ban giám khảo (jury)** (nhiều mô hình giám khảo khác nhau và bạn lấy kết quả tổng hợp của các câu trả lời): [Mang lại kết quả tốt hơn](https://arxiv.org/abs/2404.18796) so với việc chỉ sử dụng một mô hình duy nhất.
  - Kỹ thuật này có thể được thực hiện với chi phí thấp hơn đáng kể bằng cách tận dụng nhiều mô hình nhỏ thay vì một mô hình lớn đắt đỏ.
  - Bạn cũng có thể thử nghiệm sử dụng một mô hình duy nhất nhưng chạy với các mức nhiệt độ (temperature) khác nhau.
- Thật ngạc nhiên, cộng đồng đã phát hiện ra rằng việc thêm các phần thưởng/hình phạt ảo vào prompt (ví dụ: `hãy trả lời chính xác và bạn sẽ nhận được một chú mèo con`) có thể làm tăng tính chính xác. Mức độ hiệu quả có thể khác nhau đối với từng trường hợp, hãy điều chỉnh cho phù hợp với nhu cầu của bạn.

Ghi chú về cách viết prompt: Tùy thuộc vào mức độ quan trọng trong trường hợp sử dụng của bạn, để loại bỏ thiên kiến nhiều nhất có thể, bạn nên tìm hiểu các nghiên cứu trong ngành xã hội học về cách thiết kế các bản khảo sát tốt. Nếu bạn coi mô hình đánh giá của mình như một giải pháp thay thế cho người chấm điểm con người (human annotator), thì bạn cần xem xét các thước đo tương tự: tính toán độ đồng thuận giữa các người chấm điểm (inter-annotator agreement), sử dụng phương pháp luận thiết kế khảo sát chính xác để giảm thiểu thiên kiến, v.v.

Tuy nhiên, hầu hết mọi người không thực sự đòi hỏi một hệ thống đánh giá (eval) không thiên lệch, có tính tái lập và chất lượng cao, mà họ sẽ hài lòng với những đánh giá nhanh chóng và tạm ổn thông qua các prompt ở mức chấp nhận được. (Đây cũng là một lựa chọn hoàn toàn bình thường! Điều đó chỉ phụ thuộc vào mức độ ảnh hưởng của kết quả đánh giá đối với công việc của bạn).
