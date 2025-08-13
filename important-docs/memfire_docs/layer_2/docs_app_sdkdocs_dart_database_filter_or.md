# .or() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/filter/or/
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

# .or()

找到所有满足至少一个过滤器的行。

```
final data = await supabase
.from('cities')
.select('name, country_id')
.or('id.eq.20,id.eq.30');
```

## Notes [*link*](#notes)

* `.or()`希望你使用原始的[PostgREST语法](https://postgrest.org/en/stable/api.html#horizontal-filtering-rows)作为过滤器的名称和值。

  ```
  .or('id.in.(6,7),arraycol.cs.{"a","b"}')  // Use Postgres list () and 'in' for in_ filter. Array {} and 'cs' for contains.
  .or('id.in.(${mylist.join(',')}),arraycol.cs.{${mylistArray.join(',')}}')	// You can insert a Dart list for list or array column.
  .or('id.in.(${mylist.join(',')}),rangecol.cs.(${mylistRange.join(',')}]')	// You can insert a Dart list for list or range column.
  ```

## Examples [*link*](#examples)

### 使用 `select()` [*link*](#%e4%bd%bf%e7%94%a8-select)

```
final data = await supabase
.from('cities')
.select('name, country_id')
.or('id.eq.20,id.eq.30');
```

### 使用 `or`与 `and`。 [*link*](#%e4%bd%bf%e7%94%a8-or%e4%b8%8e-and)

```
final data = await supabase
.from('cities')
.select('name, country_id')
.or('id.gt.20,and(name.eq.New Zealand,name.eq.France)');
```

---

[*navigate\_before* .not()](/docs/app/sdkdocs/dart/database/filter/not/)

[.filter() *navigate\_next*](/docs/app/sdkdocs/dart/database/filter/filter/)