const CryptoJS= require('crypto-js')
/**
 * 加密（需要先加载lib/aes/aes.min.js文件）
 */
 const e = (word) => {
    var key = CryptoJS.enc.Utf8.parse("46cc793c53dc451b");
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
};

console.log(e('1ABCV123'));
