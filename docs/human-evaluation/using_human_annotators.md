---
sidebar_position: 2
sidebar_label: 'Người chấm điểm Con người'
---

# Sử dụng người chấm điểm con người

Chúng tôi khuyên bạn nên đọc Phần 3 của [bài tổng quan (review)](https://aclanthology.org/2024.cl-3.1/) này về các phương pháp hay (best practices) để đảm bảo chất lượng gán nhãn dữ liệu. Nếu bạn muốn đạt được chất lượng ở cấp độ sản xuất thực tế (production level) và có đủ điều kiện để triển khai tất cả các phương pháp này, hãy thực hiện ngay! 

![Best_annotation_practices](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/best_annotation_practices.png?raw=true)

Tuy nhiên, dưới đây là các hướng dẫn quan trọng (bất kể quy mô dự án của bạn là gì) sau khi bạn đã xác định được nhiệm vụ và hướng dẫn chấm điểm của mình:

- **Lựa chọn nhân sự, và nếu có thể, hãy có cơ chế khuyến khích bằng tài chính**
  Bạn có thể muốn những người thực hiện nhiệm vụ của mình:
  1) Đạt được một số đặc điểm nhân khẩu học nhất định.
     Một số ví dụ: là người bản xứ của ngôn ngữ mục tiêu, có trình độ học vấn cao hơn, là chuyên gia trong một lĩnh vực cụ thể, có nguồn gốc địa lý đa dạng, v.v. 
     Nhu cầu của bạn sẽ khác nhau tùy thuộc vào từng nhiệm vụ.
  2) Tạo ra công việc chất lượng cao.
     Đặc biệt quan trọng hiện nay là thêm một cách để kiểm tra xem các câu trả lời có phải do LLM tạo ra hay không, và bạn sẽ cần phải lọc bớt một số người chấm điểm (annotator) ra khỏi danh sách của mình.
     *Theo quan điểm của chúng tôi, trừ khi bạn trông cậy vào những người chấm điểm cộng đồng (crowdsourced) có động lực cực kỳ cao, việc chi trả thù lao xứng đáng cho người chấm điểm luôn là lựa chọn tốt hơn.*

- **Thiết kế hướng dẫn (guideline design)** 
  Hãy chắc chắn dành nhiều thời gian để thực sự động não (brainstorm) các tài liệu hướng dẫn của bạn! Đó là một trong những điểm mà chúng tôi đã dành nhiều thời gian nhất đối với dataset [GAIA](https://huggingface.co/gaia-benchmark).

- **Gán nhãn lặp lại (iterative annotation)** 
  Hãy chuẩn bị tinh thần để thực hiện nhiều vòng gán nhãn/chấm điểm, vì người chấm điểm có thể sẽ hiểu sai hướng dẫn của bạn (chúng thường mơ hồ hơn bạn nghĩ)! Việc tạo các mẫu thử nghiệm nhiều lần sẽ giúp người chấm điểm thực sự hội tụ về những gì bạn cần.

- **Đánh giá chất lượng** và **Chọn lọc thủ công (manual curation)**
  Bạn cần kiểm soát các câu trả lời (đặc biệt là thông qua độ đồng thuận giữa các người chấm điểm (inter-annotator agreement) nếu có thể) và thực hiện lựa chọn cuối cùng để giữ lại những câu trả lời có chất lượng cao nhất/phù hợp nhất.

Các công cụ chuyên dụng để xây dựng các dataset đã được gán nhãn chất lượng cao như [Argilla](https://argilla.io/) cũng có thể hỗ trợ bạn. 

### Đọc thêm
- ⭐ [How to set up your own annotator platform in a couple minutes](https://huggingface.co/learn/cookbook/enterprise_cookbook_argilla), bởi Moritz Laurer. Một bài đọc bổ ích để có trải nghiệm thực tế khi sử dụng các công cụ nguồn mở (như Argilla và Hugging Face), đồng thời hiểu rõ hơn về những điều nên làm và không nên làm khi gán nhãn bằng con người ở quy mô lớn.
- ⭐ [A guide on annotation good practices](https://aclanthology.org/2024.cl-3.1/). Đây là một bài đánh giá tổng quan về tất cả các bài nghiên cứu liên quan đến gán nhãn bằng con người kể từ năm 2023, và nó rất đầy đủ. Tuy có hơi dày đặc thông tin nhưng rất dễ hiểu.
- [Another guide on annotation good practices](https://scale.com/guides/data-labeling-annotation-guide), bởi ScaleAI, đơn vị chuyên về đánh giá bằng con người. Đây là một tài liệu bổ sung gọn nhẹ hơn cho tài liệu ở trên.
- [Assumptions and Challenges of Capturing Human Labels](https://aclanthology.org/2024.naacl-long.126/) là một bài báo nghiên cứu về cách nhìn nhận nguồn gốc gây ra sự bất đồng ý kiến giữa các người chấm điểm và cách giảm thiểu chúng trong thực tế.
