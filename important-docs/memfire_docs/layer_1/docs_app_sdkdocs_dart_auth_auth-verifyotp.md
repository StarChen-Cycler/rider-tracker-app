# verifyOtp() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-verifyotp/
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

# verifyOtp()

```
final AuthResponse res = await supabase.auth.verifyOTP(
  type: OtpType.sms,
  token: '111111',
  phone: '+13334445555',
);
final Session? session = res.session;
final User? user = res.user;
```

## Notes [*link*](#notes)

* `verifyOtp`方法接受不同的验证类型。如果使用电话号码，类型可以是`sms`或`phone_change`。如果使用的是电子邮件地址，类型可以是下列之一。`signup`, `magiclink`, `recovery`, `invite` 或 `email_change`.
* 使用的验证类型应该根据在`verifyOtp`之前调用的相应的auth方法来确定，以注册/登录一个用户。

## Examples [*link*](#examples)

### 验证短信一次性密码(OTP) [*link*](#%e9%aa%8c%e8%af%81%e7%9f%ad%e4%bf%a1%e4%b8%80%e6%ac%a1%e6%80%a7%e5%af%86%e7%a0%81otp)

```
final AuthResponse res = await supabase.auth.verifyOTP(
  type: OtpType.sms,
  token: '111111',
  phone: '+13334445555',
);
final Session? session = res.session;
final User? user = res.user;
```

### 验证注册 一次性密码(OTP) [*link*](#%e9%aa%8c%e8%af%81%e6%b3%a8%e5%86%8c-%e4%b8%80%e6%ac%a1%e6%80%a7%e5%af%86%e7%a0%81otp)

```
final AuthResponse res = await supabase.auth.verifyOTP(
  type: OtpType.signup,
  token: token,
  phone: '+13334445555',
);
final Session? session = res.session;
final User? user = res.user;
```

---

[*navigate\_before* signOut()](/docs/app/sdkdocs/dart/auth/auth-signout/)

[currentSession *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-currentsession/)