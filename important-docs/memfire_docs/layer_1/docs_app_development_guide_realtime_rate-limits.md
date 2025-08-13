# 实时速率限制 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/rate-limits/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

按计划限制

# 实时速率限制

MemFire Cloud Realtime是一个全球集群。我们已经实施了一些速率限制，以帮助确保所有客户的高可用性。

速率限制可按项目配置，我们的集群支持数百万的并发连接。如果这些限制造成了问题请立即通过小助手[联系我们](/docs/contactus/)。

## 按计划限制 [*link*](#%e6%8c%89%e8%ae%a1%e5%88%92%e9%99%90%e5%88%b6)

免费计划和专业计划都有相应的限制。

企业计划是按使用量计费的。我们仍然对企业计划采用限制措施。如果你使用企业计划，只需联系支持，我们将根据需要增加你的限额。

企业计划的限制从以下几点开始。

* 500个并发客户
* 每秒1,000条信息
* 500个并发的频道

## 系统限制 [*link*](#%e7%b3%bb%e7%bb%9f%e9%99%90%e5%88%b6)

以下限制适用于所有项目:

* 每秒有500个频道加入
* 每个连接的客户端有100个频道

## 客户端限制 [*link*](#%e5%ae%a2%e6%88%b7%e7%ab%af%e9%99%90%e5%88%b6)

一些基本的WebSocket消息速率限制在客户端实现。

例如，[multiplayer.dev demo](/docs/app/development_guide/realtime/quickstart/#cursor-positions)实例化了带有`eventsPerSecond`参数的Supabase客户端。

## 速率限制错误 [*link*](#%e9%80%9f%e7%8e%87%e9%99%90%e5%88%b6%e9%94%99%e8%af%af)

速率限制错误可能出现在WebSocket连接的后端日志和消息中。

info

使用[Realtime Inspector](https://realtime.supabase.com/inspector/new)来重现错误，并与Supabase支持部门分享这些连接细节。

### WebSocket错误 [*link*](#websocket%e9%94%99%e8%af%af)

* `tenant_events`。如果你的项目每秒产生太多的消息，客户将被断开连接。`supabase-js`应该在消息率降低到你的计划限制以下时自动重新连接。

一些限制会导致通道加入被拒绝。Realtime将以下列WebSocket消息之一作为答复：

* `too_many_channels`：目前有太多的频道加入到一个客户端。
* `too_many_connections`: 一个项目有太多的并发连接。
* `too_many_joins`: 每秒有太多的频道加入。

info

使用浏览器的开发工具查找WebSocket启动请求并查看单个消息。

## 有效载荷的限制 [*link*](#%e6%9c%89%e6%95%88%e8%bd%bd%e8%8d%b7%e7%9a%84%e9%99%90%e5%88%b6)

实时的信息字节大小限制为1兆字节。

## Presence的局限性 [*link*](#presence%e7%9a%84%e5%b1%80%e9%99%90%e6%80%a7)

实时Presence是一个基于Phoenix Presence的CRDT支持的内存键值存储。更新一个Presence比广播一个消息更昂贵。

以下限制适用于Presence消息：

* 每个对象有10个键
* 消息速率限制是你的实时消息速率限制的10%。

---

[*navigate\_before* Postgres CDC](/docs/app/development_guide/realtime/postgres-cdc/)

[实时概念 *navigate\_next*](/docs/app/development_guide/realtime/concepts/)