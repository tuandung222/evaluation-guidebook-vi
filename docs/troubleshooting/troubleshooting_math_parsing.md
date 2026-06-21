---
sidebar_position: 2
sidebar_label: 'Khắc phục lỗi Phân tích Toán'
---

# Sử dụng LaTeX để đánh giá năng lực Toán học

Parsing LaTeX là một việc khó khăn. Đây là vấn đề lớn khi đánh giá mô hình có đầu ra ở định dạng $\LaTeX$, chẳng hạn như benchmark [MATH](https://huggingface.co/datasets/lighteval/MATH).

Benchmark này dùng $\LaTeX$ để biểu diễn các ký hiệu và phép tính toán học. Về mặt lý thuyết, việc đánh giá chỉ đơn giản là parse và so sánh ground truth với đầu ra của mô hình. Tuy nhiên, thực tế chỉ ra rằng không có cách nào parse $\LaTeX$ một cách hoàn hảo:

![](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/sympy_doc.png?raw=true)
*Trích từ tài liệu hướng dẫn của [`sympy`](https://github.com/sympy/sympy)*

lm-evaluation-harness dùng [`sympy`](https://github.com/sympy/sympy) (thư viện Python cho toán học ký hiệu) để parse LaTeX và so sánh các biểu thức.
Khi dùng `sympy` để thử parse các nhãn chuẩn (so sánh nhãn chuẩn với chính nó), chúng tôi chỉ đạt accuracy khoảng 0.94.
Tại sao vậy? Hóa ra `sympy` không thể parse một số biểu thức $\LaTeX$ hợp lệ.

Ví dụ:

```
couldn't parse one of [0,1) or [0,1), I expected one of these: ']'
[0,1)
~~^
```

```
couldn't parse one of (-\iny,-5]\cup[5,\iny) or (-\iny,-5]\cup[5,\iny), I expected something else here
(-\iny,-5]\cup[5,\iny)
~~~~~~^
```

```
couldn't parse one of -\frac{1}{{}2x} or -\frac{1}{{}2x}, I don't understand this
-\frac{1}{{}2x}
~~~~~~~~~~~^
```

### Làm thế nào để giải quyết vấn đề này?

Bạn có thể viết lại [ngữ pháp LaTeX](https://github.com/sympy/sympy/blob/master/sympy/parsing/latex/lark/grammar/latex.lark), thêm tính năng cần thiết vào code, hoặc thêm các kiểm tra thủ công để cải thiện điểm số của mô hình. Sau khi suít rơi vào rabbit hole, chúng tôi quyết định thêm các kiểm tra string comparison vào code là giải pháp đủ tốt.

![Bản vá lỗi cho LM Evaluation Harness](https://github.com/huggingface/evaluation-guidebook/blob/main/assets/lm_eval_diff.png?raw=true)
*Bản vá lỗi cho LM Evaluation Harness*

### Kết quả

Dưới đây là bảng so sánh kết quả cũ và mới của 25 mô hình đầu tiên.


<div id="xdihwljbql" style={{paddingLeft: '0px', paddingRight: '0px', paddingTop: '10px', paddingBottom: '10px', overflowX: 'auto', overflowY: 'auto', width: 'auto', height: 'auto'}}>
<table class="gt_table" data-quarto-disable-processing="false" data-quarto-bootstrap="false">
<thead>
  <tr class="gt_heading">
    <td colspan="5" class="gt_heading gt_title gt_font_normal">So sánh bộ phân tích cú pháp gốc và bộ phân tích cú pháp đã vá trên bộ thử nghiệm MATH</td>
  </tr>
<tr class="gt_col_headings gt_spanner_row">
  <th class="gt_col_heading gt_columns_bottom_border gt_left" rowspan="2" colspan="1" scope="col" id="Model">Mô hình</th>
  <th class="gt_center gt_columns_top_border gt_column_spanner_outer" rowspan="1" colspan="2" scope="colgroup" id="Score">
    <span class="gt_column_spanner">Điểm số</span>
  </th>
  <th class="gt_center gt_columns_top_border gt_column_spanner_outer" rowspan="1" colspan="2" scope="colgroup" id="Rank">
    <span class="gt_column_spanner">Thứ hạng</span>
  </th>
</tr>
<tr class="gt_col_headings">
  <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1" scope="col" id="Original">Gốc</th>
  <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1" scope="col" id="Fixed parser">Đã vá</th>
  <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1" scope="col" id="Original">Gốc</th>
  <th class="gt_col_heading gt_columns_bottom_border gt_right" rowspan="1" colspan="1" scope="col" id="Fixed parser">Đã vá</th>
</tr>
</thead>
<tbody class="gt_table_body">
  <tr>
    <td class="gt_row gt_left">rombodawg/Rombos-LLM-V2.5-Qwen-72b</td>
    <td class="gt_row gt_right">47.58</td>
    <td class="gt_row gt_right">50.68</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#000000'}} class="gt_row gt_right">1</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#000000'}} class="gt_row gt_right">1</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">MaziyarPanahi/calme-2.2-qwen2-72b</td>
    <td class="gt_row gt_right">41.16</td>
    <td class="gt_row gt_right">43.43</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#41181f'}} class="gt_row gt_right">2</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#41181f'}} class="gt_row gt_right">2</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">arcee-ai/Arcee-Nova</td>
    <td class="gt_row gt_right">40.48</td>
    <td class="gt_row gt_right">42.90</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#82303e'}} class="gt_row gt_right">3</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#82303e'}} class="gt_row gt_right">3</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">fblgit/TheBeagle-v2beta-32B-MGS</td>
    <td class="gt_row gt_right">39.43</td>
    <td class="gt_row gt_right">42.52</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#c3495e'}} class="gt_row gt_right">4</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#c3495e'}} class="gt_row gt_right">4</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">rombodawg/Rombos-LLM-V2.5-Qwen-32b</td>
    <td class="gt_row gt_right">39.12</td>
    <td class="gt_row gt_right">41.99</td>
    <td style={{color: '#000000', backgroundColor: '#ca6866'}} class="gt_row gt_right">5</td>
    <td style={{color: '#000000', backgroundColor: '#ca6866'}} class="gt_row gt_right">5</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">dnhkng/RYS-XLarge</td>
    <td class="gt_row gt_right">38.97</td>
    <td class="gt_row gt_right">41.24</td>
    <td style={{color: '#000000', backgroundColor: '#a58c5e'}} class="gt_row gt_right">6</td>
    <td style={{color: '#000000', backgroundColor: '#a58c5e'}} class="gt_row gt_right">6</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">dfurman/CalmeRys-78B-Orpo-v0.1</td>
    <td class="gt_row gt_right">37.92</td>
    <td class="gt_row gt_right">40.71</td>
    <td style={{color: '#000000', backgroundColor: '#6ec352'}} class="gt_row gt_right">8</td>
    <td style={{color: '#000000', backgroundColor: '#80b156'}} class="gt_row gt_right">7</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">MaziyarPanahi/calme-2.2-rys-78b</td>
    <td class="gt_row gt_right">37.92</td>
    <td class="gt_row gt_right">39.95</td>
    <td style={{color: '#000000', backgroundColor: '#6ec352'}} class="gt_row gt_right">8</td>
    <td style={{color: '#000000', backgroundColor: '#4cbd81'}} class="gt_row gt_right">9</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">MaziyarPanahi/calme-2.4-rys-78b</td>
    <td class="gt_row gt_right">37.69</td>
    <td class="gt_row gt_right">40.41</td>
    <td style={{color: '#000000', backgroundColor: '#4cbd81'}} class="gt_row gt_right">9</td>
    <td style={{color: '#000000', backgroundColor: '#5ece55'}} class="gt_row gt_right">8</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">MaziyarPanahi/calme-2.3-rys-78b</td>
    <td class="gt_row gt_right">36.56</td>
    <td class="gt_row gt_right">38.97</td>
    <td style={{color: '#000000', backgroundColor: '#3aacad'}} class="gt_row gt_right">10</td>
    <td style={{color: '#000000', backgroundColor: '#3aacad'}} class="gt_row gt_right">10</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">MaziyarPanahi/calme-2.1-rys-78b</td>
    <td class="gt_row gt_right">36.40</td>
    <td class="gt_row gt_right">38.90</td>
    <td style={{color: '#000000', backgroundColor: '#279cd9'}} class="gt_row gt_right">11</td>
    <td style={{color: '#000000', backgroundColor: '#279cd9'}} class="gt_row gt_right">11</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">Qwen/Qwen2.5-72B</td>
    <td class="gt_row gt_right">36.10</td>
    <td class="gt_row gt_right">38.67</td>
    <td style={{color: '#000000', backgroundColor: '#23a7e6'}} class="gt_row gt_right">12</td>
    <td style={{color: '#000000', backgroundColor: '#23a7e6'}} class="gt_row gt_right">12</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">MaziyarPanahi/calme-2.1-qwen2-72b</td>
    <td class="gt_row gt_right">36.03</td>
    <td class="gt_row gt_right">38.07</td>
    <td style={{color: '#000000', backgroundColor: '#25bce6'}} class="gt_row gt_right">13</td>
    <td style={{color: '#000000', backgroundColor: '#36d0e2'}} class="gt_row gt_right">15</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">Qwen/Qwen2-Math-72B-Instruct</td>
    <td class="gt_row gt_right">35.95</td>
    <td class="gt_row gt_right">38.14</td>
    <td style={{color: '#000000', backgroundColor: '#27d2e5'}} class="gt_row gt_right">14</td>
    <td style={{color: '#000000', backgroundColor: '#27d2e5'}} class="gt_row gt_right">14</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">dfurman/Qwen2-72B-Orpo-v0.1</td>
    <td class="gt_row gt_right">35.42</td>
    <td class="gt_row gt_right">38.14</td>
    <td style={{color: '#000000', backgroundColor: '#36d0e2'}} class="gt_row gt_right">15</td>
    <td style={{color: '#000000', backgroundColor: '#25bce6'}} class="gt_row gt_right">13</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">abacusai/Smaug-Qwen2-72B-Instruct</td>
    <td class="gt_row gt_right">35.35</td>
    <td class="gt_row gt_right">37.46</td>
    <td style={{color: '#000000', backgroundColor: '#6691d6'}} class="gt_row gt_right">16</td>
    <td style={{color: '#000000', backgroundColor: '#d73a91'}} class="gt_row gt_right">19</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">anthracite-org/magnum-v1-72b</td>
    <td class="gt_row gt_right">35.27</td>
    <td class="gt_row gt_right">37.69</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#ae33c4'}} class="gt_row gt_right">18</td>
    <td style={{color: '#000000', backgroundColor: '#7e72d0'}} class="gt_row gt_right">16</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">alpindale/magnum-72b-v1</td>
    <td class="gt_row gt_right">35.27</td>
    <td class="gt_row gt_right">37.69</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#ae33c4'}} class="gt_row gt_right">18</td>
    <td style={{color: '#000000', backgroundColor: '#7e72d0'}} class="gt_row gt_right">16</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">Qwen/Qwen2-72B-Instruct</td>
    <td class="gt_row gt_right">35.12</td>
    <td class="gt_row gt_right">37.69</td>
    <td style={{color: '#000000', backgroundColor: '#d73a91'}} class="gt_row gt_right">19</td>
    <td style={{color: '#FFFFFF', backgroundColor: '#c614be'}} class="gt_row gt_right">18</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">dnhkng/RYS-XLarge-base</td>
    <td class="gt_row gt_right">34.67</td>
    <td class="gt_row gt_right">37.16</td>
    <td style={{color: '#000000', backgroundColor: '#e3715f'}} class="gt_row gt_right">20</td>
    <td style={{color: '#000000', backgroundColor: '#e3715f'}} class="gt_row gt_right">20</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">Undi95/MG-FinalMix-72B</td>
    <td class="gt_row gt_right">33.61</td>
    <td class="gt_row gt_right">36.10</td>
    <td style={{color: '#000000', backgroundColor: '#f4c314'}} class="gt_row gt_right">22</td>
    <td style={{color: '#000000', backgroundColor: '#eea82d'}} class="gt_row gt_right">21</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">abacusai/Dracarys-72B-Instruct</td>
    <td class="gt_row gt_right">33.61</td>
    <td class="gt_row gt_right">35.65</td>
    <td style={{color: '#000000', backgroundColor: '#f4c314'}} class="gt_row gt_right">22</td>
    <td style={{color: '#000000', backgroundColor: '#eac222'}} class="gt_row gt_right">22</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">Qwen/Qwen2.5-32B</td>
    <td class="gt_row gt_right">32.85</td>
    <td class="gt_row gt_right">35.50</td>
    <td style={{color: '#000000', backgroundColor: '#d1b64b'}} class="gt_row gt_right">23</td>
    <td style={{color: '#000000', backgroundColor: '#d1b64b'}} class="gt_row gt_right">23</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">anthracite-org/magnum-v2-72b</td>
    <td class="gt_row gt_right">31.65</td>
    <td class="gt_row gt_right">34.06</td>
    <td style={{color: '#000000', backgroundColor: '#b7aa75'}} class="gt_row gt_right">24</td>
    <td style={{color: '#000000', backgroundColor: '#b7aa75'}} class="gt_row gt_right">24</td>
  </tr>
  <tr>
    <td class="gt_row gt_left">dnhkng/RYS-Huge-bnb-4bit</td>
    <td class="gt_row gt_right">31.57</td>
    <td class="gt_row gt_right">33.84</td>
    <td style={{color: '#000000', backgroundColor: '#9e9e9e'}} class="gt_row gt_right">25</td>
    <td style={{color: '#000000', backgroundColor: '#9e9e9e'}} class="gt_row gt_right">25</td>
  </tr>
</tbody>
</table>
</div>
