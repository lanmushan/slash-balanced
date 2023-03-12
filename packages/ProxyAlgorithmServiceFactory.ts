import {ProxyAlgorithmEnum, ProxyAlgorithmService} from "~/SlashBalancedOption";
import LeastConnectionsAlgorithmService from "~/algorithms/LeastConnectionsAlgorithmService";


export default class ProxyAlgorithmServiceFactory {
    /**
     * 获取算法服务
     */
    public static getProxyAlgorithmService(algorithm: ProxyAlgorithmEnum): ProxyAlgorithmService {
        if ((globalThis as any).algorithm == undefined) {
            (globalThis as any).algorithm = {};
        }
        let proxyAlgorithmService: ProxyAlgorithmService = (globalThis as any).algorithm[algorithm];
        if (proxyAlgorithmService != undefined && proxyAlgorithmService != null) {
            return proxyAlgorithmService;
        }
        switch (algorithm) {
            case ProxyAlgorithmEnum.LeastConnections: {
                proxyAlgorithmService = new LeastConnectionsAlgorithmService();
                break;
            }
            case ProxyAlgorithmEnum.Random: {

            }
            case ProxyAlgorithmEnum.WeightedRandom: {

            }
            default: {
                //默认使用最小连接数算法
                proxyAlgorithmService = new LeastConnectionsAlgorithmService();
                break;
            }
        }
        (globalThis as any).algorithm[algorithm] = proxyAlgorithmService;
        return proxyAlgorithmService;
    }
}
