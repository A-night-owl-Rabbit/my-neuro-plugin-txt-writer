// TXT 文件创建与写入插件（原 server-tools/create_txt_writer.server.js 迁移）

const fs = require('fs').promises;
const path = require('path');
const { Plugin } = require('../../../js/core/plugin-base.js');

const TOOL_DEFS = [
    {
        name: 'create_and_write_txt',
        description: '创建TXT文件并写入内容（支持覆盖已存在文件）',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'TXT文件完整路径（如K:/日记/202508.txt、D:/notes.txt）'
                },
                content: {
                    type: 'string',
                    description: '要写入的文本内容（可选，默认空）'
                },
                overwrite: {
                    type: 'boolean',
                    default: false,
                    description: '是否覆盖已存在的文件（true=覆盖，false=不覆盖）'
                }
            },
            required: ['path']
        }
    }
];

function wrapOpenAITools(defs) {
    return defs.map((t) => ({
        type: 'function',
        function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters
        }
    }));
}

class TxtFileCreator {
    #isValidPath(targetPath) {
        const resolved = path.resolve(targetPath);
        const forbidden = ['C:\\Windows', 'C:\\Program Files', '/usr', '/bin', '/sys'];
        return !forbidden.some((dir) => resolved.startsWith(path.resolve(dir)));
    }

    async #fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async createAndWrite(params) {
        const { path: filePath, content = '', overwrite = false } = params;

        if (!filePath) {
            return '❌ 缺少参数：需提供"path"（TXT文件路径，如K:/笔记.txt）';
        }

        const ext = path.extname(filePath).toLowerCase();
        if (ext !== '.txt') {
            return `❌ 路径错误：文件必须以.txt结尾（当前路径：${filePath}）`;
        }

        const resolvedPath = path.resolve(filePath);

        if (!this.#isValidPath(resolvedPath)) {
            return '❌ 禁止操作：目标路径为系统敏感目录';
        }

        try {
            const exists = await this.#fileExists(resolvedPath);
            if (exists && !overwrite) {
                return `❌ 创建失败：${resolvedPath} 已存在\n如需覆盖，请添加参数 "overwrite": true`;
            }

            const parentDir = path.dirname(resolvedPath);
            await fs.mkdir(parentDir, { recursive: true });

            await fs.writeFile(resolvedPath, content, 'utf8');

            return (
                `✅ TXT文件处理成功：\n路径：${resolvedPath}\n内容长度：${content.length} 字符\n操作：${exists ? '覆盖写入' : '新建并写入'}`
            );
        } catch (err) {
            if (err.code === 'EACCES' || err.code === 'EPERM') {
                return (
                    '❌ 权限不足：无法创建或写入文件\n解决方法：\n1. 以管理员身份运行程序\n2. 检查目标目录是否为只读\n3. 确保路径不包含特殊字符'
                );
            }
            if (err.code === 'ENAMETOOLONG') {
                return '❌ 路径过长：文件路径超过系统限制（请缩短路径或文件名）';
            }
            return `❌ 操作失败：${err.message}`;
        }
    }
}

class TxtWriterPlugin extends Plugin {
    constructor(metadata, context) {
        super(metadata, context);
        this._creator = new TxtFileCreator();
    }

    async onStart() {
        this.context.log('info', 'TXT 文件写入插件已启动（工具：create_and_write_txt）');
    }

    getTools() {
        return wrapOpenAITools(TOOL_DEFS);
    }

    async executeTool(name, params) {
        if (name === 'create_and_write_txt') {
            return await this._creator.createAndWrite(params);
        }
        return `未知的工具: ${name}`;
    }
}

module.exports = TxtWriterPlugin;
