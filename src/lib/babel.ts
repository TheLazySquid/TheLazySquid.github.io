import { booksPerRow, shelfOffset, pagesPerBook, rowsPerShelf, charsPerPage, chars } from "./consts";
import PRNG from "./rng";
import { mod, stringToCodes } from "./util";

// Algorithm inspired by https://github.com/cakenggt/Library-Of-Pybel
const rng = new PRNG();

export function genGarbage(length: number) {
    let result = "";
    for(let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * chars.length);
        result += chars[index];
    }
    return result;
}

export interface Address {
    shelf: string;
    row: number;
    book: number;
    page: number;
}

export function searchStart(string: string, row?: number, book?: number, page?: number): Address {
    rng.setSeed(...stringToCodes(string));
    row ??= rng.random(rowsPerShelf);
    book ??= rng.random(booksPerRow);
    page ??= rng.random(pagesPerBook);
    rng.setSeed(row, book, page);

    let shelf = "";
    for(let i = 0; i < string.length; i++) {
        let index = chars.indexOf(string[i]);
        let rand = rng.random(chars.length);
        let newIndex = mod(index + Math.floor(rand), chars.length) + 1;
        shelf += newIndex.toString().padStart(2, "0");
    }

    return { shelf, row, book, page };
}

export function search(string: string) {
    const padded = string.padEnd(charsPerPage, " ");
    const exactAddress = searchStart(padded);
    
    // Get an address somewhere in the middle of the page
    const maxGarbage = charsPerPage - string.length;
    rng.setSeed(...stringToCodes(string));
    const garbageAmount = rng.random(maxGarbage);
    const garbage = genGarbage(garbageAmount);
    const middleAddress = searchStart(garbage + string);

    return {
        exactAddress,
        middleAddress
    }
}

export function getPage(shelf: string, row: number, book: number, page: number) {
    // This is kind of cheating to get the special book onto the first shelf
    if(shelf === "1" || shelf === "01") {
        let shelfInt = BigInt(shelf) + shelfOffset;
        shelf = shelfInt.toString();
    }

    // Add back leading zeroes in case they got dropped
    if(shelf.length % 2 !== 0) shelf = "0" + shelf;

    rng.setSeed(row, book, page);

    let result = "";
    for(let i = 0; i < shelf.length; i += 2) {
        let index = parseInt(shelf.slice(i, i + 2)) - 1;
        let rand = rng.random(chars.length);
        let newIndex = mod(index - Math.floor(rand), chars.length);
        result += chars[newIndex];
    }

    rng.setSeed(...stringToCodes(result));
    while(result.length < charsPerPage) {
        let index = Math.floor(rng.random(chars.length));
        result += chars[index];
    }

    return result;
}