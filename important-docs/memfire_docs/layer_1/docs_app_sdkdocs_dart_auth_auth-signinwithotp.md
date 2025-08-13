# signInWithOtp() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-signinwithotp/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Notes

# signInWithOtp()

```
await supabase.auth.signInWithOtp(
  email: 'example@email.com',
  emailRedirectTo: kIsWeb ? null : 'io.supabase.flutter://signin-callback/',
);
```

## Notes [*link*](#notes)

* 要求提供电子邮件或电话号码。
* 这种方法用于无密码登录，OTP被发送到用户的电子邮件或电话号码。
* 如果你使用电子邮件，你可以配置你是否想让用户收到一个魔术链接或OTP。
* 如果你使用电话，你可以配置你是否希望用户收到OTP。
* 魔法链接的目标URL是由[`SITE_URL`](https://supabase.com/docs/app/sdkdocs/auth/config#site_url)决定的。你可以修改`SITE_URL`或在[你的项目](https://app.supabase.com/project/_/auth/settings)中添加额外的重定向url。

## Examples [*link*](#examples)

### 用电子邮件登录。 [*link*](#%e7%94%a8%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e7%99%bb%e5%bd%95)

用户将被发送一封电子邮件，其中包含一个magiclink或OTP或两者。默认情况下，一个用户每60秒只能请求一次OTP。
你可以通过`emailRedirectTo`和动态链接，使用户在点击魔法链接后回到你的应用程序。

```
await supabase.auth.signInWithOtp(
  email: 'example@email.com',
  emailRedirectTo: kIsWeb ? null : 'io.supabase.flutter://signin-callback/',
);
```

### 用短信OTP登录。 [*link*](#%e7%94%a8%e7%9f%ad%e4%bf%a1otp%e7%99%bb%e5%bd%95)

用户将被发送一条包含OTP的短信。默认情况下，一个特定的用户只能每60秒请求一次OTP。

```
await supabase.auth.signInWithOtp(
  phone: '+13334445555',
);
```

---

[*navigate\_before* signInWithPassword()](/docs/app/sdkdocs/dart/auth/auth-signinwithpassword/)

[signInWithOAuth() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-signinwithoauth/)