# Firebase | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/wrappers/firebase/
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

# Firebase

[Firebase](https://firebase.google.com/) 是一个围绕非关系型技术构建的应用开发平台。Firebase 封装器支持连接到以下对象。

1. [认证用户](https://firebase.google.com/docs/auth/users) (只读)
2. [Firestore 数据库文档](https://firebase.google.com/docs/firestore) (只读)

## 准备 [*link*](#%e5%87%86%e5%a4%87)

在开始之前，请确保您的数据库上安装了`wrappers` 扩展：

```
create extension if not exists wrappers with schema extensions;
```

然后创建外部数据封装器：

```
create foreign data wrapper firebase_wrapper
handler firebase_fdw_handler
validator firebase_fdw_validator;
```

### 安全保护您的凭证（可选） [*link*](#%e5%ae%89%e5%85%a8%e4%bf%9d%e6%8a%a4%e6%82%a8%e7%9a%84%e5%87%ad%e8%af%81%e5%8f%af%e9%80%89)

默认情况下，Postgres 将 FDW 凭证以明文形式存储在 `pg_catalog.pg_foreign_server` 中。任何有权访问此表的人都能够查看这些凭证。封装器设计为与 [Vault](https://supabase.com/docs/guides/database/vault) 配合使用，Vault 为存储凭证提供了额外的安全级别。我们建议您使用 Vault 存储您的凭证。

```
-- Save your Firebase credentials in Vault and retrieve the `key_id`
insert into vault.secrets (name, secret)
values (
  'firebase',
  '{
      "type": "service_account",
      "project_id": "your_gcp_project_id",
      ...
  }'
)
returning key_id;
```

### 连接到 Firebase [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0-firebase)

我们需要为 Postgres 提供连接到 Firebase 的凭证和任何额外的选项。我们可以使用 `create server` 命令来完成这个操作：

使用Vault

```
create server firebase_server
  foreign data wrapper firebase_wrapper
  options (
    sa_key_id '<key_ID>', -- The Key ID from above.
    project_id '<firebase_project_id>'
);
```

不使用Vault

```
create server firebase_server
foreign data wrapper firebase_wrapper
 options (
   sa_key '
   {
      "type": "service_account",
      "project_id": "your_gcp_project_id",
      ...
   }
  ',
   project_id 'firebase_project_id'
 );
```

## 创建外部表 [*link*](#%e5%88%9b%e5%bb%ba%e5%a4%96%e9%83%a8%e8%a1%a8)

Firebase 封装器支持从以下 Firebase 对象读取数据：

| Firebase | Select | Insert | Update | Delete | Truncate |
| --- | --- | --- | --- | --- | --- |
| 认证用户 | ✅ | ❌ | ❌ | ❌ | ❌ |
| Firestore 数据库文档 | ✅ | ❌ | ❌ | ❌ | ❌ |

例如：

```
create foreign table firebase_users (
  uid text,
  email text,
  created_at timestamp,
  attrs jsonb
)
  server firebase_server
  options (
    object 'auth/users'
  );
```

注意，外部表中有一个元数据列 `attrs`，它包含了从 Firebase 返回的所有数据，格式为 json。

### 外部表选项 [*link*](#%e5%a4%96%e9%83%a8%e8%a1%a8%e9%80%89%e9%a1%b9)

完整的外部表选项如下：

* `object` - Firebase 中的对象名称，必需.

  对于认证用户，对象名称固定为 `auth/users`. 对于 Firestore 文档，其格式为 `firestore/<collection_id>`, 注意集合 ID 必须是完整路径 ID。例如,

  + `firestore/my-collection`
  + `firestore/my-collection/my-document/another-collection`

## 查询下推支持 [*link*](#%e6%9f%a5%e8%af%a2%e4%b8%8b%e6%8e%a8%e6%94%af%e6%8c%81)

这个 FDW 不支持查询下推。

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

一些关于如何使用 Firebase 外部表的示例。

### firestore [*link*](#firestore)

要映射 Firestore 集合，请使用格式`firestore/<collection_id>` 作为 `object` 选项，如下所示。

```
create foreign table firebase_docs (
  name text,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
  server firebase_server
  options (
    object 'firestore/user-profiles'
  );
```

注意， `name`, `created_at`和 `updated_at`是所有 Firestore 集合上的自动元数据字段。

### auth/users [*link*](#authusers)

`auth/users` 集合是一个具有唯一元数据的特殊案例。以下展示了如何将 Firebase 用户映射到 PostgreSQL 表。

```
create foreign table firebase_users (
  uid text,
  email text,
  created_at timestamp,
  attrs jsonb
)
  server firebase_server
  options (
    object 'auth/users'
  );
```

---

[*navigate\_before* ClickHouse](/docs/app/development_guide/database/wrappers/clickhouse/)

[Logflare *navigate\_next*](/docs/app/development_guide/database/wrappers/logflare/)