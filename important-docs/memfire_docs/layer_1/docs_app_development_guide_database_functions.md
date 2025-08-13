# 数据库函数 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/functions/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

快速演示

# 数据库函数

Postgres内置了对[SQL函数](https://www.postgresql.org/docs/current/sql-createfunction.html)的支持。
这些函数存在于你的数据库中，它们可以[与API一起使用](/docs/app/sdkdocs/javascript/database/rpc/)。

## 快速演示 [*link*](#%e5%bf%ab%e9%80%9f%e6%bc%94%e7%a4%ba)

## 开始使用 [*link*](#%e5%bc%80%e5%a7%8b%e4%bd%bf%e7%94%a8)

Supabase 为创建数据库函数提供了几个选项。你可以使用仪表板或直接使用 SQL 创建它们。
我们在 Dashboard 中提供了一个 SQL 编辑器，或者你可以 [连接](/docs/app/development_guide/database/connecting-to-postgres/) 到数据库并自己运行SQL查询。

1. 进入 `SQL编辑器`栏。
2. 点击 `新查询`。
3. 输入创建或替换数据库功函数的SQL。
4. 点击 `运行`或cmd+enter (ctrl+enter)。

## 简单的函数 [*link*](#%e7%ae%80%e5%8d%95%e7%9a%84%e5%87%bd%e6%95%b0)

让我们创建一个基本的数据库函数，返回一个字符串 `hello world`.

```
create or replace function hello_world() -- 1
returns text -- 2
language sql -- 3
as $$  -- 4
  select 'hello world';  -- 5
$$; --6
```

显示/隐藏细节

最基本的是，一个函数有以下部分：

1. `create or replace function hello_world()`。函数声明，其中`hello_world`是函数的名称。你可以在创建一个新的函数时使用`create`，或者在替换一个现有函数时使用`replace`。或者你可以同时使用`create或replace`来处理这两种情况。
2. `returns text`: 函数返回的数据类型。如果它什么都不返回，你可以`returns void`。
3. `language sql': 在函数主体中使用的语言。这也可以是一种程序性语言：`plpgsql`,` plv8`,` plpython`等。
4. `as $$`: 函数包装器。任何包含在`$$`符号中的东西都将是函数主体的一部分。
5. `select 'hello world';`: 一个简单的函数体。如果函数体中的最后一条`select`语句后面没有语句，将被返回。
6. `$$;`: 函数封装器的结束符号。

函数创建后，我们有几种 “执行 “函数的方法–可以直接在数据库中使用SQL，也可以使用其中一个客户端库。

```
select hello_world();
```

```
const { data, error } = await supabase.rpc('hello_world')
```

参考资料: [rpc()](/docs/app/sdkdocs/javascript/database/rpc/)

```
final res = await supabase
.rpc('hello_world')
.execute();
```

Reference: [rpc()](/docs/app/sdkdocs/dart/database/rpc/)

## 返回数据集 [*link*](#%e8%bf%94%e5%9b%9e%e6%95%b0%e6%8d%ae%e9%9b%86)

数据库函数也可以从[数据表](/docs/app/development_guide/database/tables/)或视图中返回数据集。

例如，如果我们有一个数据库，里面有一些星球大战的数据。

#### Planets

| id | name |
| --- | --- |
| 1 | Tattoine |
| 2 | Alderaan |
| 3 | Kashyyyk |

#### People

| id | name | planet\_id |
| --- | --- | --- |
| 1 | Anakin Skywalker | 1 |
| 2 | Luke Skywalker | 1 |
| 3 | Princess Leia | 2 |
| 4 | Chewbacca | 3 |

```
create table planets (
  id serial primary key,
  name text
);

insert into planets (id, name)
values
  (1, 'Tattoine'),
  (2, 'Alderaan'),
  (3, 'Kashyyyk');

create table people (
  id serial primary key,
  name text,
  planet_id bigint references planets
);

insert into people (id, name, planet_id)
values
  (1, 'Anakin Skywalker', 1),
  (2, 'Luke Skywalker', 1),
  (3, 'Princess Leia', 2),
  (4, 'Chewbacca', 3);
```

我们可以创建一个函数，返回所有的星球：

```
create or replace function get_planets()
returns setof planets
language sql
as $$
  select * from planets;
$$;
```

因为这个函数返回一个表集，我们也可以应用过滤器和选择器。例如，如果我们只想要第一个星球：

```
select *
from get_planets()
where id = 1;
```

```
const { data, error } = supabase.rpc('get_planets').eq('id', 1)
```

```
final res = await supabase
.rpc('get_planets')
.eq('id', 1)
.execute();
```

## 传递参数 [*link*](#%e4%bc%a0%e9%80%92%e5%8f%82%e6%95%b0)

让我们创建一个函数，在`planets`表中插入一个新的行星并返回新的ID。注意，这次我们使用的是`plpgsql`语言。

```
create or replace function add_planet(name text)
returns bigint
language plpgsql
as $$
declare
  new_row bigint;
begin
  insert into planets(name)
  values (add_planet.name)
  returning id into new_row;

  return new_row;
end;
$$;
```

再一次，你可以在数据库中使用`select`查询来执行这个函数，或者使用客户端库。

```
select * from add_planet('Jakku');
```

```
const { data, error } = await supabase.rpc('add_planet', { name: 'Jakku' })
```

```
final res = await supabase
.rpc('add_planet', params: { 'name': 'Jakku' })
.execute();
```

## 建议 [*link*](#%e5%bb%ba%e8%ae%ae)

### 数据库函数vs边缘函数 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93%e5%87%bd%e6%95%b0vs%e8%be%b9%e7%bc%98%e5%87%bd%e6%95%b0)

对于数据密集型的操作，使用数据库函数，它在你的数据库中执行并可以使用REST和GraphQL API远程调用。

对于需要低延迟的使用情况，使用[边缘函数](/docs/app/development_guide/functions/overview/)，它是全局分布的，可以用Typescript编写。

### 安全性 `definer`vs `invoker` [*link*](#%e5%ae%89%e5%85%a8%e6%80%a7-definervs-invoker)

Postgres允许你指定是作为调用函数的用户（`invoker`），还是作为函数的创建者（`definer`）来执行函数。比如说:

```
create function hello_world()
returns text
language plpgsql
security definer set search_path = public
as $$
begin
  select 'hello world';
end;
$$;
```

最好的做法是使用`security invoker`（这也是默认的）。如果你使用`security definer`，你必须设置`search_path`。
这限制了潜在的损害，如果你允许访问执行该函数的用户不应该有的模式。

### 函数的权限 [*link*](#%e5%87%bd%e6%95%b0%e7%9a%84%e6%9d%83%e9%99%90)

默认情况下，数据库函数可以由任何角色执行。你可以通过改变默认权限来限制这一点，然后选择哪些角色可以执行功能。

```
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Choose which roles can execute functions
GRANT EXECUTE ON FUNCTION hello_world TO authenticated;
GRANT EXECUTE ON FUNCTION hello_world TO service_role;
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* 官方客户端库: [JavaScript](/docs/app/sdkdocs/javascript/database/rpc/) and [Flutter](../../reference/dart/rpc)
* 社区客户端库: [github.com/supabase-community](https://github.com/supabase-community)
* PostgreSQL官方文档: [第9章 函数和运算符](https://www.postgresql.org/docs/current/functions.html)
* PostgreSQL参考资料: [创建函数](https://www.postgresql.org/docs/9.1/sql-createfunction.html)

## 深度挖掘 [*link*](#%e6%b7%b1%e5%ba%a6%e6%8c%96%e6%8e%98)

### 创建数据库函数 [*link*](#%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e5%ba%93%e5%87%bd%e6%95%b0)

### 使用JavaScript调用数据库函数 [*link*](#%e4%bd%bf%e7%94%a8javascript%e8%b0%83%e7%94%a8%e6%95%b0%e6%8d%ae%e5%ba%93%e5%87%bd%e6%95%b0)

### 使用数据库函数来调用外部API [*link*](#%e4%bd%bf%e7%94%a8%e6%95%b0%e6%8d%ae%e5%ba%93%e5%87%bd%e6%95%b0%e6%9d%a5%e8%b0%83%e7%94%a8%e5%a4%96%e9%83%a8api)

---

[*navigate\_before* 外部数据包装器(FDW)](/docs/app/development_guide/database/wrappers/overview/)

[表格和数据 *navigate\_next*](/docs/app/development_guide/database/tables/)