import CryptoJS from 'crypto-js'
/**
 * 加密（需要先加载lib/aes/aes.min.js文件）
 */
// const salt = "1a2c3Dd4EZc5DeZc6vD7f8gh9j0k-1=3!A@D5#ZD6$7%D8^9&0*-(=)_+".toString('base64')
const key = CryptoJS.enc.Utf8.parse('12345678ABCDEFG1a2c3Dd4EZc5DeZc6vD7f8gh9j0k-1=3!A@D5#ZD6$7%D8^9&0*-(=)_+') // 十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse("1234567887654321");

export const encrypt = (word) => {
    let encrypted = CryptoJS.AES.encrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString()
}
/**
 * 解密
 */
export const decrypt = (word) => {
    let decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
}