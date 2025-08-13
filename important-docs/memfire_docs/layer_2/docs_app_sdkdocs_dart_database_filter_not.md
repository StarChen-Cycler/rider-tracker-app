# .not() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/filter/not/
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# .not()

找到所有不符合过滤器要求的行。

```
final data = await supabase
.from('cities')
.select('name, country_id')
.not('name', 'eq', 'Paris');
```

## Notes [*link*](#notes)

* `.not()`希望你使用原始的[PostgREST语法](https://postgrest.org/en/stable/api.html#horizontal-filtering-rows)作为过滤器的名称和值。

  ```
  .not('name','eq','Paris')
  .not('arraycol','cs','{"a","b"}') // Use Postgres array {} for array column and 'cs' for contains.
  .not('rangecol','cs','(1,2]') // Use Postgres range syntax for range column.
  .not('id','in','(6,7)')  // Use Postgres list () and 'in' for in_ filter.
  .not('id','in','(${mylist.join(',')})')  // You can insert a Dart list array.
  ```

## Examples [*link*](#examples)

### 使用 `select()` [*link*](#%e4%bd%bf%e7%94%a8-select)

```
final data = await supabase
.from('cities')
.select('name, country_id')
.not('name', 'eq', 'Paris');
```

### 使用 `update()` [*link*](#%e4%bd%bf%e7%94%a8-update)

```
final data = await supabase
.from('cities')
.update({ 'name': 'Mordor' })
.not('name', 'eq', 'Paris');
```

### 使用 `delete()` [*link*](#%e4%bd%bf%e7%94%a8-delete)

```
final data = await supabase
.from('cities')
.delete()
.not('name', 'eq', 'Paris');
```

### 使用 `rpc()` [*link*](#%e4%bd%bf%e7%94%a8-rpc)

```
// Only valid if the Stored Procedure returns a table type.
final data = await supabase
  .rpc('echo_all_cities)
  .not('name', 'eq', 'Paris');
```

---

[*navigate\_before* match()](/docs/app/sdkdocs/dart/database/filter/match/)

[.or() *navigate\_next*](/docs/app/sdkdocs/dart/database/filter/or/)