# 实时概念 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/concepts/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

渠道

# 实时概念

您可以使用Supabase Realtime来构建具有协作/多人游戏功能的实时应用程序。它包括 3 个核心功能：

* [Broadcast](/docs/app/development_guide/realtime/broadcast): 向其他连接的客户端发送快速、短暂的消息。例如，您可以使用它来跟踪鼠标移动。
* [Presence](/docs/app/development_guide/realtime/presence): 在连接的客户端之间发送用户状态。您可以使用它来显示“在线”状态，当用户断开连接时，该状态会消失。
* [Postgres Changes](/docs/app/development_guide/realtime/postgres-changes): 实时接收数据库更改。

## 渠道 [*link*](#%e6%b8%a0%e9%81%93)

通道是实时的基本构建块。您可以将频道视为聊天室，类似于 Discord 或 Slack 频道，参与者可以在其中查看谁在线并发送和接收消息。

初始化 Supabase Realtime 客户端时，您可以定义一个唯一引用通道的主题。客户端可以通过通道双向发送和接收消息。

```
import { createClient } from '@supabase/supabase-js'

const client = createClient('https://<project>.supabase.co', '<your-anon-key>')

const roomOne = client.channel('room-one') // set your topic here
```

## 广播 [*link*](#%e5%b9%bf%e6%92%ad)

实时广播遵循[发布-订阅模式](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)，其中客户端根据唯一主题将消息发布到频道。例如，用户可以向主题为 room-one 的频道发送消息。

```
roomOne.send({
  type: 'broadcast',
  event: 'test',
  payload: { message: 'hello, world' },
})
```

其他客户端可以通过订阅主题为 room-1 的频道来实时接收消息。只要这些客户端订阅并连接到同一频道主题，它们就会继续接收消息。

一个示例用例是与在线游戏中的其他客户端共享用户的光标位置。

## Presence [*link*](#presence)

Presence 可用于与频道内的其他人共享个人的状态。

```
const presenceTrackStatus = await roomOne.track({
  user: 'user-1',
  online_at: new Date().toISOString(),
})
```

每个客户端都维护自己的状态，然后将其组合到该 Channel 主题的“共享状态”中。它通常用于共享状态（例如：“在线”或“非活动”）。Presence 的巧妙之处在于，如果客户端突然断开连接（例如，它们脱机），则其状态会自动从共享状态中删除。如果您曾经尝试过构建一个“我在线”功能来处理意外的断开连接，您会体会到它是多么有用。

当新客户端订阅某个频道时，它将立即在一条消息中收到该频道的最新状态，因为该状态由实时服务器保存。

## 在广播和存在之间进行选择 [*link*](#%e5%9c%a8%e5%b9%bf%e6%92%ad%e5%92%8c%e5%ad%98%e5%9c%a8%e4%b9%8b%e9%97%b4%e8%bf%9b%e8%a1%8c%e9%80%89%e6%8b%a9)

我们建议默认使用`广播`，然后在需要时使用 Presence。Presence 利用内存中无冲突复制数据类型 （CRDT） 以最终一致的方式跟踪和同步共享状态。它计算现有状态和新状态更改之间的差异，并通过广播向客户端发送必要的更新。这在计算上很繁重，因此您应该谨慎使用它。如果您使用 Presence，最好限制您的更改，以便减少发送更新的频率。

## 实时扩展 [*link*](#%e5%ae%9e%e6%97%b6%e6%89%a9%e5%b1%95)

通道提供通用网络解决方案。Supabase Realtime旨在通过“extensions”来利用这个网络原语。我们目前支持一个扩展：Postgres changes。

### Postgres 更改 [*link*](#postgres-%e6%9b%b4%e6%94%b9)

Postgres 更改扩展侦听数据库更改并将其发送到客户端。客户端需要订阅 JWT，根据数据库的[行级别安全](/docs/app/development_guide/auth/row-level-security)性指示允许他们接收哪些更改。

```
const allChanges = client
.channel('schema-db-changes')
.on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

任何有权访问使用项目的 JWT 密钥签名的有效 JWT 的人都可以侦听数据库的更改，除非表启用了[行级别安全性](/docs/app/development_guide/auth/row-level-security)并制定了策略。

客户端可以选择接收架构中的所有更改、架构中的表或表中的列值的 INSERT、UPDATE、DELETE 或 \*（所有）更改。客户端应仅侦听公共架构中的表，并且必须首先启用希望客户端侦听的表。

---

[*navigate\_before* 实时速率限制](/docs/app/development_guide/realtime/rate-limits/)

[广播 *navigate\_next*](/docs/app/development_guide/realtime/usage/broadcast/)