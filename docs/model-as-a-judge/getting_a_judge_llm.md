---
sidebar_position: 2
sidebar_label: 'Lựa chọn LLM Giám khảo'
---

# Lựa chọn LLM Giám khảo

Khi sử dụng một LLM sẵn có, bạn có thể lựa chọn các [mô hình đa năng, có khả năng cao](https://arxiv.org/abs/2306.05685v4), sử dụng các [mô hình chuyên biệt quy mô nhỏ](https://arxiv.org/abs/2405.01535) được huấn luyện riêng để phân biệt dựa trên dữ liệu sở thích (preference data), hoặc tự huấn luyện mô hình của riêng mình.

## Sử dụng một LLM đa năng

Với sự ra đời của các LLM có khả năng mạnh mẽ hơn (chẳng hạn như ChatGPT), một số nhà nghiên cứu bắt đầu khám phá việc sử dụng các mô hình lớn làm giám khảo. Những mô hình giám khảo quy mô lớn tốt nhất hiện nay có xu hướng là các mô hình nguồn đóng (như Claude hoặc các mô hình gpt-o), mặc dù khoảng cách với nguồn mở đang được thu hẹp rất nhanh nhờ các mô hình chất lượng cao như [Qwen 2.5](https://huggingface.co/collections/Qwen/qwen25-66e81a666513e518adb90d9e), [Command R+](https://huggingface.co/CohereForAI/c4ai-command-r-plus-08-2024) hoặc [Llama 3.1-405-Instruct](https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct). 

Các mô hình nguồn đóng, bất chấp hiệu suất cao của chúng, lại mang nhiều nhược điểm như:
- Hoạt động qua API, nghĩa là mô hình (và do đó là kết quả) có thể thay đổi mà không cần thông báo trước, gây ảnh hưởng đến khả năng tái lập (reproducibility) của các đánh giá (evals).
- Là hộp đen (black box), khiến chúng ta không thể giải thích (un-interpretable) được cách chúng đưa ra quyết định.
- Có khả năng gây rò rỉ dữ liệu (data leakage)/thiếu bảo mật dữ liệu, vì bạn gửi dữ liệu của mình đến một bên thứ ba thông qua internet (điều này thường kém an toàn hơn so với việc quản lý dữ liệu nội bộ), và bạn không biết chắc chắn dữ liệu đó sẽ được xử lý như thế nào (bạn thường phải yêu cầu từ chối (opt out) để dữ liệu không bị sử dụng cho các tập dữ liệu huấn luyện).

Tuy nhiên, chúng cũng cho phép bất kỳ ai cũng có thể tiếp cận một mô hình chất lượng cao mà không cần phải thiết lập hệ thống tại chỗ hoặc yêu cầu quyền truy cập phần cứng. Những ưu điểm này hiện nay cũng có mặt trên hầu hết các mô hình mở chất lượng cao thông qua các nhà cung cấp mô hình (model provider), giải quyết được 2 vấn đề đầu tiên nêu trên.

Bạn có thể tìm thấy một bảng phân tích chi phí tốt của các nhà cung cấp mô hình tại [đây](https://huggingface.co/spaces/ArtificialAnalysis/LLM-Performance-Leaderboard) nếu bạn cần hỗ trợ để lựa chọn.

## Sử dụng mô hình LLM giám khảo chuyên biệt quy mô nhỏ (tiny)

Bạn cũng có thể lựa chọn sử dụng các mô hình LLM giám khảo chuyên biệt quy mô cực nhỏ (tiny). Thường chỉ với một vài tỷ tham số, chúng có thể chạy cục bộ trên hầu hết các phần cứng tiêu dùng phổ biến hiện nay, trong khi được huấn luyện từ đầu hoặc được tinh chỉnh (fine-tuned) bằng dữ liệu chỉ dẫn (instruction data). Bạn thường cần phải tuân theo các định dạng prompt cụ thể của chúng.

Một số mô hình hiện có:
- Flow-Judge-v0.1 ([weights](https://huggingface.co/collections/flowaicom/flow-judge-v01-66e6af5fc3b3a128bde07dec)), 3.8B tham số, là một mô hình Phi-3.5-mini-instruct được tinh chỉnh trên một dataset sở thích tổng hợp (synthetic preference dataset).
- Prometheus ([weights](https://huggingface.co/prometheus-eval/prometheus-13b-v1.0), [paper](https://arxiv.org/abs/2310.08491)), 13B tham số, là mô hình được huấn luyện từ đầu trên dataset sở thích tổng hợp. Ngoài ra còn có phiên bản [v2](https://huggingface.co/prometheus-eval/prometheus-7b-v2.0) với 7B tham số, là một mô hình Mistral-7B-Instruct-v0.2 được tinh chỉnh trên một dataset sở thích tổng hợp lớn hơn, kết hợp với kỹ thuật trộn trọng số (weight merging).
- JudgeLM ([paper](https://arxiv.org/abs/2310.17631)), 7B đến 33B tham số, các mô hình được huấn luyện từ đầu trên các dataset sở thích tổng hợp được tạo ra từ nhiều mô hình khác nhau.

## Tự huấn luyện mô hình của riêng bạn

Bạn cũng có thể lựa chọn huấn luyện hoặc tinh chỉnh mô hình LLM làm giám khảo (LLM-as-judge) của riêng mình.

Đầu tiên, bạn cần thu thập dữ liệu sở thích (preference data) cho nhiệm vụ mà bạn quan tâm, nguồn dữ liệu này có thể đến từ:
- Các [dataset sở thích của con người (human preference datasets)](https://www.kaggle.com/competitions/lmsys-chatbot-arena) hiện có.
- Dữ liệu sở thích do mô hình tạo ra (bạn có thể tạo dữ liệu này theo phần dữ liệu của các bài nghiên cứu về mô hình giám khảo quy mô nhỏ ở trên, hoặc lấy trực tiếp, ví dụ như từ các bộ sưu tập [sở thích (preference)](https://huggingface.co/datasets/prometheus-eval/Preference-Collection) và [phản hồi (feedback)](https://huggingface.co/datasets/prometheus-eval/Feedback-Collection) của Prometheus).

Sau đó, bạn cần quyết định xem sẽ bắt đầu từ một mô hình nhỏ để huấn luyện từ đầu, hay từ một mô hình sẵn có để bạn có thể:
- Chưng cất (distill) thành một mô hình mới nhỏ hơn.
- Lượng tử hóa (quantize).
- Sau đó tinh chỉnh (bằng cách sử dụng peft hoặc trọng số adapter nếu mô hình lớn và tài nguyên tính toán huấn luyện của bạn hạn chế) bằng cách sử dụng dữ liệu trên.
  - Được biết, [việc bắt đầu từ một mô hình chấm điểm thưởng (reward model) sẽ hoạt động tốt hơn là bắt đầu từ một mô hình instruct](https://x.com/dk21/status/1826292289930674590).
