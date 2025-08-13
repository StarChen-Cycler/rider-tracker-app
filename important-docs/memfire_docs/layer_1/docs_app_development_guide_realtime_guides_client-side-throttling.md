# 限制消息 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/guides/client-side-throttling/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

管理客户端限制

# 限制消息

MemFire Cloud 客户端包括限制消息的功能。

## 管理客户端限制 [*link*](#%e7%ae%a1%e7%90%86%e5%ae%a2%e6%88%b7%e7%ab%af%e9%99%90%e5%88%b6)

您可以在创建客户端时自定义客户端限制：

```
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://<project>.supabase.co'
const SUPABASE_ANON_KEY = '<your-anon-key>'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})
```

```
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
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
```

```
val supabase = createSupabaseClient(
    "https://<project>.supabase.co",
    "<your-anon-key>"
) {
    install(Realtime) {
        eventsPerSecond = 2
    }
}
```

## 默认客户端限制 [*link*](#%e9%bb%98%e8%ae%a4%e5%ae%a2%e6%88%b7%e7%ab%af%e9%99%90%e5%88%b6)

默认情况下，Supabase 客户端将消息限制为每秒 10 条消息（每 100 毫秒 1 条消息）。这是在您开始时作为安全保障提供的软限制。您很少需要发送比这更多的消息。

每个客户端都有自己的限制行为。如果实例化两个客户端，则默认情况下，每秒将向项目发送 20 条消息。

## 项目配额 [*link*](#%e9%a1%b9%e7%9b%ae%e9%85%8d%e9%a2%9d)

每条广播和状态消息都计入您的[项目配额](/docs/app/development_guide/realtime/deep-dive/quotas/)。

无意中用消息淹没实时服务是很常见的。例如，在不限制的情况下跟踪鼠标移动每秒将发送数百个事件。您很少需要这么多消息。对于人眼来说，即使每秒更新几次鼠标移动通常也足够了。

限制参数可防止这些意外洪水。

---

[*navigate\_before* 存储CDN](/docs/app/development_guide/storage/storage-cdn/)

[Postgres 更改 *navigate\_next*](/docs/app/development_guide/realtime/guides/postgres-changes/)