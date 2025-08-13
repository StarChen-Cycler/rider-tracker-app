# signInWithOAuth() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/auth/auth-signinwithoauth/
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

# signInWithOAuth()

使用第三方OAuth提供商对用户进行签名。

```
await supabase.auth.signInWithOAuth(Provider.github);
```

## Notes [*link*](#notes)

* 这种方法用于使用第三方提供商进行登录。
* Supabase支持许多不同的[第三方提供商](https://supabase.com/docs/app/development_guide/auth/auth#providers)。

## Examples [*link*](#examples)

### 使用第三方供应商登录 [*link*](#%e4%bd%bf%e7%94%a8%e7%ac%ac%e4%b8%89%e6%96%b9%e4%be%9b%e5%ba%94%e5%95%86%e7%99%bb%e5%bd%95)

```
await supabase.auth.signInWithOAuth(Provider.github);
```

### 使用 `redirectTo` [*link*](#%e4%bd%bf%e7%94%a8-redirectto)

指定重定向链接，通过深层链接把用户带回来。
注意，对于Flutter Web，`redirectTo`应该是空的。

```
await supabase.auth.signInWithOAuth(
  Provider.github,
  redirectTo: kIsWeb ? null : 'io.supabase.flutter://reset-callback/',
);
```

### 使用 scopes [*link*](#%e4%bd%bf%e7%94%a8-scopes)

如果你需要OAuth提供商的额外数据，你可以在你的请求中包括一个空格分隔的范围列表，以获得OAuth提供商的令牌。
你可能还需要在提供者的OAuth应用设置中指定范围，这取决于提供者。

```
await supabase.auth.signInWithOAuth(
  Provider.github,
  scopes: 'repo gist notifications'
);
...
// after user comes back from signin flow

final Session? session = supabase.auth.currentSession;
final String? oAuthToken = session?.providerToken;
```

---

[*navigate\_before* signInWithOtp()](/docs/app/sdkdocs/dart/auth/auth-signinwithotp/)

[signOut() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-signout/)