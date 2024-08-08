export abstract class Crypto {
    private static readonly charShift: number = 5 as const;

    /**
     * Encrypts the given string
     * @param {string} data Data to encrypt
     * @returns {string} Returns the encrypted value of string.
     */
    public static encrypt(data: string): string {
        // return data;
        return data.split('').map(char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(code + this.charShift);
        }).join('');
    }

    /**
     * Decrypts the given string
     * @param {string} data Data to decrypt
     * @returns {string} Returns the decrypted value of string.
     */
    public static decrypt(data: string): string {
        // return data
        return data.split('').map(char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(code - this.charShift);
        }).join('');
    }
}