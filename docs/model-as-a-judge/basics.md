---
sidebar_position: 1
sidebar_label: 'Cơ bản'
---

# Cơ bản

## Mô hình giám khảo (model-as-a-judge) là gì?
Model-as-a-judge đơn giản là **các mạng nơ-ron được dùng để đánh giá đầu ra của các mạng nơ-ron khác**. Trong hầu hết trường hợp, chúng đánh giá nội dung văn bản được tạo ra.

Mô hình giám khảo có thể là các classifier nhỏ chuyên biệt (kiểu "spam filter", nhưng dành cho độc tính chẳng hạn) cho đến các LLM — có thể lớn và đa năng hoặc nhỏ và chuyên biệt. Trong trường hợp sau, khi dùng LLM làm giám khảo, bạn cung cấp cho nó một prompt để giải thích cách chấm điểm (ví dụ: `Hãy chấm điểm mức độ trôi chảy từ 0 đến 5, với 0 nghĩa là hoàn toàn không hiểu được, ...`).

Phương pháp model-as-a-judge cho phép chấm điểm văn bản trên các đặc tính phức tạp và sắc thái tinh tế.
Ví dụ, exact match giữa chuỗi dự đoán và chuỗi tham chiếu có thể giúp kiểm tra mô hình có dự đoán đúng sự thật hay con số không, nhưng đánh giá các khả năng mở hơn (như độ trôi chảy, chất lượng thơ ca, hoặc độ trung thực với đầu vào) đòi hỏi bộ đánh giá phức tạp hơn.

Đó là lúc mô hình giám khảo phát huy vai trò.

Chúng được dùng cho 3 nhiệm vụ chính:
- *Chấm điểm nội dung do mô hình tạo ra*, theo một thang đo được cung cấp, để đánh giá một đặc tính của văn bản (độ trôi chảy, độc tính, tính mạch lạc, tính thuyết phục, v.v.).
- *Chấm điểm so sánh cặp (pairwise)*: so sánh một cặp đầu ra để chọn ra văn bản tốt hơn theo một đặc tính nhất định.
- *Tính độ tương đồng* giữa đầu ra của mô hình và văn bản tham chiếu.

*Ghi chú: Trong tài liệu này, tạm thời chúng tôi tập trung vào cách tiếp cận LLM + prompt, nhưng bạn chắc chắn nên tìm hiểu thêm về cách các classifier-judge hoạt động — chúng tôi cho rằng phương pháp này có thể khá mạnh mẽ và phù hợp với nhiều use case, cũng như phương pháp reward-model-as-a-judge đầy hứa hẹn vừa được giới thiệu gần đây (được đề cập trong [báo cáo kỹ thuật này](https://research.nvidia.com/publication/2024-06_nemotron-4-340b), và chúng tôi có trang giới thiệu ngắn tại [đây](./what_about_reward_models.md))*

## Ưu và nhược điểm của LLM giám khảo
Ưu điểm:
- **Tính khách quan** so với con người: Tự động hóa đánh giá một cách khách quan và có khả năng tái lập.
- **Quy mô và tái lập**: Mở rộng tốt hơn so với người chấm điểm con người, giúp tái lập chấm điểm trên lượng dữ liệu lớn.
- **Chi phí**: Rẻ hơn để bắt đầu — không cần huấn luyện mô hình mới, chỉ cần prompt tốt và một LLM chất lượng cao sẵn có. Cũng rẻ hơn so với trả thù lao cho người chấm điểm là con người thực tế.
- **Tương quan với đánh giá con người**: Có mức độ tương quan nhất định với các đánh giá từ con người.

Tuy nhiên, mọi ưu điểm đều có mặt trái:
- LLM giám khảo trông có vẻ khách quan, nhưng chúng có nhiều **thiên kiến tiềm ẩn** khó phát hiện hơn so với con người — vì chúng ta không chủ động tìm kiếm chúng (xem thêm [Mẹo và thủ thuật](./tips-and-tricks.md)). Ngoài ra, có nhiều cách để giảm thiểu thiên kiến của con người qua thiết kế khảo sát vững chắc về mặt thống kê (đã được nghiên cứu trong xã hội học suốt một thế kỷ), trong khi việc viết prompt cho LLM vẫn chưa đạt mức vững chắc như vậy. Việc dùng LLM để đánh giá LLM đã bị ví như tạo ra echo chamber, củng cố thiên kiến một cách tinh vi.
- Chúng thực sự mở rộng tốt, nhưng lại tạo ra lượng dữ liệu khổng lồ cần được kiểm tra chất lượng (ví dụ, bạn có thể cải thiện chất lượng LLM giám khảo bằng cách yêu cầu chúng tạo thinking trace hoặc lập luận xung quanh dữ liệu — điều này lại tạo ra thêm dữ liệu nhân tạo cần phân tích).
- Chúng thực sự rẻ để bắt đầu, nhưng trả thù lao cho chuyên gia con người có thể mang lại chất lượng tốt hơn đáng kể cho các use case cụ thể của bạn.

## Bắt đầu như thế nào?
- Nếu bạn muốn thử nghiệm, trước tiên hãy đọc [hướng dẫn tuyệt vời này](https://huggingface.co/learn/cookbook/en/llm_judge) (⭐) của Aymeric Roucher về cách thiết lập LLM giám khảo đầu tiên!
  Bạn cũng có thể dùng thử thư viện [distilabel](https://distilabel.argilla.io/latest/), cho phép tạo synthetic data và cập nhật nó bằng LLM. Họ có [hướng dẫn từng bước](https://distilabel.argilla.io/latest/sections/pipeline_samples/papers/ultrafeedback/) áp dụng phương pháp luận của [báo cáo Ultrafeedback](https://arxiv.org/abs/2310.01377) cũng như [hướng dẫn benchmarking](https://distilabel.argilla.io/latest/sections/pipeline_samples/examples/benchmarking_with_distilabel/) triển khai benchmark Arena Hard.
