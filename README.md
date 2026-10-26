# course · 谷放课程库

静态课程，一门课一个目录，通过 GitHub Pages 发布。

线上地址： **https://course.goodfun.studio/**

## 目录结构

```
course/                      ← 仓根 = 站点根（自定义域 course.goodfun.studio）
├── index.html               课程列表
├── CNAME                    自定义域（course.goodfun.studio）
├── .nojekyll                跳过 Jekyll（否则下划线开头的目录会被忽略）
└── <课程id>/                一门课一个文件夹，文件夹名就是网址
    ├── index.html           封面 + 目录
    ├── chNN/                章节（含 audio/<lang>/*.mp3 + timings.js）
    └── lib/                 播放引擎与样式
```

## 加一门课

1. 新建目录，名字用小写英文＋短横线（如 `quant-ml`）——**这个名字就是网址，定了以后不要改**；
2. 把课程站点文件放进去（不要放源 PDF：版权且没必要）；
3. 在根 `index.html` 的列表里加一条链接；
4. 推 `main`，Pages 自动重新发布（首次约 30 秒–2 分钟）。

## 发布设置

- Pages：`Deploy from a branch` → `main` / `(root)`
- 自定义域：`course.goodfun.studio`；DNS 在 GoDaddy 加一条 `CNAME course → goodfun-studio.github.io`
- 证书签好后勾选 **Enforce HTTPS**
