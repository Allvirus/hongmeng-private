var webpack = require('webpack')
// require('fs').writeFile('./info.json', JSON.stringify(process.env), () => {})
const { env } = process
const isTestServer = env.npm_lifecycle_event === 'serve-test'
module.exports = {
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/cloud-user'
  //   : '/',
  publicPath: './',
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 9121,
    openPage: isTestServer
      ? '283823055044608'
      : '284011062624256',
    // https: false,
    // hotOnly: false,
    // proxy: null, // 设置代理
    before: app => { },
  },
  css: {
    loaderOptions: {
      stylus: {
        // @/ 是 src/ 的别名，想配的话可以alias上配
        import: '~@/assets/style/var.styl',
      },
    },
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        Quill: 'quill/dist/quill.js',
      }),
    ],
  },
}
