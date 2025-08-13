# uuid-ossp: 唯一标识符 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/uuid-ossp/
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

# uuid-ossp: 唯一标识符

`uuid-ossp`扩展可用于生成`UID`。

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

`UUID`是一个 `通用唯一标识符`，在实际应用中，它是唯一的。
这使得它们特别适合作为主键。它有时也被称为 `GUID`，代表 `全球唯一标识符`。

## 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

### 启用扩展名 [*link*](#%e5%90%af%e7%94%a8%e6%89%a9%e5%b1%95%e5%90%8d)

1. 进入仪表板中的**数据库**页面。
2. 点击侧边栏中的*扩展*。
3. 搜索 `uuid-ossp`并启用该扩展。

**Note**:
目前 `uuid-ossp`扩展被默认启用，不能被禁用。

```
-- Example: enable the "uuid-ossp" extension
create extension "uuid-ossp" with schema extensions;

-- Example: disable the "uuid-ossp" extension
drop extension if exists "uuid-ossp";
```

尽管SQL代码是`create extension`，但这相当于 “启用扩展”。
要禁用一个扩展，请调用`drop extension`。

程序语言会自动安装在`pg_catalog`中，所以你不需要指定模式。

**Note**:
目前 `uuid-ossp`扩展被默认启用，不能被禁用。

### `Uuid`类型 [*link*](#uuid%e7%b1%bb%e5%9e%8b)

一旦扩展被启用，你现在可以访问一个`uuid`类型。

### `uuid_generate_v1()` [*link*](#uuid_generate_v1)

根据计算机的MAC地址、当前时间戳和一个随机值的组合创建一个UUID值。

info

UUIDv1泄露了可识别的细节，这可能使它不适合于某些安全敏感的应用.

### `uuid_generate_v4()` [*link*](#uuid_generate_v4)

创建完全基于随机数的UUID值。你也可以使用Postgres内置的[`gen_random_uuid()`](https://www.postgresql.org/docs/current/functions-uuid.html)函数来生成一个UUIDv4。

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

### 在一个查询中 [*link*](#%e5%9c%a8%e4%b8%80%e4%b8%aa%e6%9f%a5%e8%af%a2%e4%b8%ad)

```
select uuid_generate_v4();
```

### 作为主键 [*link*](#%e4%bd%9c%e4%b8%ba%e4%b8%bb%e9%94%ae)

在表中自动创建唯一的随机ID：

```
create table contacts (
  id uuid default uuid_generate_v4(),
  first_name text,
  last_name text,

  primary key (id)
);
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* [选择一个Postgres主键](https://supabase.com/blog/choosing-a-postgres-primary-key)
* [PostgreSQL `UID`数据类型的基础知识](https://www.postgresqltutorial.com/postgresql-uuid/)

---

[*navigate\_before* plv8: JavaScript语言](/docs/app/development_guide/database/extensions/plv8/)

[超时 *navigate\_next*](/docs/app/development_guide/database/setting/timeouts/)