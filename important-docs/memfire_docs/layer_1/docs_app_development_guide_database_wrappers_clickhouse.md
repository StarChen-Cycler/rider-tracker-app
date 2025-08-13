# ClickHouse | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/wrappers/clickhouse/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

支持的数据类型

# ClickHouse

[ClickHouse](https://clickhouse.com/) 是一个快速的开源列式数据库管理系统，它允许使用 SQL 查询实时生成分析数据报告。

ClickHouse 封装器允许您在 Postgres 数据库中读取和写入 ClickHouse 的数据。

## 支持的数据类型 [*link*](#%e6%94%af%e6%8c%81%e7%9a%84%e6%95%b0%e6%8d%ae%e7%b1%bb%e5%9e%8b)

| Postgres 类型 | ClickHouse 类型 |
| --- | --- |
| boolean | UInt8 |
| smallint | Int16 |
| integer | UInt16 |
| integer | Int32 |
| bigint | UInt32 |
| bigint | Int64 |
| bigint | UInt64 |
| real | Float32 |
| double precision | Float64 |
| text | String |
| date | Date |
| timestamp | DateTime |

## 准备 [*link*](#%e5%87%86%e5%a4%87)

在开始之前，请确保您的数据库上安装了 `wrappers` 扩展：

```
create extension if not exists wrappers with schema extensions;
```

然后创建外部数据封装器:

```
create foreign data wrapper clickhouse_wrapper
handler click_house_fdw_handler
validator click_house_fdw_validator;
```

### 安全保护您的凭证（可选） [*link*](#%e5%ae%89%e5%85%a8%e4%bf%9d%e6%8a%a4%e6%82%a8%e7%9a%84%e5%87%ad%e8%af%81%e5%8f%af%e9%80%89)

默认情况下，Postgres 将 FDW 凭证以明文形式存储在 `pg_catalog.pg_foreign_server` 中。任何有权访问此表的人都能够查看这些凭证。封装器设计为与 [Vault](https://supabase.com/docs/guides/database/vault) 配合使用，Vault 为存储凭证提供了额外的安全级别。我们建议您使用 Vault 存储您的凭证。

```
-- Save your ClickHouse credential in Vault and retrieve the `key_id`
insert into vault.secrets (name, secret)
values (
  'clickhouse',
  'tcp://default:@localhost:9000/default'
)
returning key_id;
```

### 连接到 ClickHouse [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0-clickhouse)

我们需要为 Postgres 提供连接到 ClickHouse 的凭证和任何额外的选项。我们可以使用 `create server` 命令来完成这个操作：

使用Vault

```
create server clickhouse_server
foreign data wrapper clickhouse_wrapper
options (
  conn_string_id '<key_ID>' -- The Key ID from above.
);
```

不使用Vault

```
create server clickhouse_server
foreign data wrapper clickhouse_wrapper
options (
  conn_string 'tcp://default:@localhost:9000/default'
);
```

一些连接字符串示例：

* `tcp://user:password@host:9000/clicks?compression=lz4&ping_timeout=42ms`
* `tcp://default:PASSWORD@abc.eu-west-1.aws.clickhouse.cloud:9440/default?connection_timeout=30s&ping_before_query=false`

查看 [更多连接字符串参数](https://github.com/suharev7/clickhouse-rs#dns).

## 创建外部表 [*link*](#%e5%88%9b%e5%bb%ba%e5%a4%96%e9%83%a8%e8%a1%a8)

ClickHouse 封装器支持从 ClickHouse 读取和写入数据。

| Integration | Select | Insert | Update | Delete | Truncate |
| --- | --- | --- | --- | --- | --- |
| ClickHouse | ✅ | ✅ | ✅ | ✅ | ❌ |

例如：

```
create foreign table my_clickhouse_table (
  id bigint,
  name text
)
  server clickhouse_server
  options (
    table 'people'
  );
```

### 外部表选项 [*link*](#%e5%a4%96%e9%83%a8%e8%a1%a8%e9%80%89%e9%a1%b9)

完整的外部表选项如下：

* `table` - ClickHouse 中的源表名称，必需.

这也可是一个用括号括起来的子查询，例如，

```
table '(select * from my_table)'
```

[参数化视图](https://clickhouse.com/docs/en/sql-reference/statements/create/view#parameterized-view)也在子查询中得到支持。在这种情况下，您需要为每个参数定义一个列，并使用 `where` 来传递值给它们。例如，

```
create foreign table test_vw (
  id bigint,
  col1 text,
  col2 bigint,
  _param1 text,
  _param2 bigint
)
  server clickhouse_server
  options (
    table '(select * from my_view(column1=${_param1}, column2=${_param2}))'
  );

select * from test_vw where _param1='aaa' and _param2=32;
```

* `rowid_column` - 主键列名称，数据扫描时可选，数据修改时必需。

## 查询下推支持 [*link*](#%e6%9f%a5%e8%af%a2%e4%b8%8b%e6%8e%a8%e6%94%af%e6%8c%81)

这个 FDW 支持 `where`, `order by` 和 `limit` 子句下推，以及参数化视图（见上）.

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

一些关于如何使用 ClickHouse 外部表的示例。

### 基本示例 [*link*](#%e5%9f%ba%e6%9c%ac%e7%a4%ba%e4%be%8b)

这将在您的 Postgres 数据库中创建一个名为 `people` 的“外部表”：

```
-- Run below SQLs on ClickHouse to create source table
drop table if exists people;
create table people (
    id Int64,
    name String
)
engine=MergeTree()
order by id;

-- Add some test data
insert into people values (1, 'Luke Skywalker'), (2, 'Leia Organa'), (3, 'Han Solo');
```

Create foreign table on Postgres database:

```
create foreign table people (
  id bigint,
  name text
)
  server clickhouse_server
  options (
    table 'people'
  );

-- data scan
select * from people;

-- data modify
insert into people values (4, 'Yoda');
update people set name = 'Princess Leia' where id = 2;
delete from people where id = 3;
```

---

[*navigate\_before* BigQuery](/docs/app/development_guide/database/wrappers/bigquery/)

[Firebase *navigate\_next*](/docs/app/development_guide/database/wrappers/firebase/)