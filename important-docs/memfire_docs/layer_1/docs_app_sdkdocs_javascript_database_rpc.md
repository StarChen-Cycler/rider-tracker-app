# 调用Postgres函数 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/rpc/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# 调用Postgres函数

你可以将Postgres函数作为远程过程调用（Remote Procedure Calls）来调用，即你可以从任何地方执行数据库中的逻辑。
函数在逻辑很少更改时非常有用，比如用于密码重置和更新等情况。

下面是一个示例的 Postgres 函数定义：

```
create or replace function hello_world() returns text as $$
  select 'Hello world';
$$ language sql;
```

这个函数叫做`hello_world`，它不带参数，返回一个`text`类型的结果。函数的逻辑很简单，就是返回字符串`"Hello world"`。
你可以从任何地方调用这个函数，并获得结果`"Hello world"`。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （调用一个没有参数的Postgres函数） [*link*](#%e6%a1%88%e4%be%8b1--%e8%b0%83%e7%94%a8%e4%b8%80%e4%b8%aa%e6%b2%a1%e6%9c%89%e5%8f%82%e6%95%b0%e7%9a%84postgres%e5%87%bd%e6%95%b0)

```
create function hello_world() returns text as $$
  select 'Hello world';
$$ language sql;
```

```
const { data, error } = await supabase.rpc('hello_world')
```

```
{
  "data": "Hello world",
  "status": 200,
  "statusText": "OK"
}
```

### 案例2 （调用一个带参数的Postgres函数） [*link*](#%e6%a1%88%e4%be%8b2--%e8%b0%83%e7%94%a8%e4%b8%80%e4%b8%aa%e5%b8%a6%e5%8f%82%e6%95%b0%e7%9a%84postgres%e5%87%bd%e6%95%b0)

```
create function echo(say text) returns text as $$
  select say;
$$ language sql;
```

```
const { data, error } = await supabase.rpc('echo', { say: '👋' })
```

```
{
  "data": "👋",
  "status": 200,
  "statusText": "OK"
}
```

### 案例3 （批量处理） [*link*](#%e6%a1%88%e4%be%8b3--%e6%89%b9%e9%87%8f%e5%a4%84%e7%90%86)

```
create function add_one_each(arr int[]) returns int[] as $$
  select array_agg(n + 1) from unnest(arr) as n;
$$ language sql;
```

```
const { data, error } = await supabase.rpc('add_one_each', { arr: [1, 2, 3] })
```

```
{
  "data": [
    2,
    3,
    4
  ],
  "status": 200,
  "statusText": "OK"
}
```

你可以通过传入一个数组作为参数来处理大型有效载荷。

### 案例4 （调用带有过滤器的Postgres函数） [*link*](#%e6%a1%88%e4%be%8b4--%e8%b0%83%e7%94%a8%e5%b8%a6%e6%9c%89%e8%bf%87%e6%bb%a4%e5%99%a8%e7%9a%84postgres%e5%87%bd%e6%95%b0)

```
create table
  countries (id int8 primary key, name text);

insert into
  countries (id, name)
values
  (1, 'France'),
  (2, 'United Kingdom');

create function list_stored_countries() returns setof countries as $$
  select * from countries;
$$ language sql;
```

```
const { data, error } = await supabase
.rpc('list_stored_countries')
.eq('id', 1)
.single()
```

```
{
  "data": {
    "id": 1,
    "name": "France"
  },
  "status": 200,
  "statusText": "OK"
}
```

返回表格的 Postgres 函数还可以与[过滤器](/docs/app/SDKdocs/JavaScript/database/using-filters)和[修改器](/docs/app/SDKdocs/JavaScript/database/using-modifiers)相结合使用。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### fn [必要参数] `FunctionName类型`

  要调用的函数名称
* #### args [必要参数] `object类型`

  传递给函数调用的参数
* #### 选项（option） [必要参数] `object类型`

  命名的参数

  ##### 特性

  + #### count [可选参数] `exact` | `planned` | `estimated`

    用来计算更新行的计数算法。函数返回的行数。只适用于[返回集合的函数](https://www.postgresql.org/docs/current/functions-srf.html)。

    exact:可以精确计算行数，但执行速度较慢。执行 “COUNT(\*)“操作。

    planned:可以快速计算行数，但是结果可能略有偏差。使用了Postgres的统计数据。

    estimated:对于较小的数值使用精确计数，对于较大的数值使用计划计数。根据行数的大小决定使用精确计数或计划计数的算法。
  + #### head [可选参数] `boolean类型`

    当设置为 “true “时，“data “将不被返回。
    如果你只需要计数，则很有用。

## 参考资料 [*link*](#%e5%8f%82%e8%80%83%e8%b5%84%e6%96%99)

* [数据库函数](/docs/app/development_guide/database/functions/)

---

[*navigate\_before* Delete 数据](/docs/app/sdkdocs/javascript/database/delete/)

[使用过滤器 *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/using-filters/)