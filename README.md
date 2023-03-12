## 插件简介

为解决特定场景中，服务器资源资源利用不充分，浏览器加载数据慢，无法使用http2的情况下，解决浏览器同源并发限制问题 注意：该方案需要服务端暴露多个域名或者多个端口  
支持随机、最小连接数、轮询等多种负载均衡算法和服务熔断（正在开发）

## 项目特点&适用场景

1. 本地情况无意义，实测互联网/局域网加载性能约提升20%~50%不等，影响因素较多，可以考虑多流量入口
2. 服务器资源利用足够，解决前端并发限制瓶颈
3. 服务器多流量入口，可直接在前端分发（不建议本方案，DNS方案更好）

## 开发进度

目前只开发了ajax部分，其他的后面开发

```shell
npm install slash-balanced
yarn add slash-balanced
```

## 源码

[github](https://github.com/lanmushan/slash-balanced)
[gitee](https://gitee.com/lanmushan/slash-balanced)

## 开发指南

```shell
npm install slash-balanced
yarn add slash-balanced
```

```typescript
//ts和js的配置方式是一样的 算法取枚举后面的名字即可LeastConnections
SlashBalanced.init({
    enable: false,
    proxyOptions: [
        {
            baseUrl: "http://host:port",
            algorithm: ProxyAlgorithmEnum.LeastConnections,
            hystrix: false,
            enable: true,
            proxyPass: [
                {
                    target: "http://host:port",
                    weight: 1
                },
                {
                    target: "http://host:port",
                    weight: 1
                }
            ]
        }
    ]
} as unknown as SlashBalancedOption)
SlashBalanced.start();
//SlashBalanced.stop();
```

## 实际测试效果

![img](https://lmscms.oss-cn-beijing.aliyuncs.com/slash-balanced.png)




