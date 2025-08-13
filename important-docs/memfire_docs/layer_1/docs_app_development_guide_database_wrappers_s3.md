# AWS S3 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/wrappers/s3/
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

# AWS S3

AWS S3 是一个对象存储服务，提供行业领先的可扩展性、数据可用性、安全性和性能。它目前只支持读取操作，并支持以下文件格式：

通过 S3 封装器，您可以在 Postgres 数据库中从AWS S3 读取以下格式的数据：

1. CSV - 带或不带标题行
2. [JSON Lines](https://jsonlines.org/)
3. [Parquet](https://parquet.apache.org/)

S3 封装器还支持以下压缩算法：

1. gzip
2. bzip2
3. xz
4. zlib

**CSV 和 JSONL 文件注意事项：目前 S3 文件中的所有列必须在外部表中定义，并且它们的类型必须是 text 类型。**.

**Parquet 文件注意事项：如果是压缩文件，整个 Parquet 文件都将加载到本地内存中，因此文件大小应尽可能小**.

## Parquet 文件支持的数据类型 [*link*](#parquet-%e6%96%87%e4%bb%b6%e6%94%af%e6%8c%81%e7%9a%84%e6%95%b0%e6%8d%ae%e7%b1%bb%e5%9e%8b)

S3 封装器使用 Parquet 文件的数据类型来自 [arrow\_array::types](https://docs.rs/arrow-array/41.0.0/arrow_array/types/index.html)，以下是它们与 Postgres 数据类型的映射。

| Postgres 类型 | Parquet 类型 |
| --- | --- |
| boolean | BooleanType |
| char | Int8Type |
| smallint | Int16Type |
| real | Float32Type |
| integer | Int32Type |
| double precision | Float64Type |
| bigint | Int64Type |
| numeric | Float64Type |
| text | ByteArrayType |
| date | Date64Type |
| timestamp | TimestampNanosecondType |

## 准备 [*link*](#%e5%87%86%e5%a4%87)

在开始之前，请确保您的数据库上安装了 `wrappers` 扩展：

```
create extension if not exists wrappers with schema extensions;
```

然后创建外部数据封装器：

```
create foreign data wrapper s3_wrapper
handler s3_fdw_handler
validator s3_fdw_validator;
```

### 安全保护您的凭证（可选） [*link*](#%e5%ae%89%e5%85%a8%e4%bf%9d%e6%8a%a4%e6%82%a8%e7%9a%84%e5%87%ad%e8%af%81%e5%8f%af%e9%80%89)

默认情况下，Postgres 将 FDW 凭证以明文形式存储在 `pg_catalog.pg_foreign_server` 中。任何有权访问此表的人都能够查看这些凭证。封装器设计为与 [Vault](https://supabase.com/docs/guides/database/vault) 配合使用，Vault 为存储凭证提供了额外的安全级别。我们建议您使用 Vault 存储您的凭证。

```
-- Save your AWS credential in Vault and retrieve the `key_id`
insert into vault.secrets (name, secret)
values (
  'vault_access_key_id',
  '<access key id>'
)
returning key_id;

insert into vault.secrets (name, secret)
values (
  'vault_secret_access_key',
  '<secret access key>'
)
returning key_id;
```

### 连接到 S3 [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0-s3)

我们需要为 Postgres 提供连接到 S3 的凭证和任何额外的选项。我们可以使用`create server` 命令来完成这个操作：

使用 Vault

```
create server s3_server
foreign data wrapper s3_wrapper
options (
  vault_access_key_id '<your vault_access_key_id from above>',
  vault_secret_access_key '<your vault_secret_access_key from above>',
  aws_region 'us-east-1'
);
```

不是用Vault

```
create server s3_server
foreign data wrapper s3_wrapper
options (
  aws_access_key_id 'your_aws_access_key_id',
  aws_secret_access_key 'your_aws_secret_access_key',
  aws_region 'us-east-1'
);
```

## 创建外部表 [*link*](#%e5%88%9b%e5%bb%ba%e5%a4%96%e9%83%a8%e8%a1%a8)

S3 封装器支持从 S3 读取数据。

| Integration | Select | Insert | Update | Delete | Truncate |
| --- | --- | --- | --- | --- | --- |
| S3 | ✅ | ❌ | ❌ | ❌ | ❌ |

例如:

```
create foreign table s3_table_csv (
  name text,
  sex text,
  age text,
  height text,
  weight text
)
  server s3_server
  options (
    uri 's3://bucket/s3_table.csv',
    format 'csv',
    has_header 'true'
  );
```

在 S3 中的一个文件对应于 Postgres 中的一个外部表。对于 CSV 和 JSONL 文件，所有列必须出现在外部表中，类型必须是 `text`。您可以通过在外部表之上创建视图或使用子查询来进行自定义转换，如类型转换。

对于 Parquet 文件，无需在外部表中定义所有列，但列名必须在 Parquet 文件和其外部表之间匹配。

### 外部表选项 [*link*](#%e5%a4%96%e9%83%a8%e8%a1%a8%e9%80%89%e9%a1%b9)

完整的外部表选项如下：

* `uri` - S3 URI，必需。例如, `s3://bucket/s3_table.csv`
* `format` - 文件格式，必需. `csv`, `jsonl`, or `parquet`
* `has_header` - CSV 文件是否有标题，可选. `true` or `false`, default is `false`
* `compress` - 压缩算法，可选. `gzip`, `bzip2`, `xz`, `zlib`中的一个, 默认不压缩

## 查询下推支持 [*link*](#%e6%9f%a5%e8%af%a2%e4%b8%8b%e6%8e%a8%e6%94%af%e6%8c%81)

这个 FDW 不支持查询下推.

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

一些关于如何使用 S3 外部表的示例.

### 基本示例 [*link*](#%e5%9f%ba%e6%9c%ac%e7%a4%ba%e4%be%8b)

这将在您的 Postgres 数据库中创建一些“外部表”，它们可以读取 S3 中的数据：

```
-- CSV file, no compression
create foreign table s3_table_csv (
  name text,
  sex text,
  age text,
  height text,
  weight text
)
  server s3_server
  options (
    uri 's3://bucket/s3_table.csv',
    format 'csv',
    has_header 'true'
  );

-- JSON line file, no compression
create foreign table s3_table_jsonl (
  name text,
  sex text,
  age text,
  height text,
  weight text
)
  server s3_server
  options (
    uri 's3://bucket/s3_table.jsonl',
    format 'jsonl'
  );

-- GZIP compressed CSV file
create foreign table s3_table_csv_gzip (
  name text,
  sex text,
  age text,
  height text,
  weight text
)
  server s3_server
  options (
    uri 's3://bucket/s3_table.csv.gz',
    format 'csv',
    has_header 'true',
    compress 'gzip'
  );

-- Parquet file, no compression
create foreign table s3_table_parquet (
  id integer,
  bool_col boolean,
  bigint_col bigint,
  float_col real,
  date_string_col text,
  timestamp_col timestamp
)
  server s3_server
  options (
    uri 's3://bucket/s3_table.parquet',
    format 'parquet'
  );

-- GZIP compressed Parquet file
create foreign table s3_table_parquet_gz (
  id integer,
  bool_col boolean,
  bigint_col bigint,
  float_col real,
  date_string_col text,
  timestamp_col timestamp
)
  server s3_server
  options (
    uri 's3://bucket/s3_table.parquet.gz',
    format 'parquet',
    compress 'gzip'
  );
```

---

[*navigate\_before* Airtable](/docs/app/development_guide/database/wrappers/airtable/)

[BigQuery *navigate\_next*](/docs/app/development_guide/database/wrappers/bigquery/)