# 第一部分:JWTS | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/auth-deep-dive/auth-deep-dive-jwts/
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

# 第一部分:JWTS

### 关于 [*link*](#%e5%85%b3%e4%ba%8e)

对JWTs的介绍以及它们在Supabase Auth中的使用方法

### 观察 [*link*](#%e8%a7%82%e5%af%9f)

### 什么是JSON网络令牌（JWTs）？ [*link*](#%e4%bb%80%e4%b9%88%e6%98%afjson%e7%bd%91%e7%bb%9c%e4%bb%a4%e7%89%8cjwts)

JWT是JSON对象，经过编码和签名，以字符串的形式发送。它们被分发给服务或网站的用户，用户随后可以向网站或服务展示JWT，作为他们有权访问某些内容的证明。

当我们说 `编码`和 `签名`时，到底是什么意思？

JSON对象开始时看起来像这样。

```
{
  "sub": "0001",
  "name": "Sam Vimes",
  "iat": 1516239022,
  "exp": 1518239022
}
```

`sub`是 `主题`，通常是用户的UUID。`name`是不言自明的，`iat`是创建令牌的Unix时间戳。许多JWT也会有一个`exp`，这是该令牌被设定为过期而不能再使用的日期。这些是你可能在JWT中发现的一些标准字段，但你几乎可以在其中存储任何你想要的东西，例如。

```
{
  "sub": "0002",
  "name": "Věra Hrabánková",
  "iat": 1516239022,
  "exp": 1518239022,
  "theme": {
      "primary" : "#D80C14",
      "secondary" : "#FFFFFF"
  }
}
```

只需注意，你在令牌中存储的数据越多，编码后的字符串就越长。

当我们想把JWT发送给用户时，我们首先用一种算法对数据进行编码，如`HS256`。有许多库（和几种不同的算法）可以用来做这种编码/解码，例如[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)。我做了一个副本[这里](https://replit.com/@awalias/jsonwebtokens#index.js)，所以你可以自己试试。签名的方法很简单。

```
// from https://replit.com/@awalias/jsonwebtokens#index.js
let token = jwt.sign({ name: 'Sam Vimes' }, 'some-secret')
```

而产生的字符串将看起来像这样。

```
eyJhbGciOiJIUzI1NiJ9
.eyJzdWIiOiIwMDAxIiwibmFtZSI6IlNhbSBWaW1lcyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE4MjM5MDIyfQ
.zMcHjKlkGhuVsiPIkyAkB2rjXzyzJsMMgpvEGvGtjvA
```

你会注意到，这个字符串实际上是由三个部分组成的，我们将逐一解决这个问题。

第一段`eyJhbGciOiJIUzI1NiJ9`被称为 `头`，在解码时只是告诉我们用哪种算法来做编码。

```
{
  "alg": "HS256"
}
```

第二段`eyJzdWIiOiIwMDAxIiwibmFtZSI6IlNhbSBWaW1lcyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE4MjM5MDIyfQ`包含我们的原始有效载荷。

```
{
  "sub": "0001",
  "name": "Sam Vimes",
  "iat": 1516239022,
  "exp": 1518239022
}
```

最后一段`zMcHjKlkGhuVsiPIkyAkB2rjXzyzJsMMgpvEGvGtjvA`是签名本身，是网站或服务提供者用来验证某个用户发送的令牌是否合法的部分。它首先是通过对以下输入运行加密函数HS256产生的。

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload)
  <jwt_secret>
)
```

你可以在<https://jwt.io>上测试一下铸造你自己的代币。

值得注意的是，任何拥有`jwt_secret`的人都可以创建新的令牌，也可以验证现有的令牌。更高级的JWT算法使用两个秘密：一个用于创建令牌，另一个用于验证签名令牌的有效性。

你可能想知道为什么JWT突然间如此流行。答案是，随着微服务架构的大规模采用，我们遇到了这样一种情况：几个不同的微服务（API、网站、服务器等）想要轻松地验证一个用户是他们所说的人，或者换句话说，是一个 “登录 “用户。传统的会话令牌在这里没有用处，因为它们需要每个微服务维护一个当前有效的会话令牌的记录，或者在每次用户想要访问一个资源时查询一个中央数据库，以便检查会话令牌的有效性–效率确实很低。在这个意义上，基于JWT的认证是分散的，因为任何拥有 “jwt\_secret “的人都可以验证一个令牌，而不需要访问一个中央数据库。

注意：JWT的一个缺点是，它不像会话令牌那样可以轻易作废。如果JWT被泄露给恶意行为者，他们将能够在任何地方赎回它，直到到期日 - 当然，除非系统所有者更新`jwt_secret`（这当然会使\_所有人的现有令牌失效）。

### Supabase中的JWTs [*link*](#supabase%e4%b8%ad%e7%9a%84jwts)

在Supabase中，我们为三个不同的目的发布JWTs：

1. `匿名密钥`:这个密钥用于绕过Supabase API网关，可以在你的客户端代码中使用。
2. `服务角色密钥`:此密钥具有超级管理员权限，可以绕过你的行级安全。不要把它放在你的客户端代码中。保持它的私密性。
3. `用户特定的JWTS`:这些是我们发给登录你的项目/服务/网站的用户的令牌。它相当于现代的会话令牌，可以被用户用来访问他们特定的内容或权限。

这里的第一个令牌，即 `匿名钥匙`令牌，是供开发人员在想与Supabase数据库进行交互时与他们的API请求一起发送。

假设你想读取一个表`colors`中所有行的名字。我们会提出这样一个请求：

```
curl 'https://xscduanzzfseqszwzhcy.supabase.co/rest/v1/colors?select=name' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNDIwNTE3NCwiZXhwIjoxOTI5NzgxMTc0fQ.-NBR1WnZyQGpRLdXJfgfpszoZ0EeE6KHatJsDPLIX8c"
```

如果我们把这个令牌放到https://jwt.io，我们看到它被解码为：

```
{
  "role": "anon",
  "iss": "supabase",
  "iat": 1614205174,
  "exp": 1929781174
}
```

这个JWT是由开发人员的Supabase令牌所特有的`jwt_secret`签署的（你可以在设置>API页面下的仪表板上找到这个秘密和这个编码的 “anon key”），并且需要通过Supabase API网关并访问开发人员的项目。

这个特定密钥的想法是，它可以安全地放入你的客户端，也就是说，如果你的终端用户看到这个密钥是可以的 - 但\_只有在你首先启用行级安全的情况下，这是本系列的[第二部分](/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/) 的主题。

第二个密钥，`服务角色密钥`，应该只在你自己的服务器或环境中使用，而不应该与终端用户共享。你可以使用这个令牌来做一些事情，比如批量插入数据。

`用户访问令牌`是当你呼叫时发出的JWT，例如:

```
supabase.auth.signIn({
  email: 'lao.gimmie@gov.sg',
  password: 'They_Live_1988!',
})
```

这个令牌应该在`apikey`头之外作为`授权承载者`头传递。

```
curl 'https://xscduanzzfseqszwzhcy.supabase.co/rest/v1/colors?select=name' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNDIwNTE3NCwiZXhwIjoxOTI5NzgxMTc0fQ.-NBR1WnZyQGpRLdXJfgfpszoZ0EeE6KHatJsDPLIX8c" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjE1ODI0Mzg4LCJzdWIiOiIwMzM0NzQ0YS1mMmEyLTRhYmEtOGM4YS02ZTc0OGY2MmExNzIiLCJlbWFpbCI6InNvbWVvbmVAZW1haWwuY29tIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwifSwidXNlcl9tZXRhZGF0YSI6bnVsbCwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.I-_oSsJamtinGxniPETBf-ezAUwDW2sY9bJIThvdX9s"
```

你会注意到，这个令牌相当长，因为它包含了用户的具体信息，如:

```
{
  "aud": "authenticated",
  "exp": 1615824388,
  "sub": "0334744a-f2a2-4aba-8c8a-6e748f62a172",
  "email": "d.l.solove@gmail.com",
  "app_metadata": {
    "provider": "email"
  },
  "user_metadata": null,
  "role": "authenticated"
}
```

现在你已经了解了什么是JWTs以及它们在Supabase中的用途，你可以探索如何将它们与行级安全相结合，开始限制对Postgres数据库中某些表、行和列的访问。[第二部分：行级安全](/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/)

### 资源 [*link*](#%e8%b5%84%e6%ba%90)

* JWT debugger: <https://jwt.io/>

### 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

* [第二部分:行级安全](/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/)
* [第三部分:政策](/docs/app/development_guide/auth/auth-deep-dive/auth-policies/)
* [第四部分: GoTrue](/docs/app/development_guide/auth/auth-deep-dive/auth-gotrue/)
* 注册加入[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* Supabase Remix认证](/docs/app/development_guide/auth/auth-helpers/remix/)

[第二部分:行级安全 *navigate\_next*](/docs/app/development_guide/auth/auth-deep-dive/auth-row-level-security/)