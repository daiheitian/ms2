const webpack = require('webpack');
const { merge } = require('webpack-merge');
// const path = require('path');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  // 开发环境本地启动的服务配置
  devServer: {
    port: 9011,
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: {
      index: '/index.html',
    },
    host: 'localhost',
    // 接口代理转发
    proxy: {
      '/ms': {
        target: 'http://127.0.0.1:8081',
        // target: 'http://218.197.176.160',
        changeOrigin: true,
        secure: false,
        // pathRewrite: { '^/mdr-api': '' },
      },
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devtool: 'eval-source-map',
  optimization: {
    moduleIds: 'named',
  },
});
