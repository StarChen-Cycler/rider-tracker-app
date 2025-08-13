# 时区 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/setting/managing-timezones/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

改变时区

# 时区

每个 Supabase 数据库都默认设置为 UTC 时区。我们强烈建议保持这种方式，即使你的用户在不同的地方。
这是因为，如果你采用 “我的数据库中的一切都在UTC时间 “的心理模式，那么计算不同时区的差异就会容易得多。

### 改变时区 [*link*](#%e6%94%b9%e5%8f%98%e6%97%b6%e5%8c%ba)

```
alter database postgres
set timezone to 'America/New_York';
```

### 时区的完整列表 [*link*](#%e6%97%b6%e5%8c%ba%e7%9a%84%e5%ae%8c%e6%95%b4%e5%88%97%e8%a1%a8)

获取你的数据库所支持的时区的完整列表。这将返回以下列：

* `name`: 时区名称
* `abbrev`: 时区缩略语
* `utc_offset`: 与UTC的偏移（正数表示格林威治以东）。
* `is_dst`: 如果目前遵守夏令时，则为真

```
select name, abbrev, utc_offset, is_dst
from pg_timezone_names()
order by name;
```

### 搜索一个特定的时区 [*link*](#%e6%90%9c%e7%b4%a2%e4%b8%80%e4%b8%aa%e7%89%b9%e5%ae%9a%e7%9a%84%e6%97%b6%e5%8c%ba)

使用`ilike`（不区分大小写的搜索）来寻找特定的时区。

```
select *
from pg_timezone_names()
where name ilike '%york%';
```

---

[*navigate\_before* Passwords](/docs/app/development_guide/database/setting/managing-passwords/)

[查询优化 *navigate\_next*](/docs/app/development_guide/database/setting/query-optimization/)