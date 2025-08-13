# removeAllChannels() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/realtime/removeallchannels/
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

# removeAllChannels()

取消订阅并从Realtime客户端删除所有Realtime频道。

```
final statuses = await supabase.removeAllChannels();
```

## Notes [*link*](#notes)

* 如果你在监听Postgres的变化，移除通道是保持你项目的Realtime服务以及数据库性能的一个好方法。Supabase会在客户端断开连接后的30秒内自动处理清理工作，但未使用的通道可能会因为更多的客户端同时订阅而导致性能下降。

## Examples [*link*](#examples)

### 删除所有通道 [*link*](#%e5%88%a0%e9%99%a4%e6%89%80%e6%9c%89%e9%80%9a%e9%81%93)

```
final statuses = await supabase.removeAllChannels();
```

---

[*navigate\_before* removeChannel()](/docs/app/sdkdocs/dart/realtime/removechannel/)

[getChannels() *navigate\_next*](/docs/app/sdkdocs/dart/realtime/getchannels/)