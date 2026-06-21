---
sidebar_position: 2
sidebar_label: '2024: Mục đích Đánh giá'
---

(Bài viết gốc được đăng tải tại : https://huggingface.co/blog/clefourrier/llm-evaluation)

# Hãy cùng bàn về việc đánh giá LLM

Vì đội ngũ của tôi phụ trách mảng đánh giá (evaluation) và bảng xếp hạng (leaderboard) tại Hugging Face, tại hội nghị ICLR 2024 (diễn ra 2 tuần trước), rất nhiều người đã muốn trao đổi với tôi về chủ đề này (điều này khá bất ngờ, xin chân thành cảm ơn tất cả những ai đã quan tâm).

Nhờ tất cả những cuộc thảo luận đó, tôi nhận ra rằng có một số điều mà tôi coi là hiển nhiên trong việc đánh giá lại: 1) không phải là những ý tưởng được phổ biến rộng rãi, và 2) dường như lại rất thú vị.

Vì vậy, chúng tôi muốn chia sẻ cuộc trò chuyện này rộng rãi hơn!

## Chúng ta đánh giá LLM bằng cách nào?

Trước hết, hãy thống nhất một vài định nghĩa. Theo hiểu biết của tôi, hiện tại có 3 phương pháp chính để thực hiện đánh giá: bộ thử nghiệm tự động (automated benchmarking), sử dụng con người làm giám khảo (humans as judges), và sử dụng mô hình làm giám khảo (models as judges). Mỗi phương pháp đều có lý do tồn tại, công dụng và những hạn chế riêng.

### Bộ thử nghiệm (Benchmarks)

Đánh giá tự động bằng benchmark thường hoạt động theo cách sau: bạn muốn biết mô hình của mình hoạt động tốt như thế nào trên một khía cạnh nào đó. Khía cạnh này có thể là một **nhiệm vụ** cụ thể, chẳng hạn như *Mô hình của tôi phân loại email rác (spam) tốt đến mức nào?*, hoặc một **khả năng** trừu tượng hơn, như *Mô hình của tôi giỏi toán đến mức nào?*.

Từ đây, bạn xây dựng một bài đánh giá, thường gồm hai phần:
- Một tập hợp các *mẫu thử* (samples) được đưa vào mô hình làm đầu vào (input) để xem kết quả đầu ra (output) là gì, đôi khi đi kèm với một nhãn chuẩn/sự thật khách quan (ground truth) để so sánh. Các mẫu thử thường được thiết kế để mô phỏng những gì bạn muốn kiểm tra trên mô hình: ví dụ: nếu bạn đang xem xét phân loại email, bạn tạo ra một tập dữ liệu (dataset) gồm các email rác và email thường, cố gắng đưa vào một số trường hợp biên khó xử lý (edge cases), v.v. Đối với các LLM, hai loại nhiệm vụ chính là đánh giá khả năng tạo văn bản (so sánh văn bản được tạo ra với một tài liệu tham khảo sau khi chuẩn hóa), hoặc trắc nghiệm (multi-choice) (so sánh xác suất log (log-probability) tương đối của các phần tiếp theo khả thi sau một prompt).
- Một *thước đo* (metric), là cách để tính điểm cho mô hình. Ví dụ: mô hình của bạn có thể phân loại email rác chính xác đến mức nào (điểm của mẫu được phân loại đúng = 1, phân loại sai = 0).

Việc này sẽ thú vị hơn khi được thực hiện trên dữ liệu không nằm trong tập huấn luyện (training set) của mô hình, bởi vì bạn muốn kiểm tra xem nó có **khái quát hóa** (generalize) tốt hay không. Bạn đâu muốn một mô hình chỉ có thể phân loại các email mà nó đã "nhìn thấy" trước đó, điều đó sẽ không hữu ích lắm!

> [!NOTE]
> 📝 **Ghi chú**
> Một mô hình chỉ có thể dự đoán tốt trên dữ liệu huấn luyện của nó (và không tự học được các mẫu tổng quát ở cấp độ cao hơn) được gọi là bị **quá khớp** (overfitting). Trong các trường hợp ít cực đoan hơn, bạn vẫn muốn kiểm tra xem mô hình của mình có khả năng khái quát hóa đối với các mẫu dữ liệu không nằm trong phân phối của tập huấn luyện hay không (ví dụ: phân loại email rác về các sản phẩm "sức khỏe" sau khi chỉ mới nhìn thấy các email rác về ngân hàng giả mạo).

Phương pháp này hoạt động khá tốt đối với các nhiệm vụ được định nghĩa rõ ràng, nơi hiệu suất "dễ dàng" được đánh giá và đo lường: khi bạn thực sự kiểm tra mô hình của mình trên nhiệm vụ phân loại email rác, bạn có thể nói "mô hình đã phân loại chính xác n% trong số các mẫu thử này". Đối với các benchmark của LLM, một số vấn đề có thể phát sinh, chẳng hạn như mô hình [ưa thích các lựa chọn cụ thể dựa trên thứ tự mà chúng được hiển thị trong các bài đánh giá trắc nghiệm](https://arxiv.org/abs/2309.03882), hay các đánh giá sinh văn bản phụ thuộc vào các phép chuẩn hóa vốn có thể dễ dàng [trở nên không công bằng nếu không được thiết kế tốt](https://huggingface.co/blog/open-llm-leaderboard-drop), nhưng nhìn chung chúng vẫn cung cấp tín hiệu rõ ràng ở cấp độ nhiệm vụ.

Tuy nhiên, đối với các khả năng tổng quát, rất khó để phân rã chúng thành các nhiệm vụ cụ thể và chính xác: "giỏi toán" nghĩa là gì? giỏi số học? giỏi logic? hay có khả năng lập luận trên các khái niệm toán học?

Trong trường hợp này, mọi người có xu hướng thực hiện các đánh giá mang tính "toàn diện" (holistic) hơn, bằng cách không phân rã khả năng đó thành các nhiệm vụ thực tế, mà giả định rằng hiệu suất trên các mẫu thử chung sẽ là một **đại diện tốt** (good proxy) cho những gì chúng tôi hướng tới đo lường. Ví dụ: GSM8K bao gồm các bài toán thực tế của học sinh trung học, đòi hỏi cả một tập hợp các khả năng để giải quyết. Điều này cũng có nghĩa là cả thất bại và thành công đều rất khó để giải thích. Một số khả năng hoặc chủ đề, chẳng hạn như "mô hình này viết thơ có hay không?" hoặc "đầu ra của mô hình có hữu ích không?" thậm chí còn khó đánh giá hơn bằng các thước đo tự động – đồng thời, các mô hình hiện nay dường như ngày càng có nhiều khả năng **đa dụng** (generalist) hơn, vì vậy chúng tôi cần đánh giá khả năng của chúng một cách rộng quát hơn. (Ví dụ: đã có một cuộc tranh luận trong cộng đồng khoa học về việc liệu LLM [có thể vẽ](https://arxiv.org/abs/2303.12712) kỳ lân [hay không](https://twitter.com/DimitrisPapail/status/1719119242186871275). Nhiều khả năng là không thể ở thời điểm này, nhưng rõ ràng đây là một điểm quan trọng cần nghiên cứu.)

Các benchmark tự động cũng thường gặp phải một vấn đề khác: một khi được công bố công khai dưới dạng văn bản thuần túy, chúng rất dễ kết thúc (thường là vô tình) trong tập dữ liệu huấn luyện của các mô hình. Một số người tạo benchmark, như các tác giả của BigBench, đã cố gắng giảm thiểu điều này bằng cách thêm một "chuỗi canary" (canary string - một sự kết hợp ký tự rất đặc biệt) để mọi người tìm kiếm và loại bỏ khỏi các tập huấn luyện, nhưng không phải ai cũng biết về cơ chế này hoặc cố gắng thực hiện việc loại bỏ đó. Số lượng các benchmark cũng không hề nhỏ, nên việc tìm kiếm các bản sao vô tình của tuyệt đối tất cả chúng trong dữ liệu là rất tốn kém. Các lựa chọn khác bao gồm việc cung cấp benchmark dưới [dạng mã hóa](https://arxiv.org/pdf/2309.16575), hoặc đằng sau một [hệ thống kiểm soát quyền truy cập](https://huggingface.co/datasets/Idavidrein/gpqa). Tuy nhiên, khi đánh giá các mô hình đóng đằng sau các API hộp đen (black box), không có gì đảm bảo rằng dữ liệu được cung cấp sẽ không bị sử dụng nội bộ sau đó cho việc huấn luyện hoặc tinh chỉnh.

Trường hợp một tập dữ liệu đánh giá kết thúc trong tập dữ liệu huấn luyện được gọi là **nhiễm bẩn dữ liệu (data contamination)**, và một mô hình bị nhiễm bẩn sẽ có hiệu suất benchmark cao nhưng không khái quát hóa tốt cho nhiệm vụ thực tế bên dưới (mô tả chi tiết về sự nhiễm bẩn có thể được tìm thấy [tại đây](https://aclanthology.org/2023.findings-emnlp.722/), và đây là một cách thú vị để [phát hiện ra nó](https://arxiv.org/abs/2311.06233)). Một cách để giải quyết nhiễm bẩn dữ liệu là chạy các [**dynamic benchmark**](https://arxiv.org/abs/2104.14337) (các đánh giá trên tập dữ liệu được làm mới thường xuyên để cung cấp điểm số trên dữ liệu mới chưa từng thấy một cách hệ thống), nhưng phương pháp này rất tốn kém trong dài hạn.

### Con người đóng vai trò giám khảo (Human as a judge)

Một giải pháp cho cả vấn đề nhiễm bẩn dữ liệu và các bài đánh giá mở (open-ended) là yêu cầu con người đánh giá đầu ra của mô hình.

Việc này thường được thực hiện bằng cách giao nhiệm vụ cho con người: trước tiên là viết prompt cho mô hình, sau đó chấm điểm câu trả lời của mô hình hoặc xếp hạng một vài đầu ra theo các hướng dẫn có sẵn. Sử dụng con người làm giám khảo cho phép nghiên cứu các nhiệm vụ phức tạp hơn, với tính linh hoạt cao hơn so với các thước đo tự động. Nó cũng ngăn chặn hầu hết các trường hợp nhiễm bẩn dữ liệu, vì các prompt được viết ra (hy vọng là) mới hoàn toàn. Cuối cùng, nó có mối tương quan tốt với sở thích của con người, vì đây chính xác là những gì được đánh giá!

Có nhiều cách tiếp cận khác nhau để đánh giá các mô hình có sự tham gia của con người (human-in-the-loop).

**Vibes-check** (đánh giá cảm tính) là tên gọi dành cho các bài đánh giá thủ công được thực hiện riêng lẻ bởi một số thành viên trong cộng đồng, thường trên các prompt không được tiết lộ, để có được một "cảm nhận" tổng thể về mức độ hoạt động của mô hình trên nhiều trường hợp sử dụng, từ lập trình cho đến chất lượng văn bản truyện người lớn. (Tôi cũng từng thấy thuật ngữ "canary-testing" được sử dụng cho việc này, liên quan đến phương pháp dùng chim hoàng yến trong mỏ than để nhận biết tín hiệu cảnh báo sớm). Thường được chia sẻ trên Twitter và Reddit, họ chủ yếu cấu thành các bằng chứng mang tính giai thoại và có xu hướng cực kỳ nhạy cảm với thiên kiến xác nhận (confirmation bias - nói cách khác, người ta có xu hướng tìm thấy những gì họ đang muốn tìm). Tuy nhiên, một số người đã cố gắng thực hiện các bài đánh giá vibe-check một cách bài bản hơn; ví dụ, người dùng *Wolfram Ravenwolf* chia sẻ các kết quả so sánh mô hình của mình theo một cách rất hệ thống qua các bài viết blog (xem [tại đây](https://huggingface.co/blog/wolfram/llm-comparison-test-llama-3) để biết một ví dụ).

Việc sử dụng phản hồi của cộng đồng để thiết lập các bảng xếp hạng mô hình quy mô lớn là những gì chúng tôi gọi là **arena**. Một ví dụ nổi tiếng là [LMSYS chatbot arena](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard), nơi người dùng cộng đồng được yêu cầu trò chuyện với các mô hình cho đến khi nhận ra cái nào tốt hơn. Phần phiếu bầu sau đó được tổng hợp thành bảng xếp hạng Elo (đánh giá các trận đấu đối đầu) để chọn ra mô hình nào "tốt nhất". Vấn đề rõ ràng của cách tiếp cận này là tính chủ quan cao — rất khó áp dụng quy chuẩn chấm điểm nhất quán từ nhiều thành viên cộng đồng với các hướng dẫn chung chung, đặc biệt khi sở thích của người chấm có xu hướng [phụ thuộc vào văn hóa](https://arxiv.org/abs/2404.16019v1). Người ta có thể hy vọng rằng hiệu ứng này sẽ được làm mượt nhờ quy mô khổng lồ của số lượng phiếu bầu, thông qua hiệu ứng "trí tuệ đám đông" (wisdom of the crowd — hiệu ứng này được phát hiện bởi nhà thống kê Galton, người đã quan sát thấy các câu trả lời cá nhân nhằm ước tính một giá trị số, như trọng lượng của một con lợn, có thể được mô hình hóa dưới dạng một phân phối xác suất tập trung xung quanh câu trả lời thực tế).

Phương pháp cuối cùng là **gán nhãn hệ thống** (systematic annotations), nơi bạn cung cấp các hướng dẫn cực kỳ cụ thể cho những người chấm điểm chuyên nghiệp được trả phí, nhằm loại bỏ càng nhiều thiên kiến chủ quan càng tốt (đây là cách tiếp cận được sử dụng bởi [ScaleAI](https://scale.com/guides/data-labeling-annotation-guide#hight-quality-data-annotations) và hầu hết các công ty gán nhãn dữ liệu). Tuy nhiên, phương pháp này có thể trở nên vô cùng tốn kém một cách nhanh chóng, vì bạn phải tiếp tục thực hiện các đánh giá một cách liên tục và không tự động cho mỗi mô hình mới mà bạn muốn đánh giá, và nó vẫn có thể là nạn nhân của thiên kiến con người (nghiên cứu [này](https://arxiv.org/abs/2205.00501) cho thấy những người có bản dạng khác nhau có xu hướng đánh giá mức độ độc hại trong câu trả lời của mô hình rất khác nhau).

Các [nghiên cứu](https://arxiv.org/pdf/2309.16349) gần đây cũng chỉ ra rằng những người đánh giá là con người có xu hướng ước tính chất lượng của các câu trả lời dựa trên ấn tượng đầu tiên, thay vì tính xác thực hay độ trung thực thực tế của thông tin. Những người chấm điểm đại trà (crowdsourced annotators) đặc biệt nhạy cảm với giọng điệu, và đánh giá thấp số lượng lỗi thực tế hoặc lỗi logic trong một câu trả lời mang tính khẳng định chắc chắn. Nói cách khác, nếu một mô hình nói những điều sai trái với giọng điệu tự tin, những người đánh giá con người sẽ ít có khả năng nhận ra điều đó hơn nhiều, điều này có thể làm lệch xếp hạng nghiêng về phía các mô hình có giọng điệu khẳng định hơn. (Các người chấm điểm chuyên gia sẽ ít rơi vào các thiên kiến này hơn). Loại thiên kiến này của con người đã được xác nhận trong một [bài báo khác](https://arxiv.org/pdf/2310.13548): con người có xu hướng thích những câu trả lời phù hợp với quan điểm của họ hoặc đồng thuận với ý kiến hoặc sai lầm của họ, hơn là những câu trả lời chính xác về mặt thực tế.

Những thiên kiến này không phải là điều bất ngờ, nhưng chúng bắt buộc phải được xem xét: không phải tất cả các trường hợp sử dụng đều nên dựa vào người chấm điểm con người, đặc biệt là những người chấm điểm đại trà không chuyên – bất kỳ nhiệm vụ nào yêu cầu tính xác thực (chẳng hạn như viết code, đánh giá kiến thức mô hình, v.v.) nên đi kèm một loại đánh giá khác mạnh mẽ hơn để hoàn thiện bộ thử nghiệm.

### Mô hình đóng vai trò giám khảo (Model-as-a-judge)

Để giảm thiểu chi phí cho người chấm điểm con người, một số người đã nghiên cứu sử dụng các mô hình hoặc các sản phẩm phái sinh (ưu tiên những mô hình được căn chỉnh theo sở thích của con người) để đánh giá đầu ra của các mô hình khác. Hướng tiếp cận này không mới, vì bạn có thể tìm thấy các kỹ thuật đo lường chất lượng tóm tắt từ [model embedding](https://arxiv.org/abs/1904.09675) từ năm 2019.

Có hai cách tiếp cận để chấm điểm: sử dụng các [mô hình đa dụng, có khả năng cao](https://arxiv.org/abs/2306.05685v4) hoặc sử dụng các [mô hình chuyên biệt cỡ nhỏ](https://arxiv.org/pdf/2405.01535) được huấn luyện riêng để phân biệt dựa trên dữ liệu ưu tiên (preference data). Cách tiếp cận đầu tiên cho kết quả tương quan tốt với sở thích của con người, nhưng hầu hết các mô hình đủ mạnh thường là nguồn đóng, do đó dễ bị thay đổi đằng sau các API và không thể giải thích được.

Việc sử dụng LLM làm giám khảo (LLM-as-a-judge) có một số hạn chế lớn: chúng có xu hướng [ưa thích đầu ra của chính mình](https://arxiv.org/abs/2404.13076) khi chấm điểm câu trả lời, [kém trong việc cung cấp các dải điểm số nhất quán](https://twitter.com/aparnadhinak/status/1748368364395721128) (mặc dù bạn có thể cải thiện điều này bằng cách yêu cầu mô hình giải thích lập luận của nó [trước khi đưa ra điểm số](https://twitter.com/seungonekim/status/1749289437165769177)), và trên thực tế không quá nhất quán [với xếp hạng của con người](https://arxiv.org/pdf/2308.15812).

Điểm e ngại cá nhân lớn nhất của tôi đối với việc sử dụng mô hình làm giám khảo là chúng đưa vào những thiên kiến rất tinh vi và không thể giải thích được trong việc lựa chọn câu trả lời. Tôi cảm thấy rằng, giống như việc lai phối quá mức trong các nghiên cứu di truyền học dẫn đến các thế hệ động thực vật bị suy thoái chức năng, việc sử dụng LLM để lựa chọn và huấn luyện LLM rất có thể sẽ đưa vào những thay đổi nhỏ nhưng gây ra những hậu quả lớn hơn sau vài thế hệ. Tôi tin rằng loại thiên kiến này ít có khả năng xảy ra hơn ở các mô hình làm giám khảo nhỏ hơn và chuyên biệt hơn (chẳng hạn như bộ phân loại độc hại - toxicity classifiers), nhưng điều này vẫn cần được thử nghiệm và chứng minh một cách nghiêm túc.

## Tại sao chúng ta đánh giá LLM?

Bây giờ chúng ta đã thấy cách thực hiện đánh giá, vậy nó thực sự hữu ích cho điều gì?

Tôi tin chắc rằng có 3 lý do chính khiến mọi người thực hiện đánh giá, các lý do này thường bị gộp chung với nhau, nhưng trên thực tế chúng **rất khác biệt** và mỗi lý do đều trả lời cho một câu hỏi riêng biệt.

### 1) Mô hình của tôi có đang được huấn luyện tốt không? Phương pháp huấn luyện của tôi có đúng đắn không? - Kiểm thử không hồi quy (Non-regression testing)

**Kiểm thử không hồi quy** (non-regression testing) là một khái niệm bắt nguồn từ ngành công nghiệp phần mềm, nhằm đảm bảo các thay đổi nhỏ không làm hỏng phương pháp tiếp cận tổng thể.

Ý tưởng là: khi bạn thêm một tính năng mới vào phần mềm của mình hoặc sửa một lỗi trong cơ sở mã (codebase), liệu bạn có làm hỏng thứ khác không? Đó là mục đích của các bài kiểm thử không hồi quy: đảm bảo hành vi mong muốn ở cấp độ cao của phần mềm không đột ngột bị hỏng do một thay đổi (dường như không liên quan).

Khi bạn lựa chọn một thiết lập để huấn luyện mô hình, bạn muốn kiểm tra một điều tương tự và đảm bảo rằng các thay đổi của mình (chọn dữ liệu huấn luyện, kiến trúc, tham số khác nhau, v.v.) không làm "hỏng" hiệu suất mong đợi của một mô hình có các đặc tính này.

Để đưa ra một ví dụ cụ thể, bạn sẽ kỳ vọng một LLM cơ sở 7B đạt điểm từ 50 đến 65 trên bộ dữ liệu trắc nghiệm MMLU sau khi huấn luyện, và ngược lại, nếu hiệu suất dao động từ 20 đến 30 thì tức là không xảy ra quá trình học tập nào cả.

Đối với đánh giá "kiểm thử không hồi quy", bạn cần xem xét: 1) **quỹ đạo** (trajectories) điểm số đánh giá (hiệu suất hiện tại có tốt hơn lúc bắt đầu huấn luyện hay không), 2) **khoảng** (ranges) điểm số đánh giá (hiệu suất có nằm trong phạm vi dự kiến hay không). Thực tế là... bạn không cần quan tâm đến chính xác điểm số đó là bao nhiêu!

Do đó, đánh giá này không nhằm mục đích cho bạn biết bất cứ điều gì về khả năng thực sự của mô hình, mà thay vào đó chỉ để xác nhận rằng phương pháp huấn luyện của bạn "cũng đúng đắn" như phương pháp huấn luyện khác và mô hình của bạn hoạt động theo những cách tương tự. Tôi tin rằng ngay cả một số bài đánh giá chỉ đơn giản là xem xét những thay đổi về độ hỗn loạn (perplexity) (xác suất) của văn bản cũng có thể đủ cho bước này, nhưng bạn thường muốn các benchmark có tỷ lệ "tín hiệu trên nhiễu" (signal-to-noise) cao, hay nói cách khác, bạn muốn đảm bảo rằng một thay đổi lớn về điểm số phản ánh một sự chuyển dịch lớn trong mô hình của bạn.

### 2) Mô hình nào là tốt nhất? Mô hình của tôi có tốt hơn mô hình của bạn không? - Bảng xếp hạng và xếp thứ hạng (Leaderboards and rankings)

Vai trò tiếp theo của đánh giá chỉ đơn giản là phân loại các mô hình để tìm và lựa chọn các kiến trúc cũng như phương pháp tiếp cận tốt nhất nói chung. Nếu bạn có một bảng xếp hạng, chọn mô hình tốt nhất mà nó vẫn không hoạt động được cho trường hợp sử dụng của bạn, thì rất ít khả năng mô hình tốt thứ hai hoạt động được. Trong [bài báo của họ](https://arxiv.org/pdf/2404.02112) về những bài học rút ra từ việc xây dựng bộ thử nghiệm và thiết kế tập dữ liệu từ kỷ nguyên ImageNet, các tác giả lập luận rằng, vì điểm số rất dễ bị mất ổn định, cách mạnh mẽ duy nhất để đánh giá mô hình là thông qua thứ hạng, và cụ thể hơn là bằng cách tìm kiếm các nhóm đánh giá rộng lớn cung cấp thứ hạng nhất quán và ổn định.

Tôi tin rằng việc tìm kiếm sự ổn định của thứ hạng thực sự là một hướng tiếp cận cực kỳ thú vị đối với việc thử nghiệm mô hình, vì chúng tôi đã chỉ ra rằng *điểm số* của LLM trên các bộ thử nghiệm tự động cực kỳ nhạy cảm với [những thay đổi nhỏ trong prompt](https://huggingface.co/blog/evaluation-structured-outputs), và các đánh giá bằng con người cũng không nhất quán hơn – trong khi *thứ hạng* thực tế lại ổn định hơn khi sử dụng các phương pháp đánh giá mạnh mẽ.

Nếu bản thân điểm số không quá quan trọng, liệu việc sử dụng thứ tự sắp xếp tương đối của các mô hình có thể cho chúng ta biết điều gì đó có giá trị hay không?

Trong phiên họp toàn thể về đánh giá tại ICLR 2024 liên quan, Moritz Hardt đã so sánh việc thêm các nhiễu động vào Open LLM Leaderboard (thông qua những sửa đổi điểm số cực nhỏ, hoàn toàn nằm trong dải điểm số) và trên Chatbot Arena (thông qua việc thêm một đối thủ yếu vào đấu trường để xem nó ảnh hưởng như thế nào đến bảng xếp hạng Elo). Cả hai bộ thử nghiệm này hiện đều không cung cấp thứ hạng ổn định và nhất quán tại thời điểm hiện tại. Chúng tôi chắc chắn sẽ khám phá khía cạnh này trong các phiên bản tương lai của Open LLM Leaderboard!

### 3) Chúng ta đang ở đâu, xét trên góc độ một lĩnh vực, về mặt khả năng của mô hình? Mô hình của tôi có thể làm được X không?

"Làm thế nào để biết mô hình có thể làm được X?" là câu hỏi xuất hiện rất nhiều, và tôi nghĩ đó là một câu hỏi rất thích đáng.

Tuy nhiên, đối với bất kỳ khả năng phức tạp nào, **ở thời điểm hiện tại chúng ta không thể chỉ nói "mô hình này tốt nhất ở điểm này", mà thay vào đó là "mô hình này tốt nhất ở nhiệm vụ này, cái mà chúng tôi hy vọng là một đại diện tốt cho khả năng đó, mà không có bất kỳ sự đảm bảo nào"**.

Chúng ta đang rất thiếu bất kỳ định nghĩa và khuôn khổ (framework) tốt nào về việc thế nào là một khả năng đối với một mô hình học máy, đặc biệt là những khả năng liên quan đến lập luận và thuyết tâm trí (theory of mind). Tuy nhiên, điều này không chỉ riêng có ở học máy! Trong các nghiên cứu về con người và động vật, việc định nghĩa thế nào cấu thành một "khả năng" cũng khá khó khăn, và các thước đo cố gắng cung cấp điểm số chính xác (chẳng hạn như IQ và EQ) vẫn đang được tranh luận sôi nổi và gây nhiều tranh cãi, và điều đó hoàn toàn có cơ sở.

Chúng ta có thể muốn xem xét các ngành khoa học xã hội để suy nghĩ về việc đánh giá các khả năng, vì trong các lĩnh vực này, mọi người đã quen với việc suy nghĩ nghiêm túc về các yếu tố gây nhiễu (confounding factors) trong việc thu thập và phân tích dữ liệu. Tuy nhiên, tôi cũng tin rằng nhiều khả năng: 1) chúng ta hoàn toàn không thể định nghĩa được các khả năng rộng quát này, vì hiện tại chúng ta không thể định nghĩa chúng ở con người và động vật, 2) các khuôn khổ được xây dựng dựa trên đối tượng con người (hoặc động vật) sẽ không thể chuyển giao tốt sang các mô hình, vì các hành vi và giả định bên dưới là không giống nhau.

## Kết luận

Việc đánh giá LLM ngày nay được thực hiện theo các cách sau:
- Sử dụng các bộ thử nghiệm tự động (benchmark), vốn bị ảnh hưởng bởi nhiễm bẩn dữ liệu và thiếu tính "tổng quát" (điều sau không nhất thiết là xấu, vì các đánh giá chuyên biệt cũng rất thú vị).
- Sử dụng đánh giá bằng con người, vốn có xu hướng chịu ảnh hưởng bởi việc thiếu khả năng tái lập ở quy mô nhỏ và các thiên kiến tâm lý nói chung (chẳng hạn như thích các câu trả lời mang tính nịnh bợ), mặc dù người ta có thể hy vọng một số thiên kiến sẽ được làm mượt ở quy mô lớn.
- Sử dụng mô hình làm giám khảo (model-as-a-judge), vốn có những thiên kiến rất tinh vi khi đánh giá, dễ bị bỏ qua nhưng lại đưa vào những nhiễu động cho các bước phía sau.

Tuy nhiên, không phải mọi thứ đều bế tắc: đánh giá, trong giới hạn của nó, vẫn có thể cung cấp một số tín hiệu cho biết phương pháp huấn luyện hoặc tập dữ liệu mới nào là hứa hẹn hay không, thông qua việc xem xét hiệu suất có nằm trong phạm vi mong đợi hay không (kiểm thử không hồi quy) và cách các mô hình được xếp hạng nói chung (với các bài đánh giá đủ ổn định). Chúng ta cũng có thể hy vọng rằng việc kết hợp đủ các điểm dữ liệu trên các chủ đề và nhiệm vụ khác nhau sẽ cung cấp cho chúng ta đủ tín hiệu để có cái nhìn tổng quan về hiệu suất mô hình, mà không cần đưa ra giả định nào về các khả năng "tổng quát" hơn.

Trái ngược với những lời đồn thổi, chúng ta thực sự không thể đánh giá các "khả năng tổng quát của mô hình" vào lúc này, trước hết và quan trọng nhất là vì chúng ta chưa định nghĩa được điều đó nghĩa là gì. Tuy nhiên, đánh giá LLM, với tư cách là một lĩnh vực nghiên cứu, vẫn đang ở giai đoạn sơ khai vào lúc này, và còn rất nhiều việc phải làm, điều đó thực sự rất thú vị! Cảm hứng có thể được lấy từ nhiều lĩnh vực, từ tính khả giải thích của học máy (machine learning [interpretability](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html)) cho đến xã hội học, nhằm định nghĩa các thước đo và nhiệm vụ mới. Các nghiên cứu liên ngành có khả năng sẽ mở ra những hướng đi mới cực kỳ thú vị cho lĩnh vực này!

## Lời cảm ơn
Xin gửi lời cảm ơn sâu sắc tới tất cả những người bạn tuyệt vời đã quan tâm thảo luận về chủ đề đánh giá tại hội nghị, bao gồm nhưng không giới hạn ở Summer Yue (Scale AI), Moritz Hardt (Max Planck Institute), Luca Soldaini và Ian Magnusson (Allen AI), Ludwig Schmidt (Anthropic), Max Bartolo (Cohere), Maxime Labonne (Liquid AI), François Charton (Meta), Alan Cooney (UK AI Safety Institute) và Max Ryabinin (Together AI).

Cũng xin gửi lời cảm ơn chân thành đến Yacine Jernite và Irene Solaiman từ Hugging Face vì những phản hồi quý giá của họ đối với tài liệu này.

Và cuối cùng nhưng không kém phần quan trọng, cảm ơn đội ngũ đánh giá và bảng xếp hạng tại Hugging Face, đặc biệt là Nathan Habib, vì các cuộc thảo luận và những công việc mà chúng tôi đã cùng nhau thực hiện!
