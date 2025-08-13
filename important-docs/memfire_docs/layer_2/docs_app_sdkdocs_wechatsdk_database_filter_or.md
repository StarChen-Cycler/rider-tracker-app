# or() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/filter/or/
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

# or()

仅匹配满足至少一个过滤条件的行。

or() 期望您使用原始的 [PostgREST语法](https://postgrest.org/en/stable/api.html#operators) 来指定过滤器的名称和值。

```
.or('id.in.(5,6,7), arraycol.cs.{"a","b"}')  // Use `()` for `in` filter, `{}` for array values and `cs` for `contains()`.
.or('id.in.(5,6,7), arraycol.cd.{"a","b"}')  // Use `cd` for `containedBy()`
```

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （和select一起使用） [*link*](#%e6%a1%88%e4%be%8b1--%e5%92%8cselect%e4%b8%80%e8%b5%b7%e4%bd%bf%e7%94%a8)

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
.or('id.eq.2,name.eq.Algeria')
```

```
{
  "data": [
    {
      "name": "Albania"
    },
    {
      "name": "Algeria"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

### 案例2 （与and一起使用or） [*link*](#%e6%a1%88%e4%be%8b2--%e4%b8%8eand%e4%b8%80%e8%b5%b7%e4%bd%bf%e7%94%a8or)

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
.or('id.gt.3,and(id.eq.1,name.eq.Afghanistan)')
```

### 案例3 （在外部表上使用or） [*link*](#%e6%a1%88%e4%be%8b3--%e5%9c%a8%e5%a4%96%e9%83%a8%e8%a1%a8%e4%b8%8a%e4%bd%bf%e7%94%a8or)

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
  (1, 'Germany'),
  (2, 'Indonesia');
insert into
  cities (id, country_id, name)
values
  (1, 2, 'Bali'),
  (2, 1, 'Munich');
```

```
const { data, error } = await supabase
.from('countries')
.select(`
  name,
  cities!inner (
    name
  )
`)
.or('country_id.eq.1,name.eq.Beijing', { foreignTable: 'cities' })
```

```
{
  "data": [
    {
      "name": "Germany",
      "cities": [
        {
          "name": "Munich"
        }
      ]
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 过滤器（filters） [必要参数] `string类型`

  使用的过滤器，遵循PostgREST的语法
* #### 外部表（foreignTable） [可选参数] `object类型`

  设置为过滤外域表而不是当前表

  ##### 特性

  + #### 外部表（foreignTable） [可选参数] `string类型`

---

[*navigate\_before* not()](/docs/app/sdkdocs/wechatsdk/database/filter/not/)

[filter() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/filter/filter/)