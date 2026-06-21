---
sidebar_position: 2
sidebar_label: 'Tokenization'
---

# Tokenization

## Tại sao và làm thế nào để tokenize văn bản?
Vì các mô hình ngôn ngữ lớn thực chất là các hàm toán học khổng lồ, chúng chỉ xử lý các con số chứ không phải văn bản.

Giả sử bạn muốn chuyển đổi một câu thành các con số. Trước tiên, bạn cần quyết định cách cắt câu của mình thành các phần nhỏ, sau đó ánh xạ mỗi phần nhỏ đó thành một con số; quá trình này được gọi là *tokenization*.

Trước đây, người ta thường ánh xạ từng ký tự với chỉ số của nó trong bảng chữ cái (`a` → 1, `b` → 2, v.v.) — phương pháp này gọi là character-based tokenization. Ở chiều ngược lại, người ta cũng thử ánh xạ mỗi từ với chỉ số của nó trong từ điển (`a` → 1, `aardvark` → 2, `ab` → 3, v.v.) — đây là word-based tokenization, tức là tách văn bản tại khoảng trắng (với các ngôn ngữ không có khoảng trắng, việc này phức tạp hơn một chút).

Cả hai phương pháp này đều có một hạn chế lớn: chúng làm mất thông tin từ văn bản đầu vào. Chúng xóa nhòa các mối liên kết ngữ nghĩa có thể thấy từ dạng từ (ví dụ: `dis similar`, `similar`, `similar ity`, `similar ly`) - những thông tin mà chúng ta muốn mô hình giữ lại để liên kết các từ có liên quan với nhau.
(Thêm vào đó, điều gì sẽ xảy ra nếu đột nhiên xuất hiện một từ hoàn toàn mới ở đầu vào? Nó sẽ không có mã số tương ứng, và mô hình của bạn sẽ không thể xử lý được 😔)

Vì vậy, một số người đã nảy ra ý tưởng cắt các từ thành các từ con (sub-words) và gán chỉ số cho các từ con này (`dis`, `similar`, `ity`, `ly`)!

Ban đầu, việc này được thực hiện bằng các quy tắc morpho-syntactic (tức là ngữ pháp tạo từ). Hiện nay, hầu hết mọi người dùng thuật toán Byte Pair Encoding (BPE) — phương pháp thống kê tự động tạo ra các sub-word dựa trên tần suất xuất hiện trong văn bản tham chiếu.

Tóm lại: tokenization là cách ánh xạ các đơn vị văn bản nhỏ (có thể là một hoặc vài ký tự, hoặc ở cấp độ từ) thành các con số (tương tự như một chỉ số). Khi bạn muốn xử lý văn bản, văn bản đầu vào của bạn (được gọi *prompt* trong quá trình suy luận) sẽ được một tokenizer chia nhỏ thành các *token* này. Toàn bộ dải token mà một mô hình hoặc tokenizer có thể phân tích được gọi là *từ vựng* (vocabulary) của nó.

#### Đi xa hơn: Hiểu về tokenization
Tôi khuyên bạn nên đọc kỹ một trong hai liên kết đầu tiên.
- ⭐ [Giải thích về các phương pháp tokenization khác nhau trong Khóa học NLP của 🤗](https://huggingface.co/learn/nlp-course/en/chapter2/4)
- ⭐ [Hướng dẫn khái niệm về tokenization trong tài liệu của 🤗](https://huggingface.co/docs/transformers/en/tokenizer_summary)
- [Khóa học của Jurafsky về tokenization (và các chủ đề khác)](https://web.stanford.edu/~jurafsky/slp3/2.pdf) - tiếp cận theo hướng học thuật hơn, hãy chuyển thẳng đến phần 2.5 và 2.6 (các phần còn lại cũng thú vị nhưng quá rộng)

#### Đi xa hơn: Byte Pair Encoding (BPE)
- ⭐ [Giải thích về BPE trong Khóa học NLP của 🤗](https://huggingface.co/learn/nlp-course/en/chapter6/5)
- [Bài báo giới thiệu BPE vào xử lý ngôn ngữ tự nhiên (NLP)](https://aclanthology.org/P16-1162/)

## Một số vấn đề thường gặp của tokenization

### Lựa chọn kích thước từ vựng phù hợp
Vocabulary size cho biết số lượng token riêng biệt mà mô hình cần học.

Từ vựng **quá lớn** có thể chứa những từ rất hiếm gặp dưới dạng token đầy đủ (ví dụ: `aardvark`), dẫn đến hai vấn đề.

Nếu từ hiếm đó hầu như không xuất hiện trong dữ liệu huấn luyện, mô hình khó có thể liên kết nó với các khái niệm khác hay suy ra được ý nghĩa của nó.

Ngược lại, nếu nó chỉ xuất hiện trong những ngữ cảnh cụ thể, mô hình có thể gắn chặt nó với những từ rất hẹp: chẳng hạn, nếu huấn luyện trên dữ liệu diễn đàn và tokenizer ánh xạ tên người dùng thành một token duy nhất, mô hình có thể liên kết token đó với nội dung riêng của người dùng đó.

Từ vựng **quá nhỏ** gây ra hai vấn đề khác: biểu diễn kém và chi phí inference tăng lên.

Quay lại ví dụ với `similar`: dùng BPE (từ vựng lớn) sẽ tokenize `similarly` thành 2 token (`similar`, `ly`); còn dùng character-level tokenization (từ vựng rất nhỏ) sẽ cắt thành 9 token (`s`, `i`, `m`, `i`, `l`, `a`, `r`, `l`, `y`).

Phương pháp đầu giữ lại ý nghĩa ngữ nghĩa, phương pháp sau thì không — và biểu diễn dài hơn đồng nghĩa với chi phí sinh từ đắt hơn 4.5 lần.

Hiện tại, hầu hết mọi người dùng heuristics để xác định vocabulary size — thường có tương quan với số ngôn ngữ hỗ trợ và kích thước mô hình. Vì vậy, chọn kích thước gần với các mô hình tham chiếu có quy mô tương đương là hướng đi hợp lý.

#### Đi xa hơn: Tác động của các token hiếm
- [Bài viết SolidGoldMagikarp trên Less Wrong](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation)
	- Bài đọc thú vị về cách phát hiện ra các token cực kỳ hiếm trong từ vựng của OpenAI — đặc biệt ở chỗ điều này được thực hiện mà không cần truy cập vào bên trong mô hình.
- [Fishing for Magikarp, bài báo của Cohere](https://arxiv.org/abs/2405.05417)
	- Nghiên cứu tiếp nối để phát hiện các token này

### Quản lý nhiều ngôn ngữ
(Khuyên đọc: hãy đọc giải thích về BPE trước phần này)

Khi xây dựng hoặc lựa chọn tokenizer, bạn thiết lập từ vựng dựa trên văn bản tham chiếu. Điều này đồng nghĩa với việc tokenizer sẽ học các từ vựng và ký tự xuất hiện trong chính văn bản đó, vốn thường là tiếng Anh sử dụng hệ chữ Latin.

Nếu muốn thêm ngôn ngữ mới có cùng hệ chữ viết và chia sẻ chung một số từ gốc, về lý thuyết, các đặc trưng ngữ nghĩa của ngôn ngữ gốc có thể chuyển đổi sang ngôn ngữ mới.

Tuy nhiên, để tokenizer phân tách văn bản trong các ngôn ngữ khác (đặc biệt là các hệ chữ viết khác) một cách chính xác, bạn nên đưa dữ liệu từ chính ngôn ngữ đó vào khi xây dựng bộ từ vựng. Dù vậy, dữ liệu thường bị mất cân bằng trầm trọng khi ngôn ngữ gốc (ví dụ: tiếng Anh) áp đảo hoàn toàn ngôn ngữ mới. Do hầu hết các phương pháp tokenizer hiệu quả hiện nay (như BPE) ưu tiên các từ xuất hiện phổ biến nhất, các token dài thường là từ tiếng Anh, trong khi các từ của ngôn ngữ ít phổ biến hơn dễ bị chia nhỏ vụn vặt đến mức chỉ còn cấp độ ký tự.

Hệ quả là sự bất bình đẳng trong tokenization đa ngôn ngữ: các ngôn ngữ ít phổ biến hơn (hoặc *ít tài nguyên hơn*) cần số lượng token nhiều hơn gấp nhiều lần để diễn đạt một câu có cùng độ dài so với tiếng Anh.

#### Đi xa hơn: Ngôn ngữ và tokenization
- ⭐ [Một bài phân tích và bản demo tuyệt đẹp của Yennie Jun về các vấn đề tokenization giữa các ngôn ngữ](https://www.artfish.ai/p/all-languages-are-not-created-tokenized)
	- Bản thân bài phân tích rất rõ ràng, và việc trải nghiệm thử [không gian demo](https://huggingface.co/spaces/yenniejun/tokenizers-languages) là rất xứng đáng.
- ⭐ [Bản demo của Aleksandar Petrov về sự bất công trong tokenization](https://aleksandarpetrov.github.io/tokenization-fairness/)
	- Tôi khuyên bạn nên xem phần `Compare tokenization of sentences` để cảm nhận rõ sự khác biệt về chi phí suy luận tùy thuộc vào ngôn ngữ.

### Còn các con số thì sao?
Khi xây dựng tokenizer, bạn cần quyết định cách xử lý các con số: chỉ lập chỉ mục 0–9 và coi mọi số khác là tổ hợp các chữ số, hay lưu riêng các số lớn hơn (ví dụ: đến một tỷ)? Các mô hình nổi tiếng hiện nay có nhiều cách tiếp cận khác nhau, nhưng chưa rõ cách nào thực sự giúp mô hình lập luận toán học tốt hơn. Có lẽ cần đến các phương pháp mới như hierarchical tokenization để giải quyết vấn đề này.

#### Đi xa hơn: Tokenization số học
- ⭐ [Bản demo trực quan đẹp mắt của Yennie Jun về cách các mô hình của Anthropic, Meta, OpenAI và Mistral chia nhỏ các con số](https://www.artfish.ai/p/how-would-you-tokenize-or-break-down)
- [Lịch sử ngắn của Beren Millidge về sự tiến hóa của tokenization số học qua các năm](https://www.beren.io/2024-05-11-Integer-tokenization-is-now-much-less-insane/)
