# setSession() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-setsession/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# setSession()

`setSession()`函数的主要目的，是用于设置当前会话的会话数据。
当用户登录或进行其他需要会话数据的操作时，可以使用`setSession()`函数来更新或设置相关的会话信息。

* 如果当前会话已过期，`setSession()`将负责刷新它以获取新的会话
* 如果当前会话中的刷新令牌或访问令牌无效，将会抛出错误

`setSession()`函数需要一个刷新令牌作为参数，然后利用这个刷新令牌来获取一个新的会话。刷新令牌是用于更新会话数据的重要凭证。

刷新令牌是单次使用的，一旦被用来获取新的会话后，就会失效。

为了保护系统免受重放攻击，所有项目默认启用[刷新令牌轮换功能](/docs/app/sdkdocs/auth/config#refresh_token_rotation_enabled)。重放攻击是指攻击者通过重复使用先前获取的令牌来模拟合法用户的行为，从而进行未经授权的操作。

为了灵活性，MemFire Cloud允许你配置`REFRESH_TOKEN_REUSE_INTERVAL`，这是一个时间窗口，在这个窗口内，相同的刷新令牌可以在并发或离线问题的情况下多次使用。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （刷新对话） [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%b7%e6%96%b0%e5%af%b9%e8%af%9d)

```
const { data, error } = supabase.auth.setSession({
  access_token,
  refresh_token
})
```

使用 refresh\_token 设置会话数据，并返回当前会话状态；若 refresh\_token 无效，则返回错误信息。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 当前会话（currentSession） [必要参数] `object类型`

  当前的会话，它至少包含一个访问令牌和刷新令牌。

  ##### 特性

  + #### 刷新令牌（refresh\_token） [必要参数] `string类型`
  + #### 访问令牌（access\_token） [必要参数] `string类型`

---

[*navigate\_before* getUser()](/docs/app/sdkdocs/wechatsdk/auth/auth-getuser/)

[onAuthStateChange() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-onauthstatechange/)