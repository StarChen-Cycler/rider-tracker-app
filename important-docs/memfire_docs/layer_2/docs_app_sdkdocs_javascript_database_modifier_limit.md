# limit() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/modifier/limit/
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

# limit()

通过`count`限制查询结果。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （使用select） [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8select)

```
create table
countries (id int8 primary key, name text);

insert into
countries (id, name)
values
(1, 'Afghanistan'),
(2, 'Albania'),
(3, 'Algeria');
```

```
const { data, error } = await supabase
.from('countries')
.select('name')
.limit(1)
```

```
{
"data": [
  {
    "name": "Afghanistan"
  }
],
"status": 200,
"statusText": "OK"
}
```

### 案例2 （在外键表中） [*link*](#%e6%a1%88%e4%be%8b2-%e5%9c%a8%e5%a4%96%e9%94%ae%e8%a1%a8%e4%b8%ad)

```
create table
countries (id int8 primary key, name text);
create table
cities (
  id int8 primary key,
  country_id int8 not null references countries,
  name text
);

insert into
countries (id, name)
values
(1, 'United States');
insert into
cities (id, country_id, name)
values
(1, 1, 'Atlanta'),
(2, 1, 'New York City');
```

```
const { data, error } = await supabase
.from('countries')
.select(`
  name,
  cities (
    name
  )
`)
.limit(1, { foreignTable: 'cities' })
```

```
{
"data": [
  {
    "name": "United States",
    "cities": [
      {
        "name": "Atlanta"
      }
    ]
  }
],
"status": 200,
"statusText": "OK"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### count [必要参数] `number类型`

  要返回的最大行数
* #### 选项（option） [可选参数] `object类型`

  命名的参数

  ##### 特性

  + #### foreignTable [可选参数] `string类型`

    设置此选项以限制外键表的行数而不是当前的表

---

[*navigate\_before* order()](/docs/app/sdkdocs/javascript/database/modifier/order/)

[range() *navigate\_next*](/docs/app/sdkdocs/javascript/database/modifier/range/)