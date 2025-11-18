import { browser } from "$app/environment";
import { booksPerRow, pagesPerBook, rowsPerShelf } from "./consts";

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
}

function loadSaved(): State {
    if(!browser) return defaults;

    const params = new URLSearchParams(location.search);
    const shelf = params.get("shelf");
    const row = params.get("row");
    const book = params.get("book");
    const page = params.get("page");
    const open = params.get("open");
    if(shelf && row && book && page && open) {
        try {
            const state = {
                shelf: BigInt(shelf),
                row: Number(row),
                book: Number(book),
                page: Number(page),
                open: open === "true"
            }

            if(state.shelf < 1n) throw new Error("Invalid shelf number");
            if(state.row < 0 || state.row >= rowsPerShelf) throw new Error("Invalid row number");
            if(state.book < 0 || state.book >= booksPerRow) throw new Error("Invalid book number");
            if(state.page < 0 || state.page >= pagesPerBook) throw new Error("Invalid page number");

            // Clear the URL parameters after loading
            history.replaceState(null, "", location.pathname);
            return state;
        } catch(e) {
            console.warn("Failed to parse view state from URL parameters", e);
        }
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

export let viewState = new ViewState();