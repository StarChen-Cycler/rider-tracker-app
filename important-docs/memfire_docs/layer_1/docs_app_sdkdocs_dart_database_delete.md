# Delete 数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/delete/
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

# Delete 数据

delete()用于在表（table）或视图（view）执行 DELETE 操作。

* `delete()` 应始终与[过滤器（filter）](/docs/app/SDKdocs/dartdatabase/using-filters)结合使用，以便定位要删除的项。
* 如果你在使用 `delete()` 时带有过滤器，并且启用了RLS（行级安全性），则只会删除通过 `SELECT` 策略可见的行。请注意，默认情况下没有行可见，因此你需要至少有一个 `SELECT`/`ALL` 策略来使行可见。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (删除记录) [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%a0%e9%99%a4%e8%ae%b0%e5%bd%95)

```
await supabase
  .from('cities')
  .delete()
  .match({ 'id': 666 });
```

### 案例2 (找回已删除的记录) [*link*](#%e6%a1%88%e4%be%8b2-%e6%89%be%e5%9b%9e%e5%b7%b2%e5%88%a0%e9%99%a4%e7%9a%84%e8%ae%b0%e5%bd%95)

```
final List<Map<String,dynamic>> data = await supabase
  .from('cities')
  .delete()
  .match({ 'id': 666 })
  .select();
```

---

[*navigate\_before* Upsert 数据](/docs/app/sdkdocs/dart/database/upsert/)

[存储程序: rpc() *navigate\_next*](/docs/app/sdkdocs/dart/database/rpc/)