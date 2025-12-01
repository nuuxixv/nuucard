
import CryptoJS from 'crypto-js';

// 랜덤 키 생성 (32 bytes = 256 bits)
export const generateKey = (): string => {
    return CryptoJS.lib.WordArray.random(32).toString();
};

// 암호화
export const encrypt = (text: string, key: string): string => {
    return CryptoJS.AES.encrypt(text, key).toString();
};

// 복호화
export const decrypt = (ciphertext: string, key: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) return ''; // 복호화 실패 시 빈 문자열 반환
        return originalText;
    } catch (e) {
        console.error('Decryption failed', e);
        return '';
    }
};
