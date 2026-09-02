# 图片放这里

图片按目的地分文件夹存放：

- 龙游景点图 → `images/longyou/`
- 衢州景点图 → `images/quzhou/`

## 命名方式

用「拼音名_序号」，每个景点 1~2 张，例如：

```
images/quzhou/
├── ShuiTingMen_1.jpg
├── ShuiTingMen_2.jpg
├── QuZhouBoWuGuan_1.jpg
└── ...
```

在 `js/data.js` 里对应景点的 `images` 字段填**相对 images/ 的路径**（带上子文件夹）：

```javascript
images: ["quzhou/ShuiTingMen_1.jpg", "quzhou/ShuiTingMen_2.jpg"]
```

## 衢州待补图片（目前用占位图）

以下景点还没有图片，页面会显示“暂无图片”。放好图后，去 `js/data.js`
对应景点把 `images: []` 改成下面的文件名即可：

| 景点 | 建议文件名 |
|------|-----------|
| 孔氏南宗家庙 | `quzhou/KongMiao_1.jpg` |
| 府山公园 | `quzhou/FuShan_1.jpg` |
| 北门街历史文化街区 | `quzhou/BeiMenJie_1.jpg` |
| 鹿鸣大草坪 | `quzhou/LuMing_1.jpg` |
| 衢州礼堂 | `quzhou/LiTang_1.jpg` |
| 斗潭茶馆 | `quzhou/DouTan_1.jpg` |
| 江郎山 | `quzhou/JiangLangShan_1.jpg` |

## 注意事项

- 文件名**区分大小写**（GitHub Pages 尤其严格），`data.js` 里要和实际文件名逐字一致。
- 支持 `.jpg` / `.png` / `.webp`。
- 图片建议压缩到单张 300KB 以内，页面加载更快。
- 想加新景点：先把图片丢进对应目的地文件夹，再去 `data.js` 对应目的地的
  `spots` 里新增景点对象，并在需要的路线 `spotIds` 里加上它的 `id`。
