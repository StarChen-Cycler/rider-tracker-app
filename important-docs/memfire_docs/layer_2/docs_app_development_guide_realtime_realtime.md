# 实时 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/realtime
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

实时 API

# 实时

MemFire Cloud提供一个全球分布的实时服务器集群，实现了以下功能：

* [广播](/docs/app/development_guide/realtime/realtime/#broadcast)：以低延迟的方式从客户端向客户端发送短暂的信息。
* [Presence](/docs/app/development_guide/realtime/realtime/#presence)：跟踪和同步客户端之间的共享状态。
* [Postgres CDC](/docs/app/development_guide/realtime/realtime/#postgres-cdc)：听取Postgres数据库的变化，并将其发送给授权客户。

### 实时 API [*link*](#%e5%ae%9e%e6%97%b6-api)

默认情况下，数据库上的实时处于禁用状态。让我们为`todos`表打开实时。

1. 转到 应用 中的 Database 页面。
2. 单击侧边栏中的 **Replication**.
3. 通过切换**Insert**, **Update**和**Delete**来控制发送的数据库事件。
4. 通过选择**Source**并切换每个表来控制哪些表广播更改。

[

](https://xguihxuzqibwxjnimxev.supabase.co/storage/v1/object/public/videos/docs/api/api-realtime.mp4)

```
alter
publication supabase_realtime add table todos;
```

在客户端中，我们可以监听插入到 todos 表中的任何新数据：

```
// Initialize the JS client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Create a function to handle inserts
const handleInserts = (payload) => {
  console.log('Change received!', payload)
}

// Listen to inserts
supabase
  .channel('todos')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'todos' }, handleInserts)
  .subscribe()
```

```
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  // Initialize the Flutter client
  Supabase.initialize(
    url: 'https://<project>.supabase.co',
    anonKey: '<your-anon-key>',
    realtimeClientOptions: const RealtimeClientOptions(
      eventsPerSecond: 2,
    ),
  );
  runApp(const MyApp());
}

final supabase = Supabase.instance.client;

void handleInserts(payload) {
  print('Change received! $payload');
}

// Listen to inserts
supabase
    .channel('todos')
    .onPostgresChanges(
        event: PostgresChangeEvent.insert,
        schema: 'public',
        table: 'todos',
        callback: handleInserts)
    .subscribe();
```

使用 [subscribe()](/docs/app/sdkdocs/javascript/realtime/subscribe/) 侦听数据库更改。
Realtime API 通过 PostgreSQL 的[publication](/docs/app/development_guide/database/setting/replication/#publications)功能工作。Postgres 将数据库更改发送到发布
称为supabase\_realtime，通过管理此发布，您可以控制广播哪些数据。

---

[*navigate\_before* 抽奖示例](/docs/app/development_guide/functions/functionexample/raffle/)

[实时快速入门 *navigate\_next*](/docs/app/development_guide/realtime/quickstart/)