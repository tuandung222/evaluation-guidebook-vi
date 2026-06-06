---
sidebar_position: 4
sidebar_label: 'Đánh giá Giám khảo'
---

# Đánh giá chính mô hình giám khảo

Trước khi đưa một mô hình LLM đóng vai trò giám khảo (model-as-a-judge) vào môi trường vận hành (production) hoặc triển khai ở quy mô lớn, trước tiên bạn cần đánh giá chất lượng của nó đối với tác vụ của bạn, nhằm đảm bảo các điểm số mà nó đưa ra thực sự có liên quan và hữu ích cho bạn. 

> [!NOTE]
> 📝 **Ghi chú**
> Điều này sẽ dễ dàng thực hiện hơn nếu mô hình dự đoán đầu ra nhị phân (binary outputs), vì khi đó bạn có thể sử dụng các thước đo phân loại dễ giải thích (độ chính xác (accuracy)/độ phủ (recall)/độ chính xác dự báo dương (precision)). Nếu nó dự đoán điểm số theo thang điểm, việc ước lượng chất lượng tương quan với một tài liệu tham khảo (reference) sẽ khó khăn hơn nhiều. 

Vì vậy, sau khi đã lựa chọn mô hình giám khảo và prompt của nó, bạn sẽ cần thực hiện các bước sau đây.

## 1. Chọn điểm chuẩn so sánh (baseline)
Bạn cần so sánh các phán quyết của mô hình giám khảo với một điểm chuẩn (baseline): đó có thể là dữ liệu gán nhãn bằng con người (human annotations), đầu ra của một mô hình giám khảo khác mà bạn biết là có chất lượng tốt cho tác vụ của bạn, một nhãn chuẩn/sự thật khách quan (ground truth), hoặc chính mô hình đó nhưng sử dụng một prompt khác, v.v. 

Bạn không nhất thiết cần một lượng lớn ví dụ (50 ví dụ có thể là đủ), nhưng bạn cần chúng phải cực kỳ mang tính đại diện cho tác vụ của bạn, có tính phân biệt cao (đặc biệt là đại diện cho các trường hợp biên - edge cases), và có chất lượng cao nhất trong khả năng của bạn.

## 2. Chọn thước đo (metric)
Thước đo sẽ được sử dụng để so sánh các đánh giá của mô hình giám khảo với tài liệu tham khảo (reference) của bạn. 

Nhìn chung, việc so sánh này sẽ dễ dàng hơn nhiều nếu mô hình của bạn dự đoán các phân lớp nhị phân hoặc thực hiện so sánh cặp (pairwise comparison), vì bạn sẽ có thể tính toán độ chính xác (accuracy) (đối với so sánh cặp), hoặc độ chính xác dự báo dương (precision) và độ phủ (recall) (đối với phân lớp nhị phân), đây đều là các thước đo rất dễ giải thích. 

Việc so sánh sự tương quan của các điểm số với cách chấm điểm của con người hoặc mô hình khác sẽ khó thực hiện hơn. Để hiểu lý do chi tiết hơn, chúng tôi khuyên bạn nên đọc [phần blog thú vị này về chủ đề này](https://eugeneyan.com/writing/llm-evaluators/#key-considerations-before-adopting-an-llm-evaluator).

Nhìn chung, nếu bạn cảm thấy bối rối không biết nên chọn thước đo nào và khi nào (về mặt mô hình, thước đo, ...), bạn cũng có thể tham khảo [biểu đồ thú vị này](https://eugeneyan.com/assets/llm-eval-tree.jpg) từ [cùng bài viết blog ở trên](https://eugeneyan.com/writing/llm-evaluators/) ⭐.

## 3. Đánh giá mô hình giám khảo của bạn
Đối với bước này, bạn chỉ cần sử dụng mô hình và prompt của nó để đánh giá các mẫu thử nghiệm của mình! Sau đó, khi đã có kết quả đánh giá, hãy sử dụng thước đo và tài liệu tham khảo ở trên để tính toán điểm số cho các đánh giá của bạn.

Bạn cần quyết định ngưỡng chấp nhận của mình là bao nhiêu. Tùy thuộc vào độ khó của tác vụ, bạn có thể hướng tới độ chính xác từ 80% đến 95% nếu bạn đang thực hiện so sánh cặp. Về mặt tương quan (nếu bạn sử dụng điểm số), các nghiên cứu trong tài liệu khoa học thường có vẻ hài lòng với hệ số tương quan Pearson là 0.8 so với tài liệu tham khảo. Tuy nhiên, chúng tôi cũng đã thấy một số bài báo tuyên bố rằng 0.3 đã biểu thị một mối tương quan tốt với người gán nhãn/người chấm điểm (annotator) bằng con người (^^") nên kết quả thực tế có thể khác nhau tùy trường hợp (ymmv).
