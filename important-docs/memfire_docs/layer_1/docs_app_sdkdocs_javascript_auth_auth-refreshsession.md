# refreshSession() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-refreshsession/
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

# refreshSession()

refreshSession()用于获取新的会话，无论会话是否已过期，都将返回一个新的会话。该方法接受一个可选的当前会话作为参数。如果未传入当前会话，那么 refreshSession() 方法将尝试从 getSession() 方法中获取当前会话。
如果当前会话的刷新令牌无效，将抛出一个错误。

* 该方法将刷新并返回一个新的会话，无论当前会话是否已过期。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （使用当前会话刷新会话） [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8%e5%bd%93%e5%89%8d%e4%bc%9a%e8%af%9d%e5%88%b7%e6%96%b0%e4%bc%9a%e8%af%9d)

```
const { data: { user, session }, error } = await supabase.auth.refreshSession()
```

### 案例2 （使用传入的会话刷新会话） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8%e4%bc%a0%e5%85%a5%e7%9a%84%e4%bc%9a%e8%af%9d%e5%88%b7%e6%96%b0%e4%bc%9a%e8%af%9d)

```
const { data: { user, session }, error } = await supabase.auth.refreshSession({ refresh_token })
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### currentSession [可选参数] `object类型`

  当前会话的信息。如果传入了这个参数，则必须包含一个刷新令牌。

  ##### 特性

  + #### 刷新令牌（refresh\_token） [必要参数] `string类型`

---

[*navigate\_before* getSession()](/docs/app/sdkdocs/javascript/auth/auth-getsession/)

[getUser() *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-getuser/)