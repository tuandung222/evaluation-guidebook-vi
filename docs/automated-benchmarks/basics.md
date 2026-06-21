---
sidebar_position: 1
sidebar_label: 'Cơ bản'
---

# Khái niệm cơ bản

*Ghi chú: Một số nội dung ở đây trùng lặp với [bài viết blog chung của tôi về đánh giá mô hình](https://huggingface.co/blog/clefourrier/llm-evaluation)*

## Benchmark tự động là gì?

Benchmark tự động thường hoạt động như sau: bạn muốn biết mô hình của mình hoạt động tốt đến đâu trên một khía cạnh nào đó. Khía cạnh đó có thể là một **tác vụ** cụ thể như `Mô hình phân loại email spam tốt đến mức nào?`, hoặc một **năng lực** trừu tượng hơn như `Khả năng làm toán của mô hình ra sao?`.

Từ mục tiêu này, bạn thiết lập một quy trình đánh giá, gồm:
- Một **bộ dữ liệu** gồm các **mẫu** (samples).
	- Mỗi mẫu chứa một đầu vào cho mô hình, đôi khi kèm theo một nhãn chuẩn (ground truth) để so sánh với đầu ra.
	- Các mẫu thường được thiết kế để mô phỏng điều bạn muốn kiểm tra: ví dụ, nếu đánh giá phân loại email, bạn sẽ tạo một bộ dữ liệu gồm cả email spam và email thường, cố gắng đưa vào các trường hợp biên (edge case) khó xử lý.
- Một **thước đo** (metric).
	- Thước đo là cách tính điểm cho mô hình của bạn.
	  Ví dụ: mô hình phân loại thư rác đúng được bao nhiêu phần trăm (mẫu đúng = 1, sai = 0).
	- Các thước đo sử dụng đầu ra của mô hình để tính điểm. Với LLM, có hai loại đầu ra chính:
		- Văn bản mô hình sinh ra từ đầu vào (*đánh giá dựa trên generative*)
		- Log-probability của một hoặc nhiều chuỗi được cung cấp cho mô hình (*đánh giá trắc nghiệm* - MCQA, hoặc *đánh giá perplexity*)
		- Để biết thêm, hãy xem trang [Suy luận và đánh giá mô hình](../general-knowledge/model_inference_and_evaluation.md).

Đánh giá này có giá trị hơn khi thực hiện trên dữ liệu mô hình chưa từng thấy (không có trong tập huấn luyện), vì bạn muốn kiểm tra khả năng **khái quát hóa** của nó — ví dụ, liệu nó có thể phân loại email spam về sản phẩm "sức khỏe" sau khi chỉ được huấn luyện trên email spam ngân hàng giả mạo hay không.

> [!NOTE]
> 📝 **Ghi chú**
> Một mô hình chỉ dự đoán tốt trên dữ liệu huấn luyện (mà không học được các mẫu tổng quát) được gọi là bị **overfitting**. Giống như học sinh học thuộc đáp án mà không hiểu bản chất môn học, đánh giá LLM trên dữ liệu đã có trong tập huấn luyện thực chất là đang chấm điểm những năng lực chúng không thực sự có.

## Ưu và nhược điểm của benchmark tự động

Ưu điểm:
- **Nhất quán và có khả năng tái lập**: Chạy cùng một benchmark 10 lần trên cùng một mô hình sẽ cho kết quả như nhau (trừ biến động từ phần cứng hoặc tính ngẫu nhiên của mô hình). Điều này giúp tạo ra các bảng xếp hạng công bằng.
- **Chi phí thấp, quy mô lớn**: Đây là một trong những phương pháp đánh giá mô hình rẻ nhất hiện nay.
- **Dễ hiểu**: Hầu hết các thước đo tự động rất trực quan.
  *Ví dụ: exact match cho biết văn bản sinh ra có khớp hoàn toàn với nhãn chuẩn không, accuracy cho biết tỷ lệ lựa chọn đúng (các thước đo như `BLEU` hay `ROUGE` khó giải thích hơn một chút).*
- **Chất lượng bộ dữ liệu**: Nhiều benchmark dùng bộ dữ liệu do chuyên gia xây dựng hoặc dữ liệu chất lượng cao (như MMLU hoặc MATH). Tuy nhiên, không có nghĩa là chúng hoàn hảo: MMLU từng bị phát hiện có lỗi trong một số mẫu, từ lỗi parsing đến câu hỏi vô lý, dẫn đến các phiên bản cải tiến như MMLU-Pro và MMLU-Redux.

Nhược điểm:
- **Hạn chế với tác vụ phức tạp**: Benchmark tự động hoạt động tốt với các tác vụ dễ định nghĩa và đo lường (như phân loại), nhưng khó áp dụng cho các năng lực phức tạp hơn.
  *Ví dụ: "giỏi toán" nghĩa là gì? Giỏi số học? Giỏi logic? Hay có khả năng lập luận trên các khái niệm toán học mới?*
  Điều này dẫn đến các bài đánh giá **tổng quát** hơn, không phân rã năng lực thành tác vụ con, mà giả định hiệu suất chung là **đại diện tốt** cho điều ta muốn đo lường.
- **Nhiễm bẩn dữ liệu** (data contamination): Khi bộ dữ liệu được công bố công khai dưới dạng văn bản thuần, nó sẽ sớm xuất hiện trong tập huấn luyện của các mô hình. Không có gì đảm bảo mô hình chưa từng "đọc qua" dữ liệu đánh giá trước khi bạn chấm điểm nó.

