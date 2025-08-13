# match() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/filter/match/
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# match()

match()用于查找表（table）中所有列与指定的`查询（query）`对象相匹配的行。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (使用select) [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8select)

```
final data = await supabase
  .from('cities')
  .select('name, country_id')
  .match({'name': 'Beijing', 'country_id': 156});
```

### 案例2 (使用update) [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8update)

```
final data = await supabase
  .from('cities')
  .update({ 'name': 'Mordor' })
  .match({'name': 'Beijing', 'country_id': 156});
```

### 案例3 (使用delete) [*link*](#%e6%a1%88%e4%be%8b3-%e4%bd%bf%e7%94%a8delete)

```
final data = await supabase
  .from('cities')
  .delete()
  .match({'name': 'Beijing', 'country_id': 156});
```

### 案例4 (使用rpc) [*link*](#%e6%a1%88%e4%be%8b4-%e4%bd%bf%e7%94%a8rpc)

```
// Only valid if the Stored Procedure returns a table type.
final data = await supabase
  .rpc('echo_all_cities')
  .match({'name': 'Beijing', 'country_id': 156});
```

---

[*navigate\_before* textSearch()](/docs/app/sdkdocs/dart/database/filter/textsearch/)

[.not() *navigate\_next*](/docs/app/sdkdocs/dart/database/filter/not/)