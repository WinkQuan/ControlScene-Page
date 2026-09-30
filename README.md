# ControlScene

ControlScene 论文的英文展示主页，采用 [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) 当前演示的学术排版风格。使用原生 HTML、CSS 和 JavaScript，可直接部署到 GitHub Pages，无构建步骤、运行时依赖或后端服务。

论文：**ControlScene: Controllable Text-to-3D Scene Generation via Structured Layout Priors**

作者：Ruyi Zhang, Zhi Zhou, Wenke Quan, Wenrui Li, Wangmeng Zuo, Xiaopeng Fan

单位：Faculty of Computing, Harbin Institute of Technology

状态：CAAI Transactions on Intelligence Technology，2026 年 8 月 31 日接收。

## 本地预览

在本仓库目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8000/>。按 Ctrl+C 停止服务。无需安装 Node.js 或 npm 包。

若要验证 GitHub Pages 子路径，在本仓库的上级目录运行同一命令，再打开 <http://127.0.0.1:8000/ControlScene-Page/>。

## 项目结构

- `index.html`：论文信息、摘要、场景案例、指标表、资源链接和 BibTeX。
- `assets/css/site.css`：响应式布局、浅色视觉样式、打印和减少动效支持。
- `assets/js/site.js`：手动场景轮播、触屏手势、Contents 菜单增强、图像弹窗、原始尺寸缩放和引用复制。
- `assets/fonts/`：本地托管的 Inter Latin 可变字体（400–800 字重）及 SIL Open Font License；来源见该目录 README。
- `assets/images/`：从论文导出的网页素材；`sources.json` 记录出处和尺寸。
- `assets/paper/controlscene-accepted-manuscript.pdf`：当前完整接收稿。
- `scripts/prepare_assets.py`：可重复运行的 PDF 素材导出脚本。
- `.nojekyll`：让 GitHub Pages 直接提供静态文件。

网页主要内容存放在 HTML 中。禁用 JavaScript 后三个场景全部展开，Contents 菜单仍可原生展开；正文、表格、原始图片及论文链接均可使用。复制引用不可用时，会选中 BibTeX 并提示手动复制。图像弹窗支持 Esc 关闭、键盘焦点恢复、适应屏幕和原始尺寸查看。

## 页面与轮播

首屏展示完整论文标题、作者、单位和期刊状态，资源按钮统一为深色。正文使用白色与浅灰分区、居中章节标题和短渐变装饰线。所有字体和页面资源均随站点托管，不依赖第三方字体 CDN。

场景轮播默认显示客房，之后为家庭活动室、婴儿房。可通过前后箭头、三个指示点、轮播区域内的左右方向键或手机横向滑动切换，首尾循环，不自动播放。切换后播报当前案例与位置，隐藏案例不会进入键盘焦点顺序。触屏纵向滚动和缩放保留，横向滑动后不会误触图片放大。

轮播由现有 HTML 中的三个 .scene-card 渐进增强生成。更新案例时，同步修改对应的提示词、图像、文章 ID 与指示点的 aria-controls、data-scene；排序以 HTML 为准。打印时三个案例全部显示。

## 素材出处

所有研究图像均来自用户提供的 ControlScene-USG 稿件，没有使用合成示意图替代实验结果。

| 页面内容 | 原始文件 | 正文图号 |
| --- | --- | --- |
| 数据集概览 | `figures/FIG1.pdf` | Figure 1 |
| 方法流程、首屏客厅全景 | `figures/FIG2.pdf` | Figure 2 |
| 自校正曲线 | `figures/FIG3.pdf` | Figure 3，左侧 |
| Prompt tuning 消融曲线 | `figures/FIG4.pdf` | Figure 3，右侧 |
| 布局自校正案例 | `figures/3-6.pdf` | Figure 4 |
| 全景自校正对比 | `figures/3-7.pdf` | Figure 5 |
| 三组场景结果 | `figures/FIG5.pdf` | Figure 6 |

首屏全景直接提取自 FIG2 的高分辨率图像对象。场景图集通过裁切渲染后的完整 FIG5 保留彩色框，提示词仅规范化连字符与排版。全景自校正图拆成上下两张后并排展示，不进行配准或图像内容修饰。图表中的数值和标注保留原样；主结果表独立复现稿件的模型比较表。

常规图片经过 WebP 压缩，完整图在用户打开时才加载。页面明确提供 15.1 MB 的接收稿链接，不在初次访问时加载 PDF。

### 重新导出

需要 Poppler 的 `pdftoppm`、`pdfimages`，以及带有 WebP 支持的 Pillow。它们仅用于开发时处理素材，网站运行不需要这些工具。

```sh
# 当前环境中 /usr/bin/python3 已有 Pillow：
/usr/bin/python3 scripts/prepare_assets.py /path/to/ControlScene-USG
```

输入目录必须包含 `main.pdf` 和上述 `figures/` 文件。脚本会更新网页图片、资源来源清单和 PDF 副本。若论文图的内部结构发生变化，需要同步检查脚本中的首屏图像编号及场景裁切坐标。

## 更新论文信息

1. 在 `index.html` 中同步修改标题、作者、期刊、接收状态、摘要与 BibTeX。
2. 正式发表后，核实并补充 DOI、卷、期、页码；目前这些未知字段均省略。
3. 修改指标时，同时更新三个指标概览和六行实验表，并与论文逐项核对。
4. 更新 Paper PDF 时同步修改下载大小。替换场景图片时同步更新图注、替代文字、尺寸和 `sources.json`。
5. 代码入口使用 <https://github.com/WinkQuan/ControlScene>。LayoutVerse-20K 入口来自该仓库 README，指向百度网盘，提取码为 `zwhq`。代码链接位于首屏；数据集链接更新时应同步首屏和数据集分区。

## GitHub Pages 部署

本次实现只准备本地网页，没有执行远程发布。

1. 将页面文件提交并推送到目标仓库。
2. 在仓库 **Settings → Pages** 中选择 **Deploy from a branch**。
3. 选择 **main** 分支和 **/ (root)**，保存后等待 Pages 部署完成。
4. 当前仓库对应的网址为 <https://winkquan.github.io/ControlScene-Page/>。

样式、脚本、图片和 PDF 均使用相对路径，可兼容仓库子路径。如果更换账号、仓库名或域名，更新 `index.html` 中 `og:url` 和 `og:image` 的绝对网址；社交预览图尺寸为 1200 × 600。

## 检查要点

最近验收（2026-09-30）：已在 Chrome 中验证 1440px、768px、390px 布局、本地 Inter 字体、轮播首尾循环/指示点/键盘/真实触屏手势、纵向滚动、图片放大及焦点恢复、引用复制与回退、原生 Contents 菜单、无 JavaScript 展开、减少动效和打印全部案例。34 个本地资源均可加载，页面无脚本错误；摘要、实验表格、引用、论文 PDF 及研究图片保持一致。

- 在 1440px、768px、390px 视口对照参考模板检查标题、字体、按钮、Contents 菜单、图集与表格。
- 检查轮播箭头、指示点、首尾循环、左右方向键、触屏滑动、图片放大互不干扰，且没有自动播放。
- 检查切换后的提示词和图片对应、隐藏案例不可聚焦，以及打印时所有案例均可见。
- 检查图片弹窗、原始尺寸查看、Esc 关闭、焦点恢复和引用复制/手动复制回退。
- 禁用 JavaScript 后检查正文、结果表与资源链接；开启“减少动态效果”后检查滚动与悬停效果。
- 检查页面资源均返回成功状态，PDF 可访问，控制台无脚本错误。
- 从 `/ControlScene-Page/` 子路径访问时重复检查相对资源路径。
- 发布前再次验证外部代码、网盘资源及提取码的可用性。

## 设计参考

视觉参考 [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) 的[当前在线演示](https://eliahuhorwitz.github.io/Academic-project-page-template/)，并保留其上游 [Nerfies](https://nerfies.github.io/) 的来源致谢。本仓库独立实现 HTML、样式与交互，使用 ControlScene 自有论文内容和素材；页脚提供参考链接。Inter 字体按随附的 SIL Open Font License 1.1 分发。
