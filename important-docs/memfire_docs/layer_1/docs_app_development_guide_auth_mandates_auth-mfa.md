# 多因素身份验证 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/mandates/auth-mfa/
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

# 多因素身份验证

info

Multi-Factor Authentication仅在早期访问预览中。
尽管我们 相信它已经做好了生产准备，API和一些行为可能会根据 我们在预览期收到的反馈。

多因素身份验证(MFA)，有时称为双因素身份验证 (2FA)，为您的 通过验证他们的身份附加验证步骤。

将MFA用于应用程序被认为是最佳做法。密码薄弱或社交登录帐户受损的用户 容易被恶意接管账户。这些可以通过 MFA，因为他们要求用户提供 这两个：

* 他们知道的事情。 密码或访问社交登录帐户。
* 他们有的东西。 访问验证器应用程序（也称为TOTP）、手机或恢复代码。

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

Supabase Auth仅实现基于时间的一次性因素（TOTP）多因素认证。这种类型的多因素身份验证使用从由用户控制的验证器应用程序。

使用MFA的应用程序需要两个重要流程：

1.**报名流程**
这允许用户在应用程序中设置和控制MFA。

2.**认证流程**
这允许用户在常规登录步骤之后使用任何因素登录。

Supabase Auth提供：

* **Enrollment API**构建丰富的用户界面以添加和移除身份验证因素。
* **Challenge and Verify API**安全验证用户是否具有访问因素的权限。
* **List Factors API**构建丰富的用户界面以使用其他身份验证因素进行登录。

这些API集允许您控制适用于您的MFA体验。你可以创建MFA为可选、强制或仅为特定的流用户组。

一旦用户注册或使用某个因子登录，Supabase Auth补充道应用程序可以向用户的访问令牌（JWT）添加附加元数据用于允许或拒绝访问。

此信息由[身份验证器保证级别](https://pages.nist.gov/800-63-3-Implementation-Resources/63B/AAL/)，一个关于确保超级认证用户身份的标准措施对于该特定会话。目前公认有两个级别：

1.**保证级别1:`aal1`** 表示使用常规登录方法验证了用户的身份例如电子邮件+密码、magic link、一次性密码、电话授权或社交登录。
2.**保证级别2:`aal2`** 意味着用户的身份已使用至少一个,例如TOTP码。

该保证级别编码在与用户相关的JWT中的`aal`声明中。通过解码此值，您可以在前端、后端和数据库中创建自定义授权规则，以实施适用于应用程序的MFA策略。
没有`aal`声明的JWT属于`aal1`级别。

## 正在添加到应用程序 [*link*](#%e6%ad%a3%e5%9c%a8%e6%b7%bb%e5%8a%a0%e5%88%b0%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

将MFA添加到应用程序包括以下三个步骤：

1. \*\*添加注册流程。\*\*您需要在应用程序中提供一个用户界面，用户可以在其中设置MFA。您可以在注册后立即添加，或作为应用程序设置部分中单独流程的一部分添加。
2. \*\*将挑战步骤添加到登录。\*\*如果用户设置了MFA，您的应用程序的登录流程需要向用户显示一个挑战屏幕，要求他们证明他们可以访问附加因素。
3. \*\*强制执行MFA登录规则。\*\*一旦您的用户能够使用MFA注册和登录，您就需要在整个应用程序中强制执行授权规则：在前端、后端、API服务器或行级别安全策略上。

### 添加注册流程 [*link*](#%e6%b7%bb%e5%8a%a0%e6%b3%a8%e5%86%8c%e6%b5%81%e7%a8%8b)

注册流为用户提供了一个UI，用于设置其他身份验证因素。 大多数应用程序在其应用程序中的两个位置添加注册流程：

1.登录或注册后立即。这允许用户在登录或创建MFA后立即快速设置MFA 账户如果有意义，我们建议鼓励所有用户设置MFA 用于您的应用程序。许多应用程序将此作为 努力减少上车摩擦。
2.在设置页面内。 允许用户设置、禁用或修改MFA设置。

我们建议构建一个通用流，在这两种情况下都可以通过少量修改来重用。

注册MFA使用的因子需要三个步骤：

1.调用`supabase.auth.mfa.enroll()`。 此方法返回QR码和密码。显示QR代码给用户，并要求他们用他们的验证器应用程序扫描它。
如果他们无法扫描二维码，请以纯文本显示秘密 他们可以键入或粘贴到他们的验证器应用程序中。

2.调用`supabase.auth.mfa.challenge()`API。 这将准备Supabase Auth接受用户的验证码并返回挑战ID。

3.调用`supabase.auth.mfa.verify()`API。 这验证了用户确实已将步骤（1）中的秘密添加到 他们的应用程序运行正常。如果验证成功 立即成为用户帐户的活动状态。如果没有，你应该重复步骤2和3。

#### 示例：React [*link*](#%e7%a4%ba%e4%be%8breact)

下面是创建新的`EnrollMFA`组件的示例 MFA注册流程的重要部分。

* 当组件出现在屏幕上时，`supabase.auth.mfa.enroll()`API被调用一次，以开始为当前用户注册新因子的过程。
* 此API返回SVG格式的QR码，通过将SVG编码为数据URL，使用正常的`＜img＞`标记在屏幕上显示。
* 用户使用其验证器应用程序扫描二维码后，应在`verifyCode`输入字段中输入验证码，然后单击`启用`。
* 使用`supabase.auth.mfa.challenge()`API，用户的代码将使用`supabase.auth.mfa.verify()`挑战。
* `onEnabled`是一个回调，通知其他组件注册已完成。
* `onCancelled`是一个回调，通知其他组件用户已单击`取消`按钮。

```
/**
 * EnrollMFA shows a simple enrollment dialog. When shown on screen it calls
 * the `enroll` API. Each time a user clicks the Enable button it calls the
 * `challenge` and `verify` APIs to check if the code provided by the user is
 * valid.
 * When enrollment is successful, it calls `onEnrolled`. When the user clicks
 * Cancel the `onCancelled` callback is called.
 */
export function EnrollMFA({
  onEnrolled,
  onCancelled,
}: {
  onEnrolled: () => void
  onCancelled: () => void
}) {
  const [factorId, setFactorId] = useState('')
  const [qr, setQR] = useState('') // holds the QR code image SVG
  const [verifyCode, setVerifyCode] = useState('') // contains the code entered by the user
  const [error, setError] = useState('') // holds an error message

  const onEnableClicked = () => {
    setError('')
    ;(async () => {
      const challenge = await supabase.auth.mfa.challenge({ factorId })
      if (challenge.error) {
        setError(challenge.error.message)
        throw challenge.error
      }

      const challengeId = challenge.data.id

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      })
      if (verify.error) {
        setError(verify.error.message)
        throw verify.error
      }

      onEnrolled()
    })()
  }

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })
      if (error) {
        throw error
      }

      setFactorId(data.id)

      // Supabase Auth returns an SVG QR code which you can convert into a data
      // URL that you can place in an <img> tag.
      setQR(data.totp.qr_code)
    })()
  }, [])

  return (
    <>
      {error && <div className="error">{error}</div>}
      <img src={qr} />
      <input
        type="text"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value.trim())}
      />
      <input type="button" value="Enable" onClick={onEnableClicked} />
      <input type="button" value="Cancel" onClick={onCancelled} />
    </>
  )
}
```

### 将挑战步骤添加到登录 [*link*](#%e5%b0%86%e6%8c%91%e6%88%98%e6%ad%a5%e9%aa%a4%e6%b7%bb%e5%8a%a0%e5%88%b0%e7%99%bb%e5%bd%95)

一旦用户通过他们的第一因素（电子邮件+密码、magic link等）登录， 一次性密码、社交登录…）您需要检查是否需要验证任何其他因素。

这可以通过使用`supabase.auth.mfa.getAuthenticatorAssuranceLevel()`API来完成。当用户登录并被重定向回您的应用程序时，您应该调用此方法来提取用户的当前和下一个身份验证器保证级别（AAL）。

因此，如果您收到的`currentLevel`是`aal1`，但`nextLevel`为 `aal2`，则应向用户提供通过MFA的选项。

下表解释了组合含义。

| 当前级别 | 下一级 | 含义 |
| --- | --- | --- |
| `aal1` | `aal1` | User does not have MFA enrolled. |
| `aal1` | `aal2` | User has an MFA factor enrolled but has not verified it. |
| `aal2` | `aal2` | User has verified their MFA factor. |
| `aal2` | `aal1` | User has disabled their MFA factor. (Stale JWT.) |

#### 示例：React [*link*](#%e7%a4%ba%e4%be%8breact-1)

向登录添加挑战步骤在很大程度上取决于应用程序的架构。然而，构造React应用程序的一种相当常见的方法是拥有一个包含大部分已验证应用程序逻辑的大型组件（通常称为`App`）。

此示例将用逻辑包装此组件，如果需要，在显示完整应用程序之前，将显示MFA挑战屏幕。这在下面的`AppWithMFA`示例中进行了说明。

```
function AppWithMFA() {
  const [readyToShow, setReadyToShow] = useState(false)
  const [showMFAScreen, setShowMFAScreen] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        if (error) {
          throw error
        }

        console.log(data)

        if (data.nextLevel === 'aal2' && data.nextLevel !== data.currentLevel) {
          setShowMFAScreen(true)
        }
      } finally {
        setReadyToShow(true)
      }
    })()
  }, [])

  if (readyToShow) {
    if (showMFAScreen) {
      return <AuthMFA />
    }

    return <App />
  }

  return <></>
}
```

* `supbase.auth.mfa.getAuthenticatorAssuranceLevel()`不返回承诺。别担心，这是一种非常快速的方法（微秒），因为它很少使用网络。
* `readyToShow`仅确保在向用户显示任何应用程序UI之前完成AAL检查。
* 如果当前级别可以升级到下一级别，将显示MFA屏幕。
* 一旦挑战成功，`app`组件将最终呈现在屏幕上。

下面是实现挑战和验证逻辑的组件。

```
function AuthMFA() {
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')

  const onSubmitClicked = () => {
    setError('')
    ;(async () => {
      const factors = await supabase.auth.mfa.listFactors()
      if (factors.error) {
        throw factors.error
      }

      const totpFactor = factors.data.totp[0]

      if (!totpFactor) {
        throw new Error('No TOTP factors found!')
      }

      const factorId = totpFactor.id

      const challenge = await supabase.auth.mfa.challenge({ factorId })
      if (challenge.error) {
        setError(challenge.error.message)
        throw challenge.error
      }

      const challengeId = challenge.data.id

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      })
      if (verify.error) {
        setError(verify.error.message)
        throw verify.error
      }
    })()
  }

  return (
    <>
      <div>Please enter the code from your authenticator app.</div>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value.trim())}
      />
      <input type="button" value="Submit" onClick={onSubmitClicked} />
    </>
  )
}
```

* 您可以通过调用`supabase.auth.mfa.listFactors()`为用户提取可用的MFA因子。不用担心，这种方法也很快，很少使用网络。
* 如果`listFactors()`返回多个因子（或不同类型），则应向用户提供选择。为了简单起见，示例中没有显示这一点。
* 每次用户按下`提交`按钮时，都会为所选因素（在本例中为第一个因素）创建一个新的挑战，并立即进行验证。任何错误都会显示给用户。
* 验证成功后，客户端库将在后台自动刷新会话，最后调用`onSuccess`回调，该回调将在屏幕上显示经过验证的`App`组件。

### 强制MFA登录规则 [*link*](#%e5%bc%ba%e5%88%b6mfa%e7%99%bb%e5%bd%95%e8%a7%84%e5%88%99)

将MFA添加到应用程序的UI本身并不能为用户提供更高级别的安全性。您还需要在应用程序的数据库、API和服务器端呈现中强制执行MFA规则。

根据应用程序的需要，您可以选择三种方式来实施MFA。

1. \*\*对所有用户（新用户和现有用户）强制执行。\*\*任何用户帐户都必须注册MFA才能继续使用您的应用程序。应用程序将不允许在未首先通过MFA的情况下进行访问。
2. \*\*仅对新用户强制。\*\*只有新用户将被强制注册MFA，而旧用户将被鼓励这样做。该应用程序将不允许新用户在未首先通过MFA的情况下访问。
3. \*\*仅对已选择的用户强制执行。\*\*想要MFA的用户可以注册，如果不先通过MFA，应用程序将不允许访问。

#### 数据库 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93)

您的应用程序应根据用户当前和可能的身份验证器级别充分拒绝或允许访问表或行。

info

PostgreSQL有两种策略：许可策略和限制策略。本指南使用限制性策略。确保不要省略`as restrictive`子句。

##### 强制所有用户（新用户和现有用户） [*link*](#%e5%bc%ba%e5%88%b6%e6%89%80%e6%9c%89%e7%94%a8%e6%88%b7%e6%96%b0%e7%94%a8%e6%88%b7%e5%92%8c%e7%8e%b0%e6%9c%89%e7%94%a8%e6%88%b7)

如果您的应用属于这种情况，这是一个模板行级别安全策略，您可以应用于所有表：

```
create policy "Policy name."
on table_name
as restrictive
to authenticated
using (auth.jwt()->>'aal' = 'aal2');
```

* 在此，保单不接受除`aal2`之外的任何具有`aal`声明的JWT，这是最高的认证者保证级别。
* **使用`as restrictive`可确保此策略将限制表上的所有命令，而不考虑其他策略**

##### 仅对新用户强制 [*link*](#%e4%bb%85%e5%af%b9%e6%96%b0%e7%94%a8%e6%88%b7%e5%bc%ba%e5%88%b6)

如果你的应用属于这种情况，规则就会变得更加复杂。在特定时间戳之后创建的用户帐户必须具有`aal2`级别才能访问数据库。

```
create policy "Policy name."
on table_name
as restrictive -- very important!
to authenticated
using
  (array[auth.jwt()->>'aal'] <@ (
     select
       case
         when created_at >= '2022-12-12T00:00:00Z' then array['aal2']
         else array['aal1', 'aal2', NULL]
       end as aal
     from auth.users
     where auth.uid() = id));
```

* 对于在2022年12月12日00:00UTC之前具有`created_at`时间戳的用户，该策略将同时接受`aal1`和`aal2`，但仅接受所有其他时间戳的`aal2`。
* The `<@` 运算符是PostgreSQL的[`contained in`运算符。](https://www.postgresql.org/docs/current/functions-array.html)
* 出现`NULL`是因为在Supabase Auth中引入MFA之前的一些JWT不会包含`aal`声明。
* **使用`as restrictive`可确保此策略将限制表上的所有命令，而不考虑其他策略**

##### 仅对已选择的用户强制 [*link*](#%e4%bb%85%e5%af%b9%e5%b7%b2%e9%80%89%e6%8b%a9%e7%9a%84%e7%94%a8%e6%88%b7%e5%bc%ba%e5%88%b6)

已在其帐户上注册MFA的用户希望您的应用程序仅在他们通过MFA后才适用。

```
create policy "Policy name."
on table_name
as restrictive -- very important!
to authenticated
using (
  array[auth.jwt()->>'aal'] <@ (
    select
        case
          when count(id) > 0 then array['aal2']
          else array['aal1', 'aal2', NULL]
        end as aal
      from auth.mfa_factors
      where auth.uid() = user_id and status = 'verified'
  ));
```

* 当用户至少验证了一个MFA系数时，该策略仅接受`aal2`。
* 否则，它将同时接受`aal1`和`aal2`。
* The `<@` 运算符是PostgreSQL的[`contained in`运算符。](https://www.postgresql.org/docs/current/functions-array.html)
* 出现`NULL`是因为在Supabase Auth中引入MFA之前的一些JWT不会包含`aal`声明。
* **使用`as restrictive`可确保此策略将限制表上的所有命令，而不考虑其他策略**

### 服务器端渲染 [*link*](#%e6%9c%8d%e5%8a%a1%e5%99%a8%e7%ab%af%e6%b8%b2%e6%9f%93)

info

在服务器端渲染上下文中使用Supabase JavaScript库时，请确保始终为每个请求创建一个新对象！这将防止您意外地呈现和提供属于不同用户的内容。

可以在服务器端渲染级别上强制MFA。然而，要做好这件事可能很棘手。

您可以使用`supabase.auth.mfa.getAuthenticatorAssuranceLevel()`和`supabase.auth.mfa.listFactors()`API，用于标识会话的AAL级别以及为用户启用的任何因素，类似于您在浏览器上使用这些因素的方式。

然而，在服务器上遇到不同的AAL级别实际上可能不是安全问题。考虑以下可能的情况：

1. 用户使用常规方法登录，但关闭了MFA流上的选项卡。
2. 用户长时间忘记打开标签。（这种情况比你想象的更频繁。）
3. 用户丢失了他们的认证器设备，对接下来的步骤感到困惑。

因此，我们建议您将用户重定向到可以使用其附加因素进行身份验证的页面，而不是呈现HTTP 401未授权或HTTP 403禁止内容。

### APIs [*link*](#apis)

如果您的应用程序使用超级数据库、存储或边缘功能，那么仅使用行级别安全策略就可以提供足够的保护。如果您有其他需要保护的API，请遵循以下一般准则：

1. \*\*为您的语言使用良好的JWT验证和分析库。\*\*这将使您能够安全地解析JWT并提取其声明。
2. \*\*从JWT中检索`aal`声明，并根据您的需求比较其价值。\*\*如果您遇到可以提高的AAL级别，请要求用户继续登录过程，而不是注销。
3. \*\*使用`https://<project-ref>.supabase.co/rest/v1/auth/factors`rest端点，用于标识用户是否注册了任何MFA因素。\*\*只应对`已验证`的因素采取行动。

## 常见问题解答 [*link*](#%e5%b8%b8%e8%a7%81%e9%97%ae%e9%a2%98%e8%a7%a3%e7%ad%94)

### 当挑战没什么作用时，为什么会有挑战和验证API？ [*link*](#%e5%bd%93%e6%8c%91%e6%88%98%e6%b2%a1%e4%bb%80%e4%b9%88%e4%bd%9c%e7%94%a8%e6%97%b6%e4%b8%ba%e4%bb%80%e4%b9%88%e4%bc%9a%e6%9c%89%e6%8c%91%e6%88%98%e5%92%8c%e9%aa%8c%e8%af%81api)

TOTP不会是Supabase Auth未来支持的唯一MFA因素。通过分离挑战和验证步骤，我们使库向前兼容我们将来可能添加的新因素，例如SMS或WebAuthn。例如，对于SMS，`挑战`端点实际上会发送带有验证码的SMS。

### 二维码里面是什么？ [*link*](#%e4%ba%8c%e7%bb%b4%e7%a0%81%e9%87%8c%e9%9d%a2%e6%98%af%e4%bb%80%e4%b9%88)

TOTP QR码使用`otpauth`方案对URI进行编码。它最初[由Google Authenticator](https://github.com/google/google-authenticator/wiki/Key-Uri-Format)引入但现在已被所有验证器应用程序普遍接受。

### 如何检查用户何时通过MFA？ [*link*](#%e5%a6%82%e4%bd%95%e6%a3%80%e6%9f%a5%e7%94%a8%e6%88%b7%e4%bd%95%e6%97%b6%e9%80%9a%e8%bf%87mfa)

Supabase Auth发布的访问令牌包含`amr`（身份验证方法参考）声明。它是一个对象数组，指示用户迄今使用的身份验证方法。

例如，以下结构描述了一个用户，该用户首先使用基于密码的方法登录，然后在2分钟12秒后通过TOTP MFA。条目首先按最新方法排序！

```
{
  "amr": [
    {
      "method": "mfa/totp",
      "timestamp": 1666086056
    },
    {
      "method": "password",
      "timestamp": 1666085924
    }
  ]
}
```

使用`supabase.auth.getAuthenticatorAssuranceLevel()`方法，以便在浏览器应用程序中轻松访问此信息。

您也可以在RLS策略中使用PostgreSQL片段：

```
json_query_path(auth.jwt(), '$.amr[0]')
```

* [`json_query_path(json, path)`](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-JSON-PROCESSING-TABLE) 是一个函数, 允许根据[SQL/JSON路径](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-SQLJSON-PATH)访问JSON对象中的元素.
* `$.amr[0]`是一个SQL/JSON路径表达式，它获取JWT中最新的身份验证方法。

一旦提取了数组中的最新条目，就可以比较`方法`和`时间戳`来执行更严格的规则。

目前公认的方法有：

* `password` -任何基于密码的登录。
* `otp`-任何基于密码的一次性登录（电子邮件代码、短信代码、magic link）。
* `oauth` -任何基于oauth的登录（社交登录）。
* `mfa/totp`— totp附加系数。

此列表将在未来扩展。

---

[*navigate\_before* 服务器端渲染](/docs/app/development_guide/auth/mandates/server-side-rendering/)

[身份验证帮助程序 *navigate\_next*](/docs/app/development_guide/auth/auth-helpers/auth-helpers/)