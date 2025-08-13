# single() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/modifier/single/
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

# single()

只从结果中检索一条记录。结果必须是一行(例如,使用limit)，否则会导致错误。

```
final data = await supabase
.from('cities')
.select('name, country_id')
.single();
```

## Examples [*link*](#examples)

### 使用 `select()` [*link*](#%e4%bd%bf%e7%94%a8-select)

```
final data = await supabase
.from('cities')
.select('name, country_id')
.single();
```

---

[*navigate\_before* range()](/docs/app/sdkdocs/dart/database/modifier/range/)

[signUp() *navigate\_next*](/docs/app/sdkdocs/dart/auth/auth-signup/)