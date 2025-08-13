# 第二部分:行级安全 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

关于

# 第二部分:行级安全

### 关于 [*link*](#%e5%85%b3%e4%ba%8e)

了解如何通过启用行级安全和在Supabase仪表板中编写Postgres策略来限制对数据库表的访问。

### 观察 [*link*](#%e8%a7%82%e5%af%9f)

### 确保你的数据表安全 [*link*](#%e7%a1%ae%e4%bf%9d%e4%bd%a0%e7%9a%84%e6%95%b0%e6%8d%ae%e8%a1%a8%e5%ae%89%e5%85%a8)

在Supabase中，你可以直接从客户端（通常是网络浏览器）访问你的数据，你可以这样做，把你的Supabase URL和Anon密钥传递给supabase-js：

```
const supabase = createClient(
  'https://qwertyuiop.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
)
```

然而，这引起了一个有趣的问题：“如果我的匿名密钥在客户端，那么就不会有人阅读我的javascript并窃取我的密钥吗？"，答案是肯定的。而这正是Postgres策略的作用所在。

使用Postgres的 `行级安全`策略，我们可以对匿名钥匙默认允许或不允许访问的数据设置规则。

例如，我们可以说匿名钥匙只能从一个特定的表中读取，但不能写入、更新或删除。

而且这些规则可以随我们的意愿而复杂。我们可以说，匿名键只能删除在星期四下午4点到6点之间插入的行，并且id列是偶数。很奇怪，但它显示了策略的力量。

比方说，我们创建了一个排行榜表。我们希望网站上的人能够阅读排行榜，但不能写入、更新或删除它。我们首先在SQL中定义我们的表并添加一些假数据：

```
create table leaderboard (
    name text,
    score int
);

insert into leaderboard(name, score)
values ('Paul', 100), ('Leto', 50), ('Chani', 200);
```

现在让我们设置一个客户端来读取数据，我在这里创建了一个副本来展示一个活生生的例子。<https://replit.com/@awalias/supabase-leaderboard-demo#index.js>。如果你复制这个片段，你可以插入你自己的Supabase URL和anon key。

你可以看到，通过使用，可以自由地从表中读取和写入。

```
// Writing
let { data, error } = await supabase.from('leaderboard').insert({ name: 'Bob', score: 99999 })

// Reading
let { data, error } = await supabase
  .from('leaderboard')
  .select('name, score')
  .order('score', { ascending: false })
```

现在我们来限制访问。我们将从完全限制该表开始。我们可以在SQL编辑器中通过做一个查询来做到这一点。

```
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
```

或通过 Supabase 仪表板，导航到 Auth > Policies，并单击 leaderboard 表上的红色挂锁，使其变成白色。

你会注意到，现在读和写都失败了，出现了类似的错误:

```
{
  hint: null,
  details: null,
  code: '42501',
  message: 'new row violates row-level security policy for table "leaderboard"'
}
```

现在我们需要添加一个策略，使每个在 “授权 “中发送匿名密钥（JWT）的人能够读取该表。Bearer “头的人。

在SQL中，这可以通过以下方式完成。

```
CREATE POLICY anon_read_leaderboard ON leaderboard
  FOR SELECT
  TO 'anon'
  USING (true);
```

`anon_read_leaderboard`这里只是你为你的策略选择的一个名字。`leaderboard`是表的名称。`FOR SELECT`表示我们只希望这个策略适用于读取（或者说SQL中的 “选择”）。`TO`意味着这个策略只适用于`anon`Postgres角色。最后，规则本身是 “true”，这意味着它将允许任何 “选择 “给 “anon “用户。

如果你喜欢使用仪表板来添加你的策略，你可以通过点击策略标签中的 “添加策略 “来完成，并制定一个类似这样的策略。

现在你应该能够从你的排行榜上读取信息，但仍然不能写入、更新或删除，这正是我们想要的

快速提醒你，你总是可以使用你的`service_role`API密钥来绕过这些行级安全策略。但是要格外小心，不要把这个密钥包含在客户端中，以免泄露。如果你正在建立内部管理工具，或者你需要通过API批量插入或删除数据，这可能很有用。

在下一篇指南中，我们将探讨如何将策略与用户账户结合起来使用，这样你就可以在用户的基础上限制对数据的访问。观看[第三部分：策略](/docs/app/development_guide/auth/auth-deep-dive/auth-policies/)

### 资源 [*link*](#%e8%b5%84%e6%ba%90)

* JWT debugger: <https://jwt.io/>
* RESTED: <https://github.com/RESTEDClient/RESTED>

### 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

* 观看[第一部分：JWTs](/docs/app/development_guide/auth/auth-deep-dive/auth-deep-dive-jwts/)

* [第三部分:政策](/docs/app/development_guide/auth/auth-deep-dive/auth-policies/)
* [第四部分: GoTrue](/docs/app/development_guide/auth/auth-deep-dive/auth-gotrue/)
* 注册加入[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 第一部分:JWTS](/docs/app/development_guide/auth/auth-deep-dive/auth-deep-dive-jwts/)

[第三部分:策略 *navigate\_next*](/docs/app/development_guide/auth/auth-deep-dive/auth-policies/)