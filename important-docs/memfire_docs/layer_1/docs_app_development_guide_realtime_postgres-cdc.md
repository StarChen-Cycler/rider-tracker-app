# Postgres CDC | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/postgres-cdc/
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

# Postgres CDC

实时的Postgres变更数据捕获（CDC）功能监听数据库的变更，并将其发送给客户端。客户端需要通过JWT订阅，该JWT决定了他们可以根据数据库的[行级安全](/docs/app/development_guide/auth/mandates/row-level-security/)接收哪些变化。

任何能够访问用项目的JWT秘密签名的有效JWT的人都能够监听你的数据库的变化，除非表启用了[行级安全](/docs/app/development_guide/auth/mandates/row-level-security/)并制定了策略。

客户端可以选择接收 `INSERT`、`UPDATE`、`DELETE`或 `*`（all）的变化，用于接收模式中的所有变化、模式中的一个表或表中的一个列的值。你的客户应该只监听`public`模式中的表，你必须首先启用你希望客户监听的表。

Postgres CDC对 `public`模式中的表是开箱即用的。你可以通过给访问令牌中的数据库角色授予表 `SELECT`的权限来监听你的私有模式中的表。你可以运行一个类似于以下的查询。

```
GRANT SELECT ON "private_schema"."table" TO authenticated;
```

info

我们强烈建议你启用RLS并为私有模式中的表创建策略。否则，你所授予的任何角色都将拥有对表的不受限制的读取权限。

你可以在仪表板的Replication部分或用`SQL editor`来做这个。

```
begin;
  -- remove the supabase_realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the supabase_realtime publication with no tables
  create publication supabase_realtime;
commit;

-- add a table to the publication
alter publication supabase_realtime add table messages;
```

默认情况下，只发送 `新`的记录变化，但如果你想在每次 `UPDATE`或 `DELETE`一个记录时接收 `旧`的记录（以前的值）。
你可以将你的表的`replica identity` 设置为 `full`。

```
alter table messages replica identity full;
```

监听`public`模式中的所有变化：

```
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

/*
  Channel name can be any string.
  Event name can can be one of:
    - INSERT
    - UPDATE
    - DELETE
    - *
*/
const channel = supabase
  .channel('schema-db-changes')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => console.log(payload))
  .subscribe()
```

监听`public`模式中的一张表的变化：

```
// Supabase client setup

const channel = supabase
  .channel('table-db-changes')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) =>
    console.log(payload)
  )
  .subscribe()
```

当表中某一列的值与客户指定的值相匹配时，监听其变化：

```
// Supabase client setup

const channel = supabase
  .channel('value-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: 'body=eq.hey',
    },
    (payload) => console.log(payload)
  )
  .subscribe()
```

使用同一个通道来监听不同的事件和模式/表/过滤器组合：

```
// Supabase client setup

const channel = supabase
  .channel('db-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'messages', filter: 'body=eq.bye' },
    (payload) => console.log(payload)
  )
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'users' }, (payload) =>
    console.log(payload)
  )
  .subscribe()
```

---

[*navigate\_before* 实时快速入门](/docs/app/development_guide/realtime/quickstart/)

[实时速率限制 *navigate\_next*](/docs/app/development_guide/realtime/rate-limits/)