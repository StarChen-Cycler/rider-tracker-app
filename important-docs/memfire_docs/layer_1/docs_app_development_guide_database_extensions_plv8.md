# plv8: JavaScript语言 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/plv8/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

概述

# plv8: JavaScript语言

`plv8`扩展允许你在Postgres中使用JavaScript。

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

虽然Postgres原生运行SQL，但它也可以运行其他 “程序语言”。
`plv8`允许你运行JavaScript代码-特别是任何在[V8 JavaScript引擎](https://v8.dev)上运行的代码。

它可以用于数据库函数、触发器、查询等。

## 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

### 启用扩展 [*link*](#%e5%90%af%e7%94%a8%e6%89%a9%e5%b1%95)

1. 进入仪表板中的**数据库**页面。
2. 点击侧边栏中的*扩展*。
3. 搜索 “plv8 “并启用该扩展。

```
-- Example: enable the "plv8" extension
create extension plv8;

-- Example: disable the "plv8" extension
drop extension if exists plv8;
```

尽管SQL代码是`create extension`，但这相当于 “启用扩展”。
要禁用一个扩展，请调用`drop extension`。

程序语言会自动安装在`pg_catalog`中，所以你不需要指定模式。

### 创建`plv8`函数 [*link*](#%e5%88%9b%e5%bb%baplv8%e5%87%bd%e6%95%b0)

用`plv8`编写的函数和其他PostgreSQL函数一样，只是 语言标识符设置为`plv8`。

```
create or replace function function_name()
returns void as $$
    // V8 JavaScript
    // code
    // here
$$ language plv8;
```

你可以像其他Postgres函数一样调用`plv8`函数：

```
select function_name();
```

```
const { data, error } = supabase.rpc('function_name')
```

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

### 标量函数 [*link*](#%e6%a0%87%e9%87%8f%e5%87%bd%e6%95%b0)

一个[标量函数](https://plv8.github.io/#scalar-function-calls)是接受某些用户输入并返回单个结果。

```
create or replace function hello_world(name text)
returns text as $$

    let output = `Hello, ${name}!`;
    return output;

$$ language plv8;
```

### 正在执行SQL [*link*](#%e6%ad%a3%e5%9c%a8%e6%89%a7%e8%a1%8csql)

可以使用[`plv8.execute`函数](https://plv8.github.io/#plv8-execute)在`plv8`代码中执行SQL。

```
create or replace function update_user(id bigint, first_name text)
returns smallint as $$

    var num_affected = plv8.execute(
        'update profiles set first_name = $1 where id = $2',
        [first_name, id]
    );

    return num_affected;
$$ language plv8;
```

### 设置返回函数 [*link*](#%e8%ae%be%e7%bd%ae%e8%bf%94%e5%9b%9e%e5%87%bd%e6%95%b0)

一个[set-returning函数](https://plv8.github.io/#set-returning-function-calls)可以返回一整套结果–例如，表中的行。

```
create or replace function get_messages()
returns setof messages as $$

    var json_result = plv8.execute(
        'select * from messages'
    );

    return json_result;
$$ language plv8;
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* 官方[`plv8` 文档](https://plv8.github.io/)
* [plv8 GitHub库](https://github.com/plv8/plv8)

---

[*navigate\_before* pgTAP:单元测试](/docs/app/development_guide/database/extensions/pgtap/)

[uuid-ossp: 唯一标识符 *navigate\_next*](/docs/app/development_guide/database/extensions/uuid-ossp/)