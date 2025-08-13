# signInWithOtp() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/
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

# signInWithOtp()

使用魔法链接（Magiclink）或一次性密码（OTP）登录用户，需要提供电子邮件或手机号码中的任意一种。

这个方法用于无需密码的登录，其中一次性密码（OTP）将发送到用户的电子邮件或手机号码。
如果用户不存在，`signInWithOtp()` 将代替其进行用户注册。要限制此行为，您可以将 `SignInWithPasswordlessCredentials.options` 中的 `shouldCreateUser` 设置为 `false`。

* 如果您使用电子邮件，您可以配置是否要向用户发送魔法链接或一次性密码（OTP）。
* 如果您使用手机号码，您可以配置是否要向用户发送一次性密码（OTP）。

魔法链接的目标URL由 `SITE_URL` 决定。请查看[重定向URL和通配符](/docs/app/development_guide/auth/auth/)以向您的项目添加其他重定向URL。

魔法链接和OTP共享相同的实现。若要向用户发送一次性密码（OTP）而不是魔法链接，请修改魔法链接的[电子邮件模板](https://memfiredb.com/)，将 `{{ .ConfirmationURL }}` 替换为 `{{ .Token }}`。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （使用电子邮件登录） [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e7%99%bb%e5%bd%95)

```
const { data, error } = await supabase.auth.signInWithOtp({
email: 'example@email.com',
options: {
  emailRedirectTo: 'https://example.com/welcome'
}
})
```

用户将收到一封电子邮件，其中包含魔法链接或者一次性密码（OTP）亦或是两者都有。默认情况下，同一用户在60秒内只能请求一次一次性密码（OTP）。

### 案例2 （使用短信OTP登陆） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8%e7%9f%ad%e4%bf%a1otp%e7%99%bb%e9%99%86)

```
const { data, error } = await supabase.auth.signInWithOtp({
phone: '+13334445555',
})
```

用户将收到一条包含一次性密码（OTP）的短信。默认情况下，同一用户在60秒内只能请求一次一次性密码（OTP）。

### 案例3 （使用WhatsApp OTP登录） [*link*](#%e6%a1%88%e4%be%8b3-%e4%bd%bf%e7%94%a8whatsapp-otp%e7%99%bb%e5%bd%95)

```
const { data, error } = await supabase.auth.signInWithOtp({
phone: '+13334445555',
options: {
  channel:'whatsapp',
}
})
```

用户将收到一条包含一次性密码（OTP）的WhatsApp消息。
默认情况下，同一用户在60秒内只能请求一次一次性密码（OTP）。请注意，为了使用此功能，用户需要拥有一个与Twilio关联的有效WhatsApp账号。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### credentials [必要参数] `SignUpWithPasswordCredentials`

  SignUpWithPasswordCredentials是使用密码进行身份验证的一种凭据类型。通常包含以下信息：

  1.email（电子邮件）：用户的电子邮件地址，作为账户的唯一标识符之一。

  2.password（密码）：用户选择的密码，用于以后登录时进行身份验证。

  3.可能还包含其他一些相关的字段，例如用户名、手机号码或其他自定义的用户信息。

---

[*navigate\_before* signInWithPassword()](/docs/app/sdkdocs/javascript/auth/auth-signinwithpassword/)

[signInWithOAuth() *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/)