import { browser } from "$app/environment";

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