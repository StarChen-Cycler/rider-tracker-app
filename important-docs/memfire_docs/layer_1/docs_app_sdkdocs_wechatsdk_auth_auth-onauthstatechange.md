# onAuthStateChange() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-onauthstatechange/
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

# onAuthStateChange()

onAuthStateChange()用于监听认证事件，接收每次认证事件发生时的通知。

* 认证事件类型： `SIGNED_IN（登录）`、`SIGNED_OUT（登出）`、`TOKEN_REFRESHED（令牌刷新）`、`USER_UPDATED（用户信息更新）`、`PASSWORD_RECOVERY（密码恢复）`
* 然而目前使用 `onAuthStateChange()` 方法在不同的标签页之间无效。
  举例来说，在密码重置流程中，如果用户在一个标签页请求密码重置链接，当用户点击链接时，原始的标签页将无法收到`SIGNED_IN（登录）`和`PASSWORD_RECOVERY（密码恢复）`事件。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （监听认证变化） [*link*](#%e6%a1%88%e4%be%8b1-%e7%9b%91%e5%90%ac%e8%ae%a4%e8%af%81%e5%8f%98%e5%8c%96)

```
supabase.auth.onAuthStateChange((event, session) => {
console.log(event, session)
})
```

### 案例2 （监听密码恢复事件） [*link*](#%e6%a1%88%e4%be%8b2-%e7%9b%91%e5%90%ac%e5%af%86%e7%a0%81%e6%81%a2%e5%a4%8d%e4%ba%8b%e4%bb%b6)

```
supabase.auth.onAuthStateChange((event, session) => {
if (event == 'PASSWORD_RECOVERY') {
  console.log('PASSWORD_RECOVERY', session)

  // show screen to update user's password
  showPasswordResetScreen(true)
}
})
```

### 案例3 （监听登录） [*link*](#%e6%a1%88%e4%be%8b3-%e7%9b%91%e5%90%ac%e7%99%bb%e5%bd%95)

```
supabase.auth.onAuthStateChange((event, session) => {
if (event == 'SIGNED_IN') console.log('SIGNED_IN', session)
})
```

### 案例4 （监听退出登录） [*link*](#%e6%a1%88%e4%be%8b4-%e7%9b%91%e5%90%ac%e9%80%80%e5%87%ba%e7%99%bb%e5%bd%95)

```
supabase.auth.onAuthStateChange((event, session) => {
if (event == 'SIGNED_OUT') console.log('SIGNED_OUT', session)
})
```

### 案例5 （监听令牌刷新） [*link*](#%e6%a1%88%e4%be%8b5-%e7%9b%91%e5%90%ac%e4%bb%a4%e7%89%8c%e5%88%b7%e6%96%b0)

```
supabase.auth.onAuthStateChange((event, session) => {
if (event == 'TOKEN_REFRESHED') console.log('TOKEN_REFRESHED', session)
})
```

### 案例6 （监听用户的更新信息） [*link*](#%e6%a1%88%e4%be%8b6-%e7%9b%91%e5%90%ac%e7%94%a8%e6%88%b7%e7%9a%84%e6%9b%b4%e6%96%b0%e4%bf%a1%e6%81%af)

```
supabase.auth.onAuthStateChange((event, session) => {
if (event == 'USER_UPDATED') console.log('USER_UPDATED', session)
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 回调（callback） [必要参数] `函数类型`

  当发生认证事件时要调用的回调函数。

---

[*navigate\_before* setSession()](/docs/app/sdkdocs/wechatsdk/auth/auth-setsession/)

[resetPasswordForEmail() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-resetpasswordforemail/)