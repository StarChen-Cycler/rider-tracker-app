# 实时架构 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/deep-dive/architecture/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Elixir & Phoenix

# 实时架构

Realtime 是一个全球分布的 Elixir 集群。客户端可以通过 WebSocket 连接到集群中的任何节点，并向连接到集群的任何其他客户端发送消息。

Realtime 是用 [Elixir](https://elixir-lang.org/) 编写的，Elixir 编译为 [Erlang](https://www.erlang.org/)，并利用了 [Phoenix Framework](https://www.phoenixframework.org/) 提供的许多开箱即用的工具。

## Elixir & Phoenix [*link*](#elixir--phoenix)

Phoenix 速度很快，能够处理数百万个并发连接。

Phoenix 可以处理许多并发连接，因为 Elixir 提供了轻量级进程（而不是操作系统进程）来使用。

面向客户端的 WebSocket 服务器需要处理许多并发连接。Elixir & Phoenix让Supabase Realtime集群可以轻松做到这一点。

## 渠道 [*link*](#%e6%b8%a0%e9%81%93)

频道是使用 [Phoenix Channels](https://hexdocs.pm/phoenix/channels.html) 实现的，Phoenix Channels 将 [Phoenix.PubSub](https://hexdocs.pm/phoenix_pubsub/Phoenix.PubSub.html) 与默认的 Phoenix.PubSub.PG2 适配器结合使用。

PG2 适配器利用 Erlang [process groups](https://www.erlang.org/docs/18/man/pg2.html)来实现 PubSub 模型，在该模型中，发布者可以向多个订阅者发送消息。

## 全局集群 [*link*](#%e5%85%a8%e5%b1%80%e9%9b%86%e7%be%a4)

Presence 是由 CRDT 支持的内存中键值存储。当用户连接到集群时，该用户的状态将发送到所有连接的实时节点。

广播允许您从任何连接的客户端向频道发送消息。连接到同一通道的任何其他客户端都将收到该消息。

这在全球范围内都有效。连接到美国实时节点的客户端可以向连接到新加坡节点的另一个客户端发送消息。只需将两个客户端连接到同一个实时频道，它们就会收到相同的消息。

广播对于非常快速地将消息发送给同一位置的用户非常有用。如果一组客户端连接到新加坡的某个节点，则消息只需转到新加坡的该实时节点并返回。如果用户靠近实时节点，他们将在 ping 集群所需的时间内收到广播消息。

多亏了Realtime集群，您（一个了不起的Supabase用户）不必考虑您的客户连接到哪些区域。

如果您使用的是广播、状态或流式处理数据库更改，则消息将始终通过尽可能短的路径到达您的用户。

## 连接到数据库 [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0%e6%95%b0%e6%8d%ae%e5%ba%93)

Realtime 允许您监听 Postgres 数据库中的更改。当新客户端连接到实时并初始化postgres\_changes实时扩展时，群集将连接到 Postgres 数据库，并开始从复制槽流式传输更改。

Realtime 知道您的数据库所在的区域，并从尽可能最近的区域连接到该区域。

每个实时区域至少有两个节点，因此如果一个节点脱机，另一个节点应重新连接并再次开始流式传输更改。

## 流式传输预写日志 [*link*](#%e6%b5%81%e5%bc%8f%e4%bc%a0%e8%be%93%e9%a2%84%e5%86%99%e6%97%a5%e5%bf%97)

连接到数据库时获取 Postgres 逻辑复制槽。

Realtime 通过轮询复制槽并将通道订阅 ID 追加到每个 wal 记录来传递更改。

订阅 ID 是表示群集上基础套接字的 Erlang 进程。这些 ID 是全局唯一的，Erlang 虚拟机会自动路由到进程的消息。

在收到轮询查询的结果后，并附加订阅 ID，Realtime 会将记录传送到这些客户端。

---

[*navigate\_before* 订阅数据库更改](/docs/app/development_guide/realtime/guides/subscribing-to-database-changes/)

[自带数据库 *navigate\_next*](/docs/app/development_guide/realtime/deep-dive/bring-your-own-database/)