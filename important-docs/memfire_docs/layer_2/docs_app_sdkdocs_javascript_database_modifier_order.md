# order() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/modifier/order/
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

# order()

按列对查询结果进行排序。

* 你可以多次调用这个方法来按多列排序。
* 你可以对外部表进行排序，但这并不影响对当前表的排序。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （使用select） [*link*](#%e6%a1%88%e4%be%8b1--%e4%bd%bf%e7%94%a8select)

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
.select('id', 'name')
.order('id', { ascending: false })
```

```
{
  "data": [
    {
      "id": 3,
      "name": "Algeria"
    },
    {
      "id": 2,
      "name": "Albania"
    },
    {
      "id": 1,
      "name": "Afghanistan"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

### 案例2 （在外部表） [*link*](#%e6%a1%88%e4%be%8b2--%e5%9c%a8%e5%a4%96%e9%83%a8%e8%a1%a8)

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
  (1, 'United States'),
  (2, 'Vanuatu');
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
.order('name', { foreignTable: 'cities', ascending: false })
```

```
{
  "data": [
    {
      "name": "United States",
      "cities": [
        {
          "name": "New York City"
        },
        {
          "name": "Atlanta"
        }
      ]
    },
    {
      "name": "Vanuatu",
      "cities": []
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

对外部表进行排序不会影响父表的排序。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要排序的列
* #### 选项（option） [可选参数] `[可选参数]`

  命名的参数

  ##### 特性

  + #### foreignTable [必要参数] `string类型`

    设置此选项以按外域表的列
  + #### ascending [可选参数] `boolean类型`

    如果 “true”，结果将按升序排列。
  + #### nullsFirst [可选参数] `boolean`

    如果 true，null首先出现。如果 false,则 null 出现在最后。

---

[*navigate\_before* select()](/docs/app/sdkdocs/javascript/database/modifier/db-modifiers-select/)

[limit() *navigate\_next*](/docs/app/sdkdocs/javascript/database/modifier/limit/)