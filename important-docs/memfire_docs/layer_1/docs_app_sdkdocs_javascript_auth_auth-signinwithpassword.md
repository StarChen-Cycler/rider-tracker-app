# signInWithPassword() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithpassword/
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

# signInWithPassword()

你可以使用电子邮件和密码或者手机号码和密码来登录已存在的用户账户。登录时必须提供以下其中一种组合：

* 电子邮件和密码：输入用户注册时使用的电子邮件地址和相应的密码进行登录。
* 手机号码和密码：输入用户注册时使用的手机号码和相应的密码进行登录。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （使用电子邮件和密码登录） [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%92%8c%e5%af%86%e7%a0%81%e7%99%bb%e5%bd%95)

```
const { data, error } = await supabase.auth.signInWithPassword({
email: 'example@email.com',
password: 'example-password',
})
```

### 案例2 （使用手机号码和密码登录） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8%e6%89%8b%e6%9c%ba%e5%8f%b7%e7%a0%81%e5%92%8c%e5%af%86%e7%a0%81%e7%99%bb%e5%bd%95)

```
const { data, error } = await supabase.auth.signInWithPassword({
phone: '+13334445555',
password: 'some-password',
})

// After receiving a SMS with a OTP.
const { data, error } = await supabase.auth.verifyOtp({
phone: '+13334445555',
token: '123456',
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### credentials [必要参数] `SignUpWithPasswordCredentials`

  SignUpWithPasswordCredentials是使用密码进行身份验证的一种凭据类型。通常包含以下信息：

  1.email（电子邮件）：用户的电子邮件地址，作为账户的唯一标识符之一。

  2.password（密码）：用户选择的密码，用于以后登录时进行身份验证。

  3.可能还包含其他一些相关的字段，例如用户名、手机号码或其他自定义的用户信息。

---

[*navigate\_before* signUp()](/docs/app/sdkdocs/javascript/auth/auth-signup/)

[signInWithOtp() *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/)