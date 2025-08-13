# 通过 OTP 进行验证和登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-verifyotp/
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

# 通过 OTP 进行验证和登录

用户通过手机接收到的 OTP（一次性密码） 来登录。

* verifyOtp 方法接受不同的验证类型。如果使用手机号码，类型可以是 `sms` 或 `phone_change`。
  如果使用电子邮件地址，类型可以是以下之一：`email`、`recovery`、`invite` 或 `email_change`（`signup` 和 `magiclink` 类型已被弃用）。
* 应根据在调用 `verifyOtp` 之前使用的相应身份验证方法来确定使用的验证类型，以便进行用户的注册或登录操作。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （验证短信一次性密码） [*link*](#%e6%a1%88%e4%be%8b1-%e9%aa%8c%e8%af%81%e7%9f%ad%e4%bf%a1%e4%b8%80%e6%ac%a1%e6%80%a7%e5%af%86%e7%a0%81)

```
const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms'})
```

### 案例2 （验证注册一次性密码） [*link*](#%e6%a1%88%e4%be%8b2-%e9%aa%8c%e8%af%81%e6%b3%a8%e5%86%8c%e4%b8%80%e6%ac%a1%e6%80%a7%e5%af%86%e7%a0%81)

```
const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup'})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### params [必要参数] `VerifyOtpParams`

---

[*navigate\_before* signOut()](/docs/app/sdkdocs/wechatsdk/auth/auth-signout/)

[getSession() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-getsession/)