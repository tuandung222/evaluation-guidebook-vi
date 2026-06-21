---
sidebar_position: 3
sidebar_label: 'Mẹo & Thủ thuật'
---

# Mẹo và thủ thuật

Dưới đây là một số mẹo thực tế khi sử dụng người chấm điểm con người để xây dựng dataset đánh giá. Nếu bạn chưa thực hiện việc này, hãy đọc trang "Sử dụng người chấm điểm con người" trước rồi mới quay lại.

## Thiết kế nhiệm vụ

- **Đơn giản là tốt nhất**: Tác vụ gán nhãn có thể trở nên phức tạp không cần thiết — hãy giữ nó càng đơn giản càng tốt. Giảm thiểu cognitive load cho người chấm điểm sẽ giúp họ duy trì sự tập trung và gán nhãn với chất lượng cao hơn.

- **Kiểm tra những gì bạn hiển thị**: Chỉ hiển thị thông tin thực sự cần thiết để hoàn thành nhiệm vụ, và đảm bảo không đưa vào thông tin nào có thể tạo thêm bias không đáng có.

- **Cân nhắc thời gian của người chấm điểm**: Vị trí và cách hiển thị thông tin có thể tạo thêm công việc hoặc cognitive load, ảnh hưởng đến chất lượng kết quả. Ví dụ, hãy đảm bảo văn bản và nhiệm vụ hiển thị cùng nhau trên màn hình để tránh cuộn chuột không cần thiết. Nếu kết hợp các nhiệm vụ mà đầu ra của nhiệm vụ này là đầu vào của nhiệm vụ kia, hãy hiển thị chúng tuần tự. Hãy suy nghĩ về cách mọi thứ được trình bày trong công cụ gán nhãn và tìm cách đơn giản hóa hơn nữa nếu có thể.

- **Kiểm thử thiết lập**: Sau khi đã thiết kế nhiệm vụ và có hướng dẫn cơ bản, hãy tự chạy thử trên một vài mẫu trước khi cho cả đội tham gia, và lặp lại để tinh chỉnh nếu cần.

## Trong quá trình gán nhãn

- **Người chấm điểm nên làm việc độc lập**: Tốt nhất là người chấm điểm không hỗ trợ nhau hoặc xem bài làm của nhau — họ có thể lan truyền bias cá nhân và gây annotation drift. Sự thống nhất phải được định hướng qua hướng dẫn toàn diện. Bạn có thể muốn đào tạo thành viên mới trên dataset riêng biệt và/hoặc dùng inter-annotator agreement để đảm bảo cả đội đã đồng bộ.

- **Nhất quán là chìa khóa**: Nếu bạn thực hiện thay đổi quan trọng trong hướng dẫn (ví dụ: thay đổi định nghĩa hoặc chỉ dẫn, thêm/bớt nhãn), hãy xem xét có cần duyệt lại và cập nhật dữ liệu đã gán nhãn trước đó không. Ít nhất, hãy theo dõi các thay đổi qua metadata như `guidelines-v1`.

## Gán nhãn kết hợp người - máy (hybrid)

Đôi khi đội ngũ phải đối mặt với hạn chế về thời gian và nguồn lực nhưng không muốn hy sinh ưu điểm của đánh giá bằng con người. Trong những trường hợp này, bạn có thể dùng mô hình để hỗ trợ và tăng hiệu quả.

- **Gán nhãn có sự hỗ trợ của mô hình**: Dùng dự đoán hoặc nội dung do mô hình tạo ra như một bước pre-annotation, giúp người gán nhãn không cần bắt đầu từ con số không. Tuy nhiên, hãy lưu ý rằng cách này có thể đưa bias của mô hình vào nhãn do con người gán, và nếu độ chính xác của mô hình kém, nó có thể làm tăng khối lượng công việc cho người chấm điểm.

- **Giám sát model-as-a-judge**: Bạn có thể kết hợp phương pháp luận model-as-a-judge (xem phần "Model-as-a-judge") với giám sát viên là con người để xác nhận hoặc loại bỏ kết quả. Lưu ý rằng các bias đã thảo luận trong phần "Ưu và nhược điểm của đánh giá bằng con người" cũng áp dụng ở đây.

- **Xác định edge case**: Để tăng tốc hơn nữa, hãy dùng một jury of models và để giám sát viên con người can thiệp khi các mô hình bất đồng hoặc cần phân định khi hòa. Một lần nữa, hãy lưu ý các bias đã được thảo luận trước đó.

## Hướng dẫn từng bước hoàn chỉnh

Để tự xây dựng thiết lập đánh giá tùy chỉnh theo các mẹo này, bạn có thể theo [hướng dẫn thực tế này](https://github.com/argilla-io/argilla-cookbook/tree/main/domain-eval) từ Argilla. Hướng dẫn sẽ dắt bạn qua các bước xây dựng một tác vụ đánh giá tùy chỉnh cho lĩnh vực của bạn, sử dụng synthetic data và gán nhãn thủ công với [Argilla](https://github.com/argilla-io/argilla/) và [distilabel](https://github.com/argilla-io/distilabel). Hướng dẫn bắt đầu từ tài liệu chuyên ngành và kết quả là một tác vụ đánh giá tùy chỉnh có thể dùng để đánh giá mô hình với [lighteval](https://github.com/huggingface/lighteval).
