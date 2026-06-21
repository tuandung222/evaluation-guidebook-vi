---
sidebar_position: 1
sidebar_label: 'Cơ bản'
---

# Cơ bản

## Đánh giá bằng con người là gì?
Đánh giá bằng con người đơn giản là yêu cầu con người chấm điểm mô hình.
Trong tài liệu này, chúng ta tập trung vào đánh giá hậu kỳ (post-hoc): mô hình đã được huấn luyện, bạn đã xác định một tác vụ cụ thể, và con người sẽ cung cấp điểm số.

### Đánh giá có hệ thống
Có 3 cách chính.

Nếu **bạn chưa có dataset** nhưng muốn khám phá các khả năng của mô hình, bạn cung cấp cho người chấm điểm một nhiệm vụ và hướng dẫn (ví dụ: `cố gắng khiến cả hai mô hình tạo ra ngôn ngữ độc hại; mô hình nhận 0 nếu có độc hại, 1 nếu không`), cùng quyền truy cập vào một (hoặc vài) mô hình, rồi yêu cầu họ cung cấp điểm số và lý giải.

Nếu **bạn đã có dataset** (ví dụ: `một tập hợp prompt mà bạn muốn mô hình không được trả lời`), bạn chạy prompt đó qua mô hình, sau đó cung cấp prompt, output và hướng dẫn chấm điểm cho người chấm (`mô hình nhận 0 nếu trả lời bằng thông tin riêng tư, 1 nếu không`).

Cuối cùng, nếu **bạn đã có dataset và điểm số**, bạn có thể yêu cầu con người xem lại phương pháp đánh giá bằng [gán nhãn lỗi (error annotation)](https://ehudreiter.com/2022/06/01/error-annotations-to-evaluate/) *(phương pháp này cũng có thể dùng như một hệ thống chấm điểm trong danh mục trên)*. Đây là bước quan trọng khi thử nghiệm hệ thống đánh giá mới, nhưng về mặt kỹ thuật nó là đánh giá một hệ thống đánh giá khác, nên nằm ngoài phạm vi thảo luận ở đây.

Ghi chú:
- *Để đánh giá mô hình đã được triển khai thực tế (production), bạn cũng có thể thu thập phản hồi từ người dùng và thực hiện A/B testing.*
- *[Kiểm định AI (AI audits)](https://arxiv.org/abs/2401.14462) — đánh giá hệ thống mô hình từ bên ngoài — thường dựa trên con người, nhưng nằm ngoài phạm vi tài liệu này.*

### Đánh giá không chính thức
Có hai cách ít chính thức hơn để thực hiện đánh giá dựa trên con người.

**Vibe-check (đánh giá theo cảm tính)** là các đánh giá thủ công do cá nhân thực hiện, thường dùng prompt không công bố, nhằm có cảm nhận tổng quan về mức độ hoạt động của mô hình trên nhiều use case. Các kết quả này thường được chia sẻ trên Twitter và Reddit, chủ yếu là bằng chứng giai thoại (anecdotal evidence) và rất dễ bị confirmation bias — mọi người thường thấy những gì họ muốn thấy. Tuy nhiên, chúng có thể là [điểm khởi đầu tốt cho use case của riêng bạn](https://olshansky.substack.com/p/vibe-checks-are-all-you-need).

**Arena** là đánh giá bằng con người theo hình thức crowdsourced để xếp hạng mô hình.
Ví dụ nổi tiếng là [LMSYS Chatbot Arena](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard), nơi người dùng trò chuyện với các mô hình cho đến khi nhận thấy mô hình này tốt hơn mô hình kia. Phiếu bầu sau đó được tổng hợp thành bảng xếp hạng Elo để chọn ra mô hình "tốt nhất".

## Ưu và nhược điểm của đánh giá bằng con người

Ưu điểm:
- **Linh hoạt**: Nếu bạn xác định rõ những gì cần đánh giá, bạn có thể nhận điểm số cho hầu hết mọi thứ.
- **Không bị nhiễm bẩn dữ liệu**: Nếu bạn yêu cầu con người viết câu hỏi mới, chúng (hy vọng) sẽ không có trong tập huấn luyện.
- **Tương quan với sở thích của con người**: Khá hiển nhiên, vì đó chính là thước đo bạn dùng để chấm.
  *Ghi chú: Khi đánh giá với con người, hãy đảm bảo người chấm điểm đủ đa dạng để kết quả có thể khái quát hóa.*

Hạn chế:
- **Thiên kiến ấn tượng đầu tiên**: Người đánh giá có xu hướng ước lượng chất lượng câu trả lời [dựa trên ấn tượng ban đầu](https://arxiv.org/abs/2309.16349), thay vì độ chính xác thực tế.
- **Thiên kiến giọng điệu**: Người chấm điểm cộng đồng đặc biệt nhạy cảm với giọng điệu, và thường không nhận ra số lượng lỗi thực tế trong câu trả lời tự tin. Nói cách khác, nếu mô hình trả lời sai với giọng điệu quả quyết, người đánh giá ít có khả năng nhận ra hơn — điều này có thể làm lệch xếp hạng về phía các mô hình nói chắc hơn. (Người chấm điểm chuyên gia ít bị thiên kiến này hơn.)
- **Thiên kiến tự ưu ái**: Con người [có nhiều khả năng thích câu trả lời phù hợp với quan điểm hoặc ý kiến của họ](https://arxiv.org/abs/2310.13548) hơn là câu trả lời chính xác về mặt thực tế.
- **Thiên kiến bản sắc**: Người có bản sắc khác nhau có xu hướng có giá trị khác nhau và xếp hạng câu trả lời của mô hình rất khác nhau (ví dụ: về [độc hại](https://arxiv.org/abs/2205.00501)).

### Đánh giá có hệ thống: ưu điểm riêng
Ưu điểm của đánh giá có hệ thống, đặc biệt với người chấm điểm được trả phí:
- **Dữ liệu chất lượng cao** phù hợp với use case của bạn — làm nền tảng cho tương lai (ví dụ khi phát triển preference model).
- **Bảo mật dữ liệu**: Dùng người chấm điểm được trả phí, đặc biệt nhân sự nội bộ, giúp bộ dữ liệu tương đối an toàn. Trong khi đó, dùng LLM giám khảo qua API nguồn đóng ít đảm bảo hơn về việc dữ liệu của bạn được xử lý thế nào.
- **Khả năng giải thích**: Điểm số mô hình đạt được có thể giải thích được bởi chính những người chấm.

Những hạn chế đi kèm:
- **Chi phí**: Trả thù lao xứng đáng cho người chấm điểm tốn kém, và thường cần nhiều vòng lặp để tinh chỉnh hướng dẫn — làm tăng thêm chi phí.
- **Khó mở rộng**: Trừ khi đánh giá dựa trên phản hồi người dùng trên production, mỗi vòng đánh giá đều cần huy động người chấm điểm mới (và trả phí cho họ).
- **Khó tái lập**: Trừ khi bạn giữ nguyên cùng một nhóm người chấm điểm và hướng dẫn hoàn toàn không mơ hồ, một số đánh giá sẽ khó tái lập chính xác.

### Đánh giá không chính thức: ưu điểm riêng
Ưu điểm:
- **Chi phí thấp hơn**: Dựa trên sự đóng góp thiện chí của cộng đồng.
- **Phát hiện edge case**: Tận dụng sự sáng tạo không giới hạn của người dùng, bạn có thể khám phá ra các trường hợp biên thú vị.
- **Mở rộng tốt hơn**: Chỉ cần có đủ người tham gia, đánh giá không chính thức mở rộng dễ hơn và có rào cản gia nhập thấp hơn.

Những vấn đề rõ ràng của các cách tiếp cận không có kiểm soát:
- **Tính chủ quan cao**: Rất khó áp dụng cách chấm nhất quán từ nhiều thành viên cộng đồng khi dùng hướng dẫn chung chung, đặc biệt khi sở thích người chấm điểm bị [ràng buộc bởi văn hóa](https://arxiv.org/abs/2404.16019v1). Người ta hy vọng hiệu ứng này được làm mịn qua quy mô lớn của lượt bình chọn — nhờ "trí tuệ đám đông" (wisdom of the crowd).
- **Xếp hạng sở thích không đại diện**: Nam giới trẻ phương Tây chiếm tỷ lệ quá lớn trên các trang công nghệ, dẫn đến sở thích thiên lệch — không phản ánh toàn bộ dân số, cả về chủ đề được khám phá lẫn xếp hạng tổng thể.
- **Dễ bị thao túng**: Nếu dùng người chấm điểm cộng đồng không được chọn lọc, bên thứ ba có thể dễ dàng thao túng đánh giá (ví dụ: để nâng điểm cho một mô hình cụ thể có phong cách viết đặc trưng).
