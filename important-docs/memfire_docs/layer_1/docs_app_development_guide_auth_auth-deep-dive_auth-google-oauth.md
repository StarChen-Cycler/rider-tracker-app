# 第五部分: Google Oauth | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/auth-deep-dive/auth-google-oauth/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

About

# 第五部分: Google Oauth

### About [*link*](#about)

如何在 Supabase 应用程序中添加 Google OAuth 登录。

### Watch [*link*](#watch)

### 使用外部 OAuth 提供商登录 [*link*](#%e4%bd%bf%e7%94%a8%e5%a4%96%e9%83%a8-oauth-%e6%8f%90%e4%be%9b%e5%95%86%e7%99%bb%e5%bd%95)

连接社交登录（如 Google、GitHub 或 Facebook）再简单不过了。在本指南中，我们将指导你完成连接 Google 的过程，但这一过程对所有提供商都基本相同，其中包括：Azure、Bitbucket、Github、Gitlab、Facebook 和 Google。

首先，你需要在他们的[云控制台](https://console.cloud.google.com/home/dashboard)中创建一个谷歌项目，在其他提供商中，他们可能将此称为 “应用程序”，通常可在公司的开发人员门户网站上获得。

有了项目后，在搜索栏中输入 “OAuth”，然后打开 “OAuth 同意界面”。

选择 “外部”，然后填写其余表格字段

接下来打开左侧的证书页面

然后点击 “创建一组新凭证”，选择 “OAuth 客户端 ID “作为选项。n

现在选择 Web 应用程序（假设您创建的是 Web 应用程序），然后在授权重定向 URI 部分添加：`https://<your-ref>.supabase.co/auth/v1/callback`。你可以在 Supabase 面板内的设置 > API 中找到你的 Supabase URL。

现在，您可以从弹出窗口获取客户 ID 和秘密，并将它们插入 Supabase 面板中的 “认证”>“设置 “的谷歌部分：

点击保存。现在你应该可以在浏览器中导航到

```
https://<your-ref>.supabase.co/auth/v1/authorize?provider=google
```

然后使用任何谷歌或 Gmail 账户登录您的服务。

例如，您还可以在 URL 末尾添加查询参数 `redirect_to=` ：

```
https://<your-ref>.supabase.co/auth/v1/authorize?provider=google&redirect_to=http://localhost:3000/welcome
```

但请确保您在此输入的 URL 与您在 Supabase 面板上的 “认证”>“设置 “页面中输入的网站 URL 位于同一主机上。(即将推出其他功能，您可以在允许列表中添加其他 URL）。

如果您想在认证成功后将用户重定向到网站或应用程序中的特定页面。

您还可以选择向 oauth 提供商请求额外的范围。比方说，您希望能代表用户的 Gmail 账户发送电子邮件。您可以通过添加查询参数 “scopes “来实现这一功能，例如

```
https://<your-ref>.supabase.co/auth/v1/authorize?provider=google&https://www.googleapis.com/auth/gmail.send
```

但请注意，您的应用程序通常必须通过谷歌验证后才能申请此类高级范围。

唯一需要实现的是用户界面，但如果您更喜欢使用预制的东西，我们有一个方便的[Auth Widget](https://github.com/supabase/ui/#using-supabase-ui-auth)，您可以在其中启用/禁用您想要支持的认证提供商。

如需任何支持，请联系 beta at [supabase.com](https://supabase.com) 或在 [backend](https://github.com/supabase/gotrue) 或 [frontend](https://github.com/supabase/gotrue-js) 仓库中提交功能请求。

### 资料 [*link*](#%e8%b5%84%e6%96%99)

* [JWT debugger](https://jwt.io)

### Next steps [*link*](#next-steps)

* Watch [Part One: JWTs](/docs/app/development_guide/auth/auth-deep-dive/auth-deep-dive-jwts/)
* Watch [Part Two: Row Level Security](/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/)
* Watch [Part Three: Policies](/docs/app/development_guide/auth/auth-deep-dive/auth-policies/)
* Watch [Part Four: GoTrue](/docs/app/development_guide/auth/auth-deep-dive/auth-gotrue/)

* Sign up for Supabase: [app.supabase.com](https://app.supabase.com)

---

[*navigate\_before* 第四部分: GoTrue](/docs/app/development_guide/auth/auth-deep-dive/auth-gotrue/)

[概述 *navigate\_next*](/docs/app/development_guide/database/database/)