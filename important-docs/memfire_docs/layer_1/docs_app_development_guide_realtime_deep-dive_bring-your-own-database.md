# 自带数据库 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/deep-dive/bring-your-own-database/
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

# 自带数据库

Realtime Database Changes 适用于任何启用了逻辑复制并安装了 [wal2json](https://github.com/eulerto/wal2json) 扩展的 Postgres 数据库。

info

为Realtime设置数据库后，如果您想将数据库与托管的Supabase Realtime一起使用。

以下步骤将确保您的数据库已正确设置为使用 Realtime。

## `wal2json` 扩展 [*link*](#wal2json-%e6%89%a9%e5%b1%95)

Realtime 依靠 wal2json Postgres 扩展将数据库更改格式化为 JSON，然后将其发送给 Realtime 订阅者。

由 AWS RDS 和 Google Cloud SQL 管理的 Postgres 数据库应已安装 wal2json。
请检查以确保您的 Postgres 数据库确实如此。

## 逻辑复制配置 [*link*](#%e9%80%bb%e8%be%91%e5%a4%8d%e5%88%b6%e9%85%8d%e7%bd%ae)

Realtime 依靠 Postgres 的逻辑复制功能来获取数据库更改。请在数据库上启用逻辑复制并配置以下设置：

* `max_replication_slots`: 我们建议使用 10 个，因为 Realtime 需要几个插槽以及满足非实时逻辑复制需求所需的插槽。
* `max_slot_wal_keep_size`: 我们建议使用 1024 （MB），以便 Realtime 可以尝试提供存储在 Postgres 中的更多数据库更改。

请参阅[计算加载项](/docs/app/development_guide/database/compute-add-ons/#postgres-replication-slots-and-wal-senders)，了解根据我们用于自己的云产品/服务的值在不同实例大小下的建议max\_replication\_slots。

## 实时数据库设置 [*link*](#%e5%ae%9e%e6%97%b6%e6%95%b0%e6%8d%ae%e5%ba%93%e8%ae%be%e7%bd%ae)

### `supabase_realtime` 出版物 [*link*](#supabase_realtime-%e5%87%ba%e7%89%88%e7%89%a9)

创建supabase\_realtime发布并添加您希望 Realtime 监听的表：

```
create publication supabase_realtime with (publish = 'insert, update, delete');

alter publication supabase_realtime add table messages, users;
```

info

如果有效负载包含 401 Unauthorized，则需要向要授权的数据库角色的表授予`select`权限，以接收数据库更改：

```
grant select on table messages to anon;
```

### `realtime` Schema [*link*](#realtime-schema)

创建实时 schema:

```
create schema realtime;
```

### `supabase_realtime_admin` 角色 [*link*](#supabase_realtime_admin-%e8%a7%92%e8%89%b2)

创建supabase\_realtime\_admin数据库角色并授予其复制权限：

```
create role supabase_realtime_admin with noinherit login password 'secure-password';
```

确保授予supabase\_realtime\_admin具有复制权限的角色。此步骤因数据库提供程序而异。

例如，如果您的数据库由 AWS RDS 托管，则可以运行：

```
grant rds_replication to supabase_realtime_admin;
```

### `supabase_realtime_admin` 特权 [*link*](#supabase_realtime_admin-%e7%89%b9%e6%9d%83)

授予`supabase_realtime_admin`实时架构和所有相关实时对象的权限：

```
grant all on schema realtime to supabase_realtime_admin;
grant all on all tables in schema realtime to supabase_realtime_admin;
grant all on all sequences in schema realtime to supabase_realtime_admin;
grant all on all routines in schema realtime to supabase_realtime_admin;
```

### `authenticated` 角色 [*link*](#authenticated-%e8%a7%92%e8%89%b2)

创建经过身份验证的角色：

```
create role authenticated nologin noinherit;
```

info

此角色已硬编码到实时迁移中，因此暂时是必需的。

---

[*navigate\_before* 实时架构](/docs/app/development_guide/realtime/deep-dive/architecture/)

[实时协议 *navigate\_next*](/docs/app/development_guide/realtime/deep-dive/protocol/)