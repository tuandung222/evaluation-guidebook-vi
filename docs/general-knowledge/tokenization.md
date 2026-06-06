---
sidebar_position: 2
sidebar_label: 'Tokenization'
---

# Tokenization (Mã hóa từ)

## Tại sao và làm thế nào để tokenize văn bản?
Vì các mô hình ngôn ngữ lớn thực chất là các hàm toán học khổng lồ, chúng chỉ xử lý các con số chứ không phải văn bản.

Giả sử bạn muốn chuyển đổi một câu thành các con số. Trước tiên, bạn cần quyết định cách cắt câu của mình thành các phần nhỏ, sau đó ánh xạ mỗi phần nhỏ đó thành một con số; quá trình này được gọi là *tokenization*.

Trước đây, người ta thường cố gắng ánh xạ từng ký tự của văn bản với chỉ số của nó trong bảng chữ cái (`a` → 1, `b` → 2, v.v.), phương pháp này được gọi là *tokenization dựa trên ký tự* (character-based tokenization) (bạn chia nhỏ văn bản theo từng ký tự). Ở khía cạnh ngược lại, người ta cũng thử ánh xạ mỗi từ với chỉ số của nó trong từ điển (`a` → 1, `aardvark` → 2, `ab` → 3, v.v.), phương pháp này gọi là *tokenization dựa trên từ* (word-based tokenization) (bạn chia tách văn bản tại các khoảng trắng, nếu ngôn ngữ của bạn có khoảng trắng - nếu không có, việc này sẽ khó khăn hơn một chút).

Cả hai phương pháp này đều có một hạn chế lớn: chúng làm mất thông tin từ văn bản đầu vào. Chúng xóa nhòa các mối liên kết ngữ nghĩa có thể thấy từ dạng từ (ví dụ: `dis similar`, `similar`, `similar ity`, `similar ly`) - những thông tin mà chúng ta muốn mô hình giữ lại để liên kết các từ có liên quan với nhau.
(Thêm vào đó, điều gì sẽ xảy ra nếu đột nhiên xuất hiện một từ hoàn toàn mới ở đầu vào? Nó sẽ không có mã số tương ứng, và mô hình của bạn sẽ không thể xử lý được 😔)

Vì vậy, một số người đã nảy ra ý tưởng cắt các từ thành các từ con (sub-words) và gán chỉ số cho các từ con này (`dis`, `similar`, `ity`, `ly`)!

Ban đầu, việc này được thực hiện bằng các quy tắc hình thái-cú pháp (morpho-syntactic rules - "hình thái-cú pháp" giống như ngữ pháp của việc tạo từ). Hiện nay, hầu hết mọi người sử dụng thuật toán Byte Pair Encoding (BPE), một phương pháp thống kê thông minh để tự động tạo ra các từ con dựa trên tần suất xuất hiện của chúng trong một văn bản tham chiếu.

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
Kích thước từ vựng (vocabulary size) cho biết số lượng token riêng biệt (ví dụ: các từ con) mà mô hình sẽ phải học.

Một từ vựng **quá lớn** có thể chứa một số từ rất hiếm gặp dưới dạng các token đầy đủ (ví dụ: `aardvark`), dẫn đến hai vấn đề sau.

Nếu một từ hiếm như vậy hầu như không bao giờ xuất hiện trong dữ liệu huấn luyện, sẽ rất khó để liên kết nó với các khái niệm khác, và mô hình có thể không thể suy luận được ý nghĩa của nó.

Mặt khác, nếu nó xuất hiện hiếm hoi và chỉ trong các ngữ cảnh cụ thể, nó có thể bị liên kết với một số từ rất cụ thể khác: ví dụ, nếu bạn huấn luyện mô hình trên dữ liệu diễn đàn và tokenizer ánh xạ một tên người dùng thành một token duy nhất trong từ vựng, mô hình sau đó có thể liên kết token này với nội dung cụ thể của người dùng đó.

Một từ vựng **quá nhỏ** sẽ gây ra hai vấn đề khác: khả năng biểu diễn kém hơn và chi phí suy luận (inference) tăng lên.

Hãy quay lại ví dụ trên, nơi chúng ta tokenize các từ bắt nguồn từ `similar`. Sử dụng phương pháp giả BPE (từ vựng lớn) để tokenize `similarly` sẽ chia từ này thành 2 token (`similar`, `ly`). Thay vào đó, nếu chúng ta sử dụng tokenization cấp độ ký tự (do đó từ vựng rất nhỏ, chỉ bằng kích thước của bảng chữ cái), từ này sẽ bị cắt thành 9 token (`s`, `i`, `m`, `i`, `l`, `a`, `r`, `l`, `y`).

Trong khi phương pháp đầu tiên chia `similarly` thành các token có ý nghĩa ngữ nghĩa riêng biệt, thì phương pháp thứ hai lại không làm được như vậy: với từ vựng quá nhỏ, chúng ta đã mất đi một phần biểu diễn ngữ nghĩa. Sự khác biệt về độ dài biểu diễn cũng đồng nghĩa với việc chi phí sinh từ này với từ vựng nhỏ hơn sẽ đắt hơn gấp nhiều lần (mất 9 token thay vì 2 token, đắt hơn gấp 4.5 lần!).

Hiện tại, hầu hết mọi người sử dụng các phương pháp phỏng đoán (heuristics) để xác định kích thước từ vựng, điều này dường như có mối tương quan với số lượng ngôn ngữ được hỗ trợ và kích thước mô hình. Do đó, việc sử dụng số lượng token gần với các mô hình tham chiếu có kích thước tương tự có thể là một hướng đi phù hợp cho bạn.

#### Đi xa hơn: Tác động của các token hiếm
- [Bài viết SolidGoldMagikarp trên Less Wrong](https://www.lesswrong.com/posts/aPeJE8bSo6rAFoLqg/solidgoldmagikarp-plus-prompt-generation)
	- Một bài đọc rất thú vị về cách một số người phát hiện ra các token cực kỳ hiếm trong từ vựng của OpenAI - điều này rất thú vị vì nó được thực hiện mà không cần truy cập vào cấu trúc bên trong của mô hình (ví dụ: chúng ta không biết dữ liệu huấn luyện chứa những gì)
- [Fishing for Magikarp, bài báo của Cohere](https://arxiv.org/abs/2405.05417)
	- Nghiên cứu tiếp nối để phát hiện các token này

### Quản lý nhiều ngôn ngữ
(Khuyên đọc: hãy đọc giải thích về BPE trước phần này)

Khi xây dựng hoặc lựa chọn tokenizer của mình, bạn xây dựng từ vựng từ văn bản tham chiếu. Điều này có nghĩa là tokenizer của bạn sẽ học các từ vựng và ký tự từ văn bản tham chiếu đó. Thông thường, điều này đồng nghĩa với việc sử dụng dữ liệu bằng tiếng Anh, viết bằng hệ chữ Latin.

Nếu bạn muốn thêm ngôn ngữ mới, và ngôn ngữ mới đó sử dụng cùng hệ chữ viết cũng như chia sẻ một số từ gốc, về mặt lý thuyết bạn có thể hy vọng một số ngữ nghĩa của ngôn ngữ ban đầu sẽ chuyển sang ngôn ngữ mới.

Tuy nhiên, nếu bạn muốn tokenizer phân tách văn bản trong các ngôn ngữ khác một cách chính xác (đặc biệt là các ngôn ngữ sử dụng chữ viết khác), tốt nhất bạn nên đưa dữ liệu từ các ngôn ngữ đó vào khi xây dựng tokenizer. Dẫu vậy, phần lớn thời gian dữ liệu này sẽ mất cân bằng lớn giữa ngôn ngữ ban đầu (ví dụ: tiếng Anh) và ngôn ngữ mới (ví dụ: tiếng Thái hoặc tiếng Myanmar), trong đó ngôn ngữ ban đầu chiếm ưu thế tuyệt đối. Vì hầu hết các phương pháp tokenizer hiệu quả hiện nay (như BPE) tạo ra các token phức tạp dựa trên các từ thường gặp nhất, nên hầu hết các token dài sẽ là các từ tiếng Anh - và hầu hết các từ từ các ngôn ngữ ít phổ biến hơn sẽ chỉ bị chia nhỏ ở cấp độ ký tự.

Hiệu ứng này dẫn đến sự bất bình đẳng trong tokenization đa ngôn ngữ: một số ngôn ngữ (ít phổ biến hơn hoặc *ít tài nguyên hơn* - lower-resourced) cần số lượng token nhiều hơn gấp nhiều lần để tạo ra một câu có độ dài tương đương với tiếng Anh.

#### Đi xa hơn: Ngôn ngữ và tokenization
- ⭐ [Một bài phân tích và bản demo tuyệt đẹp của Yennie Jun về các vấn đề tokenization giữa các ngôn ngữ](https://www.artfish.ai/p/all-languages-are-not-created-tokenized)
	- Bản thân bài phân tích rất rõ ràng, và việc trải nghiệm thử [không gian demo](https://huggingface.co/spaces/yenniejun/tokenizers-languages) là rất xứng đáng.
- ⭐ [Bản demo của Aleksandar Petrov về sự bất công trong tokenization](https://aleksandarpetrov.github.io/tokenization-fairness/)
	- Tôi khuyên bạn nên xem phần `Compare tokenization of sentences` để cảm nhận rõ sự khác biệt về chi phí suy luận tùy thuộc vào ngôn ngữ.

### Còn các con số thì sao?
Khi xây dựng tokenizer của mình, bạn cần quyết định cách xử lý các con số. Bạn sẽ chỉ lập chỉ mục từ 0 đến 9 và coi tất cả các số khác là sự kết hợp của các chữ số này, hay bạn muốn lưu trữ các số lớn hơn (ví dụ: lên đến một tỷ) một cách riêng biệt? Các mô hình nổi tiếng hiện nay thể hiện nhiều cách tiếp cận khác nhau đối với vấn đề này, nhưng chưa rõ cách nào giúp mô hình lập luận toán học tốt hơn. Có lẽ chúng ta sẽ cần đến các phương pháp tokenization mới, chẳng hạn như tokenization phân cấp (hierarchical tokenization) để giải quyết vấn đề này.

#### Đi xa hơn: Tokenization số học
- ⭐ [Bản demo trực quan đẹp mắt của Yennie Jun về cách các mô hình của Anthropic, Meta, OpenAI và Mistral chia nhỏ các con số](https://www.artfish.ai/p/how-would-you-tokenize-or-break-down)
- [Lịch sử ngắn của Beren Millidge về sự tiến hóa của tokenization số học qua các năm](https://www.beren.io/2024-05-11-Integer-tokenization-is-now-much-less-insane/)
