# 重定向 URL | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/redirect-urls/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

概览

# 重定向 URL

## 概览 [*link*](#%e6%a6%82%e8%a7%88)

使用[无密码登录](/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/)或[第三方提供程序](/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/#sign-in-using-a-third-party-provider-with-redirect)时，MemFire Cloud 客户端库方法提供 `redirectTo` 参数，以指定身份验证后将用户重定向到的位置。默认情况下，用户将被重定向到`SITE_URL`，但您可以修改SITE\_URL或将其他重定向 URL 添加到允许列表。将必要的 URL 添加到允许列表后，可以在 redirectTo 参数中指定希望用户重定向到的 URL。

## 在重定向 URL 中使用通配符 [*link*](#%e5%9c%a8%e9%87%8d%e5%ae%9a%e5%90%91-url-%e4%b8%ad%e4%bd%bf%e7%94%a8%e9%80%9a%e9%85%8d%e7%ac%a6)

MemFire Cloud 允许您在将重定向 URL 添加到允许列表时指定通配符。您可以使用通配符匹配模式来支持来自 Netlify 和 Vercel 等提供商的预览 URL。

| Wildcard | Description |
| --- | --- |
| `*` | 匹配任何非分隔符字符序列 |
| `**` | 匹配任意字符序列 |
| `?` | 匹配任何单个非分隔符 |
| `c` | 匹配字符 c （c ！= \*， \*\*， ？， \， [， {， }） |
| `\c` | 匹配字符 C |
| `[!{ character-range }]` | 匹配不在 { 字符范围 } 中的任何字符序列。例如，[!a-z] 将不匹配 a-z 范围内的任何字符。 |

URL 中的分隔符定义为 。和 /。使用[此工具](https://www.digitalocean.com/community/tools/glob?comments=true&glob=http%3A%2F%2Flocalhost%3A3000%2F%2A%2A&matches=false&tests=http%3A%2F%2Flocalhost%3A3000&tests=http%3A%2F%2Flocalhost%3A3000%2F&tests=http%3A%2F%2Flocalhost%3A3000%2F%3Ftest%3Dtest&tests=http%3A%2F%2Flocalhost%3A3000%2Ftest-test%3Ftest%3Dtest&tests=http%3A%2F%2Flocalhost%3A3000%2Ftest%2Ftest%3Ftest%3Dtest)来测试您的模式。

info

虽然“globstar”(\*\*) 对于本地开发和预览 URL 很有用，但我们建议为生产中的站点 URL 设置准确的重定向 URL 路径。

### 使用通配符重定向 URL 示例 [*link*](#%e4%bd%bf%e7%94%a8%e9%80%9a%e9%85%8d%e7%ac%a6%e9%87%8d%e5%ae%9a%e5%90%91-url-%e7%a4%ba%e4%be%8b)

| Redirect URL | Description |
| --- | --- |
| `http://localhost:3000/*` | 匹配 http://localhost:3000/foo、http://localhost:3000/bar 但不匹配 http://localhost:3000/foo/bar 或 http://localhost:3000/foo/ （注意尾部斜杠） |
| `http://localhost:3000/**` | 匹配 http://localhost:3000/foo、http://localhost:3000/bar 和 http://localhost:3000/foo/bar |
| `http://localhost:3000/?` | 匹配 http://localhost:3000/a 但不匹配 http://localhost:3000/foo |
| `http://localhost:3000/[!a-z]` | 匹配 http://localhost:3000/1 但不匹配 http://localhost:3000/a |

## Netlify 预览 URL [*link*](#netlify-%e9%a2%84%e8%a7%88-url)

对于使用 Netlify 的部署，请将`SITE_URL`设置为官方站点 URL。为本地开发和部署预览添加以下其他重定向 URL：

* `http://localhost:3000/**`
* `https://**--my_org.netlify.app/**`

## Vercel 预览 URL [*link*](#vercel-%e9%a2%84%e8%a7%88-url)

对于使用 Vercel 的部署，请将`SITE_URL`设置为官方网站 URL。为本地开发和部署预览添加以下其他重定向 URL：

* `http://localhost:3000/**`
* `https://*-username.vercel.app/**`

Vercel 为名为 NEXT\_PUBLIC\_VERCEL\_URL 的部署的 URL 提供了一个环境变量。有关更多详细信息，请参阅 [Vercel 文档](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables)。您可以使用此变量根据环境动态重定向。您还应该设置名为 NEXT\_PUBLIC\_SITE\_URL 的环境变量的值，这应该设置为生产环境中的站点 URL，以确保重定向正常运行。

```
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: getURL(),
  },
})
```

## 移动深度链接 URIs [*link*](#%e7%a7%bb%e5%8a%a8%e6%b7%b1%e5%ba%a6%e9%93%be%e6%8e%a5-uris)

对于移动应用程序，您可以使用深层链接 URI。例如，对于您的`SITE_URL`，您可以指定类似 com.supabase：//login-callback/ 的内容，如果需要，可以指定类似 `com.supabase.staging：//login-callback/` 的内容。

在此处阅读有关深度链接的更多信息，并查找[不同框架](/docs/app/development_guide/auth/native-mobile-deep-linking/)的代码示例。

---

[*navigate\_before* 概述](/docs/app/development_guide/auth/auth/)

[原生移动深度链接 *navigate\_next*](/docs/app/development_guide/auth/native-mobile-deep-linking/)