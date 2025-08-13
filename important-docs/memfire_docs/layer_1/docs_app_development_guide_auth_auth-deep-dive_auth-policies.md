# 第三部分:策略 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/auth-deep-dive/auth-policies/
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

# 第三部分:策略

### 关于 [*link*](#%e5%85%b3%e4%ba%8e)

如何将表的访问限制在认证用户、行级策略和基于电子邮件域的访问。

### 观察 [*link*](#%e8%a7%82%e5%af%9f)

### 基于用户的行级策略 [*link*](#%e5%9f%ba%e4%ba%8e%e7%94%a8%e6%88%b7%e7%9a%84%e8%a1%8c%e7%ba%a7%e7%ad%96%e7%95%a5)

现在我们知道了如何根据JWT角色来限制对表的访问，我们可以把它和用户管理结合起来，让我们更多地控制你的用户可以从你的数据库中读取和写入哪些数据。

我们将从用户会话在Supabase中的工作方式开始，然后转到编写以用户为中心的策略。

比方说，我们要把一个用户第一次注册到我们的服务中。典型的方法是在supabase-js中调用以下方法：

```
// see full api reference here: /docs/app/sdkdocs/javascript/auth-signup
supabase.auth.signUp({ email, password })
```

默认情况下，这将向用户发送一封确认电子邮件。当用户点击电子邮件中的链接时，他们将被重定向到你的网站（你需要在仪表板上的授权>设置中提供你的网站网址。默认情况下，这是http://localhost:3000），包括查询参数的完整URL将看起来像这样:

```
http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjE2NDI5MDY0LCJzdWIiOiI1YTQzNjVlNy03YzdkLTRlYWYtYThlZS05ZWM5NDMyOTE3Y2EiLCJlbWFpbCI6ImFudEBzdXBhYmFzZS5pbyIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIn0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.4IFzn4eymqUNYYo2AHLxNRL8m08G93Qcg3_fblGqDjo&expires_in=3600&refresh_token=RuioJv2eLV05lgH5AlJwTw&token_type=bearer&type=signup
```

让我们把这个问题拆开，以便更容易阅读。

```
// 基本网址 - 你在app.supabase.com仪表板的授权设置中设置的任何网址
http://localhost:3000/

// 注意我们使用'#'（片段）而不是'?'查询参数
// 访问令牌是发给用户的JWT。
#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjE2NDI5MDY0LCJzdWIiOiI1YTQzNjVlNy03YzdkLTRlYWYtYThlZS05ZWM5NDMyOTE3Y2EiLCJlbWFpbCI6ImFudEBzdXBhYmFzZS5pbyIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIn0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.4IFzn4eymqUNYYo2AHLxNRL8m08G93Qcg3_fblGqDjo

// 默认情况下，60分钟内有效
&expires_in=3600

// 用来在60分钟到期前获得新的访问令牌
&refresh_token=RuioJv2eLV05lgH5AlJwTw

// 可以作为授权:在对你的API的请求中使用Bearer header
&token_type=bearer

// 这是一个注册、登录、密码重置或magic link?
&type=signup
```

如果我们把access\_token放入<https://jwt.io>，我们会看到它被解码为:

```
{
  "aud": "authenticated",
  "exp": 1616429064,
  "sub": "5a4365e7-7c7d-4eaf-a8ee-9ec9432917ca",
  "email": "ant@supabase.io",
  "app_metadata": {
    "provider": "email"
  },
  "user_metadata": {},
  "role": "authenticated"
}
```

`authenticated`角色在Supabase中很特别，它告诉API这是一个已认证的用户，并知道将JWT与你添加到请求的资源（表或行）的任何策略进行比较。

`sub`声称通常是我们用来将JWT与你数据库中的行相匹配的，因为默认情况下它是`auth.users`表中用户的唯一标识符（作为附带说明–一般不建议以任何方式改变你Supabase数据库中的`auth`模式，因为Auth API依靠它来正常运行）。

对于好奇心强的人来说，可以尝试进入SQL编辑器并进行查询：

```
select * from auth.users;
```

如果supabase-js在你的网站上被加载（这里是http://localhost:3000），它会自动从URL中提取`access_token`并启动一个会话。你可以检索[session](/docs/app/sdkdocs/javascript/auth-getsession)以查看是否有一个有效的会话。

```
console.log(supabase.auth.getSession())
```

现在我们可以使用方法向用户发布JWTs，我们想开始获取特定于该用户的资源。因此，让我们做一些。转到SQL编辑器，运行。

```
create table my_scores (
    name text,
    score int,
    user_id uuid not null
);

ALTER TABLE my_scores ENABLE ROW LEVEL SECURITY;

insert into my_scores(name, score, user_id)
values
  ('Paul', 100, '5a4365e7-7c7d-4eaf-a8ee-9ec9432917ca'),
  ('Paul', 200, '5a4365e7-7c7d-4eaf-a8ee-9ec9432917ca'),
  ('Leto', 50,  '9ec94326-2e2d-2ea2-22e3-3a535a4365e7');

-- use UUIDs from the auth.users table if you want to try it
-- for yourself
```

现在我们要写我们的策略，还是用SQL，但注意也可以通过仪表盘上的Auth > Policies来添加。

```
CREATE POLICY user_update_own_scores ON my_scores
  FOR ALL
  USING (auth.uid() = user_id);
```

现在，假设你在你的javascript/supabase-js环境中有一个活动的会话，你可以做。

```
supabase.from('my_scores').select('*').then(console.log)
```

而你应该只收到属于当前登录用户的分数。另外，你也可以使用Bash，比如。

```
curl 'https://sjvwsaokcugktsdaxxze.supabase.co/rest/v1/my_scores?select=*' \
-H "apikey: <ANON_KEY>" \
-H "Authorization: Bearer <ACCESS_TOKEN>"
```

请注意，要通过API网关，总是需要`anon key`（或`service role key`）。这可以在 `apikey`头或名为 `apikey`的查询参数中传递。只要你用它来实例化客户端，它就会在supabase-js中自动传递。

这里还有一些关于如何构建你的模式以最好地与`auth.users`表整合的说明。

一旦你掌握了策略的窍门，你就可以开始变得有点花哨了。比方说，我在暴雪工作，我只希望暴雪的工作人员能够更新人们的高分，我可以写一些东西:

```
create policy "Only Blizzard staff can update leaderboard"
on my_scores
for update using (
  right(auth.jwt() ->> 'email', 13) = '@blizzard.com'
);
```

Supabase有两个内置的辅助函数。`auth.uid()`和`auth.jwt()`。

在这里可以看到完整的PostgreSQL策略文档。<https://www.postgresql.org/docs/12/sql-createpolicy.html>

你可以随心所欲地使用这些策略：

### 资源 [*link*](#%e8%b5%84%e6%ba%90)

* JWT debugger: <https://jwt.io>​
* PostgeSQL政策: <https://www.postgresql.org/docs/12/sql-createpolicy.html>
* PostgREST行级安全: <https://postgrest.org/en/v7.0.0/auth.html>

### 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

* 观看[第一部分：JWTs](/docs/app/development_guide/auth/auth-deep-dive/auth-deep-dive-jwts/)
* [第二部分:行级安全](/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/)

* [第四部分: GoTrue](/docs/app/development_guide/auth/auth-deep-dive/auth-gotrue/)
* 注册加入[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 第二部分:行级安全](/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/)

[第四部分: GoTrue *navigate\_next*](/docs/app/development_guide/auth/auth-deep-dive/auth-gotrue/)