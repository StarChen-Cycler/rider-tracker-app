# signOut() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-signout/
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

# signOut()

在浏览器中，signOut() 方法将会从浏览器会话中移除已登录的用户，并让他们退出登陆。

* 清除所有本地存储项，然后触发一个 `SIGNED_OUT`事件。
* 为了使用 signOut() 方法，用户首先需要完成登录操作。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 [*link*](#%e6%a1%88%e4%be%8b1)

```
const { error } = await supabase.auth.signOut()
```

---

[*navigate\_before* signInWithOAuth()](/docs/app/sdkdocs/wechatsdk/auth/auth-signinwithoauth/)

[通过 OTP 进行验证和登录 *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-verifyotp/)