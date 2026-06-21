---
sidebar_position: 1
sidebar_label: 'Giới thiệu'
---

# Cẩm nang Đánh giá LLM ⚖️

> [!WARNING]
> ⚠️ **Cảnh báo**
> CẨM NANG NÀY KHÔNG CÒN ĐƯỢC CẬP NHẬT TRÊN REPO GỐC. PHIÊN BẢN MỚI NHẤT VÀ CẬP NHẬT NHẤT (tính đến tháng 12 năm 2025) HIỆN CÓ TẠI: https://huggingface.co/spaces/OpenEvals/evaluation-guidebook

---

Nếu bạn từng thắc mắc làm sao để đảm bảo một LLM hoạt động tốt trên tác vụ cụ thể của mình, hướng dẫn này dành cho bạn!
Cẩm nang này đề cập đến nhiều phương pháp đánh giá mô hình khác nhau, hướng dẫn thiết kế bài đánh giá riêng, cùng các mẹo và thủ thuật rút ra từ kinh nghiệm thực tế.

Dù bạn đang làm việc với các mô hình production, là nhà nghiên cứu hay đơn giản là người đam mê công nghệ, hy vọng bạn sẽ tìm thấy những gì mình cần ở đây. Nếu không, hãy mở một issue để đề xuất cải tiến hoặc bổ sung nội dung còn thiếu — tôi sẽ tiếp tục hoàn thiện cẩm nang này!

## Hướng dẫn đọc cẩm nang này

- **Người mới bắt đầu**:
  Hãy bắt đầu từ phần `Cơ bản` trong mỗi chương trước khi đi sâu hơn.
  Chương `Kiến thức chung` cũng có các bài giải thích hỗ trợ về các chủ đề LLM quan trọng — ví dụ như cách inference hoạt động và tokenization là gì.
- **Người dùng nâng cao**:
  Các phần `Mẹo và Thủ thuật` và chương `Khắc phục sự cố` sẽ thiết thực hơn với bạn. Các phần `Thiết kế` cũng có nhiều nội dung đáng đọc.
- **Người dùng quay lại trang web**:
  Mỗi năm tôi đều thực hiện một bài phân tích chuyên sâu về một chủ đề, hãy đón xem nhé!

Trong văn bản, các liên kết có tiền tố ⭐ là những liên kết tôi thực sự thích và khuyên bạn nên đọc.

## Mục lục

Muốn có cái nhìn tổng quan về chủ đề này, bạn có thể đọc bài [blog](https://huggingface.co/blog/clefourrier/llm-evaluation) này — tôi chia sẻ ở đó cách thức và lý do chúng tôi thực hiện đánh giá.

### Benchmark tự động

- [Cơ bản](./automated-benchmarks/basics.md)
- [Thiết kế đánh giá tự động của bạn](./automated-benchmarks/designing_your_automatic_evaluation.md)
- [Một số bộ dữ liệu đánh giá](./automated-benchmarks/some_evaluation_datasets.md)
- [Mẹo và thủ thuật](./automated-benchmarks/tips_and_tricks.md)

### Đánh giá bằng con người

- [Cơ bản](./human-evaluation/basics.md)
- [Sử dụng người chấm điểm con người](./human-evaluation/using_human_annotators.md)
- [Mẹo và thủ thuật](./human-evaluation/tips_and_tricks.md)

### Mô hình đóng vai trò giám khảo

- [Cơ bản](./model-as-a-judge/basics.md)
- [Lựa chọn LLM làm giám khảo](./model-as-a-judge/getting_a_judge_llm.md)
- [Thiết kế prompt đánh giá](./model-as-a-judge/designing_your_evaluation_prompt.md)
- [Đánh giá chính mô hình giám khảo](./model-as-a-judge/evaluating_your_evaluator.md)
- [Vai trò của các mô hình chấm điểm thưởng](./model-as-a-judge/what_about_reward_models.md)
- [Mẹo và thủ thuật](./model-as-a-judge/tips-and-tricks.md)

### Khắc phục sự cố

Đây là phần mang tính thực tiễn cao nhất trong cẩm nang này.
- [Khắc phục lỗi suy luận](./troubleshooting/troubleshooting_inference.md)
- [Khắc phục lỗi tái lập kết quả](./troubleshooting/troubleshooting_reproducibility.md)

### Kiến thức chung

Phần này chủ yếu là các hướng dẫn nền tảng về LLM dành cho người mới bắt đầu, nhưng vẫn có nhiều mẹo và tài liệu tham khảo thú vị.
Nếu bạn là người dùng nâng cao, tôi khuyên bạn nên đọc nhanh các phần `Đi xa hơn`.
- [Suy luận và đánh giá mô hình](./general-knowledge/model_inference_and_evaluation.md)
- [Tokenization](./general-knowledge/tokenization.md)

## Điểm tin hằng năm

- [2023: Năm của nguồn mở](./yearly-dives/2023_year_of_open_source.md)
- [2024: Mục tiêu thực sự của đánh giá là gì?](./yearly-dives/2024_evals_thoughts_from_iclr.md)
- [2025: Đánh giá để xây dựng các mô hình hữu ích trong "thế giới thực"](./yearly-dives/2025_evaluations_for_useful_models.md)

## Tài liệu tham khảo

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

Xin gửi lời cảm ơn sâu sắc đến tất cả những người đã truyền cảm hứng cho tôi thực hiện cẩm nang này, qua các cuộc trò chuyện trực tiếp tại sự kiện hay trực tuyến, đặc biệt là:
- 🤝 Luca Soldaini, Kyle Lo và Ian Magnusson (Allen AI), Max Bartolo (Cohere), Kai Wu (Meta), Swyx và Alessio Fanelli (Latent Space Podcast), Hailey Schoelkopf (EleutherAI), Martin Signoux (Open AI), Moritz Hardt (Max Planck Institute), Ludwig Schmidt (Anthropic)
- 🔥 Người dùng cộng đồng của Open LLM Leaderboard và lighteval — những người thường xuyên mang đến các góc nhìn rất thú vị trong các cuộc thảo luận.
- 🤗 Đồng nghiệp tại Hugging Face như Lewis Tunstall, Hynek Kydlíček, Guilherme Penedo và Thom Wolf, và tất nhiên là người bạn đồng hành Nathan Habib — người cùng tôi làm việc về đánh giá và xây dựng leaderboard từ năm 2022.

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
