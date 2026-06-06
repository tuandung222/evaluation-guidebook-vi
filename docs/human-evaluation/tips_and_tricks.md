---
sidebar_position: 3
sidebar_label: 'Mẹo & Thủ thuật'
---

# Mẹo và thủ thuật

Dưới đây là một số mẹo thực tế mà bạn nên cân nhắc khi sử dụng người chấm điểm con người (human annotator) để xây dựng một dataset đánh giá (evaluation). Nếu bạn chưa thực hiện việc này, chúng tôi khuyên bạn nên đọc trang "Sử dụng người chấm điểm con người" trước rồi mới quay lại trang này.

## Thiết kế nhiệm vụ

- **Đơn giản là tốt nhất (Simple is better)**: Các nhiệm vụ gán nhãn có thể trở nên phức tạp không cần thiết, vì vậy hãy giữ cho nó càng đơn giản càng tốt. Việc giảm thiểu tối đa tải lượng nhận thức (cognitive load) của người chấm điểm sẽ giúp bạn đảm bảo họ luôn tập trung và thực hiện gán nhãn với chất lượng cao hơn.

- **Kiểm tra những gì bạn hiển thị**: Chỉ hiển thị những thông tin thực sự cần thiết để người chấm điểm hoàn thành nhiệm vụ và đảm bảo bạn không đưa vào bất kỳ thông tin nào có thể tạo thêm thiên kiến (bias) không đáng có.

- **Cân nhắc thời gian của người chấm điểm**: Vị trí và cách hiển thị thông tin có thể làm phát sinh thêm công việc hoặc tải lượng nhận thức, từ đó ảnh hưởng tiêu cực đến chất lượng kết quả. Ví dụ, hãy đảm bảo rằng văn bản và nhiệm vụ hiển thị cùng nhau trên màn hình để tránh việc cuộn chuột không cần thiết. Nếu bạn kết hợp các nhiệm vụ mà kết quả của nhiệm vụ này là thông tin đầu vào cho nhiệm vụ kia, bạn có thể hiển thị chúng theo trình tự tuần tự. Hãy suy nghĩ về cách mọi thứ được hiển thị trong công cụ gán nhãn của bạn và tìm cách đơn giản hóa hơn nữa nếu có thể.

- **Kiểm thử thiết lập**: Sau khi đã thiết kế xong nhiệm vụ và có sẵn các tài liệu hướng dẫn cơ bản, hãy tự mình kiểm thử trên một vài mẫu thử trước khi cho toàn bộ đội ngũ tham gia, và lặp lại quy trình (iterate) để tinh chỉnh nếu cần. 

## Trong quá trình gán nhãn

- **Người chấm điểm nên làm việc độc lập**: Tốt nhất là người chấm điểm không nên hỗ trợ nhau hoặc xem bài làm của nhau trong quá trình thực hiện nhiệm vụ, vì họ có thể lan truyền thiên kiến cá nhân và gây ra hiện tượng lệch gán nhãn (annotation drift). Sự thống nhất phải luôn luôn được định hướng thông qua các tài liệu hướng dẫn toàn diện. Bạn có thể muốn đào tạo các thành viên mới trước trên một dataset riêng biệt và/hoặc sử dụng các thước đo độ đồng thuận giữa các người chấm điểm (inter-annotator agreement) để đảm bảo toàn đội ngũ đã đồng bộ với nhau.

- **Sự nhất quán là chìa khóa**: Nếu bạn thực hiện những thay đổi quan trọng trong tài liệu hướng dẫn của mình (ví dụ: thay đổi định nghĩa hoặc chỉ dẫn, hoặc thêm/bớt các nhãn), hãy cân nhắc xem có cần phải duyệt lại và cập nhật dữ liệu đã được gán nhãn trước đó hay không. Ít nhất, bạn nên theo dõi các thay đổi trong dataset của mình thông qua một giá trị siêu dữ liệu (metadata) như `guidelines-v1`.

## Gán nhãn kết hợp người - máy (hybrid human-machine)

Đôi khi các đội ngũ phải đối mặt với những hạn chế về thời gian và tài nguyên nhưng không muốn hy sinh những ưu điểm của đánh giá bằng con người. Trong những trường hợp này, bạn có thể sử dụng sự trợ giúp của các mô hình để giúp nhiệm vụ đạt hiệu quả cao hơn.

- **Gán nhãn với sự hỗ trợ của mô hình (Model-aided annotation)**: Bạn có thể sử dụng kết quả dự đoán hoặc nội dung được tạo ra bởi mô hình như một bước gán nhãn sơ bộ (pre-annotation), giúp đội ngũ gán nhãn không cần phải bắt đầu từ con số không. Tuy nhiên, hãy lưu ý rằng điều này có thể đưa thiên kiến của mô hình vào các nhãn do con người gán, và nếu độ chính xác của mô hình kém, nó có thể làm tăng thêm khối lượng công việc cho người chấm điểm.

- **Giám sát mô hình đóng vai trò giám khảo (model-as-a-judge)**: Bạn có thể kết hợp sức mạnh của phương pháp luận mô hình đóng vai trò giám khảo (model-as-a-judge) (xem phần "Model-as-a-judge") với những người giám sát là con người để xác nhận hoặc loại bỏ các kết quả. Hãy lưu ý rằng các thiên kiến được thảo luận trong phần "Ưu và nhược điểm của đánh giá bằng con người" cũng sẽ áp dụng ở đây.

- **Xác định các trường hợp biên (edge case)**: Để thực hiện nhiệm vụ nhanh hơn nữa, hãy sử dụng một ban giám khảo gồm các mô hình (jury of models) và sau đó để các giám sát viên là con người can thiệp vào những chỗ mà các mô hình bất đồng ý kiến hoặc cần phân định thắng thua khi kết quả hòa. Một lần nữa, hãy lưu ý đến các thiên kiến được thảo luận trong phần "Ưu và nhược điểm của đánh giá bằng con người".

## Hướng dẫn từng bước hoàn chỉnh (End-to-end tutorial)

Để tự xây dựng thiết lập đánh giá tùy chỉnh của riêng mình theo các mẹo này, bạn có thể làm theo [hướng dẫn thực tế này](https://github.com/argilla-io/argilla-cookbook/tree/main/domain-eval) từ Argilla. Hướng dẫn này sẽ dắt bạn qua các bước xây dựng một nhiệm vụ đánh giá tùy chỉnh cho lĩnh vực của bạn, sử dụng dữ liệu tổng hợp (synthetic data) và đánh giá thủ công với [Argilla](https://github.com/argilla-io/argilla/) và [distilabel](https://github.com/argilla-io/distilabel). Hướng dẫn bắt đầu từ các tài liệu chuyên ngành và kết quả là một nhiệm vụ đánh giá tùy chỉnh mà bạn có thể sử dụng để đánh giá mô hình của mình với [lighteval](https://github.com/huggingface/lighteval).
