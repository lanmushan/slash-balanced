export default class SlashUtil {

    public static getUrlObj(url: String | URL):URL {
        console.log("原始", url);
        let result:URL|null = null;
        if (typeof (url) == 'string') {
            if (url.startsWith("http") || url.startsWith("https")) {
                result = new URL(url);
            } else {
                result = new URL(window.location.href + url);
            }
        } else if (url.constructor === URL) {
            result = url;
        }
        return <URL>result;
    }
}
