# Update 数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/update/
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

# Update 数据

update()用于对表（table）或视图（view）执行 UPDATE 操作。

* `update()`应该始终与筛选器[Filters](/docs/app/SDKdocs/dartdatabase/using-filters)结合使用，以便定位您希望更新的项目。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (更新数据) [*link*](#%e6%a1%88%e4%be%8b1-%e6%9b%b4%e6%96%b0%e6%95%b0%e6%8d%ae)

```
await supabase
  .from('cities')
  .update({ 'name': 'Middle Earth' })
  .match({ 'name': 'Auckland' });
```

### 案例2 (更新JSON数据) [*link*](#%e6%a1%88%e4%be%8b2-%e6%9b%b4%e6%96%b0json%e6%95%b0%e6%8d%ae)

```
await supabase
  .from('users')
  .update({
    'address': {
      'street': 'Melrose Place',
      'postcode': 90210
    }
  })
  .eq('address->postcode', 90210);
```

Postgres提供了一个
[运算符的数量](https://www.postgresql.org/docs/current/functions-json.html)
用于处理JSON数据。现在，它只能更新整个JSON文档。
但我们正在[研究更新单个键的想法](https://github.com/PostgREST/postgrest/issues/465)。

### 案例3 (获取更新的行) [*link*](#%e6%a1%88%e4%be%8b3-%e8%8e%b7%e5%8f%96%e6%9b%b4%e6%96%b0%e7%9a%84%e8%a1%8c)

```
final List<Map<String, dynamic>> data = await supabase
    .from('users')
    .update({
      'address': {'street': 'Melrose Place', 'postcode': 90210}
    })
    .eq('address->postcode', 90210)
    .select();
```

---

[*navigate\_before* Insert 数据](/docs/app/sdkdocs/dart/database/insert/)

[Upsert 数据 *navigate\_next*](/docs/app/sdkdocs/dart/database/upsert/)