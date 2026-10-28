import type { NamedAddress } from "./babel";
import { booksPerRow, pagesPerBook, rowsPerShelf } from "./consts";

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

export function parseAddresses(addresses: string): NamedAddress[] {
    const parts = addresses.split(";");
    const result: NamedAddress[] = [];

    for(const part of parts) {
        const [name, shelf, row, book, page] = part.split(",");
        const shelfNum = Number(shelf);
        const rowNum = Number(row);
        const bookNum = Number(book);
        const pageNum = Number(page);

        if(!name) continue;
        if(Number.isNaN(shelfNum) || shelfNum < 1) continue;
        if(!isRowOkay(rowNum) || !isBookOkay(bookNum) || !isPageOkay(pageNum)) continue;

        result.push({
            name,
            shelf,
            row: rowNum,
            book: bookNum,
            page: pageNum
        });
    }

    return result;
}

export function formatAddresses(addresses: NamedAddress[]): string {
    return addresses.map((address) => {
        const { name, shelf, row, book, page } = address;
        return `${name},${shelf},${row},${book},${page}`;
    }).join(";");
}

export const isNumberOkay = (num: number) => Number.isFinite(num) && !Number.isNaN(num) && num >= 0;
export const isRowOkay = (row: number) => isNumberOkay(row) && row < rowsPerShelf;
export const isBookOkay = (book: number) => isNumberOkay(book) && book < booksPerRow;
export const isPageOkay = (page: number) => isNumberOkay(page) && page < pagesPerBook;