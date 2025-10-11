interface ViewState {
    shelf: bigint;
    row: number | null;
    book: number | null;
    page: number;
    open: boolean;
}

export let viewState = $state<ViewState>({
    shelf: 1n,
    row: null,
    book: null,
    page: 0,
    open: false
});