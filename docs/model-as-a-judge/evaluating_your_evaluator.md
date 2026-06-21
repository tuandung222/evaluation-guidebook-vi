---
sidebar_position: 4
sidebar_label: 'Đánh giá Giám khảo'
---

# Đánh giá chính mô hình giám khảo

Trước khi đưa một LLM đóng vai trò giám khảo (model-as-a-judge) vào production hoặc triển khai ở quy mô lớn, bạn cần đánh giá chất lượng của nó trên tác vụ cụ thể của mình, nhằm đảm bảo rằng điểm số nó đưa ra thực sự có giá trị.

> [!NOTE]
> 📝 **Ghi chú**
> Việc này dễ thực hiện hơn nếu mô hình dự đoán đầu ra nhị phân (binary outputs), vì khi đó bạn có thể dùng các thước đo phân loại dễ đọc như accuracy/recall/precision. Nếu mô hình dự đoán điểm số theo thang điểm, việc ước lượng tương quan chất lượng với một tài liệu tham chiếu (reference) sẽ khó hơn nhiều.

Vì vậy, sau khi đã chọn xong mô hình giám khảo và prompt cho nó, bạn cần thực hiện các bước sau.

## 1. Chọn điểm chuẩn so sánh (baseline)
Bạn cần so sánh phán quyết của mô hình giám khảo với một baseline: có thể là dữ liệu gán nhãn bằng con người, đầu ra của một mô hình giám khảo khác mà bạn biết là chất lượng tốt, một ground truth, hoặc chính mô hình đó nhưng dùng prompt khác, v.v.

Bạn không cần quá nhiều ví dụ (50 ví dụ có thể là đủ), nhưng chúng phải thực sự đại diện cho tác vụ của bạn, có tính phân biệt cao (đặc biệt là phải đại diện cho các trường hợp biên - edge cases), và có chất lượng cao nhất trong khả năng của bạn.

## 2. Chọn thước đo (metric)
Thước đo dùng để so sánh phán quyết của mô hình giám khảo với baseline của bạn.

Nhìn chung, việc so sánh sẽ dễ hơn nhiều nếu mô hình dự đoán các lớp nhị phân hoặc thực hiện so sánh cặp (pairwise comparison): lúc này bạn có thể tính accuracy (cho pairwise) hoặc precision/recall (cho phân lớp nhị phân) — đây đều là những thước đo rất dễ giải thích.

So sánh tương quan điểm số với cách chấm của con người hoặc mô hình khác sẽ khó hơn nhiều. Để hiểu rõ hơn về vấn đề này, bạn nên đọc [phần blog thú vị này](https://eugeneyan.com/writing/llm-evaluators/#key-considerations-before-adopting-an-llm-evaluator).

Nếu vẫn còn phân vân không biết chọn thước đo nào và khi nào, bạn có thể tham khảo [biểu đồ này](https://eugeneyan.com/assets/llm-eval-tree.jpg) từ [bài blog trên](https://eugeneyan.com/writing/llm-evaluators/) ⭐.

## 3. Đánh giá mô hình giám khảo của bạn
Bước này đơn giản: dùng mô hình và prompt của nó để đánh giá các mẫu thử nghiệm. Sau đó, dùng thước đo và baseline đã chọn để tính điểm cho kết quả đánh giá.

Bạn cần tự quyết định ngưỡng chấp nhận. Tùy vào độ khó của tác vụ, bạn có thể hướng tới accuracy từ 80% đến 95% nếu đang thực hiện pairwise comparison. Về tương quan điểm số, các nghiên cứu trong tài liệu khoa học thường hài lòng với hệ số Pearson là 0.8 so với baseline. Tuy nhiên, chúng tôi cũng thấy một số bài báo cho rằng 0.3 đã là tương quan tốt với người chấm điểm con người (^^") — nên kết quả thực tế có thể khác nhau tùy trường hợp (ymmv).
�n sử dụng mô hình và prompt của nó để đánh giá các mẫu thử nghiệm của mình! Sau đó, khi đã có kết quả đánh giá, hãy sử dụng thước đo và tài liệu tham khảo ở trên để tính toán điểm số cho các đánh giá của bạn.

Bạn cần quyết định ngưỡng chấp nhận của mình là bao nhiêu. Tùy thuộc vào độ khó của tác vụ, bạn có thể hướng tới độ chính xác từ 80% đến 95% nếu bạn đang thực hiện so sánh cặp. Về mặt tương quan (nếu bạn sử dụng điểm số), các nghiên cứu trong tài liệu khoa học thường có vẻ hài lòng với hệ số tương quan Pearson là 0.8 so với tài liệu tham khảo. Tuy nhiên, chúng tôi cũng đã thấy một số bài báo tuyên bố rằng 0.3 đã biểu thị một mối tương quan tốt với người gán nhãn/người chấm điểm (annotator) bằng con người (^^") nên kết quả thực tế có thể khác nhau tùy trường hợp (ymmv).
