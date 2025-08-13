# 实时配额 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/deep-dive/quotas/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

按计划划分的配额

# 实时配额

我们的集群支持数百万个并发连接和消息吞吐量，适用于生产工作负载。

info

升级您的计划以增加您的配额。如果没有支出上限或企业计划，一些配额仍然存在，以保护预算。所有配额均可按项目配置。如果您需要增加配额，[请联系支持人员](/docs/contactus/)。

## 按计划划分的配额 [*link*](#%e6%8c%89%e8%ae%a1%e5%88%92%e5%88%92%e5%88%86%e7%9a%84%e9%85%8d%e9%a2%9d)

|  | Free | Pro | Pro (no spend cap) | Team | Enterprise |
| --- | --- | --- | --- | --- | --- |
| **并发客户端** | 200 | 500 | 10,000 | 10,000 | 10,000 |
| **每秒消息数** | 100 | 500 | 2,500 | 2,500 | 2,500 |
| **每秒通道加入数** | 100 | 500 | 2,500 | 2,500 | 2,500 |
| **每个客户端的通道数** | 100 | 100 | 100 | 100 | 100 |
| **每个对象的状态键** | 10 | 10 | 10 | 10 | 10 |
| **每秒状态消息数** | 20 | 50 | 1,000 | 1,000 | 1,000 |
| **广播有效负载大小 KB** | 256 | 3,000 | 3,000 | 3,000 | 3,000 |
| **Postgres 更改有效负载大小 KB ([**阅读更多**](/docs/app/development_guide/realtime/deep-dive/quotas/#postgres-changes-payload-quota))** | 1,024 | 1,024 | 1,024 | 1,024 | 1,024 |

除了免费和专业计划之外，您还可以通过[联系支持人员](/docs/contactus/)来自定义配额。

## 客户端限制 [*link*](#%e5%ae%a2%e6%88%b7%e7%ab%af%e9%99%90%e5%88%b6)

一些基本的 WebSocket 消息限制是在客户端实现的。有关更多详细信息，请参阅限制[指南](/docs/app/development_guide/realtime/guides/client-side-throttling/)。

## 配额错误 [*link*](#%e9%85%8d%e9%a2%9d%e9%94%99%e8%af%af)

超过配额时，WebSocket 连接的后端日志和客户端消息中将出现错误。

* **Websocket 错误** ：使用浏览器的开发人员工具查找 WebSocket 启动请求并查看单个消息。

info

您可以使用 [Realtime Inspector](https://realtime.supabase.com/inspector/new) 重现错误，并与 Supabase 支持人员共享这些连接详细信息。

某些配额可能会导致频道加入被拒绝。Realtime 将回复以下 WebSocket 消息之一：

### `too_many_channels` [*link*](#too_many_channels)

单个客户端当前加入的通道过多。

### `too_many_connections` [*link*](#too_many_connections)

一个项目的并发连接总数过多。

### `too_many_joins` [*link*](#too_many_joins)

每秒加入的频道数过多。

### `tenant_events` [*link*](#tenant_events)

如果您的项目每秒生成过多消息，客户端将断开连接。当消息吞吐量低于您的计划配额时，supabase-js 将自动重新连接。事件是传递到客户端或从客户端发送的 WebSocket 消息。

## 更改有效负载配额 [*link*](#%e6%9b%b4%e6%94%b9%e6%9c%89%e6%95%88%e8%b4%9f%e8%bd%bd%e9%85%8d%e9%a2%9d)

当达到此配额时，新旧记录有效负载仅包含值大小小于或等于 64 字节的字段。

---

[*navigate\_before* 实时协议](/docs/app/development_guide/realtime/deep-dive/protocol/)

[总览 *navigate\_next*](/docs/app/development_guide/ai/ai/)