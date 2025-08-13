# on().subscribe() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/realtime/subscribe/
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

订阅你的数据库中的实时变化。

```
supabase.channel('*').on(
  RealtimeListenTypes.postgresChanges,
  ChannelFilter(event: '*', schema: '*'),
  (payload, [ref]) {
    print('Change received: ${payload.toString()}');
  },
).subscribe();
```

## Notes [*link*](#notes)

* 为了提高数据库性能和安全性，新项目的实时性默认是禁用的。你可以通过[管理复制](/docs/app/development_guide/api/api/#managing-realtime)打开它。
* 如果你想在更新和删除时接收 “以前的"数据，你需要将`REPLICA IDENTITY`设置为`FULL`，像这样。`ALTER TABLE your_table REPLICA IDENTITY FULL;`。

## Examples [*link*](#examples)

### 监听所有的数据库变化 [*link*](#%e7%9b%91%e5%90%ac%e6%89%80%e6%9c%89%e7%9a%84%e6%95%b0%e6%8d%ae%e5%ba%93%e5%8f%98%e5%8c%96)

```
supabase.channel('*').on(
  RealtimeListenTypes.postgresChanges,
  ChannelFilter(event: '*', schema: '*'),
  (payload, [ref]) {
    print('Change received: ${payload.toString()}');
  },
).subscribe();
```

### 监听一个特定的表 [*link*](#%e7%9b%91%e5%90%ac%e4%b8%80%e4%b8%aa%e7%89%b9%e5%ae%9a%e7%9a%84%e8%a1%a8)

```
supabase.channel('public:countries').on(
  RealtimeListenTypes.postgresChanges,
  ChannelFilter(event: '*', schema: 'public', table: 'countries'),
  (payload, [ref]) {
    print('Change received: ${payload.toString()}');
  },
).subscribe();
```

### 监听插入 [*link*](#%e7%9b%91%e5%90%ac%e6%8f%92%e5%85%a5)

```
supabase.channel('public:countries').on(
  RealtimeListenTypes.postgresChanges,
  ChannelFilter(event: 'INSERT', schema: 'public', table: 'countries'),
  (payload, [ref]) {
    print('Change received: ${payload.toString()}');
  },
).subscribe();
```

### 监听修改 [*link*](#%e7%9b%91%e5%90%ac%e4%bf%ae%e6%94%b9)

默认情况下，Supabase 将只发送更新的记录。如果你想同时接收以前的值，你可以
为你监听的表启用完全复制。

```
alter table "your_table" replica identity full;
```

```
supabase.channel('public:countries').on(
  RealtimeListenTypes.postgresChanges,
  ChannelFilter(event: 'UPDATE', schema: 'public', table: 'countries'),
  (payload, [ref]) {
    print('Change received: ${payload.toString()}');
  },
).subscribe();
```

### 监听删除 [*link*](#%e7%9b%91%e5%90%ac%e5%88%a0%e9%99%a4)

默认情况下，Supabase 不发送已删除的记录。如果你想接收删除的记录，你可以
为你所监听的表启用完全复制功能。

```
alter table "your_table" replica identity full;
```

```
supabase.channel('public:countries').on(
  RealtimeListenTypes.postgresChanges,
  ChannelFilter(event: 'DELETE', schema: 'public', table: 'countries'),
  (payload, [ref]) {
    print('Change received: ${payload.toString()}');
  },
).subscribe();
```

### 监听多个事件 [*link*](#%e7%9b%91%e5%90%ac%e5%a4%9a%e4%b8%aa%e4%ba%8b%e4%bb%b6)

如果你想监听每个表的多个事件，你可以用链式监听器。

```
supabase.channel('public:countries').on(RealtimeListenTypes.postgresChanges,
    ChannelFilter(event: 'INSERT', schema: 'public', table: 'countries'),
    (payload, [ref]) {
  print('Change received: ${payload.toString()}');
}).on(RealtimeListenTypes.postgresChanges,
    ChannelFilter(event: 'DELETE', schema: 'public', table: 'countries'),
    (payload, [ref]) {
  print('Change received: ${payload.toString()}');
}).subscribe();
```

### 监听行级变化 [*link*](#%e7%9b%91%e5%90%ac%e8%a1%8c%e7%ba%a7%e5%8f%98%e5%8c%96)

你可以使用`{table}:{col}=eq.{val}`的格式来监听单个行，其中`{col}`是列名，`{val}`是你想要匹配的值。

```
supabase.channel('public:countries:id=eq.200').on(
    RealtimeListenTypes.postgresChanges,
    ChannelFilter(
      event: 'UPDATE',
      schema: 'public',
      table: 'countries',
      filter: 'id=eq.200',
    ), (payload, [ref]) {
  print('Change received: ${payload.toString()}');
}).subscribe();
```

---

[*navigate\_before* stream()](/docs/app/sdkdocs/dart/realtime/stream/)

[removeChannel() *navigate\_next*](/docs/app/sdkdocs/dart/realtime/removechannel/)