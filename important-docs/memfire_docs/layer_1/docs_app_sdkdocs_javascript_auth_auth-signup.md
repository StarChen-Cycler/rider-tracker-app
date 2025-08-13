# signUp() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signup/
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

1. 默认情况下，用户在登录之前需要验证他们的电子邮件地址。要关闭此功能，请在您的[项目](https://cloud.memfiredb.com/db)中禁用 **确认电子邮** 选项。
2. **确认电子邮件** 决定用户在注册后是否需要确认他们的电子邮件地址。

* 如果启用了 **确认电子邮件** ，将返回一个`用户`对象，但`会话 (session)` 为空。
* 如果禁用了 **确认电子邮** ，将返回一个`用户`对象和一个`会话 (session)`。

3. 当用户确认他们的电子邮件地址时，默认情况下会重定向到 `SITE_URL`。您可以在项目中修改 `SITE_URL` 或在你的[项目](https://cloud.memfiredb.com/db)中添加其他重定向 URL。
4. 如果对已确认的现有用户调用 signUp()：

* 如果您的[项目](https://cloud.memfiredb.com/db)中启用了 **确认电子邮件** ，将返回一个混淆的（假的）的用户对象。
* 如果禁用了 **确认电子邮件** ，将返回错误消息`用户已注册`。

5. 要获取当前已登录的用户，请参阅 [getUser()](/docs/app/sdkdocs/javascript/auth/auth-getuser/) 方法。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （注册） [*link*](#%e6%a1%88%e4%be%8b1-%e6%b3%a8%e5%86%8c)

```
const { data, error } = await supabase.auth.signUp({
email: 'example@email.com',
password: 'example-password',
})
```

如果密码超过72个字符，它将被截断为前72个字符。

### 案例2 （使用附加用户元数据进行注册） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8%e9%99%84%e5%8a%a0%e7%94%a8%e6%88%b7%e5%85%83%e6%95%b0%e6%8d%ae%e8%bf%9b%e8%a1%8c%e6%b3%a8%e5%86%8c)

```
const { data, error } = await supabase.auth.signUp(
{
  email: 'example@email.com',
  password: 'example-password',
  options: {
    data: {
      first_name: 'John',
      age: 27,
    }
  }
}
)
```

### 案例3 （使用重定向URL进行注册） [*link*](#%e6%a1%88%e4%be%8b3-%e4%bd%bf%e7%94%a8%e9%87%8d%e5%ae%9a%e5%90%91url%e8%bf%9b%e8%a1%8c%e6%b3%a8%e5%86%8c)

```
const { data, error } = await supabase.auth.signUp(
{
  email: 'example@email.com',
  password: 'example-password',
  options: {
    emailRedirectTo: 'https://example.com/welcome'
  }
}
)
```

如果你希望在你的项目中添加额外的重定向URL，你可以查看重定向URL和通配符的相关内容来实现。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### credentials [必要参数] `SignUpWithPasswordCredentials`

  SignUpWithPasswordCredentials是使用密码进行身份验证的一种凭据类型。通常包含以下信息：

  1.email（电子邮件）：用户的电子邮件地址，作为账户的唯一标识符之一。

  2.password（密码）：用户选择的密码，用于以后登录时进行身份验证。

  3.可能还包含其他一些相关的字段，例如用户名、手机号码或其他自定义的用户信息。

---

[*navigate\_before* 概述](/docs/app/sdkdocs/wechatsdk/auth/auth-api/)

[signInWithPassword() *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-signinwithpassword/)