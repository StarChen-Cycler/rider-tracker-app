# getUser() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-getuser/
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

# getUser()

getUser()用于获取用户信息，当存在有效会话时，该方法获取当前用户的详细信息。

* 与从本地会话获取信息不同，该方法从数据库中获取用户对象的信息。
* 这个方法非常有用，因为它能够验证用户的访问令牌（JWT）在服务器端是否有效，从而用于检查用户是否已被授权。
* 建议仅在需要最新的用户数据时使用此方法。对于更快的结果，推荐使用 `getSession().session.user`。这是因为 `getSession().session.user` 直接从本地会话获取数据速度较快。而 `Retrieve a user` 方法需要从数据库中获取数据会稍慢一些。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （通过当前现有的会话获取已登录的用户信息） [*link*](#%e6%a1%88%e4%be%8b1-%e9%80%9a%e8%bf%87%e5%bd%93%e5%89%8d%e7%8e%b0%e6%9c%89%e7%9a%84%e4%bc%9a%e8%af%9d%e8%8e%b7%e5%8f%96%e5%b7%b2%e7%99%bb%e5%bd%95%e7%9a%84%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af)

```
const { data: { user } } = await supabase.auth.getUser()
```

### 案例2 （使用自定义访问令牌 jwt 获取已登录的用户信息） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8%e8%87%aa%e5%ae%9a%e4%b9%89%e8%ae%bf%e9%97%ae%e4%bb%a4%e7%89%8c-jwt-%e8%8e%b7%e5%8f%96%e5%b7%b2%e7%99%bb%e5%bd%95%e7%9a%84%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af)

```
const { data: { user } } = await supabase.auth.getUser(jwt)
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### jwt [可选参数] `string类型`

  接收一个可选的访问令牌jwt。如果没有提供jwt，getUser()将试图从当前会话中获取jwt。

---

[*navigate\_before* refreshSession()](/docs/app/sdkdocs/javascript/auth/auth-refreshsession/)

[updateUser() *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-updateuser/)