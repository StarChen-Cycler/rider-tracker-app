# rangeGt() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/rangegt/
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

# rangeGt()

仅适用于范围（range）列

仅匹配`列`中的每个元素都大于`范围(range)`中的任何元素的行。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (使用select) [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8select)

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
.rangeGt('during', '[2000-01-02 08:00, 2000-01-02 09:00)')
```

```
{
  "data": [
    {
      "id": 2,
      "room_name": "Topaz",
      "during": "[\"2000-01-02 09:00:00\",\"2000-01-02 10:00:00\")"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

Postgres 支持多种[范围类型](https://www.postgresql.org/docs/current/rangetypes.html)。您可以使用范围值的字符串表示来过滤范围列。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的范围列
* #### range [必要参数] `string类型`

  用来过滤的范围

---

[*navigate\_before* containedBy()](/docs/app/sdkdocs/javascript/database/filter/containedby/)

[rangeGte() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/rangegte/)