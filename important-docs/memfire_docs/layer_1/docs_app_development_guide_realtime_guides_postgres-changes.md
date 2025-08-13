# Postgres 更改 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/guides/postgres-changes/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

快速入门

# Postgres 更改

让我们探讨如何使用 Realtime 的 Postgres Changes 功能来监听数据库事件。

## 快速入门 [*link*](#%e5%bf%ab%e9%80%9f%e5%85%a5%e9%97%a8)

在此示例中，我们将设置一个数据库表，使用行级别安全性保护它，并使用 MemFire Cloud 客户端库订阅所有更改。

## step1:使用“todos”表设置 MemFire Cloud 项目 [*link*](#step1%e4%bd%bf%e7%94%a8todos%e8%a1%a8%e8%ae%be%e7%bd%ae-memfire-cloud-%e9%a1%b9%e7%9b%ae)

[创建一个新项目](https://cloud.memfiredb.com/project).

项目准备就绪后，在MemFire Cloud数据库中创建一个表。您可以使用 Table 接口或 SQL 编辑器执行此操作。

```
-- Create a table called "todos"
-- with a column to store tasks.
create table todos (
  id serial primary key,
  task text
);
```

[

](https://xguihxuzqibwxjnimxev.supabase.co/storage/v1/object/public/videos/docs/api/api-create-table-sm.mp4)

## step2:允许匿名访问 [*link*](#step2%e5%85%81%e8%ae%b8%e5%8c%bf%e5%90%8d%e8%ae%bf%e9%97%ae)

在此示例中，我们将为此表启用[行级别安全](/docs/app/development_guide/auth/mandates/row-level-security/)性并允许匿名访问。在生产环境中，请务必使用适当的权限保护应用程序。

```
-- Turn on security
alter table "todos"
enable row level security;

-- Allow anonymous access
create policy "Allow anonymous access"
on todos
for select
to anon
using (true);
```

## step3:启用 Postgres 复制 [*link*](#step3%e5%90%af%e7%94%a8-postgres-%e5%a4%8d%e5%88%b6)

转到项目的’数据库’->[Replication]设置，然后在`supabase_realtime`下，打开要收听的表。

## step4:安装客户端 [*link*](#step4%e5%ae%89%e8%a3%85%e5%ae%a2%e6%88%b7%e7%ab%af)

安装 Supabase JavaScript 客户端。

```
npm install @supabase/supabase-js
```

## step5:创建客户端 [*link*](#step5%e5%88%9b%e5%bb%ba%e5%ae%a2%e6%88%b7%e7%ab%af)

此客户端将用于侦听 Postgres 更改。

```
import { createClient } from '@supabase/supabase-js'

const client = createClient(
  'https://<project>.supabase.co',
  '<your-anon-key>'
)
```

## step6:按schemas侦听更改 [*link*](#step6%e6%8c%89schemas%e4%be%a6%e5%90%ac%e6%9b%b4%e6%94%b9)

通过将 `schema` 属性设置为 ‘public’ 并将事件名称设置为 `*`，侦听 public 架构中所有表的更改。事件名称可以是以下项之一：

* `INSERT`
* `UPDATE`
* `DELETE`
* `*`

通道名称可以是除“realtime”之外的任何字符串。

```
const channelA = client
.channel('schema-db-changes')
.on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

## step7:插入虚拟数据 [*link*](#step7%e6%8f%92%e5%85%a5%e8%99%9a%e6%8b%9f%e6%95%b0%e6%8d%ae)

现在我们可以向表中添加一些数据，这些数据将触发 `channelA` 事件处理程序。

```
insert into todos (task)
values
  ('Change!');
```

## 用法 [*link*](#%e7%94%a8%e6%b3%95)

您可以使用 Supabase 客户端库来订阅数据库更改。

### 侦听特定schemas [*link*](#%e4%be%a6%e5%90%ac%e7%89%b9%e5%ae%9aschemas)

使用 schema 参数订阅特定架构事件：

```
const changes = client
.channel('schema-db-changes')
.on(
  'postgres_changes',
  {
    schema: 'public', // Subscribes to the "public" schema in Postgres
    event: '*',       // Listen to all changes
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('schema-db-changes')
  .onPostgresChanges(
      schema: 'public', // Subscribes to the "public" schema in Postgres
      event: PostgresChangeEvent.all, // Listen to all changes

      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("schema-db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction>(schema = "public")

changes
    .onEach {
        when(it) { //You can also check for <is PostgresAction.Insert>, etc.. manually
            is HasRecord -> println(it.record)
            is HasOldRecord -> println(it.oldRecord)
            else -> println(it)
        }
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

通道名称可以是除“realtime”之外的任何字符串。

### 侦听 INSERT 事件 [*link*](#%e4%be%a6%e5%90%ac-insert-%e4%ba%8b%e4%bb%b6)

使用 event 参数仅侦听数据库 INSERT：

```
const changes = client
.channel('schema-db-changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT', // Listen only to INSERTs
    schema: 'public',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
final changes = supabase
  .channel('schema-db-changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      callback: (payload) => print(payload))
  .subscribe();
```

使用 PostgresAction.Insert 作为类型以仅侦听数据库 INSERT：

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Insert>(schema = "public")

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

通道名称可以是除“realtime”之外的任何字符串。

### 侦听 UPDATE 事件 [*link*](#%e4%be%a6%e5%90%ac-update-%e4%ba%8b%e4%bb%b6)

使用 event 参数仅侦听数据库 UPDATE：

```
const changes = client
.channel('schema-db-changes')
.on(
  'postgres_changes',
  {
    event: 'UPDATE', // Listen only to UPDATEs
    schema: 'public',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('schema-db-changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.update, // Listen only to UPDATEs
      schema: 'public',
      callback: (payload) => print(payload))
  .subscribe();
```

使用 PostgresAction.Update 作为类型以仅侦听数据库 UPDATE：

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public")

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

通道名称可以是除“realtime”之外的任何字符串。

### 侦听 DELETE 事件 [*link*](#%e4%be%a6%e5%90%ac-delete-%e4%ba%8b%e4%bb%b6)

使用 event 参数仅侦听数据库 DELETE：

```
const changes = client
.channel('schema-db-changes')
.on(
  'postgres_changes',
  {
    event: 'DELETE', // Listen only to DELETEs
    schema: 'public',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('schema-db-changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.delete, // Listen only to DELETEs
      schema: 'public',
      callback: (payload) => print(payload))
  .subscribe();
```

使用 PostgresAction.Delete 作为类型以仅侦听数据库 DELETE：

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Delete>(schema = "public")

changes
    .onEach {
        println(it.oldRecord)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

通道名称可以是除“realtime”之外的任何字符串。

### 监听特定表 [*link*](#%e7%9b%91%e5%90%ac%e7%89%b9%e5%ae%9a%e8%a1%a8)

使用 table 参数订阅特定表事件：

```
const changes = client
.channel('table-db-changes')
.on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
    table: 'todos',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('table-db-changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.all,
      schema: 'public',
      table: 'todos',
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction>(schema = "public") {
    table = "todos"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

通道名称可以是除“realtime”之外的任何字符串。

### 监听多个更改 [*link*](#%e7%9b%91%e5%90%ac%e5%a4%9a%e4%b8%aa%e6%9b%b4%e6%94%b9)

要侦听同一频道的不同事件和架构/表/筛选器组合，请执行以下操作：

```
const channel = supabase
.channel('db-changes')
.on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
    table: 'messages',
  },
  (payload) => console.log(payload)
)
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'users',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('db-changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.all,
      schema: 'public',
      table: 'messages',
      callback: (payload) => print(payload))
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'users',
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")
val messageChanges = myChannel.postgresChangeFlow<PostgresAction>(schema = "public") {
    table = "messages"
}
val userChanges = myChannel.postgresChangeFlow<PostgresAction.Insert>(schema = "public") {
    table = "users"
}
myChannel.subscribe()
```

### 筛选特定更改 [*link*](#%e7%ad%9b%e9%80%89%e7%89%b9%e5%ae%9a%e6%9b%b4%e6%94%b9)

使用 `filter` 参数进行精细更改：

```
const changes = client
.channel('table-filter-changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'todos',
    filter: 'id=eq.1',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('table-filter-changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'todos',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.eq,
        column: 'id',
        value: 1,
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Insert>(schema = "public") {
    table = "todos"
    filter = "id=eq.1"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

## 可用的过滤器 [*link*](#%e5%8f%af%e7%94%a8%e7%9a%84%e8%bf%87%e6%bb%a4%e5%99%a8)

Realtime 提供过滤器，因此您可以更精细地指定客户端接收的数据。

### 等于 （eq） [*link*](#%e7%ad%89%e4%ba%8e-eq)

当表中的列值等于客户端指定的值时侦听更改，请执行以下操作：

```
const channel = supabase
.channel('changes')
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

```
supabase
  .channel('changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.update,
      schema: 'public',
      table: 'messages',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.eq,
        column: 'body',
        value: 'hey',
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public") {
    table = "messages"
    filter = "body=eq.hey"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

此过滤器使用 Postgres 的 = 过滤器。

### 不等于 （neq） [*link*](#%e4%b8%8d%e7%ad%89%e4%ba%8e-neq)

当表中的列值不等于客户端指定的值时侦听更改，请执行以下操作：

```
const channel = supabase
.channel('changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: 'body=neq.bye',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'messages',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.neq,
        column: 'body',
        value: 'bye',
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.realtime.createChannel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public") {
    table = "messages"
    filter = "body=neq.bye"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

supabase.realtime.connect()
myChannel.join()
```

此筛选器使用 Postgres 的 ！= 筛选器。

### 小于 （lt） [*link*](#%e5%b0%8f%e4%ba%8e-lt)

当表中的列值小于客户端指定的值时侦听更改：

```
const channel = supabase
.channel('changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'profiles',
    filter: 'age=lt.65',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'profiles',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.lt,
        column: 'age',
        value: 65,
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Insert>(schema = "public") {
    table = "profiles"
    filter = "age=lt.65"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

此筛选器使用 Postgres 的<筛选器，因此它适用于非数值类型。请务必检查比较数据类型的预期行为。

### 小于或等于 （lte） [*link*](#%e5%b0%8f%e4%ba%8e%e6%88%96%e7%ad%89%e4%ba%8e-lte)

当表中的列值小于或等于客户端指定的值时侦听更改：

```
const channel = supabase
.channel('changes')
.on(
  'postgres_changes',
  {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: 'age=lte.65',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'profiles',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.lte,
        column: 'age',
        value: 65,
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public") {
    table = "profiles"
    filter = "age=lte.65"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

此筛选器使用 Postgres 的 <= 筛选器，因此它适用于非数值类型。请务必检查比较数据类型的预期行为。

### 大于 （gt） [*link*](#%e5%a4%a7%e4%ba%8e-gt)

当表中的列值大于客户端指定的值时侦听更改：

```
const channel = supabase
.channel('changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'products',
    filter: 'quantity=gt.10',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'products',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.gt,
        column: 'quantity',
        value: 10,
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public") {
    table = "products"
    filter = "quantity=gt.10"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

此筛选器使用 Postgres 的>筛选器，因此它适用于非数字类型。请务必检查比较数据类型的预期行为。

### 大于或等于 （gte） [*link*](#%e5%a4%a7%e4%ba%8e%e6%88%96%e7%ad%89%e4%ba%8e-gte)

当表中的列值大于或等于客户端指定的值时侦听更改：

```
const channel = supabase
.channel('changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'products',
    filter: 'quantity=gte.10',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'products',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.gte,
        column: 'quantity',
        value: 10,
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public") {
    table = "products"
    filter = "quantity=gte.10"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

此筛选器使用 Postgres 的 >= 筛选器，因此它适用于非数值类型。请务必检查比较数据类型的预期行为。

### 包含在清单中 （in） [*link*](#%e5%8c%85%e5%90%ab%e5%9c%a8%e6%b8%85%e5%8d%95%e4%b8%ad-in)

当表中的列值等于任何客户端指定的值时侦听更改：

```
const channel = supabase
.channel('changes')
.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'colors',
    filter: 'name=in.(red, blue, yellow)',
  },
  (payload) => console.log(payload)
)
.subscribe()
```

```
supabase
  .channel('changes')
  .onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: 'colors',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.lte,
        column: 'name',
        value: ['red', 'blue', 'yellow'],
      ),
      callback: (payload) => print(payload))
  .subscribe();
```

```
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public") {
    table = "products"
    filter = "name=in.(red, blue, yellow)"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

此筛选器使用 Postgres 的 = ANY。实时允许此筛选器最多 100 个值。

## 接收`旧` 记录 [*link*](#%e6%8e%a5%e6%94%b6%e6%97%a7-%e8%ae%b0%e5%bd%95)

默认情况下，仅发送新记录更改，但如果要在更新或删除记录时接收旧记录（以前的值），则可以将表的副本标识设置为完整：

```
alter table
messages replica identity full;
```

info

RLS 策略不适用于 DELETE 语句，因为 Postgres 无法验证用户是否有权访问已删除的记录。启用 RLS 并将表上的副本标识设置为完整时，旧记录仅包含主键。

## 私有 schemas [*link*](#%e7%a7%81%e6%9c%89-schemas)

Postgres Changes 适用于公共架构中的表。您可以通过向访问令牌中找到的数据库角色授予表 SELECT 权限来侦听私有架构中的表。您可以运行类似于以下内容的查询：

```
grant select on "non_private_schema"."some_table" to authenticated;
```

info

我们强烈建议您启用 RLS 并为私有架构中的表创建策略。否则，您授予访问权限的任何角色都将拥有对表的不受限制的读取访问权限。

## 自定义令牌 [*link*](#%e8%87%aa%e5%ae%9a%e4%b9%89%e4%bb%a4%e7%89%8c)

可以选择对自己的令牌进行签名，以自定义可在 RLS 策略中检查的声明。

项目 JWT 密钥可在仪表板中找到，其中包含项目 API 密钥。

info

不要在客户端上公开 service\_role 令牌，因为该角色有权绕过行级安全性。

要将您自己的 JWT 与 Realtime 一起使用，请确保在实例化 Supabase 客户端之后和连接到 Channel 之前设置令牌。

```
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {})

// Set your custom JWT here
supabase.realtime.setAuth('your-custom-jwt')

const channel = supabase
  .channel('db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: 'body=eq.bye',
    },
    (payload) => console.log(payload)
  )
  .subscribe()
```

```
supabase.realtime.setAuth('your-custom-jwt');

supabase
    .channel('db-changes')
    .onPostgresChanges(
      event: PostgresChangeEvent.all,
      schema: 'public',
      table: 'messages',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.eq,
        column: 'body',
        value: 'bye',
      ),
      callback: (payload) => print(payload),
    )
    .subscribe();
```

```
val supabase = createSupabaseClient(supabaseUrl, supabaseKey) {
	install(Realtime) {
		jwtToken = "your-custom-jwt"
	}
}
val myChannel = supabase.channel("db-changes")

val changes = myChannel.postgresChangeFlow<PostgresAction.Update>(schema = "public") {
    table = "products"
    filter = "name=in.(red, blue, yellow)"
}

changes
    .onEach {
        println(it.record)
    }
    .launchIn(yourCoroutineScope)

myChannel.subscribe()
```

### 刷新的令牌 [*link*](#%e5%88%b7%e6%96%b0%e7%9a%84%e4%bb%a4%e7%89%8c)

您需要自行刷新令牌，但一旦生成，您可以将其传递给 Realtime。

例如，如果你使用的是 supabase-js v2 客户端，那么你可以像这样传递你的令牌：

```
// Client setup

supabase.realtime.setAuth('fresh-token')
```

```
supabase.realtime.setAuth('fresh-token');
```

In Kotlin, you have to update the token manually per channel:

```
myChannel.updateAuth("fresh-token")
```

## 局限性 [*link*](#%e5%b1%80%e9%99%90%e6%80%a7)

### 删除事件不可筛选 [*link*](#%e5%88%a0%e9%99%a4%e4%ba%8b%e4%bb%b6%e4%b8%8d%e5%8f%af%e7%ad%9b%e9%80%89)

在跟踪 Postgres 更改时，您无法过滤删除事件。此限制是由于从 Postgres 中提取更改的方式所致。

### 表名中的空格 [*link*](#%e8%a1%a8%e5%90%8d%e4%b8%ad%e7%9a%84%e7%a9%ba%e6%a0%bc)

当表名包含空格时，实时当前不起作用。

### 数据库实例和实时性能 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93%e5%ae%9e%e4%be%8b%e5%92%8c%e5%ae%9e%e6%97%b6%e6%80%a7%e8%83%bd)

实时系统通常需要深思熟虑，因为它们具有扩展动态。对于 Postgres 更改功能，必须检查每个更改事件，以查看订阅用户是否具有访问权限。例如，如果您有 100 个用户订阅了您进行单个插入的表，它将触发 100 次“读取”：每个用户一次。

可能存在限制消息吞吐量的数据库瓶颈。如果数据库无法足够快地授权更改，则更改将延迟，直到您收到超时。

数据库更改在单个线程上处理，以维护变更单。这意味着计算升级不会对 Postgres 更改订阅的性能产生很大影响。您可以在下面估算数据库的预期最大吞吐量。

如果大规模使用 Postgres 更改，则应考虑使用单独的“公共”表，而不使用 RLS 和过滤器。或者，您可以仅使用实时服务器端，然后使用实时广播将更改重新流式传输到客户端。

输入您的数据库设置以估计实例的最大吞吐量：

不要忘记运行您自己的基准测试，以确保性能对于您的用例来说是可以接受的。

我们正在对 Realtime 的 Postgres 更改进行许多改进。如果您不确定用例的性能，请使用支持表单与我们联系，我们将很乐意为您提供帮助。我们拥有一支工程师团队，可以为您的用例提供最佳解决方案建议。

---

[*navigate\_before* 限制消息](/docs/app/development_guide/realtime/guides/client-side-throttling/)

[将 Realtime 与 Next.js 结合使用 *navigate\_next*](/docs/app/development_guide/realtime/guides/realtime-with-nextjs/)