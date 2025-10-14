export function mod(number: number, modulus: number) {
    return ((number % modulus) + modulus) % modulus;
}

export function modBigInt(number: bigint, modulus: number) {
    let bigMod = BigInt(modulus);
    return ((number % bigMod) + bigMod) % bigMod;
}

export function stringToCodes(string: string) {
    return string.split("").map(c => c.charCodeAt(0));
}

export function formatShelf(shelf: string) {
    if(shelf.length <= 6) return shelf;
    return shelf.slice(0, 3) + "..." + shelf.slice(-3);
}