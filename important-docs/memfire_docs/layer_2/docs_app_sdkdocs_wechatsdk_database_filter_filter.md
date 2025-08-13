# filter() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/filter/filter/
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

# filter()

仅匹配满足过滤器条件的行。

尽管`filter()`函数是一种通用的筛选方式，但为了代码的可读性和维护性，官方建议优先使用特定的筛选方法，以利用更简洁和直观的筛选语法。
例如，使用`eq()`、`gt()`、`lt()`等特定的筛选方法，可以使查询更加清晰和易于理解。

`filter()` 期望您使用原始的 [PostgREST语法](https://postgrest.org/en/stable/api.html#operators) 来指定过滤器的值。

```
.filter('id', 'in', '(5,6,7)')  // Use `()` for `in` filter
.filter('arraycol', 'cs', '{"a","b"}')  // Use `cs` for `contains()`, `{}` for array values
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
.select()
.filter('name', 'in', '("Algeria","Japan")')
```

```
{
  "data": [
    {
      "id": 3,
      "name": "Algeria"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

### 案例2 （在外部表上） [*link*](#%e6%a1%88%e4%be%8b2--%e5%9c%a8%e5%a4%96%e9%83%a8%e8%a1%a8%e4%b8%8a)

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
.filter('cities.name', 'eq', 'Bali')
```

```
{
  "data": [
    {
      "name": "Indonesia",
      "cities": [
        {
          "name": "Bali"
        }
      ]
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的列
* #### 操作符（operator） [必要参数] `string类型`

  用来过滤的操作符，遵循PostgREST的语法
* #### 值（value） [必要参数] `任意类型`

  用来过滤的值，遵循PostgREST的语法

---

[*navigate\_before* or()](/docs/app/sdkdocs/wechatsdk/database/filter/or/)

[使用修改器 *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/modifier/using-modifiers/)