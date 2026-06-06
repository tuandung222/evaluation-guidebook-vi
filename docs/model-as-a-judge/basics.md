---
sidebar_position: 1
sidebar_label: 'Cơ bản'
---

# Cơ bản

## Đánh giá bằng mô hình giám khảo (judge model evaluation) là gì?
Mô hình giám khảo đơn giản là **các mạng nơ-ron (neural network) được sử dụng để đánh giá đầu ra (output) của các mạng nơ-ron khác**. Trong hầu hết các trường hợp, chúng đánh giá các nội dung văn bản được tạo ra. 

Mô hình giám khảo có thể từ các bộ phân loại chuyên biệt nhỏ (kiểu như "bộ lọc thư rác - spam filter", nhưng dành cho độc tính chẳng hạn) cho đến các LLM, có thể là mô hình lớn và đa năng hoặc nhỏ và chuyên biệt. Trong trường hợp sau, khi sử dụng LLM làm giám khảo, bạn cung cấp cho nó một prompt để giải thích cách chấm điểm các mô hình (ví dụ: `Hãy chấm điểm mức độ trôi chảy từ 0 đến 5, với 0 nghĩa là hoàn toàn không hiểu được, ...`). 

Phương pháp mô hình đóng vai trò giám khảo (model-as-a-judge) cho phép chấm điểm văn bản trên các đặc tính phức tạp và sắc thái tinh tế. 
Ví dụ, việc khớp chính xác (exact match) giữa chuỗi dự đoán (prediction) và chuỗi tham chiếu (reference) có thể giúp bạn kiểm tra xem mô hình có dự đoán đúng sự thật hoặc con số hay không, nhưng việc đánh giá các khả năng thực nghiệm mang tính mở hơn (như độ trôi chảy, chất lượng thơ ca, hoặc độ trung thực đối với đầu vào) lại yêu cầu các bộ đánh giá phức tạp hơn. 

Đó là lúc các mô hình giám khảo phát huy vai trò của mình. 

Chúng được sử dụng cho 3 nhiệm vụ chính:
- *Chấm điểm nội dung do mô hình tạo ra*, theo một thang đo được cung cấp, để đánh giá một đặc tính của văn bản (độ trôi chảy, độc tính, tính mạch lạc, tính thuyết phục, v.v.).
- *Chấm điểm so sánh cặp (pairwise scoring)*: so sánh một cặp đầu ra của mô hình để chọn ra văn bản tốt nhất đối với một đặc tính nhất định.
- *Tính toán độ tương đồng* giữa đầu ra của mô hình và văn bản tham chiếu (reference).

*Ghi chú: Trong tài liệu này, tạm thời chúng tôi sẽ tập trung vào cách tiếp cận dùng LLM + prompt, nhưng bạn chắc chắn nên tìm hiểu thêm cách hoạt động của các bộ phân loại giám khảo (classifier judge), vì chúng tôi nghĩ rằng phương pháp này có thể khá mạnh mẽ và phù hợp với nhiều trường hợp sử dụng, cũng như phương pháp mô hình chấm điểm thưởng làm giám khảo (reward-model-as-a-judge) đầy hứa hẹn vừa được giới thiệu gần đây (được đề cập trong [báo cáo kỹ thuật này](https://research.nvidia.com/publication/2024-06_nemotron-4-340b), và chúng tôi có một trang ngắn giới thiệu về nó tại [đây](./what_about_reward_models.md))*

## Ưu và nhược điểm của việc sử dụng LLM làm giám khảo (judge-LLM)
Các LLM giám khảo được ưa chuộng nhờ các điểm sau:
- **Tính khách quan** so với con người: Chúng tự động hóa các đánh giá thực nghiệm một cách khách quan và có thể tái lập.
- **Quy mô và khả năng tái lập (reproducibility)**: Chúng có khả năng mở rộng quy mô tốt hơn so với người chấm điểm con người, giúp tái lập việc chấm điểm trên lượng dữ liệu lớn.
- **Chi phí**: Chúng có chi phí khởi tạo rẻ, vì không yêu cầu huấn luyện một mô hình mới, mà chỉ cần dựa trên việc viết prompt tốt và một LLM chất lượng cao sẵn có. Chúng cũng rẻ hơn so với việc trả thù lao cho người chấm điểm là con người thực tế.
- **Sự đồng thuận với đánh giá của con người**: Chúng có mối tương quan nhất định với các đánh giá từ con người.

Tuy nhiên, tất cả những ưu điểm trên đều có mặt trái:
- LLM làm giám khảo có vẻ khách quan, nhưng chúng có nhiều ** thiên kiến tiềm ẩn (hidden biases)** khó phát hiện hơn so với con người, vì chúng ta không chủ động tìm kiếm chúng (xem thêm [Mẹo và thủ thuật](./tips-and-tricks.md)). Ngoài ra, có nhiều cách để giảm thiểu thiên kiến của con người bằng cách thiết kế các câu hỏi khảo sát theo những cách cụ thể và vững chắc về mặt thống kê (điều đã được nghiên cứu trong xã hội học suốt khoảng một thế kỷ qua), trong khi việc viết prompt cho LLM vẫn chưa đạt được mức độ vững chắc như vậy. Việc sử dụng LLM để đánh giá LLM đã bị ví như việc tạo ra hiệu ứng phòng vang (echo-chamber), làm củng cố các thiên kiến một cách tinh vi.
- Chúng thực sự có khả năng mở rộng quy mô, nhưng lại góp phần tạo ra lượng dữ liệu khổng lồ mà bản thân dữ liệu đó cũng cần được kiểm tra để đảm bảo chất lượng (ví dụ, bạn có thể cải thiện chất lượng của LLM giám khảo bằng cách yêu cầu chúng tạo ra vết tư duy - thinking trace hoặc lập luận xung quanh dữ liệu của chúng, điều này tạo ra thậm chí còn nhiều dữ liệu nhân tạo mới hơn cần phân tích).
- Chúng thực sự rẻ để bắt đầu, nhưng việc chi trả cho những người chấm điểm thực tế là các chuyên gia con người có khả năng mang lại kết quả chất lượng tốt hơn rõ rệt cho các trường hợp sử dụng cụ thể của bạn.

## Bắt đầu như thế nào?
- Nếu bạn muốn thử nghiệm, trước tiên chúng tôi khuyên bạn nên đọc [hướng dẫn rất hay này](https://huggingface.co/learn/cookbook/en/llm_judge) (⭐) của Aymeric Roucher về cách thiết lập LLM giám khảo đầu tiên của bạn!
Bạn cũng có thể dùng thử thư viện [distilabel](https://distilabel.argilla.io/latest/), cho phép bạn tạo dữ liệu tổng hợp (synthetic data) và cập nhật nó bằng LLMs. Họ có một [hướng dẫn từng bước (tutorial)](https://distilabel.argilla.io/latest/sections/pipeline_samples/papers/ultrafeedback/) rất hay áp dụng phương pháp luận của [báo cáo nghiên cứu Ultrafeedback](https://arxiv.org/abs/2310.01377) cũng như một [hướng dẫn từng bước về benchmarking](https://distilabel.argilla.io/latest/sections/pipeline_samples/examples/benchmarking_with_distilabel/) triển khai bộ thử nghiệm (benchmark) Arena Hard.
