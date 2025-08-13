# 概述 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-api/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# 概述

认证方法可以通过 `supabase.auth` 命名空间访问。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (创建认证客户端) [*link*](#%e6%a1%88%e4%be%8b1--%e5%88%9b%e5%bb%ba%e8%ae%a4%e8%af%81%e5%ae%a2%e6%88%b7%e7%ab%af)

```
import { createClient } from 'supabase-wechat-stable-v2'

const supabase = createClient(supabase_url, anon_key)
```

### 案例2 （创建认证客户端 （服务器端）） [*link*](#%e6%a1%88%e4%be%8b2--%e5%88%9b%e5%bb%ba%e8%ae%a4%e8%af%81%e5%ae%a2%e6%88%b7%e7%ab%af-%e6%9c%8d%e5%8a%a1%e5%99%a8%e7%ab%af)

```
import { createClient } from 'supabase-wechat-stable-v2'

const supabase = createClient(supabase_url, anon_key, {
auth: {
  autoRefreshToken: false,
  persistSession: false,
  detectSessionInUrl: false
}
})
```

## 入门指南 [*link*](#%e5%85%a5%e9%97%a8%e6%8c%87%e5%8d%97)

[概述

每个认证系统都有认证和授权两个部分](/docs/app/development_guide/auth/auth/)

[重定向 URL

使用无密码登录或第三方提供程序时，MemFire Cloud 客户端库方法提供 redirectTo 参数，以指定身份验证后将用户重定向到的位置](/docs/app/development_guide/auth/redirect-urls/)

[原生移动端深度链接

在某些身份验证情况下，您需要处理链接回应用程序以完成用户登录](/docs/app/development_guide/auth/native-mobile-deep-linking/)

[启用Captcha保护

Supabase为您提供了在登录、注册和密码重置表单中添加captcha的选项](/docs/app/development_guide/auth/auth-captcha/)

[速率限制

速率限制、资源分配和滥用预防](/docs/app/development_guide/auth/rate-limiting/)

[身份验证

提供邮件、短信、微信等多种认证方式](/docs/app/development_guide/auth/authentication/auth-email/)

[授权

行级别安全性](/docs/app/development_guide/auth/mandates/row-level-security/)

[认证帮助程序

用于使用Supabase的特定于框架的Auth实用程序的集合](/docs/app/development_guide/auth/auth-helpers/auth-helpers/)

[深层探索

JWTS、行级安全、GoTrue、Google Oauth](/docs/app/development_guide/auth/auth-deep-dive/auth-deep-dive-jwts/)

---

[*navigate\_before* 概述](/docs/app/sdkdocs/javascript/auth/auth-api/)

[signUp() *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-signup/)