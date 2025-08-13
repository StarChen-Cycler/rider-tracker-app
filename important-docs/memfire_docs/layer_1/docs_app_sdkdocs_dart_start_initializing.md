# 初始化 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/start/initializing/
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

# 初始化

在使用 Supabase 的功能之前，需要先对 Supabase 进行初始化。这可以通过调用 Supabase 类的静态方法 initialize() 来实现。这个方法可能需要提供一些配置参数，以便正确地连接到 Supabase 服务。

一旦完成初始化，Supabase 客户端就是您与 Supabase 服务进行交互的主要接口。通过客户端，您可以访问 Supabase 提供的各种功能和服务。这是与 Supabase 生态系统内的其他组件交互的最简单且主要的方式，使您能够轻松地使用 Supabase 提供的各种功能。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （Flutter项目） [*link*](#%e6%a1%88%e4%be%8b1-flutter%e9%a1%b9%e7%9b%ae)

```
Future<void> main() async {
await Supabase.initialize(
  url: 'https://xyzcompany.supabase.co',
  anonKey: 'public-anon-key',
);

runApp(MyApp());
}

// Get a reference your Supabase client
final supabase = Supabase.instance.client;
```

### 案例2 （其他Dart项目） [*link*](#%e6%a1%88%e4%be%8b2-%e5%85%b6%e4%bb%96dart%e9%a1%b9%e7%9b%ae)

```
final supabase = SupabaseClient(
'https://xyzcompany.supabase.co',
'public-anon-key',
);
```

---

[*navigate\_before* Flutter库](/docs/app/sdkdocs/dart/start/dart/)

[安装 *navigate\_next*](/docs/app/sdkdocs/dart/start/installing/)