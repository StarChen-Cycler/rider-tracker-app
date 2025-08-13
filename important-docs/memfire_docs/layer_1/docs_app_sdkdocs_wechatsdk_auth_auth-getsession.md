# getSession() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-getsession/
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

# getSession()

getSession()用于检索会话信息，返回会话，并在必要时进行刷新。这意味着如果需要，会话会被刷新后返回。
如果未检测到会话，返回的会话可能为 `空（null）`，这可能发生在用户未登录或已退出登陆的情况下。

* 这个方法用于检索当前的本地会话（即本地存储）。
* 当会话的访问令牌过期时，该方法会使用刷新令牌来获取一个新的会话。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （获取会话数据） [*link*](#%e6%a1%88%e4%be%8b1-%e8%8e%b7%e5%8f%96%e4%bc%9a%e8%af%9d%e6%95%b0%e6%8d%ae)

```
const { data, error } = await supabase.auth.getSession()
```

---

[*navigate\_before* 通过 OTP 进行验证和登录](/docs/app/sdkdocs/wechatsdk/auth/auth-verifyotp/)

[refreshSession() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-refreshsession/)