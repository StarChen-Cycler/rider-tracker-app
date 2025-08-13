# removeChannel() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/realtime/removechannel/
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

# removeChannel()

removeChannel()用于取消订阅并从实时（realtime）客户端移除实时（realtime）频道。

移除频道是维护项目的实时服务性能以及在监听Postgres更改时维护数据库性能的好方法。
在客户端断开连接后，MemFire Cloud会自动在30秒后进行清理，但是未使用的频道可能会导致性能下降，特别是当有更多客户端同时订阅时。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 [*link*](#%e6%a1%88%e4%be%8b1)

```
supabase.removeChannel(myChannel)
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 频道（channel） [必要参数] `default`

  实时（realtime）通道的名称。如果没有显式指定通道名称，系统将使用"default"作为默认值。

---

[*navigate\_before* on().subscribe()](/docs/app/sdkdocs/javascript/realtime/subscribe/)

[removeAllChannels() *navigate\_next*](/docs/app/sdkdocs/javascript/realtime/removeallchannels/)