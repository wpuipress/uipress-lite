import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/wp-content/plugins/uipress-lite/app/dist/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  define: {
    "process.env": {
      VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
  },
  build: {
    cleanCssAndJsChunks: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        // Specify the entry point you want to build
        builder: "src/uiBuilder.js",
        app: "src/uipApp.js",
      },
      output: {
        globals: {
          vue: "Vue",
        },
        manualChunks: {
          // Specify manual chunk configuration
          //vendor: ["vue", "vue-router"],
          // ...
        },
        // Specify the desired output file name
        // You can use [name] to dynamically insert the name of the input file
        // For example, if the input file is 'custom-entry.js', the output will be 'custom-entry.js'
        // You can also specify the output directory using the 'dir' option
        // By default, it will output to the 'dist' directory
        // The '[hash]' placeholder adds a hash to the output file name for cache-busting
        // It ensures that the file name changes when its content changes
        // This is useful for ensuring that clients always receive the latest version of the file
        // The '[format]' placeholder specifies the module format (e.g., 'es', 'cjs', 'umd', etc.)
        // You can omit this placeholder if you want to use the default module format
        // For example, 'es' for ES module format and 'cjs' for CommonJS module format

        entryFileNames: "[name].build.js",
        // Optionally specify the output directory (default is 'dist')
        dir: "dist/",
      },
    },
  },
});
