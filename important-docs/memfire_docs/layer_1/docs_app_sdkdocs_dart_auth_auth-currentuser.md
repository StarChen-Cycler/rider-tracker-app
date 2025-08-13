# currentUser | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-currentuser/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Examples

# currentUser

返回用户数据，如果有一个登录的用户。

```
final User? user = supabase.auth.currentUser;
```

## Examples [*link*](#examples)

### 获取登录的用户 [*link*](#%e8%8e%b7%e5%8f%96%e7%99%bb%e5%bd%95%e7%9a%84%e7%94%a8%e6%88%b7)

```
final User? user = supabase.auth.currentUser;
```

---

[*navigate\_before* currentSession](/docs/app/sdkdocs/dart/auth/auth-currentsession/)

[updateUser() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-updateuser/)