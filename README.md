# ControlScene

ControlScene 论文的英文展示主页，使用原生 HTML、CSS 和 JavaScript，可直接部署到 GitHub Pages，无构建步骤、运行时依赖或后端服务。

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
- `assets/js/site.js`：图像弹窗、原始尺寸缩放、引用复制、导航定位。
- `assets/images/`：从论文导出的网页素材；`sources.json` 记录出处和尺寸。
- `assets/paper/controlscene-accepted-manuscript.pdf`：当前完整接收稿。
- `scripts/prepare_assets.py`：可重复运行的 PDF 素材导出脚本。
- `.nojekyll`：让 GitHub Pages 直接提供静态文件。

网页主要内容存放在 HTML 中。禁用 JavaScript 后仍可阅读正文、查看表格、打开原始图片和下载论文。复制引用不可用时，会选中 BibTeX 并提示手动复制。图像弹窗支持 Esc 关闭、键盘焦点恢复、适应屏幕和原始尺寸查看。

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
5. 代码入口使用 <https://github.com/SNOW-delala/ControlScene>。LayoutVerse-20K 入口来自该仓库 README，指向百度网盘，提取码为 `zwhq`。更新时应同步首屏和数据集分区的链接。

## GitHub Pages 部署

本次实现只准备本地网页，没有执行远程发布。

1. 将页面文件提交并推送到目标仓库。
2. 在仓库 **Settings → Pages** 中选择 **Deploy from a branch**。
3. 选择 **main** 分支和 **/ (root)**，保存后等待 Pages 部署完成。
4. 当前仓库对应的网址为 <https://winkquan.github.io/ControlScene-Page/>。

样式、脚本、图片和 PDF 均使用相对路径，可兼容仓库子路径。如果更换账号、仓库名或域名，更新 `index.html` 中 `og:url` 和 `og:image` 的绝对网址；社交预览图尺寸为 1200 × 600。

## 检查要点

已在 Chrome 中完成 1440px、768px、390px 视口、图片弹窗、Esc 与焦点恢复、复制成功/失败回退、禁用 JavaScript、减少动效以及仓库子路径的检查；站内资源无缺失，页面无脚本错误。

- 在 1440px、768px、390px 视口检查布局、长标题、图集与表格。
- 检查图片弹窗、原始尺寸查看、Esc 关闭、焦点恢复和引用复制/手动复制回退。
- 禁用 JavaScript 后检查正文、结果表与资源链接；开启“减少动态效果”后检查滚动与悬停效果。
- 检查页面资源均返回成功状态，PDF 可访问，控制台无脚本错误。
- 从 `/ControlScene-Page/` 子路径访问时重复检查相对资源路径。
- 发布前再次验证外部代码、网盘资源及提取码的可用性。

## 设计参考

参考 [ReinMorph3D](https://linimor.github.io/reinmorph_page/) 的分区组织和 [Nerfies](https://nerfies.github.io/) 的学术信息排版。本仓库独立实现页面样式与交互，页脚保留设计参考链接。
