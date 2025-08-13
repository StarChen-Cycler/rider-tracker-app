# removeAllChannels() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/realtime/removeallchannels/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# removeAllChannels()

removeAllChannels()用于取消订阅并从实时客户端移除所有实时通道。

移除频道是维护项目的实时服务性能以及在监听Postgres更改时维护数据库性能的好方法。
在客户端断开连接后，MemFire Cloud会自动在30秒后进行清理，但是未使用的频道可能会导致性能下降，特别是当有更多客户端同时订阅时。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 [*link*](#%e6%a1%88%e4%be%8b1)

```
supabase.removeAllChannels()
```

---

[*navigate\_before* removeChannel()](/docs/app/sdkdocs/javascript/realtime/removechannel/)

[getChannels() *navigate\_next*](/docs/app/sdkdocs/javascript/realtime/getchannels/)