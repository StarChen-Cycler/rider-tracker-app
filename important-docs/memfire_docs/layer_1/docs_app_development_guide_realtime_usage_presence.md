# Presence | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/usage/presence/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

用法

# Presence

让我们探讨如何实现实时状态来跟踪多个用户之间的状态。

## 用法 [*link*](#%e7%94%a8%e6%b3%95)

您可以使用 Supabase 客户端库来跟踪用户之间的状态。

### 初始化客户端 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e5%ae%a2%e6%88%b7%e7%ab%af)

转到 Supabase 项目的`设置`-> `API` ，获取 `URL` 和匿名公共 `API` 密钥。

```
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://<project>.supabase.co'
const SUPABASE_KEY = '<your-anon-key>'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

```
void main() {
  Supabase.initialize(
    url: 'https://<project>.supabase.co',
    anonKey: '<your-anon-key>',
  );

  runApp(MyApp());
}

final supabase = Supabase.instance.client;
```

```
val supabaseUrl = "https://<project>.supabase.co"
val supabaseKey = "<your-anon-key>"
val supabase = createSupabaseClient(supabaseUrl, supabaseKey) {
    install(Realtime)
}
```

### 同步和跟踪状态 [*link*](#%e5%90%8c%e6%ad%a5%e5%92%8c%e8%b7%9f%e8%b8%aa%e7%8a%b6%e6%80%81)

侦听每当任何客户端加入或离开频道或更改其状态切片时触发的`sync`、`join`和`leave`事件：

```
const roomOne = supabase.channel('room_01')

roomOne
  .on('presence', { event: 'sync' }, () => {
    const newState = roomOne.presenceState()
    console.log('sync', newState)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('join', key, newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('leave', key, leftPresences)
  })
  .subscribe()
```

```
final supabase = Supabase.instance.client;

final roomOne = supabase.channel('room_01');

roomOne.onPresenceSync((_) {
  final newState = roomOne.presenceState();
  print('sync: $newState');
}).onPresenceJoin((payload) {
  print('join: $payload');
}).onPresenceLeave((payload) {
  print('leave: $payload');
}).subscribe();
```

侦听状态更改流，每当有人加入或离开时，都会发出新的 PresenceAction：

```
val roomOne = supabase.channel("room_01")
val presenceFlow: Flow<PresenceAction> = roomOne.presenceChangeFlow()
presenceFlow
    .onEach {
        println(it.joins) //You can also use it.decodeJoinsAs<YourType>()
        println(it.leaves) //You can also use it.decodeLeavesAs<YourType>()
    }
    .launchIn(yourCoroutineScope) //You can also use .collect { } here

roomOne.subscribe()
```

### 发送状态 [*link*](#%e5%8f%91%e9%80%81%e7%8a%b6%e6%80%81)

您可以使用 track（） 将状态发送给所有订阅者：

{/\* prettier-ignore \*/}

```
const roomOne = supabase.channel('room_01')

const userStatus = {
  user: 'user-1',
  online_at: new Date().toISOString(),
}

roomOne.subscribe(async (status) => {
  if (status !== 'SUBSCRIBED') { return }

  const presenceTrackStatus = await roomOne.track(userStatus)
  console.log(presenceTrackStatus)
})
```

```
final roomOne = supabase.channel('room_01');

final userStatus = {
  'user': 'user-1',
  'online_at': DateTime.now().toIso8601String(),
};

roomOne.subscribe((status, error) async {
  if (status != RealtimeSubscribeStatus.subscribed) return;

  final presenceTrackStatus = await roomOne.track(userStatus);
  print(presenceTrackStatus);
});
```

```
val roomOne = supabase.channel("room_01")

val userStatus = UserStatus( //Your custom class
    user = "user-1",
    onlineAt = Clock.System.now().toEpochMilliseconds()
)

roomOne.subscribe(blockUntilSubscribed = true) //You can also use the roomOne.status flow instead, but this parameter will block the coroutine until the status is joined.

roomOne.track(userStatus)
```

客户端将从订阅同一主题的任何其他客户端接收状态（在本例中为 `room_01`）。它还将自动触发自己的同步和联接事件处理程序。

### 停止跟踪 [*link*](#%e5%81%9c%e6%ad%a2%e8%b7%9f%e8%b8%aa)

您可以使用 untrack（） 方法停止跟踪状态。这将触发`sync`和`leave`事件处理程序。

```
const untrackPresence = async () => {
  const presenceUntrackStatus = await roomOne.untrack()
  console.log(presenceUntrackStatus)
}

untrackPresence()
```

```
final roomOne = supabase.channel('room_01');

untrackPresence() async {
  final presenceUntrackStatus = await roomOne.untrack();
  print(presenceUntrackStatus);
}

untrackPresence();
```

```
suspend fun untrackPresence() {
	roomOne.untrack()
}

untrackPresence()
```

## 状态选项 [*link*](#%e7%8a%b6%e6%80%81%e9%80%89%e9%a1%b9)

您可以在初始化 Supabase 客户端时传递配置选项。

### 状态键 [*link*](#%e7%8a%b6%e6%80%81%e9%94%ae)

默认情况下，Presence 将在服务器上生成唯一的 UUIDv1 密钥，以跟踪客户端通道的状态。如果您愿意，可以在创建通道时提供自定义密钥。此密钥在客户端中应该是唯一的。

```
import { createClient } from '@supabase/supabase-js'

const channelC = supabase.channel('test', {
  config: {
    presence: {
      key: 'userId-123',
    },
  },
})
```

```
final channelC = supabase.channel(
  'test',
  opts: const RealtimeChannelConfig(key: 'userId-123'),
);
```

```
val channelC = supabase.channel("test") {
    presence {
        key = "userId-123"
    }
}
```

---

[*navigate\_before* 广播](/docs/app/development_guide/realtime/usage/broadcast/)

[概述 *navigate\_next*](/docs/app/development_guide/storage/storage/)