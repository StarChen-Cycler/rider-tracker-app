# 概述 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/auth
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

概述

# 概述

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

每个认证系统都有两个部分。

* **认证**：这个人应该被允许进入吗？如果是的话，他们是谁？
* **授权**：一旦他们进入，他们被允许做什么？

Supabase Auth被设计为既可以作为一个独立的产品，也可以与其他Supabase产品深度集成。
Postgres是我们一切工作的核心，Auth系统也遵循这一原则。我们尽可能地利用Postgres的内置Auth功能。

下面是Supabase内置的Auth功能的2分钟快速浏览。

## 身份认证 [*link*](#%e8%ba%ab%e4%bb%bd%e8%ae%a4%e8%af%81)

你可以通过几种方式来验证你的用户。

* 电子邮件和密码。
* Magic links（一键登录）。
* 社交媒体登录认证服务商。
* 电话登录。

### 服务商 [*link*](#%e6%9c%8d%e5%8a%a1%e5%95%86)

我们提供了多种认证方式和登录方式，以及认证工具集合。[认证帮助程序](/docs/app/development_guide/auth/auth-helpers/)。

[Email](/docs/app/development_guide/auth/authentication/auth-email)

[Magic Links](/docs/app/development_guide/auth/authentication/auth-magic-link)

[Apple](/docs/app/development_guide/auth/authentication/auth-apple)

[GitHub](/docs/app/development_guide/auth/authentication/auth-github)

[GitLab](/docs/app/development_guide/auth/authentication/auth-gitlab)

### 配置第三方服务商 [*link*](#%e9%85%8d%e7%bd%ae%e7%ac%ac%e4%b8%89%e6%96%b9%e6%9c%8d%e5%8a%a1%e5%95%86)

你可以通过点击一个按钮来启用第三方提供商，方法是浏览认证 > 设置 > Auth Providers，并为每个提供商输入你的 `客户端ID`和 `密匙`。

![](../../../img/supabase-oauth-logins.png)

### 重定向URLs和通配符 [*link*](#%e9%87%8d%e5%ae%9a%e5%90%91urls%e5%92%8c%e9%80%9a%e9%85%8d%e7%ac%a6)

当使用第三方提供商时，[Supabase客户端库](/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/#sign-in-using-a-third-party-provider-with-redirect)将用户重定向到提供商。当第三方服务商成功认证用户时，服务商将用户重定向到Supabase Auth回调URL，在那里他们将被进一步重定向到`redirectTo`参数中指定的URL。这个参数默认为`SITE_URL`。你可以修改`SITE_URL`或添加额外的重定向URL。

你可以使用通配符匹配模式来支持Netlify和Vercel等服务商的预览URL。见[支持模式的完整列表](https://pkg.go.dev/github.com/gobwas/glob#Compile)。

#### Netlify预览URLs [*link*](#netlify%e9%a2%84%e8%a7%88urls)

对于使用Netlify的部署，将`SITE_URL`设置为你的官方网站URL。为本地开发和部署预览添加以下额外的重定向URL。

* `http://localhost:3000/*/*`
* `https://**--my_org.netlify.app/*`

#### Vercel预览网址 [*link*](#vercel%e9%a2%84%e8%a7%88%e7%bd%91%e5%9d%80)

对于使用Vercel的部署，将`SITE_URL`设置为你的官方网站URL。为本地开发和部署预览添加以下额外的重定向URL。

* `http://localhost:3000/*/*`
* `https://**vercel.app/*/*`

Vercel为部署的URL提供了一个环境变量，称为`NEXT_PUBLIC_VERCEL_URL`。更多细节见[Vercel docs](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables)。你可以使用这个变量，根据环境动态地重定向。

```
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github'
  options: {
    redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000"
  }
}
```

#### 移动端深层链接 URI [*link*](#%e7%a7%bb%e5%8a%a8%e7%ab%af%e6%b7%b1%e5%b1%82%e9%93%be%e6%8e%a5-uri)

对于移动应用程序，您可以使用深度链接URI。例如，对于您的`SITE_URL`，您可以指定类似于`com.supabase://login-callback/`的内容，如果需要额外的重定向URL，则可以使用类似于`com.supabase.staging://login-callback/`的内容。

## 授权 [*link*](#%e6%8e%88%e6%9d%83)

当你需要细化的授权规则时，没有什么比PostgreSQL的行级安全（RLS）更重要了。

策略是PostgreSQL的规则引擎。它们是非常强大和灵活的，允许你编写复杂的SQL规则，以满足你独特的业务需求。

从我们的[行级安全指南](/docs/app/development_guide/auth/mandates/row-level-security/)开始吧。

### 行级安全 [*link*](#%e8%a1%8c%e7%ba%a7%e5%ae%89%e5%85%a8)

认证只解决了用户身份验证的问题，但并没有涉及用户在系统中的权限和访问级别。为了解决这个问题，您需要使用到PostgreSQL的[行级安全性（RLS）](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)的特性。该特性通过打开和关闭RLS选项，使得授权变得非常简单。

[

](../../videos/rls-zoom2.mp4)

### 策略 [*link*](#%e7%ad%96%e7%95%a5)

[策略](https://www.postgresql.org/docs/current/sql-createpolicy.html)是PostgreSQL的规则引擎。它们非常强大和灵活，允许你编写复杂的SQL规则，以适应你独特的业务需求。

[

](../../videos/policies-zoom2.mp4)

如果设置了策略(Policy)，你的数据库就成了规则引擎。就不需要编写如下复杂的查询语句：

```
const loggedInUserId = 'd0714948'
let { data, error } = await supabase
  .from('users')
  .select('user_id, name')
  .eq('user_id', loggedInUserId)

// console.log(data)
// => { id: 'd0714948', name: 'Jane' }
```

你可以很方便的在数据库表上定义一个策略（policy），`auth.uid() = user_id`，策略生效后，你对数据库的所有请求仅返回将通过该策略的行记录，即：只能查询到当前登录用户的数据,简化代码如下：

```
let { data, error } = await supabase.from('users').select('user_id, name')

// console.log(data)
// Still => { id: 'd0714948', name: 'Jane' }
```

### 它是如何工作的 [*link*](#%e5%ae%83%e6%98%af%e5%a6%82%e4%bd%95%e5%b7%a5%e4%bd%9c%e7%9a%84)

1. 用户注册后。MemFireCloud在`auth.users`表中创建一个新用户。
2. MemFireCloud返回一个包含用户`UUID`的新JWT。
3. 每个对数据库的请求都会发送JWT。
4. Postgres检查JWT以确定发起请求的用户。
5. 用户的UID可以在策略中用于限制对行的访问。

MemFireCloud 在 Postgres 中提供了一个特殊函数 `auth.uid()` 。可以从JWT中提取用户的UID，在创建策略时特别有用。

## 用户管理 [*link*](#%e7%94%a8%e6%88%b7%e7%ae%a1%e7%90%86)

Supabase提供多个端点来验证和管理你的用户。

* [注册](/docs/app/sdkdocs/javascript/auth/auth-signup/)
* [用密码登录](/docs/app/sdkdocs/javascript/auth/auth-signinwithpassword/)
* [使用无密码/一次性密码（OTP）登录](/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/)
* [用OAuth登录](/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/)
* [退出登陆](/docs/app/sdkdocs/javascript/auth/auth-signout/)

当用户注册时，Supabase为他们分配了一个唯一的ID。你可以在你的数据库中的任何地方引用这个ID。例如，你可以创建一个`profiles`表，使用`user_id`字段引用`auth.users`表中的`id`。

[

](../../videos/auth-zoom2.mp4)

---

[*navigate\_before* 快速入门: SvelteKit](/docs/app/quickstart/with-sveltekit/)

[重定向 URL *navigate\_next*](/docs/app/development_guide/auth/redirect-urls/)