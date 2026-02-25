import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      // 指定入口文件
      entry: path.resolve(__dirname, "src/index.ts"),
      // 暴露的全局变量名（UMD模式下，在浏览器中通过 window.TrackPoint 访问）
      name: "TrackPoint",
      // 输出的文件名
      fileName: (format) => `track-point.${format}.js`,
    },
    // 如果有不需要打包进代码的外部依赖，可以在这里配置 rollupOptions.external
  },
  plugins: [
    // 自动生成 .d.ts 类型声明文件
    dts({
      insertTypesEntry: true,
    }),
  ],
});
