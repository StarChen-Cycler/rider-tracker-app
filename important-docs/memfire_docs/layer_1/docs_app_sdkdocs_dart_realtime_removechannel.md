# removeChannel() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/realtime/removechannel/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Notes

# removeChannel()

取消订阅并从Realtime客户端删除Realtime频道。

```
final status = await supabase.removeChannel(channel);
```

## Notes [*link*](#notes)

* 如果你在监听Postgres的变化，删除一个通道是保持你项目的Realtime服务以及你的数据库性能的一个好方法。Supabase会在客户端断开连接后的30秒内自动处理清理工作，但未使用的通道可能会因为更多的客户端同时订阅而导致性能下降。

## Examples [*link*](#examples)

### 删除一个通道 [*link*](#%e5%88%a0%e9%99%a4%e4%b8%80%e4%b8%aa%e9%80%9a%e9%81%93)

```
final status = await supabase.removeChannel(channel);
```

---

[*navigate\_before* on().subscribe()](/docs/app/sdkdocs/dart/realtime/subscribe/)

[removeAllChannels() *navigate\_next*](/docs/app/sdkdocs/dart/realtime/removeallchannels/)