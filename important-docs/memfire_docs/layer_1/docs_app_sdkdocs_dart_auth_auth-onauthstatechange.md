# onAuthStateChange() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-onauthstatechange/
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

# onAuthStateChange()

每次发生认证事件时都会收到通知。

```
final authSubscription = supabase.auth.onAuthStateChange.listen((data) {
  final AuthChangeEvent event = data.event;
  final Session? session = data.session;
});
```

## Notes [*link*](#notes)

* 认证事件的类型: `AuthChangeEvent.passwordRecovery`, `AuthChangeEvent.signedIn`, `AuthChangeEvent.signedOut`, `AuthChangeEvent.tokenRefreshed`, `AuthChangeEvent.userUpdated`and `AuthChangeEvent.userDeleted`

## Examples [*link*](#examples)

### 监听认证变化 [*link*](#%e7%9b%91%e5%90%ac%e8%ae%a4%e8%af%81%e5%8f%98%e5%8c%96)

```
final authSubscription = supabase.auth.onAuthStateChange.listen((data) {
  final AuthChangeEvent event = data.event;
  final Session? session = data.session;
});
```

### 监听一个特定的事件 [*link*](#%e7%9b%91%e5%90%ac%e4%b8%80%e4%b8%aa%e7%89%b9%e5%ae%9a%e7%9a%84%e4%ba%8b%e4%bb%b6)

```
final authSubscription = supabase.auth.onAuthStateChange.listen((data) {
  final AuthChangeEvent event = data.event;
  if (event == AuthChangeEvent.signedIn) {
    // handle signIn
  }
});
```

### 退订自动订阅 [*link*](#%e9%80%80%e8%ae%a2%e8%87%aa%e5%8a%a8%e8%ae%a2%e9%98%85)

```
final authSubscription = supabase.auth.onAuthStateChange((event, session) {});

authSubscription.cancel();
```

---

[*navigate\_before* updateUser()](/docs/app/sdkdocs/dart/auth/auth-updateuser/)

[resetPasswordForEmail() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-resetpasswordforemail/)