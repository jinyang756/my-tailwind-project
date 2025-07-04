module.exports = {
  // 基本路径配置，用于生产环境部署
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  
  // 输出目录
  outputDir: 'dist',
  
  // 静态资源目录
  assetsDir: 'assets',
  
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  
  // 配置 webpack-dev-server
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  
  // 配置 CSS 相关选项
  css: {
    // 是否使用 css 分离插件 ExtractTextPlugin
    extract: process.env.NODE_ENV === 'production',
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ]
      }
    }
  },
  
  // webpack 配置
  configureWebpack: {
    // 生产环境下关闭性能提示
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    }
  }
}