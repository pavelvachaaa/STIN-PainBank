import hash from "../../utils/auth.util.js";

describe('hash function', () => {
    test('should hash a string using sha256 and base64 encoding', () => {
        const result = hash('hello world');
        expect(result).toEqual('uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=');
    });

    test('should hash an empty string', () => {
        const result = hash('');
        expect(result).toEqual('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
    });

    test('should hash a string containing special characters', () => {
        const result = hash('@#$%^&*()_+');
        expect(result).toEqual('swbaUfoPXtT/CF69Zw5uWbHWrlHHQf0F7Ele5P+x5TY=');
    });
});