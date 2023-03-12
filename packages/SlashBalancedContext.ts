import {
    ProxyAlgorithmService,
    ProxyOption,
    ProxyPass,
    SlashBalancedRunOptions,
    SlashProxyStatus
} from "~/SlashBalancedOption";
import SlashUtil from "~/SlashUtil";
import ProxyAlgorithmServiceFactory from "~/ProxyAlgorithmServiceFactory";
import {Url} from "url";

export default class SlashBalancedContext {
    /**
     * 初始化
     * @param options
     */
    public static init(options: SlashBalancedRunOptions) {
        let slashProxyStatus: Map<String, SlashProxyStatus> = new Map<String, SlashProxyStatus>();
        options.proxyOptions.forEach(it => {
            it.baseUrlObj = SlashUtil.getUrlObj(it.baseUrl);
            const proxyPass: ProxyPass[] = it.proxyPass;
            proxyPass.forEach(item => {
                let key: String = item.target;
                const proxyPassUrlObj = SlashUtil.getUrlObj(key);
                slashProxyStatus.set(proxyPassUrlObj.toString(), {
                    count: 0,
                    errorCount: 0,
                    consecutiveFailureCount: 0,
                    currentConnections: 0,
                    averageTime: 0,
                    proxyPassUrlObj: proxyPassUrlObj,
                    isFusing: false
                } as SlashProxyStatus)
            })
        });
        (globalThis as any).slashProxyStatusMap = slashProxyStatus;
        (globalThis as any).slashProxyOptions = options;

    }

    //匹配路径，只会取最先匹配到的
    public static matchProxyUrl(originUrl: URL) {
        console.log(originUrl)
        const slashProxyOptions: SlashBalancedRunOptions = (globalThis as any).slashProxyOptions;
        const proxies: ProxyOption[] = slashProxyOptions.proxyOptions.filter(it => {
            const baseUrlObj: URL | undefined = it.baseUrlObj;
            if (it.enable && baseUrlObj) {
                if (baseUrlObj.protocol == originUrl.protocol && baseUrlObj.hostname == originUrl.hostname && baseUrlObj.port == originUrl.port) {
                    return it;
                }
            }

        })
        if (!proxies.length) {
            return undefined;
        }
        console.log("匹配到地址", proxies);

        return proxies[0];
    }

    /**
     * 获取最优的URL
     * @param originUrl
     * @param proxy
     */
    public static getTheBestURL(originUrl: URL, proxyOption: ProxyOption): URL | undefined {
        console.log("获取最优地址:{}", originUrl);
        if (!proxyOption.enable) {
            return undefined;
        }
        const proxyAlgorithmService: ProxyAlgorithmService = ProxyAlgorithmServiceFactory.getProxyAlgorithmService(proxyOption.algorithm);
        console.log("算法服务", proxyAlgorithmService);
        const targetUrl = proxyAlgorithmService.getTheBestURL(originUrl, proxyOption, (globalThis as any).slashProxyStatusMap);
        console.log("新目标地址:", targetUrl);
        return targetUrl;
    }

    /**
     * 自动增长一个连接
     * @param url
     */
    public static incrementCurrentConnections(url: URL | undefined) {
        console.log("开启自动增长", url)
        if (url == undefined) {
            return;
        }
        console.log((globalThis as any).slashProxyStatusMap)

        const slashProxyStatus: SlashProxyStatus = (globalThis as any).slashProxyStatusMap.get(url.toString());
        slashProxyStatus.currentConnections++;
        console.log("当前连接数:{}", slashProxyStatus.currentConnections);
    }

    /**
     * 自动减少一个连接
     * @param url
     */
    public static decrementCurrentConnections(url: URL | undefined) {
        if (url == undefined) {
            return;
        }
        console.log((globalThis as any).slashProxyStatusMap)

        const slashProxyStatus: SlashProxyStatus = (globalThis as any).slashProxyStatusMap.get(url.toString());
        console.log(slashProxyStatus)
        slashProxyStatus.currentConnections--;
        console.log("当前连接数:{}", slashProxyStatus.currentConnections);

    }

}




