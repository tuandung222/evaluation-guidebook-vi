---
sidebar_position: 1
sidebar_label: 'Khắc phục lỗi Suy luận'
---

# Khắc phục lỗi suy luận

## Mô hình của tôi chạy rất chậm!

### Thay đổi kích thước batch (batch size)
Nếu bạn muốn có khả năng tái lập/tái sản xuất (reproducibility) tuyệt đối (với một phần cứng cụ thể và một prompt đánh giá cụ thể), bạn có thể đang sử dụng kích thước batch bằng một. Tuy nhiên, việc tăng kích thước batch lớn hơn có thể sẽ giúp quá trình đánh giá của bạn nhanh hơn (miễn là nó vừa với yêu cầu bộ nhớ của phần cứng của bạn).

### Song song hóa dữ liệu (Data parallelism)
Bạn cũng có thể sao chép mô hình của mình trên nhiều GPU thay vì chỉ tải nó lên một GPU duy nhất, sau đó cung cấp các tập con của dữ liệu cho từng bản sao GPU, rồi tổng hợp kết quả tính toán lại.
Điều này có nghĩa là mỗi luồng dữ liệu sẽ được xử lý song song, cùng lúc với các luồng khác, giúp giảm tổng thời gian thực thi của bạn đi một lượng tương đương với số lượng GPU sử dụng.
Tuy nhiên, nếu có thể, tất cả các GPU nên nằm trên một nút (node) duy nhất để tránh hiện tượng nghẽn cổ chai khi truyền thông tin giữa các nút (inter-node bottlenecks).

### Thay đổi mã nguồn suy luận (inference code)
Không phải tất cả các thư viện suy luận (inference) đều chạy với cùng tốc độ, và một số mã nguồn được tối ưu hóa tốt hơn những mã nguồn khác. Bạn sẽ cần thử nghiệm một chút để tìm ra thư viện nào có tốc độ suy luận nhanh nhất. Nếu bạn đang sử dụng PyTorch, chúng tôi khuyên bạn nên xem danh sách kiểm tra tối ưu hóa suy luận mô hình tại [đây](https://pytorch.org/serve/performance_checklist.html).

### Thay đổi độ chính xác (precision)
Nếu mô hình của bạn chạy rất chậm, bạn có thể giảm kích thước của nó bằng cách giảm độ chính xác của các phép tính. Một mô hình được lưu trữ ở định dạng `float32` thực hiện các phép tính rất chính xác (sử dụng 32 bit cho mỗi số được lưu trữ!) nhưng cũng rất tốn bộ nhớ và tài nguyên tính toán - việc chuyển sang `bfloat16` hoặc `float16` (giảm một nửa độ chính xác) sẽ giúp mô hình nhanh hơn gấp đôi với một lượng mất mát độ chính xác gần như không đáng kể. Nếu bạn muốn tăng tốc độ nhiều hơn nữa, bạn có thể lượng tử hóa (quantize) mô hình xuống sâu hơn, còn 8 hoặc 4 bit (ví dụ: sử dụng `gptq` hoặc `bitsandbytes`), vì các phép tính ma trận n-bit sẽ nhanh hơn và mô hình của bạn sẽ chiếm ít dung lượng bộ nhớ hơn (tuy nhiên, một số thư viện lượng tử hóa có thể hơi chậm, vì vậy hãy thử nghiệm trực tiếp trên các trường hợp sử dụng của bạn!).

## Mô hình của tôi rất lớn!

### Ước lượng yêu cầu bộ nhớ
Bạn có thể ước lượng lượng bộ nhớ lý thuyết tối thiểu cần thiết để tải một mô hình cụ thể (và do đó xác định phần cứng cần dùng) bằng **công thức sau**:

`&lt;Dung lượng bộ nhớ (tính bằng GB)&gt; = &lt;Số lượng tham số (tính bằng tỷ - G)&gt; * &lt;Hệ số độ chính xác&gt;`

Vì bạn có thể lưu trữ 8 bit trong 1 Byte, bộ nhớ cần thiết bằng tổng số lượng tham số nhân với số Byte cần thiết để lưu trữ một tham số. Do đó, hệ số độ chính xác là 4 đối với `float32`, 2 đối với `float16` hoặc `bfloat16`, 1 đối với mô hình `8bit`, và 0.5 đối với mô hình `4bit`, v.v.

Và chỉ có vậy thôi!

Tuy nhiên, chúng tôi khuyên bạn nên sử dụng công thức: `&lt;Dung lượng bộ nhớ (tính bằng GB)&gt; = &lt;Số lượng tham số (tính bằng tỷ - G)&gt; * (&lt;Hệ số độ chính xác&gt; * 110%)` để đảm bảo an toàn hơn, vì quá trình suy luận sẽ yêu cầu nhiều bộ nhớ hơn một chút so với việc chỉ tải mô hình (bạn cũng cần tải các batch dữ liệu vào bộ nhớ nữa).

### Bạn nên làm gì nếu mô hình của bạn không vừa với một GPU?

#### Lượng tử hóa (Quantization)
Điều đầu tiên và rõ ràng nhất cần làm là thay đổi `&lt;Hệ số độ chính xác&gt;` ở trên: việc chuyển từ `float32` sang 4 bit giúp giảm yêu cầu bộ nhớ đi 8 lần!
Tuy nhiên, việc sử dụng độ chính xác quá thấp có thể mang lại kết quả tệ hơn, vì vậy đối với một số mô hình (đặc biệt là các mô hình kích thước trung bình), bạn có thể muốn giữ chúng ở dạng `float16` hoặc `8bit`. (Lượng tử hóa dường như ít ảnh hưởng đến hiệu suất của các mô hình rất lớn hơn, có thể là do sự dư thừa thông tin).

#### Song song hóa mô hình (Model parallelism)
Song song hóa mô hình bao gồm một loạt các kỹ thuật chia nhỏ mô hình của bạn thành các phần mô hình nhỏ hơn, sau đó tải và chạy từng phần nhỏ này trên một GPU khác nhau. Cách này yêu cầu ít bộ nhớ hơn vì bạn không bao giờ tải toàn bộ mô hình cùng một lúc, nhưng nó có thể chậm hơn.

Hai loại song song hóa mô hình chính là:
- **Song song hóa đường ống (Pipeline parallelism)**, trong đó mô hình được chia ở cấp độ toàn bộ lớp (layer), và các lớp này được phân phối trên các GPU khác nhau. Vì đầu ra của lớp 1 là đầu vào của lớp 2, điều này dẫn đến việc thực thi chậm hơn, vì các GPU sẽ phải nhàn rỗi trong khi chờ đợi, tạo ra một khoảng trống gọi là "bong bóng" (bubble) (và dữ liệu phải được chuyển từ GPU này sang GPU tiếp theo). Bong bóng này có thể được giảm thiểu bằng cách chia nhỏ các đầu vào thành các batch nhỏ hơn. Tính năng này đang được tích hợp trực tiếp vào PyTorch thông qua thư viện `PiPPy` [ở đây](https://github.com/pytorch/PiPPy), và đây cũng là thứ mà thư viện `accelerate` sử dụng bên dưới để song song hóa.
- **Song song hóa tensor (Tensor parallelism)**, trong đó mô hình được chia ở cấp độ tính toán ma trận. Điều này có nghĩa là các ma trận sẽ được chia theo hàng hoặc cột, và kết quả tổng thể sẽ được gộp lại. Cách này cực kỳ hiệu quả miễn là tất cả các GPU nằm trên cùng một nút (để tránh hiện tượng nghẽn mạng giữa các nút), nhưng có thể khó lập trình. Bạn sẽ tìm thấy các triển khai rất hay của phương pháp này trong thư viện `vllm`. Nó mang lại **hiệu quả tăng tốc cực kỳ ấn tượng**.

Tài liệu tốt nhất về các loại song song hóa khác nhau (bao gồm cả song song hóa dữ liệu để tăng tốc độ) có thể được tìm thấy tại [đây](https://huggingface.co/docs/transformers/v4.15.0/en/parallelism).

#### Đẩy tải sang CPU (CPU offloading)
CPU offloading di chuyển một số phép tính và các phần của mô hình sang CPU nhằm giảm dung lượng bộ nhớ GPU sử dụng. Cách này **chậm hơn đáng kể** so với bất kỳ phương pháp nào khác ở đây, chủ yếu là vì bạn cần liên tục di chuyển dữ liệu qua lại giữa hai thiết bị.

Một ví dụ tiêu biểu cho phương pháp này là [ZeRO-Offload](https://arxiv.org/abs/2101.06840) của DeepSpeed, giúp phân phối các tham số giữa CPU và GPU (bên cạnh việc sử dụng các tối ưu hóa khác được mô tả trong bài báo ZeRO-2). Gradient, các trạng thái của optimizer và các tính toán tham số mô hình fp32 trong quá trình tối ưu hóa được chuyển sang CPU, trong khi các tham số fp16 và các lượt truyền xuôi/ngược (forward/backward pass) sẽ nằm trên GPU để tận dụng bộ nhớ CPU cũng như sức mạnh tính toán của GPU, đồng thời giảm thiểu giao tiếp giữa hai thiết bị này.

### Mô hình của tôi vừa với GPU nhưng tôi vẫn gặp lỗi tràn bộ nhớ (OOM)!
Rất có thể bạn đang gặp vấn đề với chiều dài ngữ cảnh (context size).

Chúng tôi khuyên bạn nên:
1. Kiểm tra xem mô hình của bạn có thực sự vừa với GPU hay không bằng cách tải một số dữ liệu suy luận giả lập (dummy inference data). Dữ liệu suy luận giả lập này nên có chiều dài ngữ cảnh đủ lớn (mang tính đại diện cho tác vụ của bạn).
2. Giảm kích thước batch (batch size), hoặc tắt tính năng tự động tìm kiếm kích thước batch (auto-batch size search) vì tính năng này có thể dẫn đến lỗi tràn bộ nhớ (OOM - Out Of Memory) ngoài ý muốn nếu bạn đang bật nó.
3. Tổng quát hơn, hãy đảm bảo rằng các mẫu thử nghiệm được đưa vào mô hình theo thứ tự chiều dài ngữ cảnh giảm dần. Điều này đảm bảo mô hình của bạn sẽ thất bại ngay lập tức nếu chiều dài ngữ cảnh quá lớn, thay vì bị lỗi sau khi đã chạy được X giờ.
