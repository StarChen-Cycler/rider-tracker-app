# range() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/modifier/range/
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

# range()

将结果限制在指定范围内的行，包括在内。

```
final data = await supabase
.from('cities')
.select('name, country_id')
.range(0,3);
```

## Examples [*link*](#examples)

### 使用 `select()` [*link*](#%e4%bd%bf%e7%94%a8-select)

```
final data = await supabase
.from('cities')
.select('name, country_id')
.range(0,3);
```

---

[*navigate\_before* limit()](/docs/app/sdkdocs/dart/database/modifier/limit/)

[single() *navigate\_next*](/docs/app/sdkdocs/dart/database/modifier/single/)