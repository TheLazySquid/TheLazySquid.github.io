export function makeCorsUrl(url: string) {
    return "https://corsproxy.io/?" + encodeURIComponent(url);
}