# 广播 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/usage/broadcast/
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

# 广播

让我们探讨如何实现实时广播以在客户端之间发送消息。

## 用法 [*link*](#%e7%94%a8%e6%b3%95)

您可以使用 MemFire Cloud 客户端库来发送和接收广播消息。

### 初始化客户端 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e5%ae%a2%e6%88%b7%e7%ab%af)

转到 MemFire Cloud 项目的 `设置`-> `API` ，获取 `URL` 和匿名公共 `API` 密钥。

```
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://<project>.supabase.co'
const SUPABASE_KEY = '<your-anon-key>'

const client = createClient(SUPABASE_URL, SUPABASE_KEY)
```

```
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
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

### 收听广播消息 [*link*](#%e6%94%b6%e5%90%ac%e5%b9%bf%e6%92%ad%e6%b6%88%e6%81%af)

您可以为广播频道提供回调以接收消息。在此示例中，我们将在`room-1` 中接收任何广播消息：

```
// Join a room/topic. Can be anything except for 'realtime'.
const channelA = clientA.channel('room-1')

// Simple function to log any messages we receive
function messageReceived(payload) {
    console.log(payload)
}

// Subscribe to the Channel
channelA
    .on(
    'broadcast',
    { event: 'test' },
    (payload) => messageReceived(payload)
    )
    .subscribe()
```

```
// Simple function to log any messages we receive
void messageReceived(payload) {
    print(payload);
}

// Subscribe to the Channel
channelA
    .onBroadcast(
        event: 'test', callback: (payload) => messageReceived(payload))
    .subscribe();
```

```
val channelA = clientA.channel("room-1")

//Listen for broadcast messages
val broadcastFlow: Flow<JsonObject> = channelA.broadcastFlow<JsonObject>("test")
    .onEach {
        println(it)
    }
    .launchIn(yourCoroutineScope) //you can also use .collect { } here

channelA.subscribe()
```

### 发送广播消息 [*link*](#%e5%8f%91%e9%80%81%e5%b9%bf%e6%92%ad%e6%b6%88%e6%81%af)

我们可以使用 channelB.send（） 发送 Broadcast 消息。让我们设置另一个客户端来发送消息。

```
// Join a room/topic. Can be anything except for 'realtime'.
const channelB = clientA.channel('room-1')

channelB.subscribe((status) => {
    // Wait for successful connection
    if (status !== 'SUBSCRIBED') {
    return null
    }

    // Send a message once the client is subscribed
    channelB.send({
    type: 'broadcast',
    event: 'test',
    payload: { message: 'hello, world' },
    })
})
```

```
// Join a room/topic. Can be anything except for 'realtime'.
final channelB = supabase.channel('room-1');

channelB.subscribe((status, error) {
    // Wait for successful connection
    if (status != RealtimeSubscribeStatus.subscribed) {
    return;
    }

    // Send a message once the client is subscribed
    channelB.sendBroadcastMessage(
    event: 'test',
    payload: {'message': 'hello, world'},
    );
});
```

我们可以使用 channelB.broadcast（） 发送 Broadcast 消息。让我们设置另一个客户端来发送消息。

```
val channelB = clientA.channel("room-1")

channelB.subscribe(blockUntilSubscribed = true) //You can also use the channelA.status flow instead, but this parameter will block the coroutine until the status is joined.

channelB.broadcast(
    event = "test",
    payload = YourMessage(message = "hello, world!")
)
```

在发送消息之前，我们需要确保客户端已连接，我们在 subscribe（） 回调中已经完成了这一点。

## 广播选项 [*link*](#%e5%b9%bf%e6%92%ad%e9%80%89%e9%a1%b9)

您可以在初始化 MemFire Cloud 客户端时传递配置选项。

### 自发消息 [*link*](#%e8%87%aa%e5%8f%91%e6%b6%88%e6%81%af)

默认情况下，广播消息仅发送到其他客户端。您可以通过将 Broadcast 的 self 参数设置为 true 将消息广播回发件人。

```
const myChannel = supabase.channel('room-2', {
  config: {
    broadcast: { self: true },
  },
})

myChannel.on(
  'broadcast',
  { event: 'test-my-messages' },
  (payload) => console.log(payload)
)

myChannel.subscribe((status) => {
  if (status !== 'SUBSCRIBED') { return }
  channelC.send({
    type: 'broadcast',
    event: 'test-my-messages',
    payload: { message: 'talking to myself' },
  })
})
```

```
final myChannel = supabase.channel(
  'room-2',
  opts: const RealtimeChannelConfig(
    self: true,
  ),
);

myChannel.onBroadcast(
  event: 'test-my-messages',
  callback: (payload) => print(payload),
);

myChannel.subscribe((status, error) {
  if (status != RealtimeSubscribeStatus.subscribed) return;
  // channelC.send({
  myChannel.sendBroadcastMessage(
    event: 'test-my-messages',
    payload: {'message': 'talking to myself'},
  );
});
```

默认情况下，广播消息仅发送到其他客户端。您可以通过将 Broadcast 的 receiveOwnBroadcasts 参数设置为 true 来将消息广播回发件人。

```
val myChannel = supabase.channel("room-2") {
    broadcast {
        receiveOwnBroadcasts = true
    }
}

val broadcastFlow: Flow<JsonObject> = myChannel.broadcastFlow<JsonObject>("test-my-messages")
    .onEach {
        println(it)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe(blockUntilSubscribed = true) //You can also use the myChannel.status flow instead, but this parameter will block the coroutine until the status is joined.

myChannel.broadcast(
    event = "test-my-messages",
    payload = YourMessage(
        message = "talking to myself"
    )
)
```

### 确认消息 [*link*](#%e7%a1%ae%e8%ae%a4%e6%b6%88%e6%81%af)

您可以通过将 Broadcast 的 ack config 设置为 true 来确认 Realtime 是否收到了您的消息。

```
const myChannel = clientD.channel('room-3', {
  config: {
    broadcast: { ack: true },
  },
})

myChannel.subscribe(async (status) => {
  if (status !== 'SUBSCRIBED') { return }

  const serverResponse = await myChannel.send({
    type: 'broadcast',
    event: 'acknowledge',
    payload: {},
  })

  console.log('serverResponse', serverResponse)
})
```

```
final myChannel = supabase.channel('room-3',opts: const RealtimeChannelConfig(
  ack: true,
),

);

myChannel.subscribe( (status, error) async {
  if (status != RealtimeSubscribeStatus.subscribed) return;

  final serverResponse = await myChannel.sendBroadcastMessage(

    event: 'acknowledge',
    payload: {},
  );

  print('serverResponse: $serverResponse');
});
```

默认情况下，广播消息仅发送到其他客户端。您可以通过将 Broadcast 的 acknowledgeBroadcasts 参数设置为 true 来将消息广播回发件人。

```
val myChannel = supabase.channel("room-2") {
    broadcast {
        acknowledgeBroadcasts = true
    }
}

myChannel.subscribe(blockUntilSubscribed = true) //You can also use the myChannel.status flow instead, but this parameter will block the coroutine until the status is joined.

myChannel.broadcast(event = "acknowledge", buildJsonObject {  })
```

使用它来保证服务器在解析 channelD.send 的 promise 之前已收到消息。如果在创建通道时没有将 ack config 设置为 true，则 channelD.send 返回的 promise 将立即解析。

### 使用 REST 调用发送消息 [*link*](#%e4%bd%bf%e7%94%a8-rest-%e8%b0%83%e7%94%a8%e5%8f%91%e9%80%81%e6%b6%88%e6%81%af)

您还可以通过向实时服务器发出 HTTP 请求来发送广播消息。当您想要从服务器或客户端发送消息而无需先建立 WebSocket 连接时，这很有用。

info

目前仅在 Supabase JavaScript 客户端版本 2.37.0 及更高版本中可用。

```
const channel = client.channel('test-channel')

// No need to subscribe to channel

channel
.send({
type: 'broadcast',
event: 'test',
payload: { message: 'Hi' },
})
.then((resp) => console.log(resp))

// Remember to clean up the channel

client.removeChannel(channel)
```

```
// No need to subscribe to channel

final channel = supabase.channel('test-channel');
final res = await channel.sendBroadcastMessage(
    event: "test",
    payload: {
    'message': 'Hi',
    },
);
print(res);
```

```
val myChannel = supabase.channel("room-2") {
    broadcast {
        acknowledgeBroadcasts = true
    }
}

// No need to subscribe to channel

myChannel.broadcast(event = "test", buildJsonObject {
    put("message", "Hi")
})
```

---

[*navigate\_before* 实时概念](/docs/app/development_guide/realtime/concepts/)

[Presence *navigate\_next*](/docs/app/development_guide/realtime/usage/presence/)