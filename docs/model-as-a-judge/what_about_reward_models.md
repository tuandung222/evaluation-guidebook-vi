---
sidebar_position: 5
sidebar_label: 'Mô hình chấm điểm thưởng'
---

# Thế còn Reward Model thì sao?

## Reward model là gì?

Reward model học cách dự đoán điểm số từ các annotation của con người cho các cặp prompt/completion cho trước. Mục tiêu cuối cùng là đưa ra dự đoán phù hợp với sở thích con người (human preference).
Sau khi được huấn luyện, các mô hình này có thể được dùng để cải thiện các mô hình khác bằng cách đóng vai trò là hàm chấm điểm đại diện cho phán quyết của con người.

### Điểm số pairwise

Loại reward model phổ biến nhất là mô hình Bradley-Terry, đưa ra điểm số theo công thức:

$$p(\text{completion b tốt hơn completion a}) = \text{sigmoid}(\text{score}_b - \text{score}_a)$$

Mô hình này được huấn luyện chỉ bằng pairwise comparison giữa các completion. Cách này giúp thu thập dữ liệu dễ hơn so với chấm điểm tuyệt đối, nhưng chỉ có thể so sánh các completion cho cùng một prompt — không so sánh được giữa các prompt khác nhau.

Một số mô hình mở rộng cách tiếp cận này để dự đoán xác suất chi tiết hơn về việc completion này tốt hơn completion kia ([ví dụ](https://huggingface.co/RLHFlow/pair-preference-model-LLaMA3-8B)).

Điều này cho phép (về mặt lý thuyết) đánh giá những khác biệt tinh tế, nhưng đổi lại, ta không thể dễ dàng lưu và so sánh nhiều điểm số giữa các prompt cho cùng một test set. Ngoài ra, context length và giới hạn bộ nhớ có thể gây vấn đề khi so sánh các completion dài.

### Điểm số tuyệt đối

Một số reward model như [SteerLM](https://arxiv.org/abs/2311.09528) đưa ra điểm số tuyệt đối — có thể dùng để đánh giá trực tiếp completion mà không cần so sánh cặp. Các mô hình này có thể dễ sử dụng hơn cho đánh giá, nhưng cũng khó thu thập dữ liệu hơn vì điểm tuyệt đối thường kém ổn định hơn điểm pairwise trong đánh giá sở thích con người.

Gần đây, một số mô hình được đề xuất để xuất ra cả điểm tuyệt đối và điểm tương đối, như [HelpSteer2-Preference](https://arxiv.org/abs/2410.01257) và [ArmoRM](https://arxiv.org/abs/2406.12845).

## Cách sử dụng Reward model để đánh giá?

Với một dataset gồm các prompt, ta tạo ra các completion từ mô hình ngôn ngữ và yêu cầu reward model chấm điểm.

Với mô hình đưa ra điểm tuyệt đối, các điểm thu được có thể được tính trung bình để có điểm tổng hợp.

Tuy nhiên, trong trường hợp phổ biến hơn là điểm tương đối, điểm thưởng trung bình có thể bị ảnh hưởng bởi outlier (một vài completion cực kỳ tốt hoặc tệ), vì các prompt khác nhau có thể có thang điểm thưởng vốn dĩ khác nhau.

Thay vào đó, ta có thể dùng:
- **Tỷ lệ thắng (win rates)**: lấy tập completion tham chiếu và tính phần trăm completion từ mô hình được xếp hạng cao hơn tham chiếu. Cách này có độ chi tiết cao hơn một chút.
- **Xác suất thắng (win probabilities)**: xác suất trung bình của completion tốt hơn tham chiếu — cung cấp tín hiệu chi tiết hơn và thay đổi mượt mà hơn.

## Ưu và nhược điểm của Reward model

Reward model thường:
- **Rất nhanh**: Lấy điểm số chỉ cần một forward pass của mô hình tương đối nhỏ (vì ta chỉ nhận một điểm số chứ không phải văn bản dài, khác với LLM giám khảo).
- **Tính xác định (deterministic)**: Cùng một forward pass tái lập chính xác cùng một điểm số.
- **Ít bị position bias**: Vì hầu hết các mô hình chỉ nhận một completion, chúng không thể bị ảnh hưởng bởi thứ tự. Với mô hình pairwise, position bias cũng thường ở mức tối thiểu nếu dữ liệu huấn luyện được cân bằng giữa câu trả lời thứ nhất và thứ hai.
- **Không cần prompt engineering**: Mô hình chỉ đơn giản xuất ra điểm số từ một hoặc hai completion tùy theo preference data được huấn luyện.

Mặt khác:
- **Cần fine-tuning cụ thể**: Đây là bước tương đối tốn kém. Dù kế thừa nhiều khả năng từ mô hình nền (base model), chúng vẫn có thể hoạt động kém trên các tác vụ nằm ngoài distribution huấn luyện.
- **Mất hiệu quả khi dùng đồng thời trong RL và đánh giá** (hoặc khi dùng direct alignment trên dataset tương tự dữ liệu huấn luyện của reward model), vì mô hình ngôn ngữ có thể overfit với sở thích của reward model.

## Mẹo khi sử dụng Reward model để đánh giá

- Tìm các mô hình hiệu suất cao tại [RewardBench Leaderboard](https://huggingface.co/spaces/allenai/reward-bench).
- Xem cách reward model được sử dụng trong bài báo [Nemotron](https://arxiv.org/abs/2406.11704).
- Với các reward model đánh giá từng cặp prompt/completion riêng lẻ, bạn có thể cache điểm số của nhiều mô hình tham chiếu và dễ dàng xem mô hình mới hoạt động thế nào.
- Theo dõi win rate hoặc win probability trong suốt quá trình huấn luyện — như trong bài báo [này](https://arxiv.org/abs/2410.11677v1) — có thể giúp phát hiện suy giảm chất lượng mô hình và chọn checkpoint tối ưu.
