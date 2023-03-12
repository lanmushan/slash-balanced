export enum ProxyAlgorithmEnum {
    Random = 'Random',
    LeastConnections = "LeastConnections",
    WeightedRandom = "WeightedRandom"
}

export interface ProxyAlgorithmService {
    getTheBestURL(originUrl: URL, proxyOption: ProxyOption, slashProxyStatusMap: Map<String, SlashProxyStatus>): URL | undefined
}

export interface SlashProxyStatus {
    //请求次数
    count: number,
    //错误次数
    errorCount: number,
    //连续错误次数
    consecutiveFailureCount: number,
    //当前连接数
    currentConnections: number,
    //平均响应时长
    averageTime: number,
    proxyPassUrlObj: URL,
    //已经熔断
    isFusing: boolean
}

export interface ProxyOption {
    /**
     * 基础路径
     */
    baseUrlObj?: URL
    enable: boolean,
    baseUrl: string,
    algorithm: ProxyAlgorithmEnum,
    hystrix: boolean,
    maxConnections: number,
    proxyPass: ProxyPass[],
}

export interface ProxyPass {
    target: String,
    weight?: number,
}

export default interface SlashBalancedOption {
    enable: boolean,
    proxyOptions: ProxyOption[],
}

export interface SlashBalancedRunOptions extends SlashBalancedOption {
    baseUrlObj: URL
}
