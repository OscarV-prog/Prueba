/**
 * Simple fractional indexing utility for lexicographical sorting.
 * Generates a string that is lexicographically between two other strings.
 */
export function generateMidpoint(prev: string | null, next: string | null): string {
    const BASE_CHAR = 'a';
    const END_CHAR = 'z';

    const p = prev || BASE_CHAR;
    const n = next || END_CHAR;

    if (p === n) return p + BASE_CHAR;

    let midpoint = "";
    let i = 0;

    while (true) {
        const pChar = p[i] || BASE_CHAR;
        const nChar = n[i] || END_CHAR;

        if (pChar === nChar) {
            midpoint += pChar;
            i++;
            continue;
        }

        const pCode = pChar.charCodeAt(0);
        const nCode = nChar.charCodeAt(0);

        if (nCode - pCode > 1) {
            const midCode = Math.floor((pCode + nCode) / 2);
            midpoint += String.fromCharCode(midCode);
            break;
        } else {
            midpoint += pChar;
            i++;
            // If we ran out of 'next' chars, we must append something to p
            if (!n[i]) {
                midpoint += String.fromCharCode(Math.floor((pChar.charCodeAt(0) + 'z'.charCodeAt(0)) / 2));
                break;
            }
        }
    }

    return midpoint;
}
