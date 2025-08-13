# 超时 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/setting/timeouts/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

改变默认超时

# 超时

默认情况下，Suabase将使用匿名密钥访问API的用户的最大语句执行时间限制为3秒，而经过身份验证的用户的最长语句执行时间为8秒。此外，所有用户的全局限制为2分钟。这可以防止由于查询写得不好或滥用而导致的资源耗尽。

### 改变默认超时 [*link*](#%e6%94%b9%e5%8f%98%e9%bb%98%e8%ae%a4%e8%b6%85%e6%97%b6)

这些超时值被选为大多数情况下的合理默认值，但可以使用[`alter role`](https://www.postgresql.org/docs/current/sql-alterrole.html)语句进行修改。

```
alter role authenticated set statement_timeout = '15s';
```

你也可以更新一个会话的语句超时:

```
set statement_timeout to 60000; -- 1 minute in milliseconds
```

### 语句优化 [*link*](#%e8%af%ad%e5%8f%a5%e4%bc%98%e5%8c%96)

所有Supabase项目都安装了[`pg_stat_statements`](https://www.postgresql.org/docs/current/pgstatstatements.html)扩展，它跟踪所有针对它执行的语句的计划和执行统计数据。这些统计数据可以用来诊断你的项目的性能。

这些数据可以进一步与Postgres的[`explain`](https://www.postgresql.org/docs/current/using-explain.html)功能结合使用，以优化你的使用。

---

[*navigate\_before* uuid-ossp: 唯一标识符](/docs/app/development_guide/database/extensions/uuid-ossp/)

[复制 *navigate\_next*](/docs/app/development_guide/database/setting/replication/)