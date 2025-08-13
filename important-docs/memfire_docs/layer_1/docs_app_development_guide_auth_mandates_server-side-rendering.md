# 服务器端渲染 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/mandates/server-side-rendering/
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

# 服务器端渲染

带有服务器端渲染（SSR）的单页应用程序是优化渲染的流行方法 性能和利用高级缓存策略。

当您需要访问用户时，Supbasse Auth支持服务器端呈现 信息，或者您的服务器需要代表您的 用户来呈现内容。

当用户使用Supabase Auth进行身份验证时 由服务器发布：

1.**JWT形式的访问令牌**。
2.**刷新令牌**，它是随机生成的字符串。

大多数Supabase项目的认证服务器都在监听 `<project-ref>.supabase.co/auth/v1`，
因此访问令牌和刷新令牌是 在上设置为`sb-access-token`和`sb-refresh-token`cookie `<project-ref>.supabase.co`域。

info

这些cookie名称仅供Suabase内部使用，在没有 警告本指南中包含的内容仅供说明之用。

Web浏览器限制跨域访问cookie，与 [同源政策 (SOP)](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

您的web应用程序无法访问这些cookie，
这些cookie也不会发送到应用程序的服务器。

## 了解身份验证流程 [*link*](#%e4%ba%86%e8%a7%a3%e8%ba%ab%e4%bb%bd%e9%aa%8c%e8%af%81%e6%b5%81%e7%a8%8b)

调用其中一个`signIn`方法时 浏览器将请求发送到Supabase Auth服务器。
身份验证服务器确定 是否验证电话号码、电子邮件和密码组合、Magic Link， 或者使用社交登录（如果项目中有任何设置）。
成功验证用户身份后，Supabase认证 服务器将用户重定向回单页应用程序。

info

您可以配置重定向URL在Supabase Dashboard中。您可以使用[通配符匹配模式](/docs/app/development_guide/auth/auth/#redirect-urls-and-wildcards) 如`*`和`**`，以允许重定向到不同形式的URL。

这些重定向URL具有以下结构：

```
https://yourapp.com/...#access_token=<...>&refresh_token=<...>&...
```

成功验证后的第一次访问和刷新令牌是 包含在重定向的URL片段（`#`符号之后的任何内容）中 地方这是故意的，不可配置。
客户端库被设计为侦听这种类型的URL 访问令牌、刷新令牌以及其中的一些额外信息，最后 将其保存在本地存储中，供库和应用程序进一步使用。

info

Web浏览器不会将URL片段发送到服务器 请求。
由于您可能没有在以下服务器上托管单页应用 您的直接控制（例如在GitHub Pages或其他免费增值托管 提供商），我们希望阻止托管服务访问您的 默认情况下，用户的授权凭据。
即使服务器在您的 直接控制、`GET`请求及其完整URL经常被记录。这 该方法还避免了在请求或访问日志中泄漏凭据。

## 把它放在一起 [*link*](#%e6%8a%8a%e5%ae%83%e6%94%be%e5%9c%a8%e4%b8%80%e8%b5%b7)

从身份验证流程可以看出，成功后的初始请求 用户登录**后，浏览器登录到应用程序的服务器 包含有关用户**的任何信息。
这是因为首先客户端 JavaScript库必须在生成访问和刷新令牌之前运行 可用于您的服务器。

确保在登录后立即重定向路由是非常重要的 无需任何服务器端渲染即可工作。
其他需要授权的路线 不具有相同的限制，前提是发送访问和刷新 令牌发送到服务器。

这通常是通过设置cookie来完成的。这里有一个例子 可以添加到应用程序的根目录：

```
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // delete cookies on sign out
    const expires = new Date(0).toUTCString()
    document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
    document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
    document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
    document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
  }
})
```

使用标准
[`document.cookie` API](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)在应用程序域的所有路径上设置cookie。
所有后续请求 浏览器对应用程序服务器的设置包括“我的访问令牌”和 `我的刷新令牌cookie（cookie的名称和其他 可以改变参数）。

在服务器端呈现代码中，您现在可以访问用户和会话 信息：

```
const refreshToken = req.cookies['my-refresh-token']
const accessToken = req.cookies['my-access-token']

if (refreshToken && accessToken) {
  await supabase.auth.setSession({
    refresh_token: refreshToken,
    access_token: accessToken,
  })
} else {
  // make sure you handle this case!
  throw new Error('User is not authenticated.')
}

// returns user information
await supabase.auth.getUser()
```

使用`setSession({ access_token, refresh_token })`而不是 `setSession(refreshToken)`或`getUser(accessToken)`单独作为刷新令牌或访问令牌不能正确标识用户会话。

访问令牌仅在短时间内有效。

即使刷新令牌寿命长，也不能保证用户 具有活动会话。他们可能已注销，而您的应用程序未能 删除`我的刷新令牌`cookie，或发生其他故障浏览器中的过时刷新令牌。
此外，刷新令牌只能是 第一次使用几秒钟后使用。仅当 访问令牌即将到期，这将避免引入困难诊断应用程序中的注销错误。

一个好的做法是通过延迟渲染页面，而不是在服务器中。一些用户信息是 但包含在访问令牌中，因此在某些情况下，您可能能够使用这些可能过时的信息来呈现页面。

## 常见问题解答 [*link*](#%e5%b8%b8%e8%a7%81%e9%97%ae%e9%a2%98%e8%a7%a3%e7%ad%94)

### 如何制作Cookie`HttpOnly`？ [*link*](#%e5%a6%82%e4%bd%95%e5%88%b6%e4%bd%9ccookiehttponly)

这不是必须的。访问令牌和刷新令牌都设计用于 传递给应用程序中的不同组件。基于浏览器 应用程序的一方需要访问刷新令牌才能正确维护 浏览器会话。

### 我的服务器收到无效的刷新令牌错误。发生什么事？ [*link*](#%e6%88%91%e7%9a%84%e6%9c%8d%e5%8a%a1%e5%99%a8%e6%94%b6%e5%88%b0%e6%97%a0%e6%95%88%e7%9a%84%e5%88%b7%e6%96%b0%e4%bb%a4%e7%89%8c%e9%94%99%e8%af%af%e5%8f%91%e7%94%9f%e4%bb%80%e4%b9%88%e4%ba%8b)

从浏览器发送到服务器的刷新令牌很可能是不新鲜的,确保`onAuthStateChange`侦听器回调没有错误在应用程序的生命周期中相对较早地注册。

当您在服务器端收到此错误时，请尝试延迟 呈现到客户端库可以访问最新刷新令牌并为用户提供更好的体验。

### 我应该在cookie上设置一个较短的`Max Age`参数吗？ [*link*](#%e6%88%91%e5%ba%94%e8%af%a5%e5%9c%a8cookie%e4%b8%8a%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e8%be%83%e7%9f%ad%e7%9a%84max-age%e5%8f%82%e6%95%b0%e5%90%97)

`Max-Age`或`Expires`cookie参数仅控制浏览器将值发送到服务器。由于刷新令牌表示 用户在该浏览器上的长期身份验证会话，设置短 Cookie上的`Max-Age`或`Expires`参数只会导致用户体验。

确保用户已注销或会话已结束的唯一方法 是使用`getUser()`获取用户的详细信息。

### 我应该为`SameSite`属性使用什么？ [*link*](#%e6%88%91%e5%ba%94%e8%af%a5%e4%b8%basamesite%e5%b1%9e%e6%80%a7%e4%bd%bf%e7%94%a8%e4%bb%80%e4%b9%88)

确保您[了解物业在不同情况](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)因为某些属性会降低用户体验。

一个好的默认设置是使用`Lax`，当用户导航到您的网站。Cookie通常需要`安全`属性， 其仅通过HTTPS发送它们。
然而，当 在`localhost`上开发。

### 我可以使用CDN或缓存进行服务器端渲染吗？ [*link*](#%e6%88%91%e5%8f%af%e4%bb%a5%e4%bd%bf%e7%94%a8cdn%e6%88%96%e7%bc%93%e5%ad%98%e8%bf%9b%e8%a1%8c%e6%9c%8d%e5%8a%a1%e5%99%a8%e7%ab%af%e6%b8%b2%e6%9f%93%e5%90%97)

是的，但您需要小心至少包含刷新令牌cookie 值。
否则，您可能会意外地使用 属于不同用户的数据！

还要确保设置了正确的缓存控制标头。我们建议无效 每小时或更短时间缓存一次密钥。

---

[*navigate\_before* 管理用户数据](/docs/app/development_guide/auth/mandates/managing-user-data/)

[多因素身份验证 *navigate\_next*](/docs/app/development_guide/auth/mandates/auth-mfa/)