---
sidebar_position: 1
sidebar_label: 'Giới thiệu'
---

# Cẩm nang Đánh giá LLM ⚖️

> [!WARNING]
> ⚠️ **Cảnh báo**
> CẨM NANG NÀY KHÔNG CÒN ĐƯỢC CẬP NHẬT TRÊN REPO GỐC. PHIÊN BẢN MỚI NHẤT VÀ CẬP NHẬT NHẤT (tính đến tháng 12 năm 2025) HIỆN CÓ TẠI: https://huggingface.co/spaces/OpenEvals/evaluation-guidebook

---

Nếu bạn từng thắc mắc làm thế nào để đảm bảo một LLM hoạt động tốt trên tác vụ cụ thể của mình, hướng dẫn này dành cho bạn!
Cẩm nang này bao gồm các phương pháp đánh giá (evaluation) mô hình khác nhau, hướng dẫn thiết kế các bài đánh giá của riêng bạn, cùng các mẹo và thủ thuật rút ra từ kinh nghiệm thực tế.

Dù bạn đang làm việc với các mô hình thực tế sản xuất (production), là một nhà nghiên cứu hay một người đam mê công nghệ, hy vọng bạn sẽ tìm thấy những gì mình cần ở đây; nếu không, hãy mở một issue (để đề xuất cải tiến hoặc bổ sung tài liệu còn thiếu) và tôi sẽ hoàn thiện hướng dẫn này!

## Hướng dẫn đọc cẩm nang này

- **Người mới bắt đầu (Beginner)**:
  Nếu bạn chưa biết gì về đánh giá mô hình, bạn nên bắt đầu bằng phần `Cơ bản` (Basics) trong mỗi chương trước khi đi sâu hơn.
  Bạn cũng sẽ tìm thấy các bài giải thích hỗ trợ về các chủ đề LLM quan trọng trong chương `Kiến thức chung` (General knowledge): ví dụ: cách hoạt động của suy luận (inference) mô hình và tokenization là gì.
- **Người dùng nâng cao (Advanced)**:
  Các phần thực tế hơn là `Mẹo và Thủ thuật` (Tips and Tricks) và chương `Khắc phục sự cố` (Troubleshooting). Bạn cũng sẽ tìm thấy nhiều nội dung thú vị trong các phần `Thiết kế` (Designing).
- **Người dùng quay lại trang web**:
  Mỗi năm tôi đều thực hiện một bài phân tích chuyên sâu về một chủ đề, hãy đón xem nhé!

Trong văn bản, các liên kết có tiền tố ⭐ là những liên kết tôi thực sự yêu thích và khuyên bạn nên đọc.

## Mục lục

Nếu bạn muốn có một bài giới thiệu về chủ đề này, bạn có thể đọc bài viết [blog](https://huggingface.co/blog/clefourrier/llm-evaluation) này về cách thức và lý do tại sao chúng tôi thực hiện đánh giá!

### Benchmark tự động (Automatic benchmarks)

- [Cơ bản](./automated-benchmarks/basics.md)
- [Thiết kế đánh giá tự động của bạn](./automated-benchmarks/designing_your_automatic_evaluation.md)
- [Một số bộ dữ liệu đánh giá](./automated-benchmarks/some_evaluation_datasets.md)
- [Mẹo và thủ thuật](./automated-benchmarks/tips_and_tricks.md)

### Đánh giá bằng con người (Human evaluation)

- [Cơ bản](./human-evaluation/basics.md)
- [Sử dụng người chấm điểm con người](./human-evaluation/using_human_annotators.md)
- [Mẹo và thủ thuật](./human-evaluation/tips_and_tricks.md)

### Mô hình đóng vai trò giám khảo (Model-as-a-judge)

- [Cơ bản](./model-as-a-judge/basics.md)
- [Lựa chọn LLM làm giám khảo](./model-as-a-judge/getting_a_judge_llm.md)
- [Thiết kế prompt đánh giá](./model-as-a-judge/designing_your_evaluation_prompt.md)
- [Đánh giá chính mô hình giám khảo](./model-as-a-judge/evaluating_your_evaluator.md)
- [Vai trò của các mô hình chấm điểm thưởng](./model-as-a-judge/what_about_reward_models.md)
- [Mẹo và thủ thuật](./model-as-a-judge/tips-and-tricks.md)

### Khắc phục sự cố (Troubleshooting)

Đây là phần mang tính thực tiễn cao nhất trong cẩm nang này.
- [Khắc phục lỗi suy luận](./troubleshooting/troubleshooting_inference.md)
- [Khắc phục lỗi tái lập kết quả](./troubleshooting/troubleshooting_reproducibility.md)

### Kiến thức chung (General knowledge)

Đây hầu hết là các hướng dẫn cơ bản về LLM dành cho người bắt đầu, nhưng vẫn chứa đựng một số mẹo và tài liệu tham khảo thú vị!
Nếu bạn là người dùng nâng cao, tôi khuyên bạn nên đọc nhanh qua các phần `Đi xa hơn` (Going further).
- [Suy luận và đánh giá mô hình](./general-knowledge/model_inference_and_evaluation.md)
- [Tokenization](./general-knowledge/tokenization.md)

## Điểm tin hằng năm (Yearly dives)

- [2023: Năm của nguồn mở (Open Source)](./yearly-dives/2023_year_of_open_source.md)
- [2024: Mục tiêu thực sự của đánh giá là gì?](./yearly-dives/2024_evals_thoughts_from_iclr.md)
- [2025: Đánh giá để xây dựng các mô hình hữu ích trong "thế giới thực"](./yearly-dives/2025_evaluations_for_useful_models.md)

## Tài liệu tham khảo (Resources)

Các liên kết tôi yêu thích:
- [Về đánh giá mô hình](https://github.com/huggingface/evaluation-guidebook/blob/main/resources/about-evaluation.md)
- [Về xử lý ngôn ngữ tự nhiên (NLP) tổng quát](https://github.com/huggingface/evaluation-guidebook/blob/main/resources/about-NLP.md)
- [The UltraScale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook)

## Các bản dịch cộng đồng

Cẩm nang này đã được cộng đồng dịch thuật một cách tận tình!
- 🇨🇳 https://github.com/huggingface/evaluation-guidebook/tree/main/translations/zh/contents, cảm ơn @SuSung-boy
- 🇫🇷 https://huggingface.co/spaces/CATIE-AQ/Guide_Evaluation_LLM, cảm ơn @lbourdois

## Lời cảm ơn

Cẩm nang này được truyền cảm hứng mạnh mẽ từ cuốn [ML Engineering Guidebook](https://github.com/stas00/ml-engineering) của Stas Bekman! Cảm ơn anh vì tài liệu tuyệt vời này!

Cũng xin gửi lời cảm ơn sâu sắc đến tất cả những người đã truyền cảm hứng cho tôi thực hiện cẩm nang này thông qua các cuộc thảo luận trực tiếp tại sự kiện hoặc trực tuyến, đặc biệt là:
- 🤝 Luca Soldaini, Kyle Lo và Ian Magnusson (Allen AI), Max Bartolo (Cohere), Kai Wu (Meta), Swyx và Alessio Fanelli (Latent Space Podcast), Hailey Schoelkopf (EleutherAI), Martin Signoux (Open AI), Moritz Hardt (Max Planck Institute), Ludwig Schmidt (Anthropic)
- 🔥 Người dùng cộng đồng của Open LLM Leaderboard và lighteval, những người thường xuyên đưa ra các góc nhìn rất thú vị trong các cuộc thảo luận.
- 🤗 Đồng nghiệp tại Hugging Face như Lewis Tunstall, Hynek Kydlíček, Guilherme Penedo và Thom Wolf, và tất nhiên là người bạn đồng hành Nathan Habib, người cùng tôi thực hiện các công việc đánh giá và xây dựng bảng xếp hạng (leaderboard) từ năm 2022.

và tất nhiên cảm ơn tất cả những người đã đóng góp cho dự án :)

## Trích dẫn

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC-BY--NC--SA-4.0-lightgrey.svg

```bibtex
@misc{fourrier2024evaluation,
  author = {Clémentine Fourrier and The Hugging Face Community},
  title = {LLM Evaluation Guidebook},
  year = {2024},
  journal = {GitHub repository},
  url = {https://github.com/huggingface/evaluation-guidebook}
}
```
