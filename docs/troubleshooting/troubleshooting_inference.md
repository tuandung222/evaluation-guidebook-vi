---
sidebar_position: 1
sidebar_label: 'Khắc phục lỗi Suy luận'
---

# Khắc phục lỗi suy luận

## Mô hình của tôi chạy rất chậm!

### Thay đổi batch size
Nếu bạn đang dùng batch size bằng 1 để đảm bảo reproducibility hoàn toàn, hãy thử tăng lên — miễn là phần cứng của bạn còn đủ bộ nhớ. Điều này thường giúp đánh giá nhanh hơn đáng kể.

### Data parallelism
Thay vì chỉ tải mô hình lên một GPU duy nhất, bạn có thể nhân bản nó trên nhiều GPU, cung cấp các tập con dữ liệu cho từng bản sao, rồi tổng hợp kết quả lại.
Mỗi luồng dữ liệu được xử lý song song với các luồng khác, giúp giảm tổng thời gian thực thi tương ứng với số GPU sử dụng.
Nếu có thể, tất cả GPU nên nằm trên cùng một node để tránh inter-node bottleneck.

### Thay đổi thư viện inference
Không phải thư viện inference nào cũng chạy với cùng tốc độ — một số được tối ưu tốt hơn những cái khác. Bạn sẽ cần thử nghiệm để tìm ra cái phù hợp nhất. Nếu đang dùng PyTorch, hãy xem danh sách kiểm tra tối ưu hóa [tại đây](https://pytorch.org/serve/performance_checklist.html).

### Thay đổi precision
Mô hình lưu ở `float32` tính toán rất chính xác (32 bit mỗi số) nhưng cũng rất tốn bộ nhớ và tài nguyên. Chuyển sang `bfloat16` hoặc `float16` (giảm một nửa precision) thường giúp mô hình nhanh hơn gấp đôi với mất mát độ chính xác gần như không đáng kể. Nếu muốn tiết kiệm hơn nữa, bạn có thể quantize mô hình xuống 8 hoặc 4 bit (ví dụ: dùng `gptq` hoặc `bitsandbytes`) — tuy nhiên, một số thư viện quantization có thể chậm hơn, vì vậy hãy thử nghiệm trực tiếp trên use case của bạn.

## Mô hình của tôi rất lớn!

### Ước lượng yêu cầu bộ nhớ
Bạn có thể ước lượng lượng bộ nhớ tối thiểu cần thiết để tải một mô hình bằng **công thức sau**:

`<Dung lượng bộ nhớ (GB)> = <Số tham số (tỷ)> * <Hệ số precision>`

Vì 8 bit = 1 Byte, hệ số precision là 4 với `float32`, 2 với `float16`/`bfloat16`, 1 với `8bit`, và 0.5 với `4bit`.

Chỉ vậy thôi!

Tuy nhiên, để an toàn hơn, chúng tôi khuyên dùng công thức: `<Dung lượng bộ nhớ (GB)> = <Số tham số (tỷ)> * (<Hệ số precision> * 110%)`, vì quá trình inference cần thêm bộ nhớ cho việc tải batch dữ liệu.

### Mô hình không vừa với một GPU?

#### Quantization
Bước đầu tiên và rõ ràng nhất là thay đổi `<Hệ số precision>` ở trên: chuyển từ `float32` sang 4 bit giúp giảm yêu cầu bộ nhớ đi 8 lần!
Tuy nhiên, precision quá thấp có thể làm giảm hiệu suất. Với các mô hình kích thước trung bình, bạn có thể muốn giữ ở `float16` hoặc `8bit`. (Quantization thường ít ảnh hưởng đến các mô hình rất lớn hơn — có thể do sự dư thừa thông tin.)

#### Model parallelism
Model parallelism là tập hợp các kỹ thuật chia nhỏ mô hình thành các phần, rồi tải và chạy từng phần trên một GPU khác nhau. Cách này yêu cầu ít bộ nhớ hơn vì không bao giờ tải toàn bộ mô hình cùng lúc, nhưng có thể chậm hơn.

Hai loại chính:
- **Pipeline parallelism**: mô hình được chia theo từng layer và phân phối trên các GPU. Vì output của layer 1 là input của layer 2, việc thực thi có thể chậm hơn khi GPU phải chờ nhau, tạo ra "bubble". Bubble này có thể giảm thiểu bằng cách chia input thành các micro-batch nhỏ hơn. Tính năng này đang được tích hợp vào PyTorch qua thư viện `PiPPy` [ở đây](https://github.com/pytorch/PiPPy), và cũng là cơ chế `accelerate` dùng bên dưới.
- **Tensor parallelism**: mô hình được chia ở cấp độ phép nhân ma trận — các ma trận được cắt theo hàng hoặc cột, kết quả được gộp lại sau. Cách này cực kỳ hiệu quả khi tất cả GPU cùng nằm trên một node (để tránh inter-node bottleneck), nhưng khó triển khai hơn. Bạn sẽ tìm thấy các triển khai rất tốt trong thư viện `vllm`, với **hiệu quả tăng tốc ấn tượng**.

Tài liệu tốt nhất về các loại parallelism (bao gồm data parallelism) có thể xem [tại đây](https://huggingface.co/docs/transformers/v4.15.0/en/parallelism).

#### CPU offloading
CPU offloading chuyển một phần phép tính và tham số mô hình sang CPU để giảm bộ nhớ GPU. Cách này **chậm hơn đáng kể** so với các phương pháp khác, chủ yếu vì cần liên tục di chuyển dữ liệu qua lại giữa hai thiết bị.

Ví dụ điển hình là [ZeRO-Offload](https://arxiv.org/abs/2101.06840) của DeepSpeed: gradient, trạng thái optimizer và tính toán tham số fp32 được chuyển sang CPU, trong khi tham số fp16 và các forward/backward pass vẫn chạy trên GPU — tận dụng bộ nhớ CPU đồng thời giảm thiểu giao tiếp giữa hai thiết bị.

### Mô hình vừa với GPU nhưng vẫn bị OOM!
Rất có thể bạn đang gặp vấn đề với context length.

Chúng tôi khuyên bạn:
1. Kiểm tra xem mô hình có thực sự vừa GPU không bằng cách chạy thử với dummy inference data có context length đại diện cho tác vụ của bạn.
2. Giảm batch size, hoặc tắt auto-batch-size search vì tính năng này có thể gây OOM ngoài ý muốn.
3. Đảm bảo các mẫu kiểm thử được đưa vào mô hình theo thứ tự context length giảm dần — để mô hình thất bại ngay lập tức nếu context quá dài, thay vì bị lỗi sau khi đã chạy được nhiều giờ.
