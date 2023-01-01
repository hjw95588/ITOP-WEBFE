import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import CryptoJS from 'crypto-js'
import Jsrsasign from 'jsrsasign'

// 加密
export function encryptData(data) {
    const jsonData = JSON.parse(JSON.stringify(data))
    // 加签
    const sign = signUtil.sign(JSON.stringify(data));
    const genKey = aesUtil.genKey()
    // 用服务端的公钥对key进行rsa加密  serverPublicKey
    const aesKey = rsaUtil.encrypt(genKey, serverPublicKey)
    // 对传的数据data进行aes加密
    const aesData = aesUtil.encrypt(jsonData, genKey)
    // 请求data修改为加密且转码后的data字符串
    const encryptData = {
        data: aesData,
        encryptKey: aesKey,
        sign: sign
    }
    return encryptData
}

// 解密
export function decryptData(data) {
    // aeskey解码后解密
    const key = rsaUtil.decrypt(data.encryptKey, privateKey)
    // 把数据解码后用解密后的key解密，拿到正确数据
    const serverData = aesUtil.decrypt(data.data, key);
    // 验签
    var result = signUtil.checkSign(serverData, data.sign)
    if (result === true) {
        return JSON.parse(serverData);
    }
}

// 客户端RSA加密
export function encryptClient(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 客户端RSA解密
export function decryptClient(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey)
    return encryptor.decrypt(txt)
}

/**
 * aes加密
 */
export const aesUtil = {

    // 获取key
    genKey: function (length = 16) {
        let random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let str = ''
        for (let i = 0; i < length; i++) {
            str = str + random.charAt(Math.random() * random.length)
        }
        return str
    },

    // 加密
    encrypt: function (plaintext, key) {
        if (plaintext instanceof Object) {
            plaintext = JSON.stringify(plaintext)
        }
        let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(key),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.toString()
    },

    // 解密
    decrypt: function (ciphertext, key) {
        let decrypt = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(key),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return CryptoJS.enc.Utf8.stringify(decrypt).toString()
    }
}

/**
 * rsa加密
 */
export const rsaUtil = {
    // RSA 位数 跟后端对应
    bits: 2048,
    // 当前JSEncrypted对象
    thisKeyPair: {},
    // 生成密钥对(公钥和私钥)
    genKeyPair: function (bits = rsaUtil.bits) {
        let genKeyPair = {}
        rsaUtil.thisKeyPair = new JSEncrypt({
            default_key_size: bits
        })
        // 获取私钥
        // genKeyPair.privateKey = rsaUtil.thisKeyPair.getPrivateKey()
        genKeyPair.privateKey = privateKey;
        // 获取公钥
        // genKeyPair.publicKey = rsaUtil.thisKeyPair.getPublicKey()
        genKeyPair.publicKey = publicKey;
        return genKeyPair
    },

    // 公钥加密
    encrypt: function (plaintext, publicKey) {
        const encryptor = new JSEncrypt()
        encryptor.setPublicKey(publicKey)
        return encryptor.encrypt(plaintext)
    },

    // 私钥解密
    decrypt: function (ciphertext, privateKey) {
        const encryptor = new JSEncrypt()
        encryptor.setPrivateKey(privateKey)
        return encryptor.decrypt(ciphertext)
    }
}

/**
 * 签名
 */
export const signUtil = {
    // 加签 用私钥对signData进行签名
    sign(signData) {
        // 创建RSAKey对象
        var rsa = new Jsrsasign.RSAKey();
        // 后端是pck#8密钥对，使用KEYUTIL.getKey来解析密钥 将密钥转码
        rsa = new Jsrsasign.KEYUTIL.getKey(privateKey);
        // 创建Signature对象，设置签名编码算法
        var sig = new Jsrsasign.KJUR.crypto.Signature({ alg: "SHA256withRSA" });
        // 初始化
        sig.init(rsa)
        // 传入待加密字符串
        sig.updateString(signData)
        // 生成密文
        var sign = Jsrsasign.hextob64(sig.sign());
        return sign;
    },

    // 验签 用服务端公钥对签名进行验签
    checkSign(signData, sign) {
        // signData: 加签的数据
        // sign: 加签之后得到的签文
        try {
            let sig = new Jsrsasign.KJUR.crypto.Signature({ alg: "SHA256withRSA", prvkeypem: serverPublicKey });
            sig.updateString(signData);
            let result = sig.verify(Jsrsasign.b64tohex(sign));
            return result;
        } catch (e) {
            console.error(e);
        }
    }
}

/**
 * RSA秘钥
 */
// 客户端公钥
export const publicKey = '-----BEGIN PUBLIC KEY-----' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCq+UJi6rUz1SzBD/Oq5/+Z1aan' +
    'LSfWgOA6oYMomoAhbzAPa5i6hmlGMVJUjJazNudQeV5RJiZwPDNcRwtkSyEPv9QP' +
    'jC54zYNe7NW32/InIWjKfC9OfNz1LRUhXfTWjKYfS0aBPniyEwVIB2vbjYU/7DPx' +
    'hK1txQT/Lc04UYlbmwIDAQAB' +
    '-----END PUBLIC KEY-----'
// 客户端私钥
export const privateKey = '-----BEGIN PRIVATE KEY-----' +
    'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKr5QmLqtTPVLMEP' +
    '86rn/5nVpqctJ9aA4DqhgyiagCFvMA9rmLqGaUYxUlSMlrM251B5XlEmJnA8M1xH' +
    'C2RLIQ+/1A+MLnjNg17s1bfb8ichaMp8L0583PUtFSFd9NaMph9LRoE+eLITBUgH' +
    'a9uNhT/sM/GErW3FBP8tzThRiVubAgMBAAECgYBQZ1AU/JOigIm/cSUCJoBJc/Qf' +
    'gljNw2WvrOzlV2MSVhuf5NW6QiOX4vH42PS16wf1DF6SgwJonab5ql9tFvfAjtbl' +
    'GnemAGJVG4NsWZAxRkL+ZEsWcYmX1vGOOrzG5pBY30QMGOhuS0aY0P5Q4EHW2i4J' +
    'lICckjTnzwQbOWdAYQJBAOOz2ZcX0E/wm/J+auPkGo7WCyv7eNkVIZSjvxJPK1og' +
    'aVoH0mFYP4QimX+xWfk+8IZTK9rAPAMXyLa90CyJ5A8CQQDAOKG6gZsqvXoRB4c0' +
    'WqSOrwQ6bX2e/u+IjLfylCU9KR3oO7K1wCJjYuWe9cwue75esakrMABUCecOu9ww' +
    'AhO1AkBwRo9E9EYQFMkggfs80Y3S3nH1xvKov8WmIDOn2Ie80fyAmxi+TSBMjC76' +
    'Cr4dq044PayDGYS91a1vhhquy3M7AkA+7kuElAoI5B+ik6RgL4zQadwohNArzar+' +
    'OZO/h2DptRxle6X2ewDHKQmkETTXwwuAVQndacmxucw7tqVP0l5BAkEAiMh+r4WS' +
    'aLRfjwxw3em6wCEto6T2y1XF5aMwbieG9UOQyFEizbch4I+ZzYVi6NWrzjcQ2M3R' +
    'fJfRULsZLXF5tQ==' +
    '-----END PRIVATE KEY-----'
// 服务端公钥
export const serverPublicKey = '-----BEGIN PUBLIC KEY-----' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDvjfXaC1FjoerYNxlZbpX2w8Ar' +
    'vo7BxF9W81CyoMqkZS2NUwF0TN5l0aTdQizTMGxaPcNLET/z8RziaPg0ZBjjeTnE' +
    'N7ygNIxbjC/Y2SfGnWSPTS/ATsHc/xjGDts1Y7WN0/x56qN8N9DFhHVQYTJOlZwE' +
    'RJN7pRKPvIueR9U3jwIDAQAB' +
    '-----END PUBLIC KEY-----'