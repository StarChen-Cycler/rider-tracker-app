# 电子邮件模板 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-email-templates/
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

# 电子邮件模板

您可以自定义用于身份验证流的电子邮件。您可以编辑以下电子邮件模板：

* 确认注册
* 邀请用户
* Magic Link
* 更改邮箱地址
* 重置密码

## 术语 [*link*](#%e6%9c%af%e8%af%ad)

模板系统提供以下变量供使用：

| 名称 | 描述 |
| --- | --- |
| `{{ .ConfirmationURL }}` | 包含确认 URL。例如，注册确认 URL 如下所示：https://project-ref.supabase.co/auth/v1/verify?token={{ 。TokenHash }}&type=signup&redirect\_to=https：//example.com/path 。 |
| `{{ .Token }}` | 包含一个 6 位数的一次性密码 （OTP），可用于代替 {{.ConfirmationURL }} 中。 |
| `{{ .TokenHash }}` | 包含 {{ .Token }}。这对于在电子邮件模板中构建您自己的电子邮件链接非常有用。 |
| `{{ .SiteURL }}` | 包含应用程序的站点 URL。这可以在项目的身份验证设置中进行配置。 |
| `{{ .RedirectTo }}` | 包含在调用 signUp、signInWithOtp、signInWithOAuth、resetPasswordForEmail 或 inviteUserByEmail 时传递的重定向 URL。可以在项目的身份验证设置中配置重定向 URL 允许列表。 |
| `{{ .Data }}` | 包含来自auth.users.user\_metadata的元数据。使用它来个性化电子邮件。 |

## 局限性 [*link*](#%e5%b1%80%e9%99%90%e6%80%a7)

### 电子邮件预取 [*link*](#%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e9%a2%84%e5%8f%96)

某些电子邮件提供商可能具有垃圾邮件检测或其他安全功能，可预提取传入电子邮件中的 URL 链接（例如，[Microsoft Defender for Office 365 中的安全链接](https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/safe-links-about?view=o365-worldwide)）。
在此方案中，发送的 {{ .ConfirmationURL }} 将立即被消耗，这会导致“令牌已过期或无效”错误。
为了防止这种情况，请执行以下操作：

* 改用电子邮件 OTP，包括 {{ .Token }}。
* 创建您自己的自定义电子邮件链接，将用户重定向到一个页面，他们可以在其中单击按钮以确认操作。
  例如，您可以在电子邮件模板中包含以下内容：

  ```
  <a href="{{ .SiteURL }}/confirm-signup?confirmation_url={{ .ConfirmationURL }}"
    >Confirm your signup
  </a>
  ```

  用户应被带到您网站上的页面，他们可以在其中通过单击按钮来确认操作。
  该按钮应包含实际的确认链接，该链接可以通过解析 confirmation\_url=获得{{ 。ConfirmationURL }} 查询参数。

### 电子邮件跟踪 [*link*](#%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e8%b7%9f%e8%b8%aa)

如果您使用的是启用“电子邮件跟踪”的外部电子邮件提供商，则 MemFireCloud 电子邮件模板中的链接将被覆盖，并且无法按预期执行。我们建议禁用电子邮件跟踪，以确保电子邮件链接不会被覆盖。

### 将用户重定向到服务器端终结点 [*link*](#%e5%b0%86%e7%94%a8%e6%88%b7%e9%87%8d%e5%ae%9a%e5%90%91%e5%88%b0%e6%9c%8d%e5%8a%a1%e5%99%a8%e7%ab%af%e7%bb%88%e7%bb%93%e7%82%b9)

如果打算使用[服务器端](/docs/app/development_guide/auth/mandates/server-side-rendering/)呈现，则可能需要电子邮件链接将用户重定向到服务器端终结点，以在返回页面之前检查他们是否经过身份验证。但是，默认电子邮件链接会在验证后将用户重定向到查询片段中包含会话的重定向 URL。由于默认情况下，会话在查询片段中返回，因此您将无法在服务器端访问它。

您可以在电子邮件模板中自定义电子邮件链接，以成功将用户重定向到服务器端终结点。例如：

```
<a
  href="https://api.example.com/v1/authenticate?token_hash={{ .TokenHash }}&type=invite&redirect_to={{ .RedirectTo }}"
  >Accept the invite
</a>
```

当用户点击链接时，请求将点击 <https://api.example.com/v1/authenticate>，您可以从 URL 中获取token\_hash、键入和redirect\_to查询参数。然后，可以调用 [verifyOtp](/docs/app/sdkdocs/javascript/auth/auth-verifyotp/) 方法以在将用户重定向回客户端之前取回经过身份验证的会话。由于 verifyOtp 方法向 MemFireCloud Auth 发出 POST 请求以验证用户，因此会话将在响应正文中返回，服务器可以读取该正文。例如：

```
const { token_hash, type } = Object.fromEntries(new URLSearchParams(window.location.search))
const {
  data: { session },
  error,
} = await supabase.auth.verifyOtp({ token_hash, type })

// subsequently redirect the user back to the client using the redirect_to param
// ...
```

## 定制 [*link*](#%e5%ae%9a%e5%88%b6)

MemFireCloud Auth 使用 [Go 模板](https://pkg.go.dev/text/template). 这意味着可以根据模板属性有条件地呈现信息。您可能希望查看 Hugo 的本指南，以获取有关模板语言的指南。

### 向抢先体验用户发送不同的电子邮件 [*link*](#%e5%90%91%e6%8a%a2%e5%85%88%e4%bd%93%e9%aa%8c%e7%94%a8%e6%88%b7%e5%8f%91%e9%80%81%e4%b8%8d%e5%90%8c%e7%9a%84%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6)

向通过抢先体验域 (`https://www.earlyaccess.trial.com`)注册的用户发送不同的电子邮件。

```
{{ if eq .Data.Domain "https://www.example.com" }}
<h1>Welcome to Our Database Service!</h1>
  <p>Dear Developer,</p>
  <p>Welcome to Billy, the scalable developer platform!</p>
  <p>Best Regards,<br>
Billy Team</p>
{{ else if eq .Data.Domain "https://www.earlyaccess.trial.com" }}
<h1>Welcome to Our Database Service!</h1>
  <p>Dear Developer,</p>
  <p>Welcome Billy, the scalable developer platform!</p>
  <p> As an early access member, you have access to select features like Point To Space Restoration.</p>
  <p>Best Regards,<br>
Billy Team</p>
{{ end }}
```

---

[*navigate\_before* 使用GitLab登录](/docs/app/development_guide/auth/authentication/auth-gitlab/)

[行级别安全性 *navigate\_next*](/docs/app/development_guide/auth/mandates/row-level-security/)