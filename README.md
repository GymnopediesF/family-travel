# 家庭旅行路线推荐

一个纯静态网页：先展示所有景点，再让家人勾选想去的景点，自动推荐最合适的旅行路线。可直接部署到 GitHub Pages。

## 目录结构

```
travel/
├── index.html          页面结构（一般不用改）
├── css/style.css       样式（想调配色/字号改这里）
├── js/data.js          ★ 你要编辑的内容：景点 + 路线
├── js/app.js           逻辑（不用改）
├── images/             ★ 真实图片放这里（命名见 images/README.md）
└── README.md           本说明
```

## 你需要做的两件事

1. **改内容**：打开 `js/data.js`，按里面的注释替换成你家的真实景点和路线。
2. **放图片**：把照片放进 `images/`，命名规则见 `images/README.md`，再回到 `data.js` 填好文件名。

就这些，不用碰其它文件。

## 本地预览

直接双击 `index.html` 就能在浏览器里打开查看效果。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个仓库（例如 `family-travel`）。
2. 把这个文件夹里的所有文件上传 / 推送到仓库。
3. 进入仓库页面 → **Settings** → 左侧 **Pages**。
4. 在 **Build and deployment** 的 Source 选 **Deploy from a branch**，
   Branch 选 `main`，目录选 `/ (root)`，点 **Save**。
5. 等一两分钟，页面顶部会显示访问网址（形如
   `https://你的用户名.github.io/family-travel/`），把这个网址发给家人就能打开。

每次改完内容重新推送，网站会自动更新。
