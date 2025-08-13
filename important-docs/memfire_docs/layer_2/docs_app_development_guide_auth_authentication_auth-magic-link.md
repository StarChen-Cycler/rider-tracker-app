# 使用Magic Link登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-magic-link
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

概述

# 使用Magic Link登录

Magic Link是一种无密码登录的形式，用户单击发送到其电子邮件地址的链接即可登录其帐户。
Magic Link仅适用于电子邮件地址。默认情况下，用户只能每60秒请求一次Magic Link。

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

为MemfireCloud应用程序提供Magic Link登录。

* 将登录代码添加到应用程序 - [JavaScript](https://github.com/supabase/supabase-js) | [Flutter](https://github.com/supabase/supabase-flutter)

## 将Magic Link添加到您的 MemfireCloud 项目中 [*link*](#%e5%b0%86magic-link%e6%b7%bb%e5%8a%a0%e5%88%b0%e6%82%a8%e7%9a%84-memfirecloud-%e9%a1%b9%e7%9b%ae%e4%b8%ad)

1. 对于 网站 URL（`用户认证`-> `URL 配置`）, 输入应用程序的最终（托管）URL。
2. 对于 身份验证服务商（`用户认证`-> `服务商`）, **启用电子邮件提供程序**.

## 将登录代码添加到客户端应用程序 [*link*](#%e5%b0%86%e7%99%bb%e5%bd%95%e4%bb%a3%e7%a0%81%e6%b7%bb%e5%8a%a0%e5%88%b0%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

当您的用户登录时，使用其电子邮件地址调用[signInWithOtp()](/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/):

```
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'example@email.com',
  })
}
```

当您的用户登录时，使用其电子邮件地址调用[signIn()](/docs/app/sdkdocs/dart/auth/auth-signinwithotp/):

```
Future<void> signInWithEmail() async {
  final AuthResponse res = await supabase.auth.signinwithotp(email: 'example@email.com');
}
```

当用户注销时，调用[signOut()](/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除:

```
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

当用户注销时，调用[signOut()](/docs/app/sdkdocs/dart/auth/auth-signout/)将其从浏览器会话和localStorage中删除:

```
Future<void> signOut() async {
  await supabase.auth.signOut();
}
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* [MemFire Cloud](https://cloud.memfiredb.com)
* [JS客户端](https://github.com/supabase/supabase-js)
* [Flutter客户端](https://github.com/supabase/supabase-flutter)

---

[*navigate\_before* 微信网站应用扫码登录](/docs/app/development_guide/auth/authentication/wechatqrauth/)

[使用Apple登录 *navigate\_next*](/docs/app/development_guide/auth/authentication/auth-apple/)