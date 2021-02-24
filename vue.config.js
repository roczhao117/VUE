// const proxyObj={}
// proxyObj['/posts']={
//     ws:false,
//     target:'http://localhost:3000',
//     changeOrigin:true,
//     pathReWrite:{
//        '^/':'/'
//     }
// }

module.exports={
    devServer:{
        host:'localhost',
        port:1107,
        //proxy:proxyObj,
    }
}