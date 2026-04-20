# my-neuro-plugin-txt-writer

适用于 [my-neuro](https://github.com/) 生态的社区插件：**在本地创建 `.txt` 文件并写入文本**，支持可选覆盖；对系统敏感目录做了禁止写入保护。

本仓库为独立分发包，安装时请将整个 `txt-writer` 目录放到 my-neuro 的社区插件目录中（见下方「安装」）。

## 功能说明

- **工具**：`create_and_write_txt` — 按给定路径创建 UTF-8 文本文件并写入内容。
- **覆盖策略**：若文件已存在，需显式传入 `overwrite: true` 才会覆盖，避免误删。
- **扩展名校验**：仅允许以 `.txt` 结尾的路径。
- **路径安全**：禁止对常见系统敏感目录（如 `C:\Windows`、`C:\Program Files`、部分 Unix 系统目录等）进行写入。

## 安装

1. 克隆或下载本仓库。
2. 将本仓库内文件整体放入 my-neuro 的社区插件目录，并保证文件夹名为 **`txt-writer`**（与 `metadata.json` 中的 `name` 一致），例如：

   `my-neuro-main/live-2d/plugins/community/txt-writer/`

3. 目录中至少包含：

   - `metadata.json`
   - `index.js`

4. 在 my-neuro 中启用该社区插件后重启或按主程序说明刷新插件。

> **说明**：`index.js` 通过相对路径引用主程序内的 `plugin-base.js`，因此必须放在上述 `community/txt-writer` 路径下，**不建议**单独拷贝到其他任意目录后运行。

## 工具参数（`create_and_write_txt`）

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `path` | string | 是 | 目标 `.txt` 文件的完整路径（示例：`D:/notes/diary.txt`） |
| `content` | string | 否 | 要写入的文本，默认空字符串 |
| `overwrite` | boolean | 否 | 文件已存在时是否覆盖，默认 `false` |

## 使用注意

- 写入路径需为当前运行环境有权访问的目录；若遇权限错误，请以合适权限运行主程序或更换目标目录。
- 本插件仅处理 `.txt` 文件，不会写入其他扩展名。
- 请勿在仓库或 Issue 中粘贴 **API Key、Token、个人路径** 等敏感信息。

## 版本与元数据

参见仓库内 `metadata.json`（`name`、`version`、`displayName`、`description`）。

## 许可证

若上游 my-neuro 或你对本插件有单独许可证要求，请在上游仓库或本仓库补充 `LICENSE` 文件后使用。

## 致谢

插件逻辑源自 my-neuro 原 `server-tools` 能力迁移；分发方式参考社区插件惯例（如 [my-neuro-plugin-astrbook](https://github.com/A-night-owl-Rabbit/my-neuro-plugin-astrbook) 的独立仓库结构）。
