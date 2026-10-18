# proxyclean-mihomo

把 [HankNovic/ProxyClean](https://github.com/HankNovic/ProxyClean) 的免费 SOCKS5 池转换成 mihomo / Clash Verge / Clash.Meta 可直接订阅的 YAML。

- 上游每行格式为 `socks5://ip:port #国家`，其行尾注释会导致 mihomo 订阅解析 0 节点，本仓库负责剥注释、去重并生成 `proxies:` 列表
- 每小时自动刷新（cron `3 * * * *`），产物：`proxyclean.yaml`
- 订阅链接：

```
https://raw.githubusercontent.com/beichenhaoyu/proxyclean-mihomo/main/proxyclean.yaml
```

以 proxy-provider 挂载示例：

```yaml
proxy-providers:
  proxyclean:
    type: http
    url: "https://raw.githubusercontent.com/beichenhaoyu/proxyclean-mihomo/main/proxyclean.yaml"
    interval: 3600
    path: ./providers/proxyclean.yaml
    health-check: {enable: true, url: "https://www.gstatic.com/generate_204", interval: 300}
```

节点命名规则 `s5-<国家码>-<ip>`，可在策略组里用 `filter: "^s5-"` 只接管本池节点。

> 免费公共 SOCKS5 为明文中转，存在中间人、隐私与风控风险，仅用于低敏感抓取/调试，不要作为默认出口。
