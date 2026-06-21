---
sidebar_position: 2
sidebar_label: 'Người chấm điểm Con người'
---

# Sử dụng người chấm điểm con người

Tôi khuyên bạn nên đọc Phần 3 của [bài tổng quan](https://aclanthology.org/2024.cl-3.1/) này về các best practice khi đảm bảo chất lượng gán nhãn dữ liệu. Nếu bạn muốn đạt chất lượng production và có đủ điều kiện triển khai tất cả các phương pháp này, hãy làm ngay!

![Best_annotation_practices](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/best_annotation_practices.png?raw=true)

Dưới đây là các hướng dẫn quan trọng (bất kể quy mô dự án) sau khi bạn đã xác định được tác vụ và hướng dẫn chấm điểm:

- **Lựa chọn nhân sự, và nếu có thể, có cơ chế khuyến khích tài chính**
  Bạn có thể muốn người thực hiện nhiệm vụ:
  1) Đạt một số đặc điểm nhân khẩu học nhất định.
     Ví dụ: là người bản ngữ của ngôn ngữ mục tiêu, có trình độ học vấn cao hơn, là chuyên gia trong lĩnh vực cụ thể, có đa dạng nguồn gốc địa lý, v.v.
     Nhu cầu cụ thể sẽ khác nhau theo từng tác vụ.
  2) Tạo ra công việc chất lượng cao.
     Đặc biệt quan trọng hiện nay là thêm cơ chế kiểm tra xem câu trả lời có phải do LLM tạo không — và bạn sẽ cần loại bỏ một số người chấm điểm.
     *Theo quan điểm của chúng tôi, trừ khi bạn dựa vào crowdsourced annotator có động lực rất cao, trả thù lao xứng đáng luôn là lựa chọn tốt hơn.*

- **Thiết kế hướng dẫn**
  Hãy dành nhiều thời gian để thực sự brainstorm các hướng dẫn của bạn! Đây là một trong những điểm chúng tôi đầu tư nhiều thời gian nhất khi xây dựng dataset [GAIA](https://huggingface.co/gaia-benchmark).

- **Gán nhãn lặp lại (iterative annotation)**
  Hãy chuẩn bị tinh thần cho nhiều vòng gán nhãn/chấm điểm, vì người chấm điểm có thể hiểu sai hướng dẫn của bạn — chúng thường mơ hồ hơn bạn nghĩ! Tạo nhiều mẫu thử nghiệm sẽ giúp người chấm điểm hội tụ về những gì bạn thực sự cần.

- **Đánh giá chất lượng** và **Chọn lọc thủ công**
  Bạn cần kiểm soát các câu trả lời (đặc biệt qua inter-annotator agreement nếu có thể) và thực hiện lựa chọn cuối cùng để giữ lại những câu trả lời chất lượng cao/phù hợp nhất.

Các công cụ chuyên dụng như [Argilla](https://argilla.io/) cũng có thể hỗ trợ bạn xây dựng dataset được gán nhãn chất lượng cao.

### Đọc thêm
- ⭐ [How to set up your own annotator platform in a couple minutes](https://huggingface.co/learn/cookbook/enterprise_cookbook_argilla), bởi Moritz Laurer — hữu ích để có trải nghiệm thực tế với các công cụ mã nguồn mở (Argilla và Hugging Face), đồng thời hiểu rõ những điều nên và không nên làm khi gán nhãn bằng con người ở quy mô lớn.
- ⭐ [A guide on annotation good practices](https://aclanthology.org/2024.cl-3.1/) — tổng quan toàn diện về tất cả nghiên cứu liên quan đến gán nhãn bằng con người từ năm 2023. Có hơi dày đặc nhưng rất dễ hiểu.
- [Another guide on annotation good practices](https://scale.com/guides/data-labeling-annotation-guide), bởi ScaleAI — tài liệu bổ sung ngắn gọn hơn cho tài liệu trên.
- [Assumptions and Challenges of Capturing Human Labels](https://aclanthology.org/2024.naacl-long.126/) — nghiên cứu về cách nhìn nhận nguyên nhân gây bất đồng giữa người chấm điểm và cách giảm thiểu trong thực tế.
