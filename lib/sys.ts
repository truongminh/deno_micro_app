const CHARSET = {
    UPSERCASE: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ALPHABET: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    NUMBER: '0123456789'
}

function randomString(len: number, chars: string) {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    const char_len = chars.length;
    const result = [...arr].map(n => chars[n % char_len]);
    console.log(arr, result);
    return result.join('');
}

const uppercase = (l = 8) => randomString(l, CHARSET.UPSERCASE);
const alphabet = (l = 8) => randomString(l, CHARSET.ALPHABET);
const number = (l = 8) => randomString(l, CHARSET.NUMBER);

export const Rand = {
    uppercase, alphabet, number,
}
