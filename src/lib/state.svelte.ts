import { browser } from "$app/environment";
import { bitsPerCharacter, booksPerRow, characterMask, characterOffset, pagesPerBook, rowsPerShelf } from "./consts";
import { stringToCodes } from "./util";

interface State {
    shelf: bigint;
    row: number;
    book: number;
    page: number;
    open: boolean;
}

const defaults: State = {
    shelf: 1n,
    row: 0,
    book: 0,
    page: 0,
    open: false
}

const initialState = loadSaved();

class ViewState {
    shelf = $state(initialState.shelf);
    row = $state(initialState.row);
    book = $state(initialState.book);
    page = $state(initialState.page);
    open = $state(initialState.open);

    save() {
        localStorage.setItem("viewState", JSON.stringify({
            shelf: this.shelf.toString(),
            row: this.row,
            book: this.book,
            page: this.page,
            open: this.open
        }));
    }

    getCompressed() {
        let codes: number[] = [];
        let shelf = this.shelf;

        // Read 15 bits a time, and convert to unicode character
        while(shelf > 0) {
            codes.push(Number(shelf & characterMask) + characterOffset);
            shelf >>= bitsPerCharacter;
        }

        // Row = 3 bits, book = 8 bits, page = 12 bits, open = 1 bit (24 total)
        const rowAndBook = ((this.row << 8) | this.book) + characterOffset;
        const pageAndOpen = ((this.page << 1) | (this.open ? 1 : 0)) + characterOffset;
        codes.push(rowAndBook, pageAndOpen);

        return String.fromCharCode(...codes);
    }
}

function loadSaved(): State {
    if(!browser) return defaults;

    const searched = decodeURIComponent(location.search);

    if(searched.includes("=")) {
        const uncompressed = readUncompressedParams(searched);
        if(uncompressed) return uncompressed;
    } else if(searched.length > 2) {
        const compressed = readCompressedParams(searched);
        if(compressed) return compressed;
    }

    const saved = localStorage.getItem("viewState");
    if(!saved) return defaults;

    try {
        let parsed = JSON.parse(saved);
        return {
            ...parsed,
            shelf: BigInt(parsed.shelf)
        }
    } catch {
        console.error("Failed to parse saved view state");
        return defaults;
    }
}

function readUncompressedParams(search: string) {
    const params = new URLSearchParams(search);
    const shelf = params.get("shelf");
    const row = params.get("row");
    const book = params.get("book");
    const page = params.get("page");
    const open = params.get("open");
    if(!shelf || !row || !book || !page || !open) return null;

    try {
        const state: State = {
            shelf: BigInt(shelf),
            row: Number(row),
            book: Number(book),
            page: Number(page),
            open: open === "true"
        };

        checkState(state);

        // Clear the URL parameters after loading
        history.replaceState(null, "", location.pathname);
        return state;
    } catch(e) {
        console.warn("Failed to parse view state from URL parameters", e);
        return null;
    }
}

function readCompressedParams(search: string) {
    try {
        const characters = search.slice(1);
        const codes = stringToCodes(characters);
    
        if(codes.length < 2) return null;

        let shelf = 0n;
        for(let i = codes.length - 3; i >= 0; i--) {
            shelf = (shelf << bitsPerCharacter) | BigInt(codes[i] - characterOffset);
        }
        
        const rowAndBook = codes[codes.length - 2] - characterOffset;
        const pageAndOpen = codes[codes.length - 1] - characterOffset;

        const state: State = {
            shelf,
            row: rowAndBook >> 8,
            book: rowAndBook & 0xFF,
            page: pageAndOpen >> 1,
            open: (pageAndOpen & 0x1) === 1
        };

        checkState(state);

        // Clear the URL parameters after loading
        history.replaceState(null, "", location.pathname);
        return state;
    } catch(e) {
        console.warn("Failed to parse view state from compressed parameters", e);
        return null;
    }
}

function checkState(state: State) {
    if(state.shelf < 1n) throw new Error("Invalid shelf number " + state.shelf);
    if(state.row < 0 || state.row >= rowsPerShelf) throw new Error("Invalid row number " + state.row);
    if(state.book < 0 || state.book >= booksPerRow) throw new Error("Invalid book number " + state.book);
    if(state.page < 0 || state.page >= pagesPerBook) throw new Error("Invalid page number " + state.page);
}

export let viewState = new ViewState();