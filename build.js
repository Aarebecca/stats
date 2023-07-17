const { build } = require('esbuild');

build({
  entryPoints: ['src/index.js'], // 你的入口文件
  outfile: 'dist/index.js', // 打包输出文件
  platform: 'node', // 设置平台为 Node.js
  bundle: true, // 合并所有模块成一个文件
}).catch(() => process.exit(1));
