export function makeCorsUrl(url: string) {
    return "https://corsproxy.io/?url=" + encodeURIComponent(url);
}