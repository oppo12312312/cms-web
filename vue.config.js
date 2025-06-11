const path = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const resolve = (dir) => {
  return path.join(__dirname, dir);
};

const projectName = require("./config/projects");
const configObj = require("./config/project.con");

module.exports = {
  // 启用lint但设置为warning模式，不阻塞编译
  lintOnSave: process.env.NODE_ENV === "development" ? "warning" : false,
  publicPath: "./",
  outputDir: `dist/tms/`,
  pages: {
    index: {
      entry: `src/projects/tms/main.js`,
      title: configObj.title,
      template: "./public/index.html",
      filename: "index.html",
    },
  },
  configureWebpack() {
    const config = {
      // 性能优化
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },
    };

    const devPlugins = [
      /**
       * 缓存加速二次构建速度
       */
      new HardSourceWebpackPlugin(),
      new HardSourceWebpackPlugin.ExcludeModulePlugin([
        {
          test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        },
      ]),
    ];

    if (process.env.NODE_ENV === "development") {
      config.plugins = devPlugins;
    }

    return config;
  },
  chainWebpack: (config) => {
    // 简化代码分割配置，移除可能导致问题的复杂分包策略
    if (process.env.NODE_ENV === "production") {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          vendor: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
        },
      });
    }

    /* 配置svg图标自动加载 begin */
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
    /* 配置svg图标自动加载 end */

    config.plugin("define").tap((args) => {
      args[0].PROJECT = JSON.stringify(configObj);
      return args;
    });

    // 路径别名配置
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@p", resolve("public"))
      .set("_c", resolve("src/components"))
      .set("#", resolve(`src/projects/${projectName.name}`));
  },
  // sourcemap配置
  productionSourceMap: process.env.NODE_ENV === "development",
  css: {
    sourceMap: process.env.NODE_ENV === "development",
    loaderOptions: {
      scss: {
        // 优化sass编译性能
        sassOptions: {
          outputStyle: "compressed",
        },
      },
    },
  },
  devServer: {
    host: "",
    port: 3030,
    // 开发服务器性能优化
    compress: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      "^/api": {
        target: "http://117.72.103.4:8010/",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
};
