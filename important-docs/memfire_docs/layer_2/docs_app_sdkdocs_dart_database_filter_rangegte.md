# rangeGte() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/filter/rangegte/
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

# rangeGte()

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (使用select) [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8select)

```
final data = await supabase
  .from('countries')
  .select('name, id, population_range_millions')
  .rangeGte('population_range_millions', '[150, 250]');
```

### 案例2 (使用update) [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8update)

```
final data = await supabase
  .from('countries')
  .update({ 'name': 'Mordor' })
  .rangeGte('population_range_millions', '[150, 250]');
```

### 案例3 (使用delete) [*link*](#%e6%a1%88%e4%be%8b3-%e4%bd%bf%e7%94%a8delete)

```
final data = await supabase
  .from('countries')
  .delete()
  .rangeGte('population_range_millions', '[150, 250]');
```

### 案例4 (使用rpc) [*link*](#%e6%a1%88%e4%be%8b4-%e4%bd%bf%e7%94%a8rpc)

```
// Only valid if the Stored Procedure returns a table type.
final data = await supabase
  .rpc('echo_all_countries')
  .rangeGte('population_range_millions', '[150, 250]');
```

---

[*navigate\_before* rangeGt()](/docs/app/sdkdocs/dart/database/filter/rangegt/)

[rangeLt() *navigate\_next*](/docs/app/sdkdocs/dart/database/filter/rangelt/)