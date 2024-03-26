// const proxyObj={}
// proxyObj['/posts']={
//     ws:false,
//     target:'http://localhost:3000',
//     changeOrigin:true,
//     pathReWrite:{
//        '^/':'/'
//     }
// }
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}
const {
    defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    /*关闭语法检查*/
    lintOnSave: false,

    chainWebpack: config => {
        // 配置别名
        config.resolve.alias.set('@', resolve('src'))
    },

    publicPath: '/',



    devServer: {
        host: 'localhost',
        port: 1107,
        //proxy:proxyObj,
    }
})