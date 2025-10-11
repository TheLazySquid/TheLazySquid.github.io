import { booksPerRow, pagesPerBook, rowsPerShelf } from "./consts";
import PRNG from "./rng";
import { mod, stringToCodes } from "./util";

// Algorithm inspired by https://github.com/cakenggt/Library-Of-Pybel
const rng = new PRNG();

// 99 characters total (so there's no issues with leading 00)
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ  `1234567890-=[]\\;'./~!@#$%^&*()_+{}|:\"<>?\n,.?";
const charsPerPage = 3200;

export function searchText(string: string) {
    string = string.padEnd(charsPerPage);
    rng.setSeed(...stringToCodes(string));
    let row = rng.random(rowsPerShelf);
    let book = rng.random(booksPerRow);
    let page = rng.random(pagesPerBook);
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

export function getPage(shelf: string, row: number, book: number, page: number) {
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