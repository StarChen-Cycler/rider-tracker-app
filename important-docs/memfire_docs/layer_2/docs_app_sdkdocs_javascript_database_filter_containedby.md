# containedBy() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/containedby/
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

# containedBy()

该方法仅用于在 jsonb、数组（array）和范围（range）列上进行过滤

contains()的作用是匹配那些其中每个元素都被包含在指定的值中的行。

换句话说，在指定列中，给定的`数组（array）`是匹配出来的记录值的子集

也就是说，在指定列中，匹配出来的记录的值包含了给定的`数组（array）`的所有元素。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （关于数组列） [*link*](#%e6%a1%88%e4%be%8b1-%e5%85%b3%e4%ba%8e%e6%95%b0%e7%bb%84%e5%88%97)

```
create table
classes (
  id int8 primary key,
  name text,
  days text[]
);

insert into
classes (id, name, days)
values
(1, 'Chemistry', array['monday', 'friday']),
(2, 'History', array['monday', 'wednesday', 'thursday']);
```

```
const { data, error } = await supabase
.from('classes')
.select('name')
.containedBy('days', ['monday', 'tuesday', 'wednesday', 'friday'])
```

```
{
"data": [
  {
    "name": "Chemistry"
  }
],
"status": 200,
"statusText": "OK"
}
```

### 案例2 （关于范围列） [*link*](#%e6%a1%88%e4%be%8b2-%e5%85%b3%e4%ba%8e%e8%8c%83%e5%9b%b4%e5%88%97)

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
.containedBy('during', '[2000-01-01 00:00, 2000-01-01 23:59)')
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

### 案例3 （关于jsonb列） [*link*](#%e6%a1%88%e4%be%8b3-%e5%85%b3%e4%ba%8ejsonb%e5%88%97)

```
create table
users (
  id int8 primary key,
  name text,
  address jsonb
);

insert into
users (id, name, address)
values
(1, 'Michael', '{ "postcode": 90210, "street": "Melrose Place" }'),
(2, 'Jane', '{}');
```

```
const { data, error } = await supabase
.from('users')
.select('name')
.containedBy('address', {})
```

```
{
  "data": [
    {
      "name": "Jane"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的jsonb、数组或范围列
* #### 值（value） [必要参数] `object类型`

  用来过滤的jsonb、数组或范围值

---

[*navigate\_before* contains()](/docs/app/sdkdocs/javascript/database/filter/contains/)

[rangeGt() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/rangegt/)