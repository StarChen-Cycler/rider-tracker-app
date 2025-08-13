# currentSession | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-currentsession/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Examples

# currentSession

如果有一个活动的会话，返回会话数据。

```
final Session? session = supabase.auth.currentSession;
```

## Examples [*link*](#examples)

### 获取会话数据 [*link*](#%e8%8e%b7%e5%8f%96%e4%bc%9a%e8%af%9d%e6%95%b0%e6%8d%ae)

```
final Session? session = supabase.auth.currentSession;
```

---

[*navigate\_before* verifyOtp()](/docs/app/sdkdocs/dart/auth/auth-verifyotp/)

[currentUser *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-currentuser/)