// packages/core/vite.config.ts 简化版（移除 dts 插件）
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts'; // 可选：自动生成 TS 类型声明文件（推荐 TS 库安装）

const entry = resolve(__dirname, 'src/index.ts');

export default defineConfig({
  build: {
    lib: {
      entry,
      fileName: 'core',
      formats: ['cjs', 'es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      external: ['@ts-monorepo/utils'], // core 子包保留，utils 子包可删除
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    // 可选插件：自动生成 TS 类型声明文件（.d.ts），TS 库必备（需先安装：pnpm add vite-plugin-dts -D --filter 子包名）
    dts({
      entryRoot: 'src', // 类型声明入口目录
      outDir: 'dist', // 类型声明输出到 dist 目录，与产物同目录
    }),
  ],
});
