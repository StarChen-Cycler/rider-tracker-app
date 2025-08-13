# BigQuery | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/wrappers/bigquery/
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

# BigQuery

[BigQuery](https://cloud.google.com/bigquery) 是一个完全无服务器的、成本效益高的企业级数据仓库，它可以跨云工作，并且随着数据的增长而扩展，内置了商业智能（BI）、机器学习和人工智能（AI）。

TBigQuery 封装器允许您在 Postgres 数据库中读取和写入 BigQuery 的数据。

## 支持的数据类型 [*link*](#%e6%94%af%e6%8c%81%e7%9a%84%e6%95%b0%e6%8d%ae%e7%b1%bb%e5%9e%8b)

| Postgres 类型 | BigQuery 类型 |
| --- | --- |
| boolean | BOOL |
| bigint | INT64 |
| double precision | FLOAT64 |
| numeric | NUMERIC |
| text | STRING |
| varchar | STRING |
| date | DATE |
| timestamp | DATETIME |
| timestamp | TIMESTAMP |

## 准备 [*link*](#%e5%87%86%e5%a4%87)

在开始之前，请确保您的数据库上安装了 `wrappers` 扩展：

```
create extension if not exists wrappers with schema extensions;
```

然后创建外部数据封装器：

```
create foreign data wrapper bigquery_wrapper
handler big_query_fdw_handler
validator big_query_fdw_validator;
```

### 安全保护您的凭证（可选） [*link*](#%e5%ae%89%e5%85%a8%e4%bf%9d%e6%8a%a4%e6%82%a8%e7%9a%84%e5%87%ad%e8%af%81%e5%8f%af%e9%80%89)

默认情况下，Postgres 将 FDW 凭证以明文形式存储在`pg_catalog.pg_foreign_server` 中。任何有权访问此表的人都能够查看这些凭证。封装器设计为与 [Vault](https://supabase.com/docs/guides/database/vault) 配合使用，Vault 为存储凭证提供了额外的安全级别。我们建议您使用 Vault 存储您的凭证。

```
-- Save your BigQuery service account json in Vault and retrieve the `key_id`
insert into vault.secrets (name, secret)
values (
  'bigquery',
  '
    {
      "type": "service_account",
      "project_id": "your_gcp_project_id",
      "private_key_id": "your_private_key_id",
      "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
      ...
    }
  '
)
returning key_id;
```

### 连接到 BigQuery [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0-bigquery)

我们需要为 Postgres 提供连接到 BigQuery 的凭证和任何额外的选项。我们可以使用 `create server` 命令来完成这个操作：

使用Vault

```
create server bigquery_server
foreign data wrapper bigquery_wrapper
options (
  sa_key_id '<key_ID>', -- The Key ID from above.
  project_id 'your_gcp_project_id',
  dataset_id 'your_gcp_dataset_id'
);
```

不使用Vault

```
create server bigquery_server
foreign data wrapper bigquery_wrapper
options (
  sa_key '
  {
     "type": "service_account",
     "project_id": "your_gcp_project_id",
     ...
  }
 ',
  project_id 'your_gcp_project_id',
  dataset_id 'your_gcp_dataset_id'
);
```

## 创建外部表 [*link*](#%e5%88%9b%e5%bb%ba%e5%a4%96%e9%83%a8%e8%a1%a8)

BigQuery 封装器支持从 BigQuery 读取和写入数据。

| Integration | Select | Insert | Update | Delete | Truncate |
| --- | --- | --- | --- | --- | --- |
| BigQuery | ✅ | ✅ | ✅ | ✅ | ❌ |

例如：

```
create foreign table my_bigquery_table (
  id bigint,
  name text,
  ts timestamp
)
  server bigquery_server
  options (
    table 'people',
    location 'EU'
  );
```

### 外部表选项 [*link*](#%e5%a4%96%e9%83%a8%e8%a1%a8%e9%80%89%e9%a1%b9)

完整的外部表选项如下：

* `table` - BigQuery 中的源表或视图名称，必需.

这也可是一个用括号括起来的子查询，例如,

```
table '(select * except(props), to_json_string(props) as props from `my_project.my_dataset.my_table`)'
```

**注意**: 当在此选项中使用子查询时，必须使用完整的限定表名.

* `location` - 源表位置，可选。默认为 ‘US’.
* `timeout` - 查询请求超时时间（毫秒），可选。默认为 ‘30000’ (30 秒).
* `rowid_column` - 主键列名称，数据扫描时可选，数据修改时必需.

## 查询下推支持 [*link*](#%e6%9f%a5%e8%af%a2%e4%b8%8b%e6%8e%a8%e6%94%af%e6%8c%81)

这个 FDW 支持 `where`, `order by` 和 `limit` 子句下推.

## 插入行 & 流缓冲区 [*link*](#%e6%8f%92%e5%85%a5%e8%a1%8c--%e6%b5%81%e7%bc%93%e5%86%b2%e5%8c%ba)

这个外部数据封装器使用 BigQuery 的 `insertAll` API 方法创建一个带有关联分区时间的 `streamingBuffer`。**在该分区时间内，数据不能被更新、删除或完全导出**。只有在时间过去之后（根据 [BigQuery’s 文档](https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery) 最多 90 分钟），您才能执行操作。

如果您尝试在 streamingBuffer 中的行上执行 `UPDATE` 或 `DELETE` 语句，您将收到 `UPDATE` 或 `DELETE`语句在表 datasetName 上的错误 - 请注意，表名会影响流缓冲区中的行，这是不支持的。

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

一些关于如何使用 BigQuery 外部表的示例。

首先，让我们在 BigQuery 中准备源表：

```
-- Run below SQLs on BigQuery to create source table
create table your_project_id.your_dataset_id.people (
  id int64,
  name string,
  ts timestamp
);

-- Add some test data
insert into your_project_id.your_dataset_id.people values
  (1, 'Luke Skywalker', current_timestamp()),
  (2, 'Leia Organa', current_timestamp()),
  (3, 'Han Solo', current_timestamp());
```

### 基本示例 [*link*](#%e5%9f%ba%e6%9c%ac%e7%a4%ba%e4%be%8b)

这个示例将在您的 Postgres 数据库中创建一个名为`people`的“外部表”并查询其数据：

```
create foreign table people (
  id bigint,
  name text,
  ts timestamp
)
  server bigquery_server
  options (
    table 'people',
    location 'EU'
  );

select * from people;
```

### 数据修改示例 [*link*](#%e6%95%b0%e6%8d%ae%e4%bf%ae%e6%94%b9%e7%a4%ba%e4%be%8b)

这个示例将在您的 Postgres 数据库中名为`people`的“外部表”中修改数据，请注意 `rowid_column` 选项是强制性的：

```
create foreign table people (
  id bigint,
  name text,
  ts timestamp
)
  server bigquery_server
  options (
    table 'people',
    location 'EU',
    rowid_column 'id'
  );

-- insert new data
insert into people(id, name, ts)
values (4, 'Yoda', '2023-01-01 12:34:56');

-- update existing data
update people
set name = 'Anakin Skywalker'
where id = 1;

-- delete data
delete from people
where id = 2;
```

---

[*navigate\_before* AWS S3](/docs/app/development_guide/database/wrappers/s3/)

[ClickHouse *navigate\_next*](/docs/app/development_guide/database/wrappers/clickhouse/)