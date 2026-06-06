# AGENT.md — Tiêu chuẩn Dịch thuật Kỹ thuật Đánh giá LLM sang Tiếng Việt

## Mục đích

Tệp này quy định **quy chuẩn dịch thuật và tiêu chuẩn làm việc** cho tất cả các sub-agents tham gia vào dự án dịch **"LLM Evaluation Guidebook"** từ Hugging Face sang tiếng Việt (`evaluation-guidebook-vi`). Mọi agent **PHẢI** đọc và tuân thủ các hướng dẫn này trước khi thực hiện bất kỳ thao tác chỉnh sửa nào.

---

## 1. Nguyên tắc Tổng quát

### Giọng văn (Tone & Voice)
- **Chuyên nghiệp, khách quan nhưng dễ hiểu** — như một chuyên gia đánh giá mô hình (Evaluation Engineer) đang chia sẻ kinh nghiệm thực tế.
- Giữ tinh thần chia sẻ kinh nghiệm xương máu của đội ngũ Hugging Face.
- Sử dụng xưng hô "chúng tôi" khi văn bản gốc sử dụng "we".
- Dịch thoát ý (free translation) thay vì dịch từng từ (literal translation) để đảm bảo câu văn trôi chảy trong tiếng Việt kỹ thuật.

### Nguyên tắc bảo toàn
- **KHÔNG** dịch các đoạn code, cú pháp lập trình, tên tệp tin, hoặc cấu hình.
- **KHÔNG** làm mất hoặc dịch sai các công thức toán học LaTeX.
- **KHÔNG** tự ý thêm thông tin nằm ngoài phạm vi bài viết gốc.

---

## 2. Quy chuẩn Thuật ngữ Kỹ thuật (Glossary)

Để đảm bảo tính nhất quán trên toàn bộ cuốn sách, các thuật ngữ sau đây cần được xử lý thống nhất:

### 2.1. LUÔN giữ nguyên tiếng Anh (Không dịch)
Các thuật ngữ kỹ thuật phổ biến trong ngành học máy/LLM:
```text
LLM, transformer, token, tokenizer, tokenization, embedding, dataset,
GPU, HBM, CPU, VRAM, API, prompt, system prompt, user prompt,
few-shot, zero-shot, multi-choice, free-form,
SFT, DPO, PPO, GRPO, RLHF, RLVR,
GSM8K, HumanEval, MATH, MMLU, ARC, HellaSwag, TruthfulQA,
lighteval, evaluate, transformers, Hugging Face,
bias, variance, overfitting, underfitting,
pipeline, codebase, config, log, output, input,
regex, parser, parsing, metadata,
JSON, YAML, Python, bash, script
```

### 2.2. Dịch + Giữ gốc trong ngoặc (Đối với lần đầu xuất hiện)
Các thuật ngữ kỹ thuật cần được giải thích nghĩa tiếng Việt khi xuất hiện lần đầu trong mỗi chương:
```text
evaluation → đánh giá (evaluation)
benchmark → bộ thử nghiệm (benchmark)
model-as-a-judge → mô hình đóng vai trò giám khảo (model-as-a-judge)
human evaluation → đánh giá bằng con người (human evaluation)
annotator → người gán nhãn/người chấm điểm (annotator)
inter-annotator agreement → độ đồng thuận giữa các người chấm điểm (inter-annotator agreement)
data contamination → nhiễm bẩn dữ liệu (data contamination)
data leakage → rò rỉ dữ liệu (data leakage)
reproducibility → khả năng tái lập/tái sản xuất (reproducibility)
inference → suy luận (inference)
reward model → mô hình chấm điểm thưởng (reward model)
agreement rate → tỷ lệ đồng thuận (agreement rate)
ground truth → nhãn chuẩn/sự thật khách quan (ground truth)
CoT (Chain-of-Thought) → chuỗi suy nghĩ/lập luận từng bước (CoT - Chain-of-Thought)
math parsing → phân tích cú pháp toán học (math parsing)
```

### 2.3. Dịch hoàn toàn sang tiếng Việt
Các từ vựng thông dụng và dễ hiểu trong ngữ cảnh học thuật:
```text
model → mô hình
methodology → phương pháp luận
accuracy → độ chính xác
performance → hiệu suất
metric → thước đo / chỉ số
reproduce → tái lập
reproducible → có thể tái lập
result → kết quả
table → bảng
chart / graph → biểu đồ
chapter → chương
guidebook → cẩm nang
error / bug → lỗi
```

---

## 3. Định dạng và Cấu trúc MDX

### 3.1. Frontmatter YAML bắt buộc
Mỗi tệp Markdown trong Docusaurus phải bắt đầu bằng:
```yaml
---
sidebar_position: <thứ tự trong thư mục>
sidebar_label: '<tên ngắn gọn bằng tiếng Việt>'
---
```

### 3.2. Admonitions (Hộp thông tin)
Không sử dụng cú pháp Docusaurus cũ (`:::type`), bắt buộc sử dụng định dạng GFM Alerts chuẩn:
```markdown
> [!NOTE]
> 📝 **Ghi chú**
> Nội dung...

> [!TIP]
> 💡 **Mẹo**
> Nội dung...

> [!IMPORTANT]
> ⚠️ **Quan trọng**
> Nội dung...

> [!WARNING]
> ⚠️ **Cảnh báo**
> Nội dung...
```

### 3.3. MDX Safety (Thoát ký tự đặc biệt)
Tránh lỗi parse MDX đối với các ký tự `<` và `>` bên ngoài các khối code block:
* Sử dụng `&lt;` cho ký tự bé hơn (`<`).
* Sử dụng `&gt;` cho ký tự lớn hơn (`>`).
* Ví dụ: viết `mô hình có kích thước &lt;70B` thay vì `mô hình có kích thước <70B`.

### 3.4. Liên kết nội bộ (Links)
Đồng bộ hóa các liên kết nội bộ theo cấu trúc thư mục mới của Docusaurus tiếng Việt, sử dụng tương đối (relative paths) và tên file không dấu dạng `snake_case`.

---

## 4. Phân chia Chương và Tên tệp tin (Naming Convention)

Dự án dịch sẽ được tổ chức theo cấu trúc thư mục Docusaurus như sau:

```text
docs/
├── gioi_thieu.md                                  # Giới thiệu cẩm nang
├── general-knowledge/
│   ├── _category_.json                            # Cấu hình danh mục Kiến thức chung
│   ├── model_inference_and_evaluation.md          # 1.1. Suy luận và Đánh giá Mô hình
│   └── tokenization.md                            # 1.2. Tokenization
├── automated-benchmarks/
│   ├── _category_.json                            # Cấu hình danh mục Benchmark tự động
│   ├── basics.md                                  # 2.1. Khái niệm cơ bản
│   ├── designing_your_automatic_evaluation.md     # 2.2. Thiết kế hệ thống đánh giá tự động
│   ├── some_evaluation_datasets.md                # 2.3. Giới thiệu một số bộ dữ liệu đánh giá
│   └── tips_and_tricks.md                         # 2.4. Mẹo và thủ thuật
├── human-evaluation/
│   ├── _category_.json                            # Cấu hình danh mục Đánh giá bằng con người
│   ├── basics.md                                  # 3.1. Khái niệm cơ bản
│   ├── using_human_annotators.md                  # 3.2. Sử dụng người chấm điểm con người
│   └── tips_and_tricks.md                         # 3.3. Mẹo và thủ thuật
├── model-as-a-judge/
│   ├── _category_.json                            # Cấu hình danh mục Model-as-a-Judge
│   ├── basics.md                                  # 4.1. Khái niệm cơ bản
│   ├── getting_a_judge_llm.md                     # 4.2. Lựa chọn LLM làm giám khảo
│   ├── designing_your_evaluation_prompt.md        # 4.3. Thiết kế prompt đánh giá
│   ├── evaluating_your_evaluator.md               # 4.4. Đánh giá chính mô hình giám khảo
│   ├── what_about_reward_models.md                # 4.5. Vai trò của các mô hình chấm điểm thưởng
│   └── tips_and_tricks.md                         # 4.6. Mẹo và thủ thuật
├── troubleshooting/
│   ├── _category_.json                            # Cấu hình danh mục Giải quyết sự cố
│   ├── troubleshooting_inference.md               # 5.1. Khắc phục lỗi suy luận
│   ├── troubleshooting_math_parsing.md            # 5.2. Khắc phục lỗi phân tích cú pháp toán
│   └── troubleshooting_reproducibility.md         # 5.3. Khắc phục lỗi tái lập kết quả
└── yearly-dives/
    ├── _category_.json                            # Cấu hình danh mục Điểm tin hằng năm
    ├── 2023_year_of_open_source.md                # 6.1. Nhìn lại 2023: Năm của nguồn mở
    ├── 2024_evals_thoughts_from_iclr.md           # 6.2. Nhìn lại 2024: Mục tiêu thực sự của đánh giá
    └── 2025_evaluations_for_useful_models.md      # 6.3. Nhìn lại 2025: Đánh giá để xây dựng mô hình hữu ích
```

---

## 5. Quy trình Kiểm tra và Báo cáo (Checklist)

Từng agent dịch thuật và QA phải thực hiện kiểm duyệt trước khi đẩy mã nguồn:
- [ ] Tệp tin có đầy đủ phần YAML frontmatter và hiển thị chính xác trên thanh điều hướng.
- [ ] Không chứa ký tự `<` hoặc `>` trần ngoài code block.
- [ ] Giữ nguyên 100% công thức toán học LaTeX và các khối mã nguồn gốc.
- [ ] Các thuật ngữ kỹ thuật tuân thủ Glossary trong phần 2.
- [ ] Chạy `npm run build` thành công, không có cảnh báo về link gãy hay lỗi cú pháp MDX.
