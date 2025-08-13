# signInWithPassword() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-signinwithpassword/
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

# signInWithPassword()

使用电子邮件或电话号码与密码登录现有用户。

```
final AuthResponse res = await supabase.auth.signInWithPassword(
  email: 'example@email.com',
  password: 'example-password',
);
final Session? session = res.session;
final User? user = res.user;
```

## Notes [*link*](#notes)

* 需要电子邮件和密码或电话号码和密码。

## Examples [*link*](#examples)

### 用电子邮件和密码登录 [*link*](#%e7%94%a8%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%92%8c%e5%af%86%e7%a0%81%e7%99%bb%e5%bd%95)

```
final AuthResponse res = await supabase.auth.signInWithPassword(
  email: 'example@email.com',
  password: 'example-password',
);
final Session? session = res.session;
final User? user = res.user;
```

### 用电话和密码登录 [*link*](#%e7%94%a8%e7%94%b5%e8%af%9d%e5%92%8c%e5%af%86%e7%a0%81%e7%99%bb%e5%bd%95)

```
final AuthResponse res = await supabase.auth.signInWithPassword(
  phone: '+13334445555',
  password: 'example-password',
);
final Session? session = res.session;
final User? user = res.user;
```

---

[*navigate\_before* signUp()](/docs/app/sdkdocs/dart/auth/auth-signup/)

[signInWithOtp() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-signinwithotp/)