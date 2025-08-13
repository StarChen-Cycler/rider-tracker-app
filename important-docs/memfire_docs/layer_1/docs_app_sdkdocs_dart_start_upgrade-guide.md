# 更新 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/start/upgrade-guide/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

升级客户端库

# 更新

supabase-flutter专注于改善开发者的体验，使其更容易使用。本指南将帮助你从supabase-flutter v0升级到v1。

## 升级客户端库 [*link*](#%e5%8d%87%e7%ba%a7%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%93)

更新你的pubspec.yaml文件中的软件包。

```
supabase_flutter: ^1.0.0
```

## 错误处理 [*link*](#%e9%94%99%e8%af%af%e5%a4%84%e7%90%86)

supabase-flutter抛出错误的方式在v1中有所改变。在v1中，错误是以异常形式抛出的。这使得作为Flutter开发者处理错误时更加直观。

```
final res = await supabase.from('my_table').select().execute();
final error = res.error;
if (error != null) {
  // handle error
}
final data = res.data;
```

```
try {
    final data = supabase.from('my_table').select();
} catch (error) {
    // handle error
}
```

## Auth类/方法 [*link*](#auth%e7%b1%bb%e6%96%b9%e6%b3%95)

### `SupabaseAuthState`和`SupabaseAuthRequiredState`类的用法 [*link*](#supabaseauthstate%e5%92%8csupabaseauthrequiredstate%e7%b1%bb%e7%9a%84%e7%94%a8%e6%b3%95)

在v0中，`SupabaseAuthState`和`SupabaseAuthRequiredState`是用来处理自动令牌刷新和监听认证状态变化的。在v1版本中，`SupabaseAuthState`和`SupabaseAuthRequiredState`被弃用，令牌刷新将通过初始化Supabase自动发生。[`onAuthStateChange`](/docs/app/SDKdocs/dartstart/upgrade-guide#listening-to-auth-state-change)可以用来对auth状态的变化采取行动。

```
await Supabase.initialize(
  url: 'SUPABASE_URL',
  anonKey: 'SUPABASE_ANON_KEY',
);
...

class AuthState<T extends StatefulWidget> extends SupabaseAuthState<T> {
  ...
}

...

class AuthRequiredState<T extends StatefulWidget> extends SupabaseAuthState<T> {
  ...
}
```

```
await Supabase.initialize(
  url: 'SUPABASE_URL',
  anonKey: 'SUPABASE_ANON_KEY',
);
```

### 倾听认证状态的变化 [*link*](#%e5%80%be%e5%90%ac%e8%ae%a4%e8%af%81%e7%8a%b6%e6%80%81%e7%9a%84%e5%8f%98%e5%8c%96)

`onAuthStateChange`现在返回一个`Stream`。

```
final authSubscription = supabase.auth.onAuthStateChange((event, session) {
  // handle auth state change
});

// Unsubscribe when no longer needed
authSubscription.data?.unsubscribe();
```

```
final authSubscription = supabase.auth.onAuthStateChange.listen((data) {
      final AuthChangeEvent event = data.event;
      final Session? session = data.session;
      // handle auth state change
    });

// Unsubscribe when no longer needed
authSubscription.cancel();
```

### 用电子邮件和密码登录 [*link*](#%e7%94%a8%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%92%8c%e5%af%86%e7%a0%81%e7%99%bb%e5%bd%95)

signIn()方法已被废弃，转而采用更明确的方法签名来帮助类型提示。以前，开发者很难知道他们错过了什么（例如，很多开发者没有意识到他们可以使用无密码的magic links）。

```
await supabase.auth.signIn(email: email, password: password);
```

```
await supabase.auth.signInWithPassword(email: email, password: password);
```

### 用 magic link登录 [*link*](#%e7%94%a8-magic-link%e7%99%bb%e5%bd%95)

```
await supabase.auth.signIn(email: email);
```

```
await supabase.auth.signInWithOtp(email: email);
```

### 用第三方OAuth提供商登录 [*link*](#%e7%94%a8%e7%ac%ac%e4%b8%89%e6%96%b9oauth%e6%8f%90%e4%be%9b%e5%95%86%e7%99%bb%e5%bd%95)

```
await supabase.auth.signInWithProvider(
  Provider.github,
  options: AuthOptions(
      redirectTo: kIsWeb
          ? null
          : 'io.supabase.flutter://reset-callback/'),
);
```

```
await supabase.auth.signInWithOAuth(
  Provider.github,
  redirectTo: kIsWeb ? null : 'io.supabase.flutter://reset-callback/',
);
```

### 用手机登录 [*link*](#%e7%94%a8%e6%89%8b%e6%9c%ba%e7%99%bb%e5%bd%95)

```
await supabase.auth.signIn(
  phone: '+13334445555',
  password: 'example-password',
);
```

```
await supabase.auth.signInWithPassword(
  phone: '+13334445555',
  password: 'example-password',
);
```

### 使用OTP用手机登录 [*link*](#%e4%bd%bf%e7%94%a8otp%e7%94%a8%e6%89%8b%e6%9c%ba%e7%99%bb%e5%bd%95)

```
final res = await supabase.auth.signIn(phone: phone);
```

```
await supabase.auth.signInWithOtp(
  phone: phone,
);

// After receiving a SMS with a OTP.
await supabase.auth.verifyOTP(
  type: OtpType.sms,
  token: token,
  phone: phone,
);
```

### 重置电子邮件的密码 [*link*](#%e9%87%8d%e7%bd%ae%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e7%9a%84%e5%af%86%e7%a0%81)

```
await supabase.auth.api.resetPasswordForEmail(
  email,
  options:
      AuthOptions(redirectTo: 'io.supabase.flutter://reset-callback/'),
);
```

```
await supabase.auth.resetPasswordForEmail(
  email,
  redirectTo: kIsWeb ? null : 'io.supabase.flutter://reset-callback/',
);
```

### 获取用户的当前会话 [*link*](#%e8%8e%b7%e5%8f%96%e7%94%a8%e6%88%b7%e7%9a%84%e5%bd%93%e5%89%8d%e4%bc%9a%e8%af%9d)

```
final session = supabase.auth.session();
```

```
final Session? session = supabase.auth.currentSession;
```

### 获取登录的用户 [*link*](#%e8%8e%b7%e5%8f%96%e7%99%bb%e5%bd%95%e7%9a%84%e7%94%a8%e6%88%b7)

```
final user = supabase.auth.user();
```

```
final User? user = supabase.auth.currentUser;
```

### 更新已登录用户的用户数据 [*link*](#%e6%9b%b4%e6%96%b0%e5%b7%b2%e7%99%bb%e5%bd%95%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%a8%e6%88%b7%e6%95%b0%e6%8d%ae)

```
await supabase.auth.update(
  UserAttributes(data: {'hello': 'world'})
);
```

```
await supabase.updateUser(
  UserAttributes(
    data: { 'hello': 'world' },
  ),
);
```

## 数据方法 [*link*](#%e6%95%b0%e6%8d%ae%e6%96%b9%e6%b3%95)

`.insert()`/`.upsert()`/`.update()`/`.delete()`默认不会返回记录。

以前，这些方法默认返回插入/更新/删除的行(这引起了[一些混乱](https://github.com/supabase/supabase/discussions/1548))，你可以通过指定`returning: 'minimal'`来选择不返回它。现在的默认行为是不返回记录。要返回插入/更新/删除的行，在最后添加一个`.select()`的调用。

另外，在查询结束时调用`.execute()`是v0中的一个要求，但在v1中`.execute`已经过时了。

### 插入而不返回插入的数据 [*link*](#%e6%8f%92%e5%85%a5%e8%80%8c%e4%b8%8d%e8%bf%94%e5%9b%9e%e6%8f%92%e5%85%a5%e7%9a%84%e6%95%b0%e6%8d%ae)

```
await supabase
.from('my_table')
.insert(data, returning: ReturningOption.minimal)
.execute();
```

```
await supabase.from('my_table').insert(data);
```

### 插入，并返回插入的数据 [*link*](#%e6%8f%92%e5%85%a5%e5%b9%b6%e8%bf%94%e5%9b%9e%e6%8f%92%e5%85%a5%e7%9a%84%e6%95%b0%e6%8d%ae)

```
final res = await supabase
.from('my_table')
.insert(data)
.execute();
```

```
final insertedData = await supabase.from('my_table').insert(data).select();
```

##实时方法

### Stream [*link*](#stream)

`.stream()`不再需要最后的`.execute()`。另外，通过`eq`过滤现在变得容易多了。`primaryKey`现在是一个命名的参数，以使它更明显地传递什么。

```
supabase.from('my_table:id=eq.120')
.stream(['id'])
.listen();
```

```
supabase.from('my_table')
.stream(primaryKey: ['id'])
.eq('id', '120')
.listen();
```

### Subscribe [*link*](#subscribe)

```
final subscription = supabase
.from('countries')
.on(SupabaseEventTypes.all, (payload) {
  // Handle realtime payload
})
.subscribe();
```

```
final channel = supabase.channel('*');
channel.on(
  RealtimeListenTypes.postgresChanges,
  ChannelFilter(event: '*', schema: '*'),
  (payload, [ref]) {
    // Handle realtime payload
  },
).subscribe();
```

### Unsubscribe [*link*](#unsubscribe)

```
supabase.removeSubscription(subscription);
```

```
await supabase.removeChannel(channel);
```

---

[*navigate\_before* 安装](/docs/app/sdkdocs/dart/start/installing/)

[Select 查询 *navigate\_next*](/docs/app/sdkdocs/dart/database/select/)