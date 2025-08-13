# .filter() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/filter/filter/
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

# .filter()

找到所有`column`符合过滤器的记录。

```
final data = await supabase
.from('cities')
.select('name, country_id')
.filter('name', 'in', '("Paris","Tokyo")');
```

## Notes [*link*](#notes)

* `.filter()`希望你使用原始的[PostgREST语法](https://postgrest.org/en/stable/api.html#horizontal-filtering-rows)来表示过滤器的名称和值，所以它只能作为其他过滤器不工作时的一个转义。

  ```
  .filter('arraycol','cs','{"a","b"}') // Use Postgres array {} and 'cs' for contains.
  .filter('rangecol','cs','(1,2]') // Use Postgres range syntax for range column.
  .filter('id','in','(6,7)')  // Use Postgres list () and 'in' for in_ filter.
  .filter('id','cs','{${mylist.join(',')}}')  // You can insert a Dart array list.
  ```

## Examples [*link*](#examples)

### 使用 `select()` [*link*](#%e4%bd%bf%e7%94%a8-select)

```
final data = await supabase
.from('cities')
.select('name, country_id')
.filter('name', 'in', '("Paris","Tokyo")');
```

### 使用 `update()` [*link*](#%e4%bd%bf%e7%94%a8-update)

```
final data = await supabase
.from('cities')
.update({ 'name': 'Mordor' })
.filter('name', 'in', '("Paris","Tokyo")');
```

### 使用 `delete()` [*link*](#%e4%bd%bf%e7%94%a8-delete)

```
final data = await supabase
.from('cities')
.delete()
.filter('name', 'in', '("Paris","Tokyo")');
```

### 使用 `rpc()` [*link*](#%e4%bd%bf%e7%94%a8-rpc)

```
// Only valid if the Stored Procedure returns a table type.
final data = await supabase
  .rpc('echo_all_cities')
  .filter('name', 'in', '("Paris","Tokyo")');
```

### Filter embedded resources [*link*](#filter-embedded-resources)

```
final data = await supabase
.from('cities')
.select('name, countries ( name )')
.filter('countries.name', 'in', '("France","Japan")');
```

---

[*navigate\_before* .or()](/docs/app/sdkdocs/dart/database/filter/or/)

[Using Modifiers *navigate\_next*](/docs/app/sdkdocs/dart/database/modifier/using-modifiers/)