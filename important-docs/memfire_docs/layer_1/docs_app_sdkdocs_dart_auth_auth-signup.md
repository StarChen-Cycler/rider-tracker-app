# signUp() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-signup/
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

# signUp()

创建一个新的用户。

```
final AuthResponse res = await supabase.auth.signUp(
  email: 'example@email.com',
  password: 'example-password',
);
final Session? session = res.session;
final User? user = res.user;
```

## Notes [*link*](#notes)

* 默认情况下，用户在登录前需要验证他们的电子邮件地址。要关闭这个功能，请在[你的项目](https://app.supabase.com/project/_/auth/settings)中禁用**确认电子邮件**。
* **确认电子邮件**决定了用户在注册后是否需要确认他们的电子邮件地址。
  + 如果**确认电子邮件**被启用，将返回一个`用户`，但`会话`为空。
  + 如果**确认电子邮件**被禁用，则同时返回一个`用户'和一个`会话`。
* 当用户确认他们的电子邮件地址时，他们默认会被重定向到[`SITE_URL`](https://supabase.com/docs/app/sdkdocs/auth/config#site_url)。你可以修改你的`SITE_URL`或在[你的项目](https://app.supabase.com/project/_/auth/settings)中添加额外的重定向URL。
* 如果为一个现有的确认用户调用signUp()。
  + 如果在[你的项目](https://app.supabase.com/project/_/auth/settings)中启用了**确认邮件**，将返回一个混淆的/假的用户对象。
  + 如果**确认电子邮件**被禁用，将返回错误信息 “用户已经注册”。

## Examples [*link*](#examples)

### Sign up. [*link*](#sign-up)

```
final AuthResponse res = await supabase.auth.signUp(
  email: 'example@email.com',
  password: 'example-password',
);
final Session? session = res.session;
final User? user = res.user;
```

### 与第三方供应商签约。 [*link*](#%e4%b8%8e%e7%ac%ac%e4%b8%89%e6%96%b9%e4%be%9b%e5%ba%94%e5%95%86%e7%ad%be%e7%ba%a6)

如果你使用Flutter，你可以使用`supabase_flutter`上的[signInWithOAuth()`](/docs/app/SDKdocs/dartauth/auth-signinwithoauth)方法与OAuth提供商签约。

---

[*navigate\_before* single()](/docs/app/sdkdocs/dart/database/modifier/single/)

[signInWithPassword() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-signinwithpassword/)