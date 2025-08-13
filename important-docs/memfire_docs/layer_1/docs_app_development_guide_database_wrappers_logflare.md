# Logflare | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/wrappers/logflare/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

准备

# Logflare

[Logflare](https://logflare.app) 是一个集中式的基于 Web 的日志管理解决方案，可以轻松访问 Cloudflare、Vercel 和 Elixir 的日志。

Logflare 封装器允许您在 Postgres 数据库中读取来自 Logflare 端点的数据。

## 准备 [*link*](#%e5%87%86%e5%a4%87)

在开始之前，请确保您的数据库上安装了`wrappers` 扩展：

```
create extension if not exists wrappers with schema extensions;
```

然后创建外部数据封装器：

```
create foreign data wrapper logflare_wrapper
handler logflare_fdw_handler
validator logflare_fdw_validator;
```

### 安全保护您的凭证（可选） [*link*](#%e5%ae%89%e5%85%a8%e4%bf%9d%e6%8a%a4%e6%82%a8%e7%9a%84%e5%87%ad%e8%af%81%e5%8f%af%e9%80%89)

默认情况下，Postgres 将外部数据封装器（FDW）的凭证以明文形式存储在 `pg_catalog.pg_foreign_server` 表中。任何有权访问此表的人都能够查看这些凭证。封装器设计为与[Vault](https://supabase.com/docs/guides/database/vault) 配合使用，Vault 提供了额外的安全级别来存储凭证。我们建议您使用 Vault 来存储您的凭证。

```
-- Save your Logflare API key in Vault and retrieve the `key_id`
insert into vault.secrets (name, secret)
values (
  'logflare',
  'YOUR_SECRET'
)
returning key_id;
```

### 连接到Logflare [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0logflare)

我们需要为 Postgres 提供连接到 Logflare 的凭证以及任何额外的选项。我们可以使用 `create server` 命令来完成这个操作：

使用Vault

```
create server logflare_server
foreign data wrapper logflare_wrapper
options (
  api_key_id '<key_ID>' -- The Key ID from above.
);
```

不使用Vault

```
create server logflare_server
foreign data wrapper logflare_wrapper
options (
  api_key '<Logflare API Key>' -- Logflare API key, required
);
```

## 创建外部表 [*link*](#%e5%88%9b%e5%bb%ba%e5%a4%96%e9%83%a8%e8%a1%a8)

Logflare 封装器支持从 Logflare 的端点读取数据。

| Integration | Select | Insert | Update | Delete | Truncate |
| --- | --- | --- | --- | --- | --- |
| Logflare | ✅ | ❌ | ❌ | ❌ | ❌ |

例如：

```
create foreign table my_logflare_table (
  id bigint,
  name text,
  _result text
)
  server logflare_server
  options (
    endpoint '9dd9a6f6-8e9b-4fa4-b682-4f2f5cd99da3'
  );
```

### 元数据列 [*link*](#%e5%85%83%e6%95%b0%e6%8d%ae%e5%88%97)

您可以在外部表中定义一个特定的元数据列 `_result`（数据类型：`text`）。它将存储整个结果记录的 JSON 字符串格式，因此您可以使用 Postgres JSON 查询（如 `_result::json->>'foo'`）从中提取任何字段。请参阅下面的更多示例。

### 查询参数 [*link*](#%e6%9f%a5%e8%af%a2%e5%8f%82%e6%95%b0)

可以通过特定的参数列（如 `_param_foo` 和 `_param_bar`）传递 Logflare 端点查询参数。请参阅下面的更多示例。

### 外部表选项 [*link*](#%e5%a4%96%e9%83%a8%e8%a1%a8%e9%80%89%e9%a1%b9)

完整的外部表选项列表如下：

* `endpoint` - Logflare 端点的 UUID 或名称，必需.

## 查询下推支持 [*link*](#%e6%9f%a5%e8%af%a2%e4%b8%8b%e6%8e%a8%e6%94%af%e6%8c%81)

This FDW doesn’t support query pushdown.

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

一些关于如何使用 Logflare 外部表的示例。

### 基本示例 [*link*](#%e5%9f%ba%e6%9c%ac%e7%a4%ba%e4%be%8b)

假设 Logflare 端点的响应如下：

```
[
  {
    "id": 123,
    "name": "foo"
  }
]
```

然后我们可以这样定义一个外部表：

```
create foreign table people (
  id bigint,
  name text,
  _result text
)
  server logflare_server
  options (
    endpoint '9dd9a6f6-8e9b-4fa4-b682-4f2f5cd99da3'
  );

select * from people;
```

### 查询参数示例 [*link*](#%e6%9f%a5%e8%af%a2%e5%8f%82%e6%95%b0%e7%a4%ba%e4%be%8b)

假设 Logflare 端点接受 3 个参数：

1. org\_id
2. iso\_timestamp\_start
3. iso\_timestamp\_end

并且它的响应如下所示：

```
[
  {
    "db_size": "large",
    "org_id": "123",
    "runtime_hours": 21.95,
    "runtime_minutes": 1317
  }
]
```

我们可以像这样定义一个外部表和参数列：

```
create foreign table runtime_hours (
  db_size text,
  org_id text,
  runtime_hours numeric,
  runtime_minutes bigint,
  _param_org_id bigint,
  _param_iso_timestamp_start text,
  _param_iso_timestamp_end text,
  _result text
)
  server logflare_server
  options (
    endpoint 'my.custom.endpoint'
  );
```

并且可以像这样使用参数进行查询：

```
select
  db_size,
  org_id,
  runtime_hours,
  runtime_minutes
from
  runtime_hours
where _param_org_id = 123
  and _param_iso_timestamp_start = '2023-07-01 02:03:04'
  and _param_iso_timestamp_end = '2023-07-02';
```

---

[*navigate\_before* Firebase](/docs/app/development_guide/database/wrappers/firebase/)

[Stripe *navigate\_next*](/docs/app/development_guide/database/wrappers/stripe/)