# updateUser() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-updateuser/
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

# updateUser()

更新用户数据，如果有一个登录的用户。

```
final UserResponse res = await supabase.auth.updateUser(
  UserAttributes(
    email: 'example@email.com',
  ),
);
final User? updatedUser = res.user;
```

## Notes [*link*](#notes)

* 为了使用`updateUser()`方法，用户需要先登录。
* 默认情况下，电子邮件更新会向用户的当前和新的电子邮件发送一个确认链接。
  要想只向用户的新邮箱发送确认链接，请在你的项目的[email auth provider settings](https://app.supabase.com/project/_/auth/settings)中禁用**安全的邮件变更**。

## Examples [*link*](#examples)

### 更新已认证用户的电子邮件 [*link*](#%e6%9b%b4%e6%96%b0%e5%b7%b2%e8%ae%a4%e8%af%81%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6)

向新的电子邮件地址发送一封 “确认电子邮件变更 “的电子邮件。

```
final UserResponse res = await supabase.auth.updateUser(
  UserAttributes(
    email: 'example@email.com',
  ),
);
final User? updatedUser = res.user;
```

### 更新一个已认证用户的密码 [*link*](#%e6%9b%b4%e6%96%b0%e4%b8%80%e4%b8%aa%e5%b7%b2%e8%ae%a4%e8%af%81%e7%94%a8%e6%88%b7%e7%9a%84%e5%af%86%e7%a0%81)

```
final UserResponse res = await supabase.auth.updateUser(
  UserAttributes(
    password: 'new password',
  ),
);
final User? updatedUser = res.user;
```

### 更新用户的元数据 [*link*](#%e6%9b%b4%e6%96%b0%e7%94%a8%e6%88%b7%e7%9a%84%e5%85%83%e6%95%b0%e6%8d%ae)

```
final UserResponse res = await supabase.auth.updateUser(
  UserAttributes(
    data: { 'hello': 'world' },
  ),
);
final User? updatedUser = res.user;
```

---

[*navigate\_before* currentUser](/docs/app/sdkdocs/dart/auth/auth-currentuser/)

[onAuthStateChange() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-onauthstatechange/)