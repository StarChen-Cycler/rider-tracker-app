# 使用电子邮件登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-email/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

概述

# 使用电子邮件登录

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

为 MemFireCloud 应用程序设置电子邮件登录。

* 将电子邮件验证器添加到[MemFire Cloud项目](https://cloud.memfiredb.com)
* 将登录代码添加到应用程序 - [JavaScript](https://github.com/supabase/supabase-js) | [Flutter](https://github.com/supabase/supabase-flutter)

## 配置电子邮件设置 [*link*](#%e9%85%8d%e7%bd%ae%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e8%ae%be%e7%bd%ae)

1. 对于 网站 URL（`用户认证`-> `URL 配置`）, 输入应用程序的最终（托管）URL。
2. 对于 身份验证服务商（`用户认证`-> `服务商`）, **启用电子邮件提供程序**.

info

对于自托管，可以使用提供的文件和环境变量更新项目配置。
有关详细信息，请参阅[自托管文档](/docs/app/development_guide/hosting/static-start/)。

## 将登录代码添加到客户端应用程序 [*link*](#%e5%b0%86%e7%99%bb%e5%bd%95%e4%bb%a3%e7%a0%81%e6%b7%bb%e5%8a%a0%e5%88%b0%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

当用户登录时，使用其电子邮件地址和密码调用[signInWithPassword()](/docs/app/sdkdocs/javascript/auth/auth-signinwithpassword/)：

```
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'example@email.com',
    password: 'example-password',
  })
}
```

当用户登录时，使用其电子邮件地址和密码调用[signInWithPassword()](/docs/app/sdkdocs/dart/auth/auth-signinwithpassword/)：

```
Future<void> signInWithEmail() async {
  final AuthResponse res = await supabase.auth.signInWithPassword(
    email: 'example@email.com',
    password: 'example-password'
  );
}
```

当用户注销时，调用[signOut()](/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除：

```
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

当用户注销时，调用[signOut()](/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除：

```
Future<void> signOut() async {
   await supabase.auth.signOut();
}
```

## 资料 [*link*](#%e8%b5%84%e6%96%99)

* [MemFire Cloud](https://cloud.memfiredb.com)
* [JS客户端](https://github.com/supabase/supabase-js)
* [Flutter客户端](https://github.com/supabase/supabase-flutter)

---

[*navigate\_before* vue 设置微信扫码登录身份验证](/docs/app/development_guide/auth/auth-getting-start/vue/)

[手机登录认证 *navigate\_next*](/docs/app/development_guide/auth/authentication/phoneauth/)