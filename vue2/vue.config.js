const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 代理跨域
  devServer: {
    //设置前端网站的端口
    port: 8090,
    //代理协议
    proxy: {
      '/api': //请求转发的前缀
      {
        target: 'http://localhost:3000',  //目标地址
        ws: false,                        //是否代理websocket
        changeOrigin: true,               //是否跨域
        pathRewrite: {
          '^/api': '/'                    //重写url
        }
      },
    }
  },

  transpileDependencies: true
})
