# 存储程序: rpc() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/rpc/
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

# 存储程序: rpc()

你可以用"远程程序调用"的方式调用存储程序。

这是一种高级的说法，即你可以把一些逻辑放入数据库，然后从任何地方调用它。
这在逻辑很少更改的情况下特别有用，比如密码重置和更新等情况。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (调用一个没有参数的存储程序) [*link*](#%e6%a1%88%e4%be%8b1-%e8%b0%83%e7%94%a8%e4%b8%80%e4%b8%aa%e6%b2%a1%e6%9c%89%e5%8f%82%e6%95%b0%e7%9a%84%e5%ad%98%e5%82%a8%e7%a8%8b%e5%ba%8f)

```
final data = await supabase
  .rpc('hello_world');
```

这是一个调用存储过程的示例。

### 案例2 (调用一个带参数的存储程序) [*link*](#%e6%a1%88%e4%be%8b2-%e8%b0%83%e7%94%a8%e4%b8%80%e4%b8%aa%e5%b8%a6%e5%8f%82%e6%95%b0%e7%9a%84%e5%ad%98%e5%82%a8%e7%a8%8b%e5%ba%8f)

```
final data = await supabase
  .rpc('echo_city', params: { 'name': 'The Shire' });
```

## 参考资料 [*link*](#%e5%8f%82%e8%80%83%e8%b5%84%e6%96%99)

* [数据库函数](/docs/app/development_guide/database/functions/)

---

[*navigate\_before* Delete 数据](/docs/app/sdkdocs/dart/database/delete/)

[使用过滤器 *navigate\_next*](/docs/app/sdkdocs/dart/database/filter/using-filters/)