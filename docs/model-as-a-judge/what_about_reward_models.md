---
sidebar_position: 5
sidebar_label: 'Mô hình chấm điểm thưởng'
---

# Thế còn các Mô hình chấm điểm thưởng thì sao?

## Mô hình chấm điểm thưởng là gì?

Mô hình chấm điểm thưởng (reward model) học cách dự đoán điểm số từ dữ liệu gán nhãn bằng con người (human annotations) cho các cặp prompt/phần hoàn thiện (completion) cho trước. Mục tiêu cuối cùng là giúp chúng đưa ra các dự đoán căn chỉnh phù hợp với sở thích của con người (human preference). 
Sau khi được huấn luyện, các mô hình này có thể được sử dụng để cải thiện các mô hình khác bằng cách đóng vai trò là một hàm chấm điểm thưởng đại diện cho phán quyết của con người.

### Điểm số dạng so sánh cặp (Pairwise score)

Loại mô hình chấm điểm thưởng phổ biến nhất là mô hình Bradley-Terry, mô hình này đưa ra một điểm số duy nhất theo công thức sau:

$$p(\text{completion b tốt hơn completion a}) = \text{sigmoid}(\text{score}_b - \text{score}_a)$$

Mô hình này được huấn luyện chỉ bằng cách so sánh cặp (pairwise comparisons) giữa các phần hoàn thiện. Cách tiếp cận này giúp thu thập dữ liệu dễ dàng hơn so với việc chấm điểm số tuyệt đối, nhưng nó chỉ có thể so sánh nhiều phần hoàn thiện cho cùng một prompt, chứ không thể so sánh các phần hoàn thiện giữa các prompt khác nhau.

Các mô hình khác đã mở rộng cách tiếp cận này để dự đoán một xác suất chi tiết hơn (nuanced probability) về việc phần hoàn thiện này tốt hơn phần hoàn thiện kia ([ví dụ](https://huggingface.co/RLHFlow/pair-preference-model-LLaMA3-8B)). 

Điều này cho phép chúng (về mặt lý thuyết) đánh giá những khác biệt tinh tế giữa các phần hoàn thiện, nhưng đổi lại, chúng ta không thể dễ dàng lưu trữ và so sánh nhiều điểm số khác nhau giữa các prompt cho cùng một tập kiểm thử (test set). Ngoài ra, chiều dài ngữ cảnh (context length) và giới hạn bộ nhớ có thể trở thành vấn đề khi so sánh các phần hoàn thiện quá dài.

### Điểm số tuyệt đối (Absolute score)

Một số mô hình chấm điểm thưởng như [SteerLM](https://arxiv.org/abs/2311.09528) đưa ra điểm số tuyệt đối (absolute scores), có thể được sử dụng để đánh giá trực tiếp các phần hoàn thiện mà không cần so sánh cặp. Các mô hình này có thể dễ sử dụng hơn cho việc đánh giá, nhưng cũng khó thu thập dữ liệu hơn, vì điểm số tuyệt đối có xu hướng kém ổn định hơn so với điểm số so sánh cặp trong đánh giá sở thích của con người. 

Gần đây hơn, một số mô hình đã được đề xuất để xuất ra cả điểm số tuyệt đối và điểm số tương đối, chẳng hạn như [HelpSteer2-Preference](https://arxiv.org/abs/2410.01257) và [ArmoRM](https://arxiv.org/abs/2406.12845).

## Làm thế nào để sử dụng Mô hình chấm điểm thưởng cho việc Đánh giá?

Cho một dataset gồm các prompt, chúng ta có thể tạo ra các phần hoàn thiện từ một mô hình ngôn ngữ và yêu cầu một mô hình chấm điểm thưởng chấm điểm cho chúng.

Đối với các mô hình đưa ra điểm số tuyệt đối, các điểm số thu được có thể được tính trung bình để có được điểm số tổng hợp hợp lý.

Tuy nhiên, trong trường hợp phổ biến hơn là sử dụng điểm số tương đối, điểm thưởng trung bình có thể bị ảnh hưởng bởi các giá trị ngoại lệ (outliers - một vài phần hoàn thiện cực kỳ tốt hoặc cực kỳ tệ), vì các prompt khác nhau có thể có thang điểm thưởng vốn dĩ khác nhau (một số prompt khó hoặc dễ hơn nhiều so với các prompt khác).

Thay vào đó, chúng ta có thể sử dụng:
- **Tỷ lệ thắng (win rates)**: lấy một tập hợp các phần hoàn thiện tham chiếu và tính phần trăm các phần hoàn thiện từ mô hình được xếp hạng cao hơn các phần hoàn thiện tham chiếu. Cách này có độ chi tiết cao hơn một chút. 
- **Xác suất thắng (win probabilities)**: xác suất trung bình của các phần hoàn thiện tốt hơn các phần hoàn thiện tham chiếu, điều này có thể cung cấp một tín hiệu chi tiết hơn và thay đổi mượt mà hơn.

## Ưu điểm và Nhược điểm của Mô hình chấm điểm thưởng

Các mô hình chấm điểm thưởng thường:
- **Rất nhanh**: Việc lấy điểm số chỉ đơn giản là chạy một lượt truyền thẳng (forward pass) của một mô hình tương đối nhỏ (vì chúng ta chỉ nhận được một điểm số chứ không phải văn bản dài, trái ngược với các mô hình LLM đóng vai trò giám khảo).
- **Tính xác định (Deterministic)**: Cùng một lượt truyền thẳng sẽ tái lập lại chính xác cùng một điểm số.
- **Ít có khả năng bị ảnh hưởng bởi thiên vị vị trí (positional bias)**: Vì hầu hết các mô hình chỉ nhận vào một phần hoàn thiện duy nhất, chúng không thể bị ảnh hưởng bởi thứ tự. Đối với các mô hình so sánh cặp, thiên vị vị trí cũng thường ở mức tối thiểu, miễn là dữ liệu huấn luyện được cân bằng giữa việc câu trả lời thứ nhất hay thứ hai là tốt nhất.
- **Không yêu cầu thiết kế prompt (prompt engineering)**: vì mô hình sẽ chỉ đơn giản xuất ra điểm số từ một hoặc hai phần hoàn thiện tùy thuộc vào dữ liệu sở thích mà nó đã được huấn luyện.

Mặt khác, chúng:
- **Yêu cầu tinh chỉnh (fine-tuning) cụ thể**: Đây có thể là một bước tương đối tốn kém, và mặc dù chúng kế thừa nhiều khả năng từ mô hình cơ sở (base model), chúng vẫn có thể hoạt động kém trên các tác vụ nằm ngoài phân phối huấn luyện (out of training distribution).
- **Mất đi tính hiệu quả khi được sử dụng đồng thời trong cả học tăng cường (reinforcement learning) và đánh giá** (hoặc khi sử dụng các thuật toán căn chỉnh trực tiếp - direct alignment trên các dataset tương tự như dữ liệu huấn luyện của mô hình chấm điểm thưởng), vì mô hình ngôn ngữ có thể bị quá khớp (overfit) với sở thích của mô hình chấm điểm thưởng.

## Mẹo và Thủ thuật khi sử dụng Mô hình chấm điểm thưởng để Đánh giá

- Một nơi tốt để tìm các mô hình có hiệu suất cao là [Bảng xếp hạng RewardBench (RewardBench Leaderboard)](https://huggingface.co/spaces/allenai/reward-bench).
- Bạn có thể tham khảo cách các mô hình chấm điểm thưởng được sử dụng trong bài báo [Nemotron](https://arxiv.org/abs/2406.11704). 
- Đối với các mô hình chấm điểm thưởng đánh giá từng prompt và phần hoàn thiện đơn lẻ, bạn có thể lưu bộ nhớ đệm (cache) điểm số của nhiều mô hình tham chiếu và dễ dàng xem một mô hình mới hoạt động như thế nào.
- Việc theo dõi tỷ lệ thắng hoặc xác suất thắng trong suốt quá trình huấn luyện, ví dụ như trong bài báo gần đây [này](https://arxiv.org/abs/2410.11677v1), có thể giúp bạn phát hiện sự suy giảm chất lượng của mô hình và lựa chọn các checkpoint tối ưu.
