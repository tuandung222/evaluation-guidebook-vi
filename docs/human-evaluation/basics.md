---
sidebar_position: 1
sidebar_label: 'Cơ bản'
---

# Cơ bản

## Đánh giá bằng con người (human evaluation) là gì?
Đánh giá bằng con người đơn giản là yêu cầu con người thực hiện đánh giá (evaluation) các mô hình.
Trong tài liệu này, chúng ta sẽ xem xét phương pháp đánh giá hậu kỳ (post-hoc evaluation): mô hình của bạn đã được huấn luyện, bạn đã xác định một nhiệm vụ cụ thể và con người sẽ cung cấp điểm số.

### Đánh giá một cách hệ thống
Có 3 cách chính để thực hiện việc này một cách hệ thống.

Nếu **bạn chưa có dataset**, nhưng muốn khám phá một tập hợp các khả năng của mô hình, bạn cung cấp cho người chấm điểm một nhiệm vụ và hướng dẫn chấm điểm (ví dụ: `cố gắng làm cho cả hai mô hình này tạo ra ngôn ngữ độc hại; mô hình nhận điểm 0 nếu có độc hại, điểm 1 nếu không`), đồng thời cấp quyền truy cập vào một (hoặc vài) mô hình mà họ có thể tương tác, sau đó yêu cầu họ cung cấp điểm số và lý giải của mình.

Nếu **bạn đã có sẵn dataset** (ví dụ: `một tập hợp các prompt mà bạn muốn đảm bảo mô hình sẽ không trả lời`), bạn chạy prompt đó với mô hình, rồi cung cấp prompt, kết quả đầu ra (output) và hướng dẫn chấm điểm cho người chấm điểm (`mô hình nhận điểm 0 nếu trả lời bằng thông tin riêng tư, ngược lại nhận điểm 1`).

Cuối cùng, nếu **bạn đã có sẵn dataset và điểm số**, bạn có thể yêu cầu con người xem xét lại phương pháp đánh giá của mình bằng cách thực hiện [gán nhãn lỗi (error annotation)](https://ehudreiter.com/2022/06/01/error-annotations-to-evaluate/) (*phương pháp này cũng có thể được sử dụng như một hệ thống chấm điểm trong danh mục ở trên*). Đây là một bước rất quan trọng khi thử nghiệm hệ thống đánh giá mới, nhưng về mặt kỹ thuật, nó thuộc phạm vi đánh giá một hệ thống đánh giá khác, vì vậy nó nằm ngoài phạm vi thảo luận ở đây.

Ghi chú:
- *Để đánh giá các mô hình đã được triển khai thực tế (production), bạn cũng có thể yêu cầu người dùng phản hồi và thực hiện thử nghiệm A/B (A/B testing) sau đó.*
- *[Kiểm định AI (AI audits)](https://arxiv.org/abs/2401.14462) (đánh giá hệ thống mô hình từ bên ngoài) thường dựa trên con người, nhưng nằm ngoài phạm vi của tài liệu này.*

### Đánh giá không chính thức (casual evaluation)
Có hai cách tiếp cận khác để thực hiện đánh giá dựa trên con người theo cách ít chính thức hơn.

**Vibe-check (đánh giá theo cảm tính)** là các đánh giá thủ công được thực hiện bởi cá nhân, thường dựa trên các prompt không được công bố, nhằm có được cảm nhận tổng quan về mức độ hoạt động hiệu quả của mô hình trên nhiều trường hợp sử dụng (từ lập trình đến chất lượng văn bản nhạy cảm/khiêu dâm). Thường được chia sẻ trên Twitter và Reddit, các kết quả này chủ yếu cấu thành bằng chứng giai thoại (anecdotal evidence) và có xu hướng rất nhạy cảm với thiên kiến xác nhận (confirmation bias) (nói cách khác, mọi người có xu hướng tìm thấy những gì họ muốn tìm). Tuy nhiên, chúng có thể là [điểm khởi đầu tốt cho các trường hợp sử dụng của riêng bạn](https://olshansky.substack.com/p/vibe-checks-are-all-you-need).

**Đấu trường (arena)** là hình thức đánh giá bằng con người dưới dạng đóng góp cộng đồng (crowdsourced) để xếp hạng các mô hình.
Một ví dụ nổi tiếng về việc này là [Đấu trường chatbot LMSYS (LMSYS chatbot arena)](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard), nơi người dùng trong cộng đồng được yêu cầu trò chuyện với các mô hình cho đến khi họ nhận thấy mô hình này tốt hơn mô hình kia. Phiếu bầu sau đó được tổng hợp thành bảng xếp hạng Elo (xếp hạng các trận đấu đầu) để chọn ra mô hình "tốt nhất".

## Ưu và nhược điểm của đánh giá bằng con người

Đánh giá bằng con người rất thú vị vì những lý do sau:
- **Tính linh hoạt**: Nếu bạn xác định đủ rõ ràng những gì mình đang đánh giá, bạn có thể nhận được điểm số cho hầu hết mọi thứ!
- **Không bị nhiễm bẩn dữ liệu**: Nếu bạn yêu cầu con người viết các câu hỏi mới để kiểm thử hệ thống của mình, chúng (hy vọng) sẽ không xuất hiện trong dữ liệu huấn luyện của bạn.
- **Tương quan với sở thích của con người**: Điều này khá hiển nhiên, vì đó chính là thước đo bạn đang sử dụng để chấm điểm.
  *Ghi chú: Tuy nhiên, khi thực hiện đánh giá với con người, bạn cần đảm bảo rằng các người chấm điểm (annotator) của mình đủ đa dạng để kết quả có thể khái quát hóa được.*

Tuy nhiên, phương pháp này cũng tồn tại một số hạn chế:
- **Thiên kiến ấn tượng đầu tiên (first impressions bias)**: Người đánh giá là con người có xu hướng ước lượng chất lượng của câu trả lời [dựa trên ấn tượng đầu tiên](https://arxiv.org/abs/2309.16349), thay vì tính thực tế (factuality) hoặc độ trung thực (faithfulness) thực tế của câu trả lời.
- **Thiên kiến giọng điệu (tone bias)**: Người chấm điểm từ cộng đồng đặc biệt rất nhạy cảm với giọng điệu, và thường đánh giá thấp số lượng lỗi thực tế hoặc lỗi logic trong một câu trả lời mang tính khẳng định chắc chắn. Nói cách khác, nếu một mô hình nói sai với giọng điệu tự tin, người đánh giá là con người sẽ ít có khả năng nhận ra điều đó hơn, điều này có thể làm lệch xếp hạng đối với các mô hình có giọng điệu quả quyết hơn. (Các người chấm điểm chuyên gia sẽ ít rơi vào những thiên kiến này hơn.)
- **Thiên kiến tự ưu ái (self-preference bias)**: Con người [có nhiều khả năng thích các câu trả lời thu hút quan điểm của họ hoặc phù hợp với ý kiến hoặc lỗi của họ](https://arxiv.org/abs/2310.13548), thay vì các câu trả lời chính xác về mặt thực tế.
- **Thiên kiến bản sắc (identity bias)**: Những người có bản sắc khác nhau có xu hướng có các giá trị khác nhau, và xếp hạng câu trả lời của mô hình rất khác nhau (ví dụ: về [độc hại (toxicity)](https://arxiv.org/abs/2205.00501)).

### Đánh giá bằng con người một cách hệ thống
Ưu điểm của đánh giá bằng con người một cách hệ thống, đặc biệt là với những người chấm điểm được trả phí, bao gồm:
- **Nhận được dữ liệu chất lượng cao** phù hợp với trường hợp sử dụng của bạn, giúp bạn có thể xây dựng nền tảng cho tương lai (ví dụ như khi bạn cần phát triển các mô hình sở thích - preference model).
- **Bảo mật dữ liệu**: Nếu bạn dựa vào những người chấm điểm được trả phí, đặc biệt là nhân sự nội bộ, các dataset của bạn sẽ tương đối an toàn, trong khi việc sử dụng LLM làm giám khảo (LLM-evaluation) với các mô hình API nguồn đóng ít có sự đảm bảo hơn về những gì xảy ra với dữ liệu của bạn, vì bạn phải gửi nó đến một dịch vụ bên ngoài.
- **Khả năng giải thích (explainability)**: Điểm số mà mô hình đạt được sẽ có thể giải thích được bởi chính những con người đã chấm điểm chúng.

Đánh giá bằng con người một cách hệ thống cũng mang lại một số vấn đề phát sinh:
- **Chi phí**: Nếu bạn trả thù lao cho người chấm điểm một cách xứng đáng, chi phí này có thể tăng lên nhanh chóng. Bạn cũng có thể cần phải thực hiện nhiều vòng đánh giá lặp lại để tinh chỉnh tài liệu hướng dẫn của mình, điều này cũng làm tăng thêm chi phí.
- **Không có khả năng mở rộng (un-scalability)**: Trừ khi bạn đang đánh giá một hệ thống đang chạy thực tế (production) dựa trên phản hồi của người dùng, đánh giá bằng con người không thực sự có khả năng mở rộng, vì mỗi vòng đánh giá mới đều yêu cầu huy động những người đánh giá mới (và phải trả phí cho họ).
- **Thiếu khả năng tái lập (lack of reproducibility)**: Trừ khi bạn liên tục giữ chân đúng những người chấm điểm đó và tài liệu hướng dẫn của bạn hoàn toàn rõ ràng, không mơ hồ, rất có khả năng một số đánh giá sẽ khó tái lập một cách chính xác.

### Đánh giá bằng con người không chính thức
Ưu điểm của đánh giá bằng con người không chính thức là:
- **Chi phí thấp hơn**: vì bạn dựa trên thiện chí đóng góp của cộng đồng.
- **Phát hiện các trường hợp biên (edge case)**: vì bạn tận dụng sự sáng tạo của người dùng theo cách hầu như không bị giới hạn, bạn có thể khám phá ra các trường hợp biên thú vị.
- **Khả năng mở rộng tốt hơn**: chỉ cần bạn có nhiều người tham gia quan tâm và sẵn lòng, đánh giá bằng con người không chính thức sẽ mở rộng tốt hơn và có chi phí gia nhập thấp hơn.

Những vấn đề rõ ràng của các cách tiếp cận không chính thức (không có sự chọn lọc người chấm điểm) là:
- **Tính chủ quan cao**: rất khó để áp dụng một cách chấm điểm nhất quán từ nhiều thành viên trong cộng đồng khi sử dụng các hướng dẫn chung chung, đặc biệt là khi sở thích của người chấm điểm có xu hướng [bị ràng buộc bởi văn hóa](https://arxiv.org/abs/2404.16019v1). Người ta có thể hy vọng rằng ảnh hưởng này sẽ được làm mịn thông qua quy mô lớn của các lượt bình chọn, nhờ hiệu ứng "trí tuệ đám đông" (wisdom of the crowd) (xem trang wikipedia của Galton).
- **Xếp hạng sở thích không mang tính đại diện**: vì nam giới trẻ tuổi ở phương Tây chiếm tỷ lệ quá lớn trên các trang công nghệ của internet, điều này có thể dẫn đến các sở thích rất thiên lệch, không khớp với sở thích của toàn bộ dân số nói chung, cả về các chủ đề được khám phá lẫn xếp hạng tổng thể.
- **Dễ bị thao túng (game)**: nếu bạn sử dụng những người chấm điểm cộng đồng không được chọn lọc, bên thứ ba sẽ khá dễ dàng thao túng đánh giá của bạn, ví dụ như để nâng cao điểm số của một mô hình cụ thể (vì một số mô hình có phong cách viết rất đặc trưng).
