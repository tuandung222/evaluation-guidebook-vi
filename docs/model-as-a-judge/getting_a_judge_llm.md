---
sidebar_position: 2
sidebar_label: 'Lựa chọn LLM Giám khảo'
---

# Lựa chọn LLM Giám khảo

Khi sử dụng LLM sẵn có, bạn có thể lựa chọn [mô hình đa năng, khả năng cao](https://arxiv.org/abs/2306.05685v4), [mô hình chuyên biệt quy mô nhỏ](https://arxiv.org/abs/2405.01535) được huấn luyện riêng để phân biệt dựa trên preference data, hoặc tự huấn luyện mô hình của riêng mình.

## Sử dụng LLM đa năng

Với sự ra đời của các LLM mạnh hơn (như ChatGPT), một số nhà nghiên cứu bắt đầu khám phá việc dùng mô hình lớn làm giám khảo. Các mô hình giám khảo quy mô lớn tốt nhất hiện nay có xu hướng là nguồn đóng (như Claude hoặc gpt-o), tuy khoảng cách với mã nguồn mở đang được thu hẹp rất nhanh nhờ các mô hình chất lượng cao như [Qwen 2.5](https://huggingface.co/collections/Qwen/qwen25-66e81a666513e518adb90d9e), [Command R+](https://huggingface.co/CohereForAI/c4ai-command-r-plus-08-2024) hoặc [Llama 3.1-405-Instruct](https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct).

Các mô hình nguồn đóng, dù hiệu suất cao, lại có nhiều nhược điểm:
- Hoạt động qua API, nghĩa là mô hình (và kết quả) có thể thay đổi mà không thông báo trước — ảnh hưởng đến khả năng tái lập của các đánh giá.
- Là hộp đen, khiến ta không thể giải thích được cách chúng đưa ra quyết định.
- Có nguy cơ rò rỉ dữ liệu, vì bạn gửi dữ liệu đến bên thứ ba qua internet (kém an toàn hơn so với quản lý nội bộ), và không chắc chắn dữ liệu được xử lý như thế nào (thường cần opt-out để dữ liệu không bị dùng cho tập huấn luyện).

Tuy nhiên, chúng cho phép bất kỳ ai cũng tiếp cận mô hình chất lượng cao mà không cần hạ tầng hoặc phần cứng riêng. Các ưu điểm này hiện cũng có trên hầu hết mô hình mở chất lượng cao qua các model provider — giải quyết được 2 vấn đề đầu tiên nêu trên.

Bạn có thể tìm bảng phân tích chi phí các model provider tại [đây](https://huggingface.co/spaces/ArtificialAnalysis/LLM-Performance-Leaderboard) nếu cần hỗ trợ lựa chọn.

## Sử dụng LLM giám khảo chuyên biệt quy mô nhỏ

Bạn cũng có thể chọn các mô hình giám khảo chuyên biệt rất nhỏ (tiny). Thường chỉ vài tỷ tham số, chúng có thể chạy cục bộ trên phần cứng tiêu dùng phổ biến, được huấn luyện từ đầu hoặc fine-tuned bằng instruction data. Bạn thường cần tuân theo các định dạng prompt cụ thể của chúng.

Một số mô hình hiện có:
- Flow-Judge-v0.1 ([weights](https://huggingface.co/collections/flowaicom/flow-judge-v01-66e6af5fc3b3a128bde07dec)), 3.8B tham số, là mô hình Phi-3.5-mini-instruct được fine-tuned trên synthetic preference dataset.
- Prometheus ([weights](https://huggingface.co/prometheus-eval/prometheus-13b-v1.0), [paper](https://arxiv.org/abs/2310.08491)), 13B tham số, huấn luyện từ đầu trên synthetic preference dataset. Còn có phiên bản [v2](https://huggingface.co/prometheus-eval/prometheus-7b-v2.0) với 7B tham số, là mô hình Mistral-7B-Instruct-v0.2 được fine-tuned trên dataset lớn hơn, kết hợp với weight merging.
- JudgeLM ([paper](https://arxiv.org/abs/2310.17631)), 7B đến 33B tham số, các mô hình huấn luyện từ đầu trên synthetic preference dataset từ nhiều mô hình khác nhau.

## Tự huấn luyện mô hình

Bạn cũng có thể tự huấn luyện hoặc fine-tune LLM-as-a-judge riêng.

Trước tiên, bạn cần thu thập preference data cho tác vụ quan tâm, từ:
- Các [human preference dataset](https://www.kaggle.com/competitions/lmsys-chatbot-arena) sẵn có.
- Preference data do mô hình tạo ra (có thể tạo theo phần dữ liệu của các nghiên cứu về tiny judge model ở trên, hoặc lấy trực tiếp từ bộ sưu tập [preference](https://huggingface.co/datasets/prometheus-eval/Preference-Collection) và [feedback](https://huggingface.co/datasets/prometheus-eval/Feedback-Collection) của Prometheus).

Sau đó, quyết định xem sẽ bắt đầu từ mô hình nhỏ để huấn luyện từ đầu, hay từ mô hình sẵn có để:
- Distill thành mô hình mới nhỏ hơn.
- Quantize.
- Sau đó fine-tune (dùng peft hoặc adapter weights nếu mô hình lớn và tài nguyên hạn chế) bằng dữ liệu trên.
  - Đáng chú ý, [bắt đầu từ reward model sẽ hoạt động tốt hơn bắt đầu từ instruct model](https://x.com/dk21/status/1826292289930674590).
