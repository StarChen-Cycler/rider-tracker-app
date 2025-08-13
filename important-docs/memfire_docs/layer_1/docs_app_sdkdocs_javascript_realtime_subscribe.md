# on().subscribe() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/realtime/subscribe/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# on().subscribe()

on().subscribe()创建一个事件处理程序，用于监听变更。

* 默认情况下，广播（Broadcast）和在线状态（Presence）对所有项目都是启用的。
* 对于新项目，默认情况下禁用了监听数据库变更，原因是出于数据库性能和安全方面的考虑。你可以通过管理实时数据的[复制功能](/docs/app/development_guide/api/api/#managing-realtime)来启用它。
* 你可以通过将表的 `REPLICA IDENTITY` 设置为 `FULL`（例如，执行 `ALTER TABLE your_table REPLICA IDENTITY FULL`;），来接收更新和删除操作的"之前"的数据。
* 删除语句(delete statements)不适用行级安全（Row level security）。当启用行级安全并将复制标识（replica identity）设置为 full 时，只有主键会被发送到客户端。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （监听广播消息） [*link*](#%e6%a1%88%e4%be%8b1-%e7%9b%91%e5%90%ac%e5%b9%bf%e6%92%ad%e6%b6%88%e6%81%af)

```
supabase
.channel('any')
.on('broadcast', { event: 'cursor-pos' }, payload => {
  console.log('Cursor position received!', payload)
})
.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    channel.send({
      type: 'broadcast',
      event: 'cursor-pos',
      payload: { x: Math.random(), y: Math.random() },
    })
  }
})
```

### 案例2 （监听在线状态同步） [*link*](#%e6%a1%88%e4%be%8b2-%e7%9b%91%e5%90%ac%e5%9c%a8%e7%ba%bf%e7%8a%b6%e6%80%81%e5%90%8c%e6%ad%a5)

```
const channel = supabase.channel('any')
channel
.on('presence', { event: 'sync' }, () => {
  console.log('Synced presence state: ', channel.presenceState())
})
.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({ online_at: new Date().toISOString() })
  }
})
```

### 案例3 （监听用户加入状态） [*link*](#%e6%a1%88%e4%be%8b3-%e7%9b%91%e5%90%ac%e7%94%a8%e6%88%b7%e5%8a%a0%e5%85%a5%e7%8a%b6%e6%80%81)

```
const channel = supabase.channel('any')
channel
.on('presence', { event: 'join' }, ({ newPresences }) => {
  console.log('Newly joined presences: ', newPresences)
})
.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({ online_at: new Date().toISOString() })
  }
})
```

### 案例4 （监听用户离开状态） [*link*](#%e6%a1%88%e4%be%8b4-%e7%9b%91%e5%90%ac%e7%94%a8%e6%88%b7%e7%a6%bb%e5%bc%80%e7%8a%b6%e6%80%81)

```
const channel = supabase.channel('any')
channel
.on('presence', { event: 'leave' }, ({ leftPresences }) => {
  console.log('Newly left presences: ', leftPresences)
})
.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({ online_at: new Date().toISOString() })
    await channel.untrack()
  }
})
```

### 案例5 （监听所有数据库变更） [*link*](#%e6%a1%88%e4%be%8b5-%e7%9b%91%e5%90%ac%e6%89%80%e6%9c%89%e6%95%b0%e6%8d%ae%e5%ba%93%e5%8f%98%e6%9b%b4)

```
supabase
.channel('any')
.on('postgres_changes', { event: '*', schema: '*' }, payload => {
  console.log('Change received!', payload)
})
.subscribe()
```

### 案例6 （监听特定表格） [*link*](#%e6%a1%88%e4%be%8b6-%e7%9b%91%e5%90%ac%e7%89%b9%e5%ae%9a%e8%a1%a8%e6%a0%bc)

```
supabase
.channel('any')
.on('postgres_changes', { event: '*', schema: 'public', table: 'countries' }, payload => {
  console.log('Change received!', payload)
})
.subscribe()
```

### 案例7 （监听插入操作） [*link*](#%e6%a1%88%e4%be%8b7-%e7%9b%91%e5%90%ac%e6%8f%92%e5%85%a5%e6%93%8d%e4%bd%9c)

```
supabase
.channel('any')
.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, payload => {
  console.log('Change received!', payload)
})
.subscribe()
```

### 案例8 （监听更新操作） [*link*](#%e6%a1%88%e4%be%8b8-%e7%9b%91%e5%90%ac%e6%9b%b4%e6%96%b0%e6%93%8d%e4%bd%9c)

```
supabase
.channel('any')
.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {
  console.log('Change received!', payload)
})
.subscribe()
```

默认情况下，MemFire Cloud只会发送更新后的记录。如果你想要同时接收之前的值，你可以为你正在监听的表启用完整的复制（full replication）：

alter table “your\_table” replica identity full;

### 案例9 （监听删除操作） [*link*](#%e6%a1%88%e4%be%8b9-%e7%9b%91%e5%90%ac%e5%88%a0%e9%99%a4%e6%93%8d%e4%bd%9c)

```
supabase
.channel('any')
.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, payload => {
  console.log('Change received!', payload)
})
.subscribe()
```

默认情况下，MemFire Cloud不会发送已删除的记录。如果你想要接收已删除的记录，你可以为你正在监听的表启用完整的复制（full replication）：

alter table “your\_table” replica identity full;

### 案例10 （监听多个事件） [*link*](#%e6%a1%88%e4%be%8b10-%e7%9b%91%e5%90%ac%e5%a4%9a%e4%b8%aa%e4%ba%8b%e4%bb%b6)

```
supabase
.channel('any')
.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, handleRecordInserted)
.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, handleRecordDeleted)
.subscribe()
```

如果你想要监听同一张表的多个事件，你可以进行链式监听（chain listeners）。

### 案例11 （监听行级别变更） [*link*](#%e6%a1%88%e4%be%8b11-%e7%9b%91%e5%90%ac%e8%a1%8c%e7%ba%a7%e5%88%ab%e5%8f%98%e6%9b%b4)

```
supabase
.channel('any')
.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries', filter: 'id=eq.200' }, handleRecordUpdated)
.subscribe()
```

你可以使用格式 `{table}:{col}=eq.{val}` 来监听单个行，其中 `{col}` 是列名，`{val}` 是你要匹配的值。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 类型（type） [必要参数] `类型为 "broadcast" 的字符串`

  可选值为 “broadcast”、“presence” 或 “postgres\_changes”。
* #### filter [必要参数] `object类型`

  针对实时功能（realtime功能）的自定义对象，用于详细说明要接收哪些有效载荷（payloads）。

  ##### 特性

  + #### event [必要参数] `string类型`
* #### callback [必要参数] `函数类型`

  当事件处理程序被触发时要调用的函数。

---

[*navigate\_before* invoke()](/docs/app/sdkdocs/javascript/function/invoke/)

[removeChannel() *navigate\_next*](/docs/app/sdkdocs/javascript/realtime/removechannel/)