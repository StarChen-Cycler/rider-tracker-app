# signOut() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-signout/
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

# signOut()

退出当前用户，如果有一个登录的用户。

```
await supabase.auth.signOut();
```

## Notes [*link*](#notes)

* 为了使用`signOut()`方法，用户需要先退出。

## Examples [*link*](#examples)

### Sign out [*link*](#sign-out)

```
await supabase.auth.signOut();
```

---

[*navigate\_before* signInWithOAuth()](/docs/app/sdkdocs/dart/auth/auth-signinwithoauth/)

[verifyOtp() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-verifyotp/)