# resetPasswordForEmail() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-resetpasswordforemail/
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

# resetPasswordForEmail()

向电子邮件地址发送重置请求。

`redirectTo` is used to open the app via deeplink when user opens the password reset email.

```
await supabase.auth.resetPasswordForEmail(
  'sample@email.com',
  redirectTo: kIsWeb ? null : 'io.supabase.flutter://reset-callback/',
);
```

## Notes [*link*](#notes)

向一个电子邮件地址发送一个密码重置请求。当用户点击邮件中的重置链接时，他们会被重定向到你的应用程序。提示用户输入新的密码并调用auth.updateUser()。

```
await supabase.auth.resetPasswordForEmail(
  'sample@email.com',
  redirectTo: kIsWeb ? null : 'io.supabase.flutter://reset-callback/',
);
```

## Examples [*link*](#examples)

### 重置Flutter的密码 [*link*](#%e9%87%8d%e7%bd%aeflutter%e7%9a%84%e5%af%86%e7%a0%81)

`redirectTo` is used to open the app via deeplink when user opens the password reset email.

```
await supabase.auth.resetPasswordForEmail(
  'sample@email.com',
  redirectTo: kIsWeb ? null : 'io.supabase.flutter://reset-callback/',
);
```

---

[*navigate\_before* onAuthStateChange()](/docs/app/sdkdocs/dart/auth/auth-onauthstatechange/)

[待补充 *navigate\_next*](/docs/app/sdkdocs/dart/function/invoke/)