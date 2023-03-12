import SlashUtil from "~/SlashUtil";
import SlashBalancedContext from "~/SlashBalancedContext"
import {ProxyOption} from "~/SlashBalancedOption";

export default class SlashXMLHttpRequest extends XMLHttpRequest {
    private eventListener: any = new Object();
    private startTime: number | undefined;
    private targetUrl: URL | undefined;
    public static config = (options: { enable: boolean }): void => {
        // if (!options.enable) {
        //     return
        // }
    };
    private readonly SlashAddEventListener: { <K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: (boolean | AddEventListenerOptions)): void; (type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void };

    constructor() {
        super();
        this.SlashAddEventListener = super.addEventListener;
        //请求开始
        this.SlashAddEventListener('loadstart', (e) => {
            this.startTime = new Date().getTime();
            SlashBalancedContext.incrementCurrentConnections(this.targetUrl)

            if (this.eventListener["loadstart"]) {
                this.eventListener['loadstart'].call(this, e);
            }
            console.log("请求[开始]")
        });
        //请求成功
        this.SlashAddEventListener('load', (e) => {
            if (this.eventListener["load"]) {
                this.eventListener['load'].call(this, e);
            }
            console.log(" 请求[成功]");
        });
        //请求结束
        this.SlashAddEventListener('loadend', (e) => {
            SlashBalancedContext.decrementCurrentConnections(this.targetUrl);
            if (this.eventListener["loadend"]) {
                this.eventListener['loadend'].call(this, e);
            }
            console.log("请求[结束]", e);
        });
        this.SlashAddEventListener('progress', (e) => {
            if (this.eventListener["progress"]) {
                this.eventListener['progress'].call(this, e);
            }
            console.log("请求[进度]", e);
        });
        //请求出错
        this.SlashAddEventListener('error', (e) => {
            if (this.eventListener["error"]) {
                this.eventListener['error'].call(this, e);
            }
            console.log("请求[出错]", e);
        });
        this.SlashAddEventListener("timeout", (e) => {
            if (this.eventListener["timeout"]) {
                this.eventListener['timeout'].call(this, e);
            }
            console.log("请求[超时]", e);
        })
        this.SlashAddEventListener('abort', (e) => {
            if (this.eventListener["abort"]) {
                this.eventListener['abort'].call(this, e);
            }
        });
        this.SlashAddEventListener("onreadystatechange", (e) => {
            console.log("onreadystatechange ", e);
        })
    }

    addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
        console.log("收到监听器请求", listener);
        this.eventListener[type] = listener;
    }

// @ts-ignore
    open(method: string, url: string | URL, async: boolean, username?: string | null | undefined, password?: string | null | undefined): void {
        //console.time("加载时间")
        let urlObj: URL = SlashUtil.getUrlObj(url);
        const proxyOption: undefined | ProxyOption = SlashBalancedContext.matchProxyUrl(urlObj);
        console.log(proxyOption);
        if (proxyOption != undefined) {
            console.log("匹配成功", proxyOption);
            let targetUrl = SlashBalancedContext.getTheBestURL(urlObj, proxyOption);

            console.log("targetUrl", targetUrl)
            if (targetUrl != undefined) {
                this.targetUrl = targetUrl;
                urlObj.host = targetUrl.host;
                urlObj.port = targetUrl.port;
                urlObj.protocol = targetUrl.protocol;
                if (targetUrl.pathname != "/") {
                    urlObj.pathname = targetUrl.pathname + urlObj.pathname;
                }
            }

        }
        console.log("最终请求", urlObj);
        //console.timeEnd("加载时间")
        super.open(method, urlObj, async, username, password);
    }


    removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | EventListenerOptions) {
        delete this.eventListener[type];
    }
}


