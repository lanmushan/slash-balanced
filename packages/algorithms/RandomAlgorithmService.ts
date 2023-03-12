import {ProxyAlgorithmService, ProxyOption, SlashProxyStatus} from "~/SlashBalancedOption";

export default class RandomAlgorithmService implements ProxyAlgorithmService {
    getTheBestURL(originUrl: URL, proxyOption: ProxyOption, slashProxyStatusMap: Map<String, SlashProxyStatus>): URL | undefined {
        return undefined;
        console.log('随机算法:',slashProxyStatusMap);
    }
}
