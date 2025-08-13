# Airtable | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/wrappers/airtable/
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

# Airtable

[Airtable](https://www.airtable.com) 是一个易于使用的在线平台，用于创建和共享关系型数据库。

Airtable 封装器允许您在 Postgres 数据库中读取您的 Airtable 基础/表中的数据。

## 准备 [*link*](#%e5%87%86%e5%a4%87)

在开始之前，请确保您的数据库上安装了 `wrappers`扩展：

```
create extension if not exists wrappers with schema extensions;
```

然后创建外部数据封装器：

```
create foreign data wrapper airtable_wrapper
handler airtable_fdw_handler
validator airtable_fdw_validator;
```

### 安全保护您的凭证（可选） [*link*](#%e5%ae%89%e5%85%a8%e4%bf%9d%e6%8a%a4%e6%82%a8%e7%9a%84%e5%87%ad%e8%af%81%e5%8f%af%e9%80%89)

默认情况下，Postgres 将 FDW 凭证以明文形式存储在 `pg_catalog.pg_foreign_server` 中。任何有权访问此表的人都能够查看这些凭证。封装器设计为与 [Vault](https://supabase.com/docs/guides/database/vault) 配合使用，Vault 为存储凭证提供了额外的安全级别。我们建议您使用 Vault 存储您的凭证。

```
-- Save your Airtable API key in Vault and retrieve the `key_id`
insert into vault.secrets (name, secret)
values (
  'airtable',
  '<Airtable API Key or PAT>' -- Airtable API key or Personal Access Token (PAT)
)
returning key_id;
```

### 连接到 Airtable [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0-airtable)

我们需要为 Postgres 提供连接到 Airtable 的凭证和任何额外的选项。我们可以使用 `create server`命令来完成这个操作：

使用Vault

```
create server airtable_server
foreign data wrapper airtable_wrapper
options (
  api_key_id '<key_ID>' -- The Key ID from above.
);
```

不使用Vault

```
create server airtable_server
foreign data wrapper airtable_wrapper
options (
  api_url 'https://api.airtable.com/v0',  -- Airtable API url, optional
  api_key '<Airtable API Key or PAT>'  -- Airtable API key or Personal Access Token (PAT), required
);
```

## 创建外部表 [*link*](#%e5%88%9b%e5%bb%ba%e5%a4%96%e9%83%a8%e8%a1%a8)

Airtable 封装器支持从 Airtable 的 [Records](https://airtable.com/developers/web/api/list-records) 端点（只读）读取数据。

| Airtable | Select | Insert | Update | Delete | Truncate |
| --- | --- | --- | --- | --- | --- |
| Records | ✅ | ❌ | ❌ | ❌ | ❌ |

例如：

```
create foreign table my_foreign_table (
  name text
  -- other fields
)
server airtable_server
options (
  base_id 'appXXXX',
  table_id 'tblXXXX'
);
```

### 外部表选项 [*link*](#%e5%a4%96%e9%83%a8%e8%a1%a8%e9%80%89%e9%a1%b9)

完整的外部表选项如下：

* `base_id` - 表所属的 Airtable 基础 ID，必需。
* `table_id` - Airtable 表 ID，必需。
* `view_id` - Airtable 视图 ID，可选。

## 查询下推支持 [*link*](#%e6%9f%a5%e8%af%a2%e4%b8%8b%e6%8e%a8%e6%94%af%e6%8c%81)

这个 FDW 不支持查询下推。

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

一些关于如何使用 Airtable 外部表的示例。

### 基本示例 [*link*](#%e5%9f%ba%e6%9c%ac%e7%a4%ba%e4%be%8b)

这将在您的 Postgres 数据库中创建一个名为 `airtable_table` 的“外部表”：

```
create foreign table airtable_table (
  name text,
  notes text,
  content text,
  amount numeric,
  updated_at timestamp
)
server airtable_server
options (
  base_id 'appTc3yI68KN6ukZc',
  table_id 'tbltiLinE56l3YKfn'
);
```

现在可以从 Postgres 数据库中获取您的 Airtable 数据：

```
select * from airtable_table;
```

我们还可以从名为 `airtable_view` 的 Airtable 视图中创建一个外部表：

```
create foreign table airtable_view (
  name text,
  notes text,
  content text,
  amount numeric,
  updated_at timestamp
)
server airtable_server
options (
  base_id 'appTc3yI68KN6ukZc',
  table_id 'tbltiLinE56l3YKfn',
  view_id 'viwY8si0zcEzw3ntZ'
);

select * from airtable_view;
```

---

[*navigate\_before* 查询优化](/docs/app/development_guide/database/setting/query-optimization/)

[AWS S3 *navigate\_next*](/docs/app/development_guide/database/wrappers/s3/)