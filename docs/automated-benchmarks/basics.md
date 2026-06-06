---
sidebar_position: 1
sidebar_label: 'Cơ bản'
---

# Khái niệm cơ bản

*Ghi chú: Một số nội dung ở đây sẽ trùng lặp với [bài viết blog chung của tôi về đánh giá mô hình](https://huggingface.co/blog/clefourrier/llm-evaluation)*

## Bộ thử nghiệm tự động (automated benchmark) là gì?

Các bộ thử nghiệm tự động (automated benchmark) thường hoạt động theo cách sau: bạn muốn biết mô hình của mình hoạt động tốt như thế nào trên một phương diện nào đó. Phương diện này có thể là một **tác vụ** cụ thể và rõ ràng như `Mô hình phân loại email spam và email thường tốt đến mức nào?`, hoặc một **năng lực** trừu tượng và khái quát hơn như `Khả năng làm toán của mô hình tốt như thế nào?`.

Từ mục tiêu này, bạn sẽ thiết lập một quy trình đánh giá (evaluation), sử dụng:
- Một **bộ dữ liệu** (dataset) được cấu thành từ các **mẫu** (samples).
	- Các mẫu này chứa một đầu vào cho mô hình, đôi khi đi kèm với một nhãn chuẩn (thường gọi là gold reference) để so sánh với đầu ra của mô hình.
	- Các mẫu thường được thiết kế để mô phỏng những gì bạn muốn thử nghiệm trên mô hình: ví dụ, nếu bạn đang đánh giá tác vụ phân loại email, bạn sẽ tạo ra một bộ dữ liệu gồm các email spam và email thường, cố gắng đưa vào một số trường hợp biên (edge case) hóc búa, v.v.
- Một **thước đo** (metric).
	- Thước đo là cách để tính điểm cho mô hình của bạn.
	  Ví dụ: mô hình của bạn có thể phân loại thư rác chính xác đến mức nào (điểm của mẫu phân loại đúng = 1, phân loại sai = 0).
	- Các thước đo sử dụng đầu ra của mô hình để tính điểm. Trong trường hợp của LLM, người ta chủ yếu xem xét hai loại đầu ra:
		- Đoạn văn bản do mô hình sinh ra từ đầu vào (*đánh giá dựa trên khả năng sinh* - generative evaluation)
		- Xác suất log (log-probability) của một hoặc nhiều chuỗi được cung cấp cho mô hình (*đánh giá trắc nghiệm nhiều lựa chọn* - multiple-choice evaluations, đôi khi được gọi là MCQA, hoặc *đánh giá perplexity* - perplexity evaluations)
		- Để biết thêm thông tin về vấn đề này, bạn nên xem trang [Suy luận và đánh giá mô hình](../general-knowledge/model_inference_and_evaluation.md).

Việc đánh giá này sẽ có giá trị hơn khi thực hiện trên dữ liệu mà mô hình chưa từng tiếp xúc trước đây (dữ liệu không có trong tập dữ liệu huấn luyện của mô hình), bởi vì bạn muốn kiểm tra khả năng **khái quát hóa** (generalizes) của nó. Ví dụ, liệu nó có thể phân loại các email spam về sản phẩm "sức khỏe" sau khi chỉ được huấn luyện trên các email spam về ngân hàng giả mạo hay không.

> [!NOTE]
> 📝 **Ghi chú**
> Một mô hình chỉ có thể đưa ra dự đoán tốt trên dữ liệu huấn luyện của nó (và chưa học được các mẫu tổng quát ở cấp độ cao hơn một cách ngầm định) được gọi là bị **overfitting**. Tương tự như một học sinh học thuộc lòng các câu hỏi kiểm tra mà không hiểu bản chất môn học, việc đánh giá LLM trên dữ liệu đã xuất hiện trong tập huấn luyện thực chất là đang chấm điểm cho những năng lực mà chúng không hề sở hữu.

## Ưu và nhược điểm của các bộ thử nghiệm tự động

Các bộ thử nghiệm tự động có những ưu điểm sau:
- **Tính nhất quán và khả năng tái lập (reproducibility)**: Bạn có thể chạy cùng một bộ thử nghiệm tự động 10 lần trên cùng một mô hình và bạn sẽ nhận được kết quả như nhau (ngoại trừ các biến động do phần cứng hoặc tính ngẫu nhiên vốn có của mô hình). Điều này có nghĩa là bạn có thể dễ dàng tạo ra các bảng xếp hạng công bằng cho các mô hình trên một tác vụ nhất định.
- **Quy mô lớn với chi phí hạn chế**: Đây là một trong những phương pháp rẻ nhất để đánh giá mô hình ở thời điểm hiện tại.
- **Dễ hiểu**: Hầu hết các thước đo tự động đều rất dễ hiểu.
  *Ví dụ: thước đo khớp chính xác (exact match) sẽ cho bạn biết văn bản được sinh ra có khớp hoàn toàn với nhãn chuẩn hay không, và điểm độ chính xác (accuracy) sẽ cho biết trong bao nhiêu trường hợp lựa chọn được chọn là chính xác (các thước đo như `BLEU` hoặc `ROUGE` sẽ khó diễn giải hơn một chút).*
- **Chất lượng bộ dữ liệu**: Nhiều bộ thử nghiệm tự động sử dụng các bộ dữ liệu do chuyên gia xây dựng hoặc dữ liệu chất lượng cao có sẵn (như MMLU hoặc MATH). Tuy nhiên, điều này không có nghĩa là các bộ dữ liệu này hoàn hảo: đối với MMLU, một số lỗi đã được phát hiện trong các mẫu sau đó, từ lỗi phân tích cú pháp (parsing) cho đến các câu hỏi vô lý, dẫn đến sự ra đời của các bộ dữ liệu cải tiến tiếp theo như MMLU-Pro và MMLU-Redux.

Tuy nhiên, chúng cũng có những hạn chế sau:
- **Hạn chế sử dụng trên các tác vụ phức tạp**: Các bộ thử nghiệm tự động hoạt động tốt cho các tác vụ dễ xác định và đánh giá hiệu suất (ví dụ: phân loại). Ngược lại, các năng lực phức tạp hơn sẽ khó phân tách thành các tác vụ rõ ràng và chính xác hơn.
  *Ví dụ: thế nào là "giỏi toán"? Là giỏi số học? Giỏi logic? Hay có khả năng lập luận trên các khái niệm toán học mới?*
  Điều này dẫn đến việc sử dụng các bài đánh giá **khái quát** (generalist) hơn, không còn chia nhỏ các năng lực thành các tác vụ con nữa, mà giả định rằng hiệu suất chung sẽ là một **đại diện tốt** (good proxy) cho những gì chúng ta muốn đo lường.
- **Nhiễm bẩn dữ liệu (data contamination)**: Một khi bộ dữ liệu được công bố công khai dưới dạng văn bản thuần túy, nó sẽ sớm xuất hiện trong tập dữ liệu huấn luyện của mô hình. Điều này có nghĩa là bạn không có gì đảm bảo rằng mô hình chưa từng đọc qua dữ liệu đánh giá trước đó khi bạn tính điểm cho nó.
