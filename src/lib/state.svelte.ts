interface ViewState {
    shelf: bigint;
    row: number;
    book: number;
    page: number;
    open: boolean;
}

export let viewState = $state<ViewState>({
    shelf: 1n,
    row: 1,
    book: 1,
    page: 0,
    open: false
});