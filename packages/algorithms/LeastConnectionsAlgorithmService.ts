import {ProxyAlgorithmService, ProxyOption, ProxyPass, SlashProxyStatus} from "~/SlashBalancedOption";
import SlashUtil from "~/SlashUtil";

export default class LeastConnectionsAlgorithmService implements ProxyAlgorithmService {
    getTheBestURL(originUrl: URL, proxyOption: ProxyOption, slashProxyStatusMap: Map<String, SlashProxyStatus>): URL | undefined {
        console.log("使用最小连接算法")
        let minCount = 9999;
        let proxyPassUrlObj:URL|undefined = undefined;
        if(proxyOption.proxyPass==undefined)
        {
            return proxyPassUrlObj;
        }
        // @ts-ignore
        for (const proxyPass: ProxyPass|undefined of proxyOption.proxyPass) {
            const slashProxyStatus: SlashProxyStatus | undefined = slashProxyStatusMap.get(SlashUtil.getUrlObj(proxyPass.target).toString());
            //没有取到记录
            if (slashProxyStatus == undefined) {
                continue;
            }
            //已经熔断,熔断后不会自动恢复
            if (slashProxyStatus.isFusing) {
                continue;
            }
            //表示没有连接，直接返回
            if (slashProxyStatus.currentConnections == 0) {
                return slashProxyStatus.proxyPassUrlObj;
            }
            //取最小连接的
            if (slashProxyStatus.currentConnections < minCount) {
                minCount = slashProxyStatus.currentConnections;
                proxyPassUrlObj = slashProxyStatus.proxyPassUrlObj;
            }
        }
        return proxyPassUrlObj;
    }
}
