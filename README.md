# 颜色便签

颜色便签是一个可以实际使用的 WhaleLife 社区插件。写下一条便签，选择薄荷绿、杏橙或淡紫并保存。再次打开时可以继续编辑。便签保存在本机，运行时无需模型、外部账号或网络。

这个公开示例由 iinukami 维护，用于实际检验 WhaleLife 社区插件从 GitHub Issue 投稿、审核收录到商店搜索的流程。[反馈问题](https://github.com/iinukami/whalelife-community-color-note/issues)

## 手动安装

1. 下载 [颜色便签 v0.1.0 安装包](https://github.com/iinukami/whalelife-community-color-note/releases/download/v0.1.0/color-note-0.1.0.zip)，正常关闭要安装它的 WhaleLife 实例。
2. 将 `color-note-0.1.0.zip` 解压到该实例的 `plugins` 目录。解压后应看到 `plugins/color-note/plugin.yaml`。
3. 启动 WhaleLife，在「插件管理」点「颜色便签」的设置或管理入口。写入内容，选择一种颜色，点击「保存便签」。

兼容信息：WhaleLife 0.1.0，插件 API 1.0.0，依赖宿主内置的 Web 服务。更新时保留 `plugins/color-note/data/note.json` 即可保留已保存的便签。

源代码采用 AGPL-3.0-only。附加条款、来源和第三方声明见同目录的许可文件。
