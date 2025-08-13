# order() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/modifier/order/
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

# order()

用指定的列对结果进行排序。

```
final data = await supabase
.from('cities')
.select('name, country_id')
.order('id',  ascending: false );
```

## Examples [*link*](#examples)

### 使用 `select()` [*link*](#%e4%bd%bf%e7%94%a8-select)

```
final data = await supabase
.from('cities')
.select('name, country_id')
.order('id',  ascending: false );
```

### 有嵌入式资源 [*link*](#%e6%9c%89%e5%b5%8c%e5%85%a5%e5%bc%8f%e8%b5%84%e6%ba%90)

```
final data = await supabase
.from('countries')
.select('name, cities(name)')
.eq('name', 'United States')
.order('name', foreignTable: 'cities');
```

---

[*navigate\_before* Using Modifiers](/docs/app/sdkdocs/dart/database/modifier/using-modifiers/)

[limit() *navigate\_next*](/docs/app/sdkdocs/dart/database/modifier/limit/)