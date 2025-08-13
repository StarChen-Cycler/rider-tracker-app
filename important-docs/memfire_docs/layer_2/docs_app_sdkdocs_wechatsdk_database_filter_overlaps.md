# overlaps() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/filter/overlaps/
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

# overlaps()

仅适用于数组列和范围列

仅匹配`列（column）`和`值（value）`有一个共同元素的行。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （关于数组列） [*link*](#%e6%a1%88%e4%be%8b1--%e5%85%b3%e4%ba%8e%e6%95%b0%e7%bb%84%e5%88%97)

```
create table
issues (
  id int8 primary key,
  title text,
  tags text[]
);

insert into
issues (id, title, tags)
values
(1, 'Cache invalidation is not working', array['is:open', 'severity:high', 'priority:low']),
(2, 'Use better names', array['is:open', 'severity:low', 'priority:medium']);
```

```
const { data, error } = await supabase
.from('issues')
.select('title')
.overlaps('tags', ['is:closed', 'severity:high'])
```

```
{
"data": [
  {
    "title": "Cache invalidation is not working"
  }
],
"status": 200,
"statusText": "OK"
}
```

### 案例2 （关于范围列） [*link*](#%e6%a1%88%e4%be%8b2--%e5%85%b3%e4%ba%8e%e8%8c%83%e5%9b%b4%e5%88%97)

```
create table
reservations (
  id int8 primary key,
  room_name text,
  during tsrange
);

insert into
reservations (id, room_name, during)
values
(1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),
(2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');
```

```
const { data, error } = await supabase
.from('reservations')
.select()
.overlaps('during', '[2000-01-01 12:45, 2000-01-01 13:15)')
```

```
{
"data": [
  {
    "id": 1,
    "room_name": "Emerald",
    "during": "[\"2000-01-01 13:00:00\",\"2000-01-01 15:00:00\")"
  }
],
"status": 200,
"statusText": "OK"
}
```

Postgres 支持多种[范围类型](https://www.postgresql.org/docs/current/rangetypes.html)。您可以使用范围值的字符串表示来过滤范围列。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要进行过滤的数组或范围列
* #### 值（value） [必要参数] `object类型`

  用于过滤的数组或范围值

---

[*navigate\_before* rangeAdjacent()](/docs/app/sdkdocs/wechatsdk/database/filter/rangeadjacent/)

[textSearch() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/filter/textsearch/)