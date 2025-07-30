# 概述

## 概述

每个认证系统都有两个部分。

* **认证** ：这个人应该被允许进入吗？如果是的话，他们是谁？
* **授权** ：一旦他们进入，他们被允许做什么？

Supabase Auth被设计为既可以作为一个独立的产品，也可以与其他Supabase产品深度集成。 Postgres是我们一切工作的核心，Auth系统也遵循这一原则。我们尽可能地利用Postgres的内置Auth功能。

下面是Supabase内置的Auth功能的2分钟快速浏览。

<iframe src="https://www.youtube-nocookie.com/embed/6ow_jW4epf8" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>

## 身份认证

你可以通过几种方式来验证你的用户。

* 电子邮件和密码。
* Magic links（一键登录）。
* 社交媒体登录认证服务商。
* 电话登录。

### 服务商

我们提供了多种认证方式和登录方式，以及认证工具集合。[认证帮助程序](https://docs.memfiredb.com/docs/app/development_guide/auth/auth-helpers/)。

[Email](https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-email)

[Magic Links](https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-magic-link)

[Apple](https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-apple)

[GitHub](https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-github)

[GitLab](https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-gitlab)

### 配置第三方服务商

你可以通过点击一个按钮来启用第三方提供商，方法是浏览认证 > 设置 > Auth Providers，并为每个提供商输入你的 `客户端ID`和 `密匙`。

![](https://docs.memfiredb.com/docs/app/img/supabase-oauth-logins.png)### 重定向URLs和通配符

当使用第三方提供商时，[Supabase客户端库](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/#sign-in-using-a-third-party-provider-with-redirect)将用户重定向到提供商。当第三方服务商成功认证用户时，服务商将用户重定向到Supabase Auth回调URL，在那里他们将被进一步重定向到 `redirectTo`参数中指定的URL。这个参数默认为 `SITE_URL`。你可以修改 `SITE_URL`或添加额外的重定向URL。

你可以使用通配符匹配模式来支持Netlify和Vercel等服务商的预览URL。见[支持模式的完整列表](https://pkg.go.dev/github.com/gobwas/glob#Compile)。

#### Netlify预览URLs

对于使用Netlify的部署，将 `SITE_URL`设置为你的官方网站URL。为本地开发和部署预览添加以下额外的重定向URL。

* `http://localhost:3000/*/*`
* `https://**--my_org.netlify.app/*`

#### Vercel预览网址

对于使用Vercel的部署，将 `SITE_URL`设置为你的官方网站URL。为本地开发和部署预览添加以下额外的重定向URL。

* `http://localhost:3000/*/*`
* `https://**vercel.app/*/*`

Vercel为部署的URL提供了一个环境变量，称为 `NEXT_PUBLIC_VERCEL_URL`。更多细节见[Vercel docs](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables)。你可以使用这个变量，根据环境动态地重定向。

```js
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github'
  options: {
    redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000"
  }
}
```

#### 移动端深层链接 URI

对于移动应用程序，您可以使用深度链接URI。例如，对于您的 `SITE_URL`，您可以指定类似于 `com.supabase://login-callback/`的内容，如果需要额外的重定向URL，则可以使用类似于 `com.supabase.staging://login-callback/`的内容。

## 授权

当你需要细化的授权规则时，没有什么比PostgreSQL的行级安全（RLS）更重要了。

策略是PostgreSQL的规则引擎。它们是非常强大和灵活的，允许你编写复杂的SQL规则，以满足你独特的业务需求。

从我们的[行级安全指南](https://docs.memfiredb.com/docs/app/development_guide/auth/mandates/row-level-security/)开始吧。

### 行级安全

认证只解决了用户身份验证的问题，但并没有涉及用户在系统中的权限和访问级别。为了解决这个问题，您需要使用到PostgreSQL的[行级安全性（RLS）](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)的特性。该特性通过打开和关闭RLS选项，使得授权变得非常简单。

<video width="99%" muted="" playsinline="" controls="true"></video>

### 策略

[策略](https://www.postgresql.org/docs/current/sql-createpolicy.html)是PostgreSQL的规则引擎。它们非常强大和灵活，允许你编写复杂的SQL规则，以适应你独特的业务需求。

<video width="99%" muted="" playsinline="" controls="true"></video>

如果设置了策略(Policy)，你的数据库就成了规则引擎。就不需要编写如下复杂的查询语句：

```js
const loggedInUserId = 'd0714948'
let { data, error } = await supabase
  .from('users')
  .select('user_id, name')
  .eq('user_id', loggedInUserId)

// console.log(data)
// => { id: 'd0714948', name: 'Jane' }
```

你可以很方便的在数据库表上定义一个策略（policy），`auth.uid() = user_id`，策略生效后，你对数据库的所有请求仅返回将通过该策略的行记录，即：只能查询到当前登录用户的数据,简化代码如下：

```js
let { data, error } = await supabase.from('users').select('user_id, name')

// console.log(data)
// Still => { id: 'd0714948', name: 'Jane' }
```

### 它是如何工作的

1. 用户注册后。MemFireCloud在 `auth.users`表中创建一个新用户。
2. MemFireCloud返回一个包含用户 `UUID`的新JWT。
3. 每个对数据库的请求都会发送JWT。
4. Postgres检查JWT以确定发起请求的用户。
5. 用户的UID可以在策略中用于限制对行的访问。

MemFireCloud 在 Postgres 中提供了一个特殊函数 `auth.uid()` 。可以从JWT中提取用户的UID，在创建策略时特别有用。

## 用户管理

Supabase提供多个端点来验证和管理你的用户。

* [注册](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signup/)
* [用密码登录](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithpassword/)
* [使用无密码/一次性密码（OTP）登录](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/)
* [用OAuth登录](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/)
* [退出登陆](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signout/)

当用户注册时，Supabase为他们分配了一个唯一的ID。你可以在你的数据库中的任何地方引用这个ID。例如，你可以创建一个 `profiles`表，使用 `user_id`字段引用 `auth.users`表中的 `id`。

# 重定向 URL

## 概览

使用[无密码登录](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/)或[第三方提供程序](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/#sign-in-using-a-third-party-provider-with-redirect)时，MemFire Cloud 客户端库方法提供 `redirectTo` 参数，以指定身份验证后将用户重定向到的位置。默认情况下，用户将被重定向到 `SITE_URL`，但您可以修改SITE_URL或将其他重定向 URL 添加到允许列表。将必要的 URL 添加到允许列表后，可以在 redirectTo 参数中指定希望用户重定向到的 URL。

## 在重定向 URL 中使用通配符

MemFire Cloud 允许您在将重定向 URL 添加到允许列表时指定通配符。您可以使用通配符匹配模式来支持来自 Netlify 和 Vercel 等提供商的预览 URL。

| Wildcard                   | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `*`                      | 匹配任何非分隔符字符序列                                                             |
| `**`                     | 匹配任意字符序列                                                                     |
| `?`                      | 匹配任何单个非分隔符                                                                 |
| `c`                      | 匹配字符 c （c ！= *， **， ？， \， [， {， }）                                     |
| `\c`                     | 匹配字符 C                                                                           |
| `[!{ character-range }]` | 匹配不在 { 字符范围 } 中的任何字符序列。例如，[!a-z] 将不匹配 a-z 范围内的任何字符。 |

URL 中的分隔符定义为 。和 /。使用[此工具](https://www.digitalocean.com/community/tools/glob?comments=true&glob=http%3A%2F%2Flocalhost%3A3000%2F%2A%2A&matches=false&tests=http%3A%2F%2Flocalhost%3A3000&tests=http%3A%2F%2Flocalhost%3A3000%2F&tests=http%3A%2F%2Flocalhost%3A3000%2F%3Ftest%3Dtest&tests=http%3A%2F%2Flocalhost%3A3000%2Ftest-test%3Ftest%3Dtest&tests=http%3A%2F%2Flocalhost%3A3000%2Ftest%2Ftest%3Ftest%3Dtest)来测试您的模式。

**info**

虽然“globstar”(**) 对于本地开发和预览 URL 很有用，但我们建议为生产中的站点 URL 设置准确的重定向 URL 路径。

### 使用通配符重定向 URL 示例

| Redirect URL                     | Description                                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `http://localhost:3000/*`      | 匹配 http://localhost:3000/foo、http://localhost:3000/bar 但不匹配 http://localhost:3000/foo/bar 或 http://localhost:3000/foo/ （注意尾部斜杠） |
| `http://localhost:3000/**`     | 匹配 http://localhost:3000/foo、http://localhost:3000/bar 和 http://localhost:3000/foo/bar                                                      |
| `http://localhost:3000/?`      | 匹配 http://localhost:3000/a 但不匹配 http://localhost:3000/foo                                                                                 |
| `http://localhost:3000/[!a-z]` | 匹配 http://localhost:3000/1 但不匹配 http://localhost:3000/a                                                                                   |

## Netlify 预览 URL

对于使用 Netlify 的部署，请将 `SITE_URL`设置为官方站点 URL。为本地开发和部署预览添加以下其他重定向 URL：

* `http://localhost:3000/**`
* `https://**--my_org.netlify.app/**`

## Vercel 预览 URL

对于使用 Vercel 的部署，请将 `SITE_URL`设置为官方网站 URL。为本地开发和部署预览添加以下其他重定向 URL：

* `http://localhost:3000/**`
* `https://*-username.vercel.app/**`

Vercel 为名为 NEXT_PUBLIC_VERCEL_URL 的部署的 URL 提供了一个环境变量。有关更多详细信息，请参阅 [Vercel 文档](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables)。您可以使用此变量根据环境动态重定向。您还应该设置名为 NEXT_PUBLIC_SITE_URL 的环境变量的值，这应该设置为生产环境中的站点 URL，以确保重定向正常运行。

```js
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

## 移动深度链接 URIs

对于移动应用程序，您可以使用深层链接 URI。例如，对于您的 `SITE_URL`，您可以指定类似 com.supabase：//login-callback/ 的内容，如果需要，可以指定类似 `com.supabase.staging：//login-callback/` 的内容。

在此处阅读有关深度链接的更多信息，并查找[不同框架](https://docs.memfiredb.com/docs/app/development_guide/auth/native-mobile-deep-linking/)的代码示例。

# 原生移动深度链接

在某些身份验证情况下，您需要处理链接回应用程序以完成用户登录。

### 何时需要设置深层链接

* 魔法链接登录。
* 已启用 “确认电子邮件 “并正在使用电子邮件登录。
* 重设电子邮件登录密码。
* 调用 `.signInWithOAuth()` 方法。

[Expo React Native]()[Flutter]()

要链接到开发构建或独立应用程序，您需要为应用程序指定自定义 URL 方案。您可以在应用程序配置（app.json、app.config.js）中注册一个方案，方法是在 `scheme` 键下添加一个字符串：

```json
{
  "expo": {
    "scheme": "com.supabase"
  }
}
```

在项目的 `用户认证`-> `URL 配置` 中添加重定向 URL，例如 `com.supabase://***`。

最后，实现 OAuth 和链接处理程序。有关在 React Native 中初始化 supabase-js 客户端的说明，请参阅 [supabase-js 参考资料](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/start/initializing/#%E6%A1%88%E4%BE%8B5--react-native%E9%80%89%E9%A1%B9)。

```tsx
import { Button } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "app/utils/supabase";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};

const sendMagicLink = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: "example@email.com",
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
  // Email sent.
};

export default function Auth() {
  // Handle linking into app from email app.
  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  return (
    <>
      <Button onPress={performOAuth} title="Sign in with Github" />
      <Button onPress={sendMagicLink} title="Send Magic Link" />
    </>
  );
}
```

为了获得最佳的用户体验，建议使用通用链接，这需要更复杂的设置。您可以在 [Expo docs](https://docs.expo.dev/guides/deep-linking/) 中找到详细的设置说明。

### 平台特定配置

[Android]()[iOS]()[Windows]()[MacOS]()

```xml
<manifest ...>
  <!-- ... other tags -->
  <application ...>
    <activity ...>
      <!-- ... other tags -->

      <!-- Deep Links -->
      <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <!-- Accepts URIs that begin with YOUR_SCHEME://YOUR_HOST -->
        <data
          android:scheme="YOUR_SCHEME"
          android:host="YOUR_HOSTNAME" />
      </intent-filter>
    </activity>
  </application>
</manifest>
```

对于深度链接，“android:host “属性是可选的。

更多信息： [https://developer.android.com/training/app-links/deep-linking](https://developer.android.com/training/app-links/deep-linking)

[Swift]()[Android Kotlin]()

### 深度链接配置

1. 进入 [授权设置](https://supabase.com/dashboard/project/_/auth/url-configuration) 页面。
2. 在 “附加重定向 URL “字段中输入应用程序重定向 URL。这是用户点击魔法链接后重定向到的 URL。

重定向回调 URL 的格式应为 `[YOUR_SCHEME]://[YOUR_HOSTNAME]`。这里，`io.supabase.user-management://login-callback`只是一个例子。你可以为 `YOUR_SCHEME`和 `YOUR_HOSTNAME`选择任何你想要的方案，只要该方案在用户的设备上是唯一的。因此，通常会使用网站的反向域名。

Supabase控制台[深度链接设置](https://docs.memfiredb.com/docs/img/deeplink-setting.png)

现在为您的应用程序添加一个自定义 URL，这样操作系统就知道如何在用户点击神奇链接后重定向回您的应用程序。

您可以按照 [Apple 官方文档](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app#Register-your-URL-scheme) 使用 Xcode 的目标信息编辑器。

或者，在您的 `Info.plist` 文件中手动声明 URL 方案。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- other tags -->
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleTypeRole</key>
      <string>Editor</string>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>io.supabase.user-management</string>
      </array>
    </dict>
  </array>
</dict>
</plist>
```

# 启用Captcha保护

Supabase为您提供了在登录、注册和密码重置表单中添加captcha的选项。这使您的网站免受机器人和恶意脚本的攻击。Supabase身份验证支持[hCaptcha](https://www.hcaptcha.com/)。

<iframe src="https://www.youtube-nocookie.com/embed/em1cpOAXknM" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>

## 注册hCaptcha

跳转到hCaptcha网站并注册帐户。在欢迎页面上，复制**站点密钥**和 **密钥** 。

如果您已经注册，并且没有从欢迎页面复制此信息，则可以从设置页面获取 **密钥** 。

**站点密钥**可以在您创建的活动站点的**设置**中找到。

在 `设置`页面中，查找**Sitekey**部分并复制密钥。

## 为Suabase项目启用hCaptcha保护

导航到**身份验证**页面，并在**安全和保护**部分下找到**启用hCaptcha保护**切换。

输入您的hCaptcha **密钥** ，然后单击 **保存** 。

## 添加hCaptcha前端组件

前端需要一些更改才能为用户提供屏幕上的captcha。本示例使用React和hCaptcha React组件，但hCaptch可以与任何JavaScript框架一起使用。

Install `@hcaptcha/react-hcaptcha` in your project as a dependency.

```bash
npm install @hcaptcha/react-hcaptcha
```

现在从 `@HCaptcha/react HCaptcha`库导入 `HCaptcha`组件。

```javascript
import HCaptcha from '@hcaptcha/react-hcaptcha'
```

让我们创建一个空状态来存储 `captchaToken`

```jsx
const [captchaToken, setCaptchaToken] = useState()
```

现在让我们将HCaptcha组件添加到代码的JSX部分

```html
<HCaptcha />
```

我们将把从hCaptcha网站复制的sitekey作为一个属性以及一个onVerify属性传递给它，该属性接受回调函数。此回调函数将有一个标记作为其属性之一。让我们使用 `setCaptchaToken`将令牌设置为状态

```jsx
<HCaptcha
  sitekey="your-sitekey"
  onVerify={(token) => { setCaptchaToken(token) }
/>
```

现在让我们使用我们在Supabase signUp函数中接收的captcha令牌。

```jsx
await supabase.auth.signUp({
  email,
  password,
  options: { captchaToken },
})
```

调用上述函数后，我们还需要重置captcha挑战。

创建一个用于HCaptcha组件的引用。

```jsx
const captcha = useRef()
```

让我们在 `HCaptcha`组件上添加一个ref属性，并为其分配 `captcha`常量。

```jsx
<HCaptcha
  ref={captcha}
  sitekey="your-sitekey"
  onVerify={(token) => {
    setCaptchaToken(token)
  }}
/>
```

使用以下代码调用signUp函数后重置 `captcha`：

```jsx
captcha.current.resetCaptcha()
```

为了测试这在本地是否有效，我们需要使用类似[ngrok](https://ngrok.com/)的工具或向主机文件添加条目。您可以在[hCaptcha docs](https://docs.hcaptcha.com/#local-%E5%BC%80%E5%8F%91)中了解更多信息。

运行应用程序，现在应该会向您提供一个captcha挑战。

# 速率限制

## 速率限制、资源分配和滥用预防

* MemFire Cloud采用了许多保护措施来防止传入流量的突发，以防止滥用，并帮助最大限度地提高整个平台的稳定性
  * 如果您预计会出现高负载事件，包括生产启动或重负载测试，或长时间的高资源使用率，请至少提前 2 周通知我们。

### 身份验证速率限制

* 下表显示了以下身份验证终端节点上的速率限制配额。您可以在 `用户认证`-> `Rate Limits`配置项目的身份验证速率限制。

| Endpoint                          | Path                                                               | Limited By     | Rate Limit                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 发送电子邮件的所有结点            | `/auth/v1/signup` `/auth/v1/recover` `/auth/v1/user`         | 合并请求的总和 | 默认为每小时 30 封电子邮件。截至 2023 年 7 月 14 日，这已更新为每小时 4 封电子邮件。可通过自定义 SMTP 设置进行自定义。 |
| 发送一次性密码 （OTP） 的所有结点 | `/auth/v1/otp`                                                   | 合并请求的总和 | 默认为每小时 30 个 OTP。是可定制的。                                                                                   |
| 发送 OTP 或魔术链接               | `/auth/v1/otp`                                                   | 上次请求       | 默认为允许新请求之前的 60 秒窗口。是可定制的。                                                                         |
| 注册确认请求                      | `/auth/v1/signup`                                                | 上次请求       | 默认为允许新请求之前的 60 秒窗口。是可定制的。                                                                         |
| 密码重置请求                      | `/auth/v1/recover`                                               | 上次请求       | 默认为允许新请求之前的 60 秒窗口。是可定制的。                                                                         |
| 验证请求                          | `/auth/v1/verify`                                                | IP地址         | 每小时 360 个请求（最多 30 个请求）                                                                                    |
| 令牌刷新请求                      | `/auth/v1/token`                                                 | IP地址         | 每小时 1800 个请求（最多 30 个请求）                                                                                   |
| 创建或验证 MFA 质询               | `/auth/v1/factors/:id/challenge` `/auth/v1/factors/:id/verify` | IP地址         | 每分钟 15 个请求（最多 30 个请求）                                                                                     |

### 实时配额

* 查看[实时配额](https://docs.memfiredb.com/docs/app/development_guide/realtime/deep-dive/quotas/)。
* 如果您需要增加配额，可以随时[联系支持人员](https://docs.memfiredb.com/docs/contactus/).

### 预防滥用

* MemFire Cloud在注册、登录和密码重置端点上提供验证码保护。请参阅[我们的指南](https://docs.memfiredb.com/docs/app/development_guide/auth/auth-captcha/)，了解如何使用此方法防止滥用。

# vue 设置微信扫码登录身份验证

通过MemFire Cloud，开发者可以轻松地为WEB应用添加微信扫码登录功能，为用户提供更加流畅、安全的登录体验。

[传送门](https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/wechatqrauth/)

此存储库是如何开始使用 Vue 3 和 MemFire Cloud构建应用程序的快速示例。您可以在快速入门：Vue 指南中找到有关如何构建此应用程序的分步指南。 该存储库将演示如何：

* 使用MemFire Cloud Auth 的微信扫码登录认证
* 使用 MemFire Cloud数据库存储和检索数据
* 将图像文件存储在 MemFire Cloud存储中

示例代码

```none
git clone https://github.com/LucaRao/vue3-user-management.git
```



# 身份验证

# 使用电子邮件登录

## 概述

为 MemFireCloud 应用程序设置电子邮件登录。

* 将电子邮件验证器添加到[MemFire Cloud项目](https://cloud.memfiredb.com/)
* 将登录代码添加到应用程序 - [JavaScript](https://github.com/supabase/supabase-js) | [Flutter](https://github.com/supabase/supabase-flutter)

## 配置电子邮件设置

1. 对于 网站 URL（`用户认证`-> `URL 配置`）, 输入应用程序的最终（托管）URL。
2. 对于 身份验证服务商（`用户认证`-> `服务商`）,  **启用电子邮件提供程序** .

**info**

对于自托管，可以使用提供的文件和环境变量更新项目配置。 有关详细信息，请参阅[自托管文档](https://docs.memfiredb.com/docs/app/development_guide/hosting/static-start/)。

## 将登录代码添加到客户端应用程序

[JavaScript]()[Dart]()[]()[]()

当用户登录时，使用其电子邮件地址和密码调用[signInWithPassword()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithpassword/)：

```js
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'example@email.com',
    password: 'example-password',
  })
}
```

[JavaScript]()[Dart]()[]()[]()

当用户注销时，调用[signOut()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除：

```js
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## 资料

* [MemFire Cloud](https://cloud.memfiredb.com/)
* [JS客户端](https://github.com/supabase/supabase-js)
* [Flutter客户端](https://github.com/supabase/supabase-flutter)


# 手机登录认证

### 前言

为了顺应国内用户的使用习惯，MemFire Cloud提供了手机号码验证的登录方式，可以兼容国内的阿里云服务商，用户可以采用手机号+短信的放式进行用户身份认证。

### 使用步骤

### 1.开启手机验证

进入“用户认证”->“服务商”页面，启用手机号码验证，短信（SMS）服务商选择“阿里云”，依次填写好阿里云配置后点击保存。

![](https://docs.memfiredb.com/docs/app/img/phoneauth1.png)当启用“短信验证”时，说明您需要发送短信验证码来进行手机认证，您需要填写正确的阿里云短信签名名称和短信模板CODE

### 2.示例教程

MemFire Cloud 提供两种手机登录认证方式，分别如下：

### ① 手机号+验证码登录认证

用户使用手机号获取验证码。

![](https://docs.memfiredb.com/docs/app/img/phoneauth2.png) ![](https://docs.memfiredb.com/docs/app/img/phoneauth3.png)

![](https://docs.memfiredb.com/docs/app/img/phoneauth4.png)SDK的使用教程

```js
//获取验证码
async function getQRcode(){
    let { data, error } = await _supabase.auth.signInWithOtp({
            phone: phone,
        })
        if(error){
          alert(error)
        }
        alert('短信已发送至您的手机中，请注意查收。')
 }
 //登录
async function sigin(){
    let { data, error } = await _supabase.auth.verifyOtp({
        phone: phone,
        token: QRcode,
        type: 'sms',
    })
    if(error){
        alert(error)
        return;
    }
       alert('登录成功！')
 }
```

### ② 手机号+密码+验证码认证

#### 图示

先用手机号+密码获取验证码进行注册

![](https://docs.memfiredb.com/docs/app/img/phoneauth5.png)随后会在用户列表里刚刚那条等待验证的用户信息

![](https://docs.memfiredb.com/docs/app/img/phoneauth6.png)输入验证码，点击注册，会发现用户列表的用户已经认证成功。

![](https://docs.memfiredb.com/docs/app/img/phoneauth7.png) ![](https://docs.memfiredb.com/docs/app/img/phoneauth8.png)SDK的使用教程

1.用户使用手机号+密码先来获取验证码进行注册。

```js
//获取验证码（注册）
async function getQRcode(){
 let { data, error } = await _supabase.auth.signUp({
        phone: phone,
        password: passowrd
    })
    if(data){
        alert('短信已发送至您的手机中，请注意查收。')
    }
 }
 //使用验证码方式进行一次性登录
async function sigin(){
    let { data, error } = await _supabase.auth.verifyOtp({
        phone: phone,
        token: QRcode,
        type: 'sms',
    })
    if(data){
        alert('登录成功')
    }else if(error){
        alert('登录失败')
    }
}
```

* 2.手机号+密码登录（第一步相当于注册，这一步是登录）

```js
//使用验证码方式登录
async function sigin(){
    let { data, error } = await _supabase.auth.signInWithPassword({
        phone: phone,
        password: passowrd
    })
    if(data){
        alert('登录成功')
    }else if(error){
        alert('登录失败')
    }
}
```




# 微信小程序登录认证

### 前言

为了顺应国内用户的使用习惯，MemFire Cloud 的SDK推出了微信可以在不同应用场景下的登录方式，以下两种场景是MemFire Cloud 推荐的微信登录方式，我们以简单的小示例来做示范，具体的实现还需要根据业务自身的场景来判断。

### ① 微信用户授权登录

首次进入小程序，点击登录后会立即跳转个人中心页进行个人资料的修改，或者可以点击个人中心页面进行个人资料的修改

前提条件：

* 在MemFire Cloud认证服务商页面启用微信小程序认证

![](https://docs.memfiredb.com/docs/app/img/wechatauth1.png)图例

![](https://docs.memfiredb.com/docs/app/img/wechatauth2.png) ![](https://docs.memfiredb.com/docs/app/img/wechatauth5.png) ![](https://docs.memfiredb.com/docs/app/img/wechatauth3.png) ![](https://docs.memfiredb.com/docs/app/img/wechatauth6.png)

首页代码示例：

html

```js
<button style="border-radius: 100rpx;margin-top: 300rpx;" type="primary" bindtap="login">微信快速登录</button>
```

SDK使用教程

signInWithWechat接口接受一个wx.login返回的code参数，通过code兑换openid等信息，并判断用户是否存在，不存在则自动创建

```js
// pages/main/index.ts
import { supabase } from '../../lib/supabase'
Page({
  data: {

  },
  login(){
    wx.login({
      success: async res => {
        const { data, error } = await supabase.auth.signInWithWechat({code:res.code})
        if(error){
          wx.showToast({
            title: error?.error || error?.msg,
            icon: "none",
            duration: 2000
          })
        }else if(data){
          setTimeout(() => {
            wx.showModal({
              title: '提示',
              content: '登录成功！去填充个人资料吧！',
              success (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url:'/pages/me/index'
                  })
                } else if (res.cancel) {
                }
              }
            })
          }, 1000);
        }
      },
      fail(err){
        wx.showToast({
          title: err.errMsg,
          icon: "none",
          duration: 2000
        })
      }
    })
  },

})
```

个人中心页面

html

```js
<view class="container">
  <view style="margin-bottom:20rpx">修改个人信息</view>

</view>
<!--昵称-->
<view class="section">
  <view class="section-title">昵称：</view>
  <view>
    <input type="text"  bindinput='getNickNameValue' name="getNickNameValue" value="{{nikeName}}" placeholder="请输入昵称"/>
  </view>
</view>
<!--头像-->
<view class="section">
  <view class="section-title">头像：</view>
  <view>
    <button class="avatar-wrapper" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar">
    <text wx:if="{{!avatarUrl}}">点我获取头像</text>
    <image wx:else class="avatar" src="{{avatarUrl}}"></image>
</button>
  </view>
</view>
<view class="section">
  <view wx:if="{{phone}}" class="section-title">{{phone}}</view>
  <view wx:else class="section-title">手机</view>
  <view>
    <button style="width: 237rpx;" class="{{phone ? 'auth':'no-auth'}} phone-wrapper" open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber">
    <text wx:if="{{!phone}}">未授权</text>
    <text wx:else>已授权</text>
</button>
  </view>
</view>
<button style="margin-top: 20rpx;" bindtap="submit" type="primary">保存</button>
```

SDK使用教程

进入页面先调用getUser()判断是否登陆过，登录过会通过这个接口去获取用户信息，获取之后进行信息回填；没有登陆过则不会进行信息回填。

* 修改头像选择图片时，需要将头像的临时地址上传到memfire cloud的对象存储生成永久图片，再进行下载,在此之前需要去memfire cloud创建一个新的公开bucket。

```js
import { supabase } from '../../lib/supabase'
// pages/me/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: null,
    nikeName: null,
    phone: null
  },
  //判断用户是否登录过，是否进行信息回填
  async onLoad(){
   const { data: { user } } = await supabase.auth.getUser()
    if(user){
      if(user.data.phone){
        this.setData({phone:user.data.phone})
      }
      if(user.data.user_metadata){
        this.setData({avatarUrl:user.data.user_metadata.arvatar,nikeName:user.data.user_metadata.nickname.value})
      }
    }
  },
  async submit() {
    if (!this.data.nikeName || !this.data.avatarUrl) {
      wx.showToast({
        title: '请输入完整个人资料',
        icon: "none",
        duration: 2000
      })
      return;
    }
    const { data, error } = await supabase.auth.updateUser({ "data": { "nickname": this.data.nikeName, "arvatar": this.data.avatarUrl } })
    if (error) {
      wx.showToast({
        title: error?.error || error?.msg,
        icon: "none",
        duration: 2000
      })
    } else if (data) {
      wx.showToast({
        title: "修改成功！",
        icon: "none",
        duration: 2000
      })
    }
  },
  async getPhoneNumber(e) {
    const { data: { user }, error } = await supabase.auth.wechatBindPhone({
      code: e.detail.code,
    })
    if (error) {
      wx.showToast({
        title: JSON.stringify(error) || error?.msg,
        icon: "none",
        duration: 2000
      })
    } else if (user) {
      this.setData({
        phone: user.data.phone
      })
    }
  },
  //选择头像，需要将头像的临时地址上传到memfire cloud的对象存储生成永久图片，再进行下载
  //在此之前需要去memfire cloud创建一个新的bucket
  async onChooseAvatar(e) {
    let { avatarUrl } = e.detail
    wx.getImageInfo({
      src: avatarUrl, // 图片路径，必须是本地路径，可以相对路径或绝对路径
      success: async function (res) {
        const file = { fileType: "image", width:res.width,height:res.height, tempFilePath: avatarUrl }
        const fileExt = avatarUrl.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        let { error: uploadError } = await supabase.storage
          .from('avatar')
          .upload(filePath, file)
        if (uploadError) {
          throw uploadError
        }
        const { data } = await supabase
          .storage
          .from('avatar')
          .getPublicUrl(filePath)
          this.setData({ avatarUrl: data.publicUrl })
      }
  })
})
```

css

```js
page{
  font-size: 32rpx;
}
.section{
  padding: 40rpx;
  border-bottom: 1px solid gray;
}
.section:last-child{
  border: none;
}
.section-title{
  width: 20%;
  float: left;
}
label{
  padding: 0 20rpx;
}
.avatar{
  width: 70rpx;
  height: 70rpx;
}
.phone-wrapper{
  width: 180rpx;
}
.no-auth{
  background-color: #ccc;
}
.auth{
  background-color: #07c160;
  color: #fff;
}
```

### ② 手机号授权登录

使用手机号授权登录，用户初次进入小程序。 场景：

* 需要拿到用户的手机号。
* 小程序对应的web端是使用手机号登录注册的，小程序端不得不也需要使用手机号授权登录。

前提条件：

* 只有企业账号才有权限进行手机授权登录
* 在MemFire Cloud认证服务商页面启用微信小程序认证

![](https://docs.memfiredb.com/docs/app/img/wechatauth1.png)图例

![](https://docs.memfiredb.com/docs/app/img/wechatauth4.png) ![](https://docs.memfiredb.com/docs/app/img/wechatauth7.png)

html

```js
<button style="border-radius: 100rpx;margin-top: 300rpx;" type="primary"  open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber">微信快速登录</button>
```

首先需要通过signInWithWechat接口来帮助用户进行注册，成功之后再使用wechatBindPhone将手机号绑定到用户信息中，这样就实现了手机号授权登录。

```js
import { supabase } from '../../lib/supabase'
// pages/phone_login/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  async getPhoneNumber(e: any) {
    wx.login({
      success: async res => {
        const { data, error } = await supabase.auth.signInWithWechat({ code: res.code })
        if(error){
          wx.showToast({
            title: JSON.stringify(error) || error?.msg,
            icon: "none",
            duration: 2000
          })
        }else if (data) {
          const { data, error } = await supabase.auth.wechatBindPhone({
            code: e.detail.code,
          })
          if (error) {
            wx.showToast({
              title: JSON.stringify(error) || error?.msg,
              icon: "none",
              duration: 2000
            })
          } else if (data) {
            wx.showToast({
              title: '登录成功！',
              icon: "none",
              duration: 1000
            })
          }
        }
      },
    })
  }
})
```

更多api详情请参考[资料](https://supabase.github.io/gotrue-js/v2/classes/GoTrueClient.html)

[微信小程序脚手架](https://docs.memfiredb.com/docs/app/example/scaffold/)



# 微信移动应用授权登录

### 前言

为了顺应国内用户的使用习惯，MemFire Cloud认证服务已集成微信移动应用授权登录功能。微信，作为国内广受欢迎的社交平台，其微信移动应用授权登录功能以其便捷性和快速性赢得了广大用户的青睐。现在，通过MemFire Cloud，开发者可以轻松地为app应用添加微信移动应用授权登录功能，为用户提供更加流畅、安全的登录体验。

### 前提条件

1. 您已成功注册MemFire Cloud平台的账号，并创建了一个应用。
2. 您已成功注册微信开放平台账号。

### 配置步骤

#### 1、在微信开放平台上“创建移动应用”

**info**

首先，需要您在微信开放平台创建一个“移动应用”，待审核通过后即可获得该“移动应用”对应的AppID、AppSecret。

![](https://docs.memfiredb.com/docs/app/img/wechatapp1.png)#### 2、在MemFire Cloud应用界面启用微信（移动应用）并填入相应appid信息

![](https://docs.memfiredb.com/docs/app/img/wechatapp2.png)### 使用方法

#### 引入包

```js
fluwx: ^3.4.2
gotrue_wechatlogin: ^2.7.2
```

fluwx是基于Flutter的微信SDK框架，并支持以下功能：

* 分享图片，文本，音乐，视频等。支持分享到会话，朋友圈以及收藏
* 微信支付
* 在微信登录时，获取Auth Code
* 拉起小程序
* 订阅消息
* 打开微信
* 从微信标签打开应用 gotrue_wechatlogin是MemFire Cloud基于gotrue开发用于微信认证。

### Flutter 使用教程

#### 初始化fluwx

```dart
//微信登录初始化
initWXLogin() async {
  fluwx.registerWxApi(
      appId: 'wxxxxxx', //查看微信开放平台
      doOnAndroid: true,
      doOnIOS: true,
      universalLink: 'xxxxx' //查看微信开放平台
      );
}
```

#### 调用fluwx的 sendWeChatAuth 方法， 请求code

![](https://docs.memfiredb.com/docs/app/img/wechatapp3.png)

```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text("登录")),
    body: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(_userId ?? "还没登录"),
          FutureBuilder<bool>(
            future: fluwx.isWeChatInstalled,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return CircularProgressIndicator();  // 等待异步任务完成
              } else if (snapshot.hasError) {
                return Text("错误提示Error: ${snapshot.error}");
              } else if (snapshot.hasData && snapshot.data!) {
                // 如果安装了微信，显示微信登录按钮
                return ElevatedButton(
                  onPressed: () async {
                    bool exist = await fluwx.isWeChatInstalled;
                    if (exist) {
                      fluwx.sendWeChatAuth(
                        scope: "snsapi_userinfo",
                        state: "wechat_sdk_demo_test",
                      );
                    }
                  },
                  child: const Text("微信登录"),
                );
              } else {
                // 如果没有安装微信
                return const Text("没有安装微信，系统不显示按钮");
              }
            },
          ),
        ],
      ),
    ),
  );
}
```

#### 微信登录结果监听获取到code 后，请求signInWithWechat登录

```dart
// 微信登录结果监听方法
void loginWxHandler() async {
  fluwx.weChatResponseEventHandler.listen((response) async {
    if (response is fluwx.WeChatAuthResponse) {
      if (response.code != null) {
        print('wxLogin--code:${response.code}');
        final String nonNullableCode = response.code ?? ""; // 如果response.code为空，则使用空字符串代替
        setState(() {
          _code = response.code ?? "";
        });
          final auth = GoTrueClient(
            url: "xxx",
            headers: {
              'Authorization': 'Bearer xxx',
              'apikey': 'xxxx',
            },
          );
        final res = await auth.signInWithWechat(code: nonNullableCode);
        setState(() {
          _userId__ = res.user?.id;
        });

        final session = res.session;
        final user = res.user;
      } else {
        print('wx------------e$response');
        // print('wxLogin--code:${event.code}');
      }
    }else{
      print('未安装微信');
    }
  });
}
```

全部代码 main.dart

```dart
import 'package:flutter/material.dart';
import 'package:flutter_application_dmo1/pages/account_page.dart';
import 'package:flutter_application_dmo1/pages/login_page.dart';
import 'package:flutter_application_dmo1/pages/splash_page.dart';
import 'package:fluwx/fluwx.dart' as fluwx;

Future<void> main() {

    fluwx.registerWxApi(
        appId: 'xxx', //查看微信开放平台
        doOnAndroid: true,
        doOnIOS: true
        );

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Supabase Flutter',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.green,
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: Colors.green,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.green,
          ),
        ),
      ),
      initialRoute: '/',
      routes: <String, WidgetBuilder>{
        '/': (_) => const SplashPage(),
        '/login': (_) => const LoginPage(),
      },
    );
  }
}
```

login_page.dart

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:gotrue_wechatlogin/gotrue.dart';
import 'package:flutter_application_dmo1/main.dart';
import 'package:fluwx/fluwx.dart' as fluwx;

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _LoginPageState createState() => _LoginPageState();

}

class _LoginPageState extends State<LoginPage> {
  String? _userId;
  String? _code;
  String? _userId__;
  @override
  void initState() {
    super.initState();
    loginWxHandler(); // 在 initState 中调用微信登录结果监听方法
  }

  late final StreamSubscription _authStateSubscription;

  // 微信登录结果监听方法
  void loginWxHandler() async {
    fluwx.weChatResponseEventHandler.listen((response) async {
      if (response is fluwx.WeChatAuthResponse) {
        if (response.code != null) {
          print('wxLogin--code:${response.code}');
          final String nonNullableCode = response.code ?? ""; // 如果response.code为空，则使用空字符串代替
          setState(() {
            _code = response.code ?? "";
          });
            final auth = GoTrueClient(
              url: "https://cpeov0k8c94v6pnsqqg0.baseapi.test1.nimbleyun.com",
              headers: {
                'Authorization': 'Bearer xxx',
                'apikey': 'xxx',
              },
            );
          final res = await auth.signInWithWechat(code: nonNullableCode);
          setState(() {
            _userId__ = res.user?.id;
          });

          final session = res.session;
          final user = res.user;
        } else {
          print('wx------------e$response');
          // print('wxLogin--code:${event.code}');
        }
      }else{
        print('未安装微信');
      }
    });
  }

  @override
  void dispose() {
    _authStateSubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("登录")),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_code != null ? "code为:${_code} ;用户id为:${_userId__}": "还没登录"),
            FutureBuilder<bool>(
              future: fluwx.isWeChatInstalled,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return CircularProgressIndicator();  // 等待异步任务完成
                } else if (snapshot.hasError) {
                  return Text("错误提示Error: ${snapshot.error}");
                } else if (snapshot.hasData && snapshot.data!) {
                  // 如果安装了微信，显示微信登录按钮
                  return ElevatedButton(
                    onPressed: () async {
                      bool exist = await fluwx.isWeChatInstalled;
                      if (exist) {
                        fluwx.sendWeChatAuth(
                          scope: "snsapi_userinfo",
                          state: "wechat_sdk_demo_test",
                        );
                      }
                    },
                    child: const Text("微信登录"),
                  );
                } else {
                  // 如果没有安装微信
                  return const Text("没有安装微信，系统不显示按钮");
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
```

移动端app微信登录示例： [https://github.com/LucaRao/wechat_app_demo](https://github.com/LucaRao/wechat_app_demo)



# 微信网站应用扫码登录

### 前言

为了满足国内用户日益增长的操作习惯需求，并进一步提升用户体验，MemFire Cloud认证服务已集成微信扫码登录功能。微信，作为国内广受欢迎的社交平台，其扫码登录功能以其便捷性和快速性赢得了广大用户的青睐。现在，通过MemFire Cloud，开发者可以轻松地为WEB应用添加微信扫码登录功能，为用户提供更加流畅、安全的登录体验。

### 前提条件

1. 您已成功注册MemFire Cloud平台的账号，并创建了一个应用。
2. 您已成功注册微信开放平台账号。
3. 您拥有一个正确的网站应用官网，用于在微信开放平台上创建网站应用时提交审核。

### 配置步骤

#### 1、在微信开放平台上“创建网站应用”

**info**

首先，需要您在微信开放平台创建一个“网站应用”，待审核通过后即可获得该“网站应用”对应的AppID、AppSecret。

![](https://docs.memfiredb.com/docs/app/img/wechatqr1.png)#### 2、在MemFire Cloud应用界面启用微信扫码认证

![](https://docs.memfiredb.com/docs/app/img/wechatqr2.png)#### 3、在微信开放平台上对审核通过的网站应用配置其授权回调域

**info**

在微信开放平台，进入到第1步审核通过的“网站应用”中进行“授权回调域”的配置，配置的值为上一步中微信扫码认证服务商的重定向URL的cpa09na5g6h7mlpvrehg.baseapi.memfiredb.com这一部分。此处注意，不要在“授权回调域”的前面加上“https://”，也不需要在其之后加上具体的路径。

正确填写格式如下： ![](https://docs.memfiredb.com/docs/app/img/wechatqr3.png)

#### 4、在MemFire Cloud应用界面进行重定向URL配置

**info**

将审核通过的网站应用界面里的“应用官网”填写到Memfire Cloud中 认证>URL配置>网站URL中即可，也可以配置“重定向URL列表”。这样，当完成微信扫码登录后，将会默认重定向到“网站URL”或是“重定向URL列表”的其中一个指定网址。

![](https://docs.memfiredb.com/docs/app/img/wechatqr4.png)### SDK使用教程

#### 1、SDK安装

```js
npm install @supabase/supabase-js
```

#### 2、当您的用户进行登录时，调用signInWithOAuth()接口，将wechat_qr作为provider即可。

```js
<button onclick="signInWithWechatQr()">微信扫码登录</button>

async function signInWithWechatQr() {
    const { data, error } = await _supabase.auth.signInWithOAuth({
        provider: 'wechat_qr',
        // 如果不配置下面的options则登录成功后将会默认重定向到“网站URL”
        // 如果配置下面的options，则需要保持redirectTo参数的值与重定向URL列表中的值一致，登录成功后将会跳转到该网址
        options: {
            redirectTo: 'https://memfiredb.com/',
        },
    })
}
```

#### 3、当用户注销时，调用signOut()接口将其从浏览器会话和localStorage中删除：

```js
async function signout() {
  const { error } = await supabase.auth.signOut()
}
```



# 使用Magic Link登录

Magic Link是一种无密码登录的形式，用户单击发送到其电子邮件地址的链接即可登录其帐户。 Magic Link仅适用于电子邮件地址。默认情况下，用户只能每60秒请求一次Magic Link。

## 概述

为MemfireCloud应用程序提供Magic Link登录。

* 将登录代码添加到应用程序 - [JavaScript](https://github.com/supabase/supabase-js) | [Flutter](https://github.com/supabase/supabase-flutter)

## 将Magic Link添加到您的 MemfireCloud 项目中

1. 对于 网站 URL（`用户认证`-> `URL 配置`）, 输入应用程序的最终（托管）URL。
2. 对于 身份验证服务商（`用户认证`-> `服务商`）,  **启用电子邮件提供程序** .

## 将登录代码添加到客户端应用程序

[JavaScript]()[Dart]()[]()[]()

当您的用户登录时，使用其电子邮件地址调用[signInWithOtp()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/):

```js
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'example@email.com',
  })
}
```

[JavaScript]()[Dart]()[]()[]()

当用户注销时，调用[signOut()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除:

```js
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## 资源

* [MemFire Cloud](https://cloud.memfiredb.com/)
* [JS客户端](https://github.com/supabase/supabase-js)
* [Flutter客户端](https://github.com/supabase/supabase-flutter)



# 使用Apple登录

要为项目启用Apple Auth，您需要设置Apple OAuth应用程序，并将应用程序凭据添加到MemFire Cloud项目仪表板。

## 概述

Apple OAuth包括六大步骤：

* 获取具有 `使用Apple登录` 功能的 `App Id`。
* 获取 `Services Id` - 这将用作 `client_id`。
* 获取用于获取 `client_secret`的 `secret key`。
* 使用 `secret key`生成 `client_secret`。
* 将您的 `client id`和 `client secret` 密钥添加到[MemFire Clpud Project](https://cloud.memfiredb.com/)。
* 将登录代码添加到[JS客户端应用程序](https://github.com/supabase/supabase-js)。

## 访问您的Apple Developer帐户

* 进入[developer.apple.com](https://developer.apple.com/).
* 点击右上方的 `账户`来登录。

![](https://docs.memfiredb.com/docs/app/img/guides/auth-apple/apple-developer-portal.png)## 获取应用程序ID

* 跳转到 `Certificates, Identifiers & Profiles`文件.
* 单击左侧的 `Identifiers`。
* 单击左上角 `Identifiers`旁边的 `+`符号。
* 选择 `App IDs`并单击 `继续`。
* 选择 `App` 类型，然后单击 `继续`。
* 填写应用程序信息：
  * 应用程序描述。
  * 绑定ID (苹果推荐反向域名风格，所以如果你的域名是acme.com，而您的应用程序称为roadrunner，请使用：`com.acme.roadrunner`)。
  * 向下滚动并选中 `使用Apple登录`。
  * 单击右上角的 `继续`。
  * 单击右上角的 `注册`。

## 获取服务ID

当您进行API调用以验证用户时，这将用作 `client_id`。

* 跳转到 `Certificates, Identifiers & Profiles`文件.
* 单击左侧的 `Identifiers`。
* 单击左上角 `Identifiers`旁边的 `+`符号。
* 选择 `Services IDs` 并单击“继续”。
* 填写应用程序信息：
  * 应用程序描述。
  * 绑定ID (您不能使用上一步中的同一绑定的ID，但可以在开头添加一些内容，例如 `app.`，使其成为app.com.acme.roadrunner).
  * 保存此ID – 此ID稍后将成为您的 `client_id` 。
  * 单击右上角的 `继续`。
  * 单击右上角的 `注册`。

## 查找您的回调URL

下一步需要回调URL，如下所示：

`https://<project-ref>.supabase.co/auth/v1/callback`

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com/).
* 单击左侧边栏底部的 `设置` 图标。
* 单击列表中的 `API` 。
* 在 Config / URL下，您将找到您的API URL，您可以单击 `复制`将其复制到剪贴板。
* 现在只需在末尾添加 `/auth/v1/callback` 即可获得完整的 `OAuth重定向URI`。

<video width="99%" muted="" playsinline="" controls="true"></video>

## 配置服务ID

* 在 `Identifiers`下，单击新创建的服务ID。
* 选中 `使用Apple登录`旁边的复选框以启用它。
* 单击右侧的 `配置`。
* 确保在 `Primary App ID`下选择了新创建的绑定ID`
* 将域添加到 `域和子域`框中（不要添加 `https://`，只添加域）。
* 在 `Return URLs` 框中，键入在上一步中找到的应用程序的回调URL，然后单击右下角的 `下一步`。
* 单击底部的 `完成`。
* 单击右上角的 `继续`。
* 单击右上角的 `保存`。

## 下载密钥

现在，您需要从Apple下载一个 `secret key`文件，用于生成 `client_secret`。

* 跳转到 `Certificates, Identifiers & Profiles`文件.
* 单击左侧的 `Keys`。
* 单击左上角 `Keys`旁边的 `+`符号。
* 输入 `Key Name`。
* 选中 `使用Apple登录`。
* 单击右上角的 `保存`。
* 从下拉选择器中选择新创建的服务ID。
* 单击右上角的 `保存`。
* 单击右上角的 `继续`。
* 单击右上角的 `注册`。
* 单击右上角的 `下载`。
* 保存下载的文件——其中包含用于生成 `client_secret`的 `secret key`。
* 单击右上角的 `完成`。

## 生成 `client_secret`

您下载的 `secret key` 用于创建验证用户所需的 `client_secret` 字符串。

根据[Apple Docs](https://developer.apple.com/documentation/signinwithapplerestapi/generate_and_validate_tokens)它必须是JWT，使用具有P-256曲线和SHA-256哈希算法的椭圆曲线数字签名算法（ECDSA）加密的令牌。

此时，生成此JWT令牌的最简单方法是使用[Ruby](https://www.ruby-lang.org/en/)。 如果您没有安装Ruby，可以在此处[下载Ruby](https://www.ruby-lang.org/en/downloads)。

* 安装Ruby（或检查以确保它已安装在您的系统上）。
* 安装 [ruby-jwt](https://github.com/jwt/ruby-jwt).
* 从命令行运行：`sudo gem install jwt`。

使用文本编辑器创建以下脚本：`secret_gen.rb`

```ruby
require "jwt"

key_file = "Path to the private key"
team_id = "Your Team ID"
client_id = "The Service ID of the service you created"
key_id = "The Key ID of the private key"

validity_period = 180 # In days. Max 180 (6 months) according to Apple docs.

private_key = OpenSSL::PKey::EC.new IO.read key_file

token = JWT.encode(
	{
		iss: team_id,
		iat: Time.now.to_i,
		exp: Time.now.to_i + 86400 * validity_period,
		aud: "https://appleid.apple.com",
		sub: client_id
	},
	private_key,
	"ES256",
	header_fields=
	{
		kid: key_id
	}
)
puts token
```

1. 编辑 `secret_gen.rb` 文件:

* `key_file` = “从Apple下载的私钥的路径”。它应该是这样的：`AuthKey_XXXXXXXX.p8`。
* `team_id` = `您的团队id`。这可以在Apple Developer网站的右上方找到（在您的名字旁边）。
* `client_id` = `您创建的服务的服务id`。这是您在上述步骤 `获取服务ID`中创建的 `服务ID`。如果您丢失了此ID，可以在Apple开发者网站中找到：
  * 跳转到 `Certificates, Identifiers & Profiles`文件.
  * 单击左侧的 `Identifiers`。
  * 在右上角的下拉列表中，选择 `服务ID`。
  * 在列表中查找您的Identifier（即app.com.acme.roadrunner）。
* `key_id` = `私钥的密钥id`。这可以在下载的机密文件的名称中找到（对于名为 `AuthKey_XXXXXXXX.p8`的文件，您的key_id为 `XXXXXXXX`）。如果您丢失了此ID，可以在Apple开发者网站中找到：
  * 跳转到 `Certificates, Identifiers & Profiles`文件.
  * 单击左侧的 `Keys`。
  * 单击列表中新创建的密钥。
  * 在 `Key ID` 下查找Key_ID。

2. 从命令行运行：`ruby secret_gen.rb>client_secret.txt`。
3. 您的 `client_secret` 现在存储在此 `client_secret.txt`文件。

## 将OAuth凭据添加到Supabase

* 跳转到[MemFire Cloud 项目仪表](https://cloud.memfiredb.com/).
* 在左侧边栏中，单击“身份验证”图标（靠近顶部）。
* 单击列表中的 `设置`以转到 `身份验证设置`页面。
* 在 `站点URL`下输入应用程序的最终（托管）URL（这很重要）。
* 在 `外部OAuth提供程序`下，将 `Apple Enabled`设置为 ON。
* 输入前面步骤中保存的 `client_id` 和 `client_secret` 。
* 单击 `保存`。

## 将登录代码添加到客户端应用程序

当您的用户登录时，调用[signInWithOAuth()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/)，并将 `apple`作为 `provider`：

```js
async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  })
}
```

当用户注销时，调用[signOut()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signout/) 将其从浏览器会话和localStorage中删除：

```js
async function signout() {
  const { error } = await supabase.auth.signOut()
}
```

## 资料

* [Apple开发者帐户](https://developer.apple.com/).
* [Ruby](https://www.ruby-lang.org/en/) Docs.
* [ruby-jwt](https://github.com/jwt/ruby-jwt) library.
* 感谢 [Janak Amarasena](https://medium.com/@janakda) 在[如何配置Apple登录](https://medium.com/identity-beyond-borders/how-to-configure-sign-in-with-apple-77c61e336003)中承担了所有繁重的工作。



# 使用GitHub登录

要为项目启用GitHub Auth，您需要设置一个GitHub OAuth应用程序，并将应用程序凭据添加到Supabase Dashboard。

## 概述

为应用程序设置GitHub登录由三部分组成:

* 在[GitHub](https://github.com/)上创建和配置GitHub OAuth应用程序
* 将GitHub OAuth密钥添加到[MemFire Cloud项目](https://cloud.memfiredb.com/)
* 将登录代码添加到[JS客户端应用程序](https://github.com/supabase/supabase-js)

## 访问您的GitHub帐户

* 进入 [github.com](https://github.com/).
* 单击右上角的 `登录`以登录。

![](https://docs.memfiredb.com/docs/app/img/guides/auth-github/github-portal.png)## 创建GitHub Oauth应用程序

转到[GitHub开发者设置页面](https://github.com/settings/developers):

* 单击右上方的个人资料照片
* 单击菜单底部附近的设置
* 在左侧边栏中，单击 `开发人员设置`（靠近底部）
* 在左侧边栏中，单击 `OAuth Apps`

## 查找回调URL

下一步需要回调URL，如下所示：

`https://<project-ref>.supabase.co/auth/v1/callback`

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com/).
* 单击左侧边栏底部的 `设置`图标。
* 单击列表中的 `API`。
* 在Config/URL下，您将找到您的API URL，您可以单击 `复制`将其复制到剪贴板。
* 现在只需在末尾添加 `/auth/v1/callback`即可获得完整的 `OAuth重定向URI`。

<video width="99%" muted="" playsinline="" controls="true"></video>

## 注册新的OAuth应用程序

* 单击 `注册新应用程序`。如果您以前创建过应用程序，请单击此处的 `新建OAuth应用程序`。
* 在 `应用程序名称`中，键入应用程序的名称。
* 在 `主页URL`中，键入应用程序网站的完整URL。
* 在 `授权回调URL`中，键入应用的回调URL。
* 在 `有效OAuth重定向URI`框中输入URL。
* 单击右下角的 `保存更改`。
* 单击 `注册应用程序`。

复制新的OAuth凭据

* 复制并保存 `客户端ID`。
* 单击 `生成新客户端密钥`。
* 复制并保存 `客户端密码`。

## 将您的GitHub凭据输入到Supabase项目中

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com/)
* 在左侧边栏中，单击 `身份验证`图标（靠近顶部）
* 单击列表中的 `设置`以转到 `身份验证设置`页面
* 在 `站点URL`下输入应用程序的最终（托管）URL（这很重要）
* 在 `外部OAuth提供程序`下，将 `已启用GitHub`设置为ON
* 输入上一步中保存的 `GitHub客户端ID<span> </span>`和 `GitHubClient Secret`
* 单击 `保存`

## 将登录代码添加到客户端应用程序

当您的用户登录时,调用[signInWithOAuth()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/),将 `github`作为 `provider`:

```js
async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}
```

当用户注销时，调用[signOut()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除：

```js
async function signout() {
  const { error } = await supabase.auth.signOut()
}
```

## 资源

* [MemFire Cloud](https://cloud.memfiredb.com/)
* [JS客户端](https://github.com/supabase/supabase-js)
* [Flutter客户端](https://github.com/supabase/supabase-flutter)



# 使用GitLab登录

要为项目启用GitLab Auth，您需要设置一个GitLab OAuth应用程序，并将应用程序凭据添加到Supabase Dashboard。

## 概述

为应用程序设置GitLab登录由三部分组成：

* 在[GitLab](https://gitlab.com/)上创建和配置GitLab应用程序
* 将GitLab应用程序密钥添加到[MemFire Cloud项目](https://cloud.memfiredb.com/)
* 将登录代码添加到[JS客户端应用程序](https://github.com/supabase/supabase-js)

## 访问您的GitLab帐户

* 进入 [gitlab.com](https://gitlab.com/).
* 单击右上角的 `登录`以登录。

![](https://docs.memfiredb.com/docs/app/img/guides/auth-gitlab/gitlab-portal.png)## 查找回调URL

下一步需要回调URL，如下所示：

`https://<project-ref>.supabase.co/auth/v1/callback`

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com/).
* 单击左侧边栏底部的 `设置`图标。
* 单击列表中的 `API`。
* 在Config/URL下，您将找到您的API URL，您可以单击 `复制`将其复制到剪贴板。
* 现在只需在末尾添加 `/auth/v1/callback`即可获得完整的 `OAuth重定向URI`。

<video width="99%" muted="" playsinline="" controls="true"></video>

## 创建GitLab应用程序

* 单击右上角的 `个人资料徽标`（头像）。
* 选择 `编辑配置文件`。
* 在左侧边栏中，选择应用程序。
* 输入应用程序的名称。
* 在 `重定向URI`框中，键入应用程序的回调URL。
* 选中 `机密`旁边的复选框（确保选中）。
* 检查名为 `read_user`的作用域（这是唯一需要的作用域）。
* 单击底部的 `保存应用程序`。
* 复制并保存您稍后需要的 `应用程序ID`（`client_ID`）和 `机密`（`client _Secret`）。

## 将您的GitLab凭据添加到Suabase项目中

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com/).
* 在左侧边栏中，单击 `身份验证`图标（靠近顶部）。
* 单击列表中的 `设置`以转到 `身份验证设置`页面。
* 在 `站点URL`下输入应用程序的最终（托管）URL（这很重要）。
* 在 `外部OAuth提供程序`下，将 `GitLab Enabled`设置为ON。
* 输入上一步中保存的 `client_id`和 `client_secret`。
* 单击 `保存`。

## 将登录代码添加到客户端应用程序

当您的用户登录时，调用[signInWithOAuth()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/)，并将 `gitlab`作为 `provider`：

```js
async function signInWithGitLab() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'gitlab',
  })
}
```

当用户注销时，调用[signOut()](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除：

```js
async function signout() {
  const { error } = await supabase.auth.signOut()
}
```

## 资源

* [MemFire Cloud](https://cloud.memfiredb.com/)
* [JS客户端](https://github.com/supabase/supabase-js)
* [Flutter客户端](https://github.com/supabase/supabase-flutter)



# 电子邮件模板

您可以自定义用于身份验证流的电子邮件。您可以编辑以下电子邮件模板：

* 确认注册
* 邀请用户
* Magic Link
* 更改邮箱地址
* 重置密码

## 术语

模板系统提供以下变量供使用：

| 名称                       | 描述                                                                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{ .ConfirmationURL }}` | 包含确认 URL。例如，注册确认 URL 如下所示：https://project-ref.supabase.co/auth/v1/verify?token={{ 。TokenHash }}&type=signup&redirect_to=https：//example.com/path 。 |
| `{{ .Token }}`           | 包含一个 6 位数的一次性密码 （OTP），可用于代替 {{.ConfirmationURL }} 中。                                                                                             |
| `{{ .TokenHash }}`       | 包含 {{ .Token }}。这对于在电子邮件模板中构建您自己的电子邮件链接非常有用。                                                                                            |
| `{{ .SiteURL }}`         | 包含应用程序的站点 URL。这可以在项目的身份验证设置中进行配置。                                                                                                         |
| `{{ .RedirectTo }}`      | 包含在调用 signUp、signInWithOtp、signInWithOAuth、resetPasswordForEmail 或 inviteUserByEmail 时传递的重定向 URL。可以在项目的身份验证设置中配置重定向 URL 允许列表。  |
| `{{ .Data }}`            | 包含来自auth.users.user_metadata的元数据。使用它来个性化电子邮件。                                                                                                     |

## 局限性

### 电子邮件预取

某些电子邮件提供商可能具有垃圾邮件检测或其他安全功能，可预提取传入电子邮件中的 URL 链接（例如，[Microsoft Defender for Office 365 中的安全链接](https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/safe-links-about?view=o365-worldwide)）。 在此方案中，发送的 {{ .ConfirmationURL }} 将立即被消耗，这会导致“令牌已过期或无效”错误。 为了防止这种情况，请执行以下操作：

* 改用电子邮件 OTP，包括 {{ .Token }}。
* 创建您自己的自定义电子邮件链接，将用户重定向到一个页面，他们可以在其中单击按钮以确认操作。 例如，您可以在电子邮件模板中包含以下内容：

  ```html
  <a href="{{ .SiteURL }}/confirm-signup?confirmation_url={{ .ConfirmationURL }}"
    >Confirm your signup
  </a>
  ```

  用户应被带到您网站上的页面，他们可以在其中通过单击按钮来确认操作。 该按钮应包含实际的确认链接，该链接可以通过解析 confirmation_url=获得{{ 。ConfirmationURL }} 查询参数。

### 电子邮件跟踪

如果您使用的是启用“电子邮件跟踪”的外部电子邮件提供商，则 MemFireCloud 电子邮件模板中的链接将被覆盖，并且无法按预期执行。我们建议禁用电子邮件跟踪，以确保电子邮件链接不会被覆盖。

### 将用户重定向到服务器端终结点

如果打算使用[服务器端](https://docs.memfiredb.com/docs/app/development_guide/auth/mandates/server-side-rendering/)呈现，则可能需要电子邮件链接将用户重定向到服务器端终结点，以在返回页面之前检查他们是否经过身份验证。但是，默认电子邮件链接会在验证后将用户重定向到查询片段中包含会话的重定向 URL。由于默认情况下，会话在查询片段中返回，因此您将无法在服务器端访问它。

您可以在电子邮件模板中自定义电子邮件链接，以成功将用户重定向到服务器端终结点。例如：

```html
<a
  href="https://api.example.com/v1/authenticate?token_hash={{ .TokenHash }}&type=invite&redirect_to={{ .RedirectTo }}"
  >Accept the invite
</a>
```

当用户点击链接时，请求将点击 [https://api.example.com/v1/authenticate](https://api.example.com/v1/authenticate)，您可以从 URL 中获取token_hash、键入和redirect_to查询参数。然后，可以调用 [verifyOtp](https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-verifyotp/) 方法以在将用户重定向回客户端之前取回经过身份验证的会话。由于 verifyOtp 方法向 MemFireCloud Auth 发出 POST 请求以验证用户，因此会话将在响应正文中返回，服务器可以读取该正文。例如：

```js
const { token_hash, type } = Object.fromEntries(new URLSearchParams(window.location.search))
const {
  data: { session },
  error,
} = await supabase.auth.verifyOtp({ token_hash, type })

// subsequently redirect the user back to the client using the redirect_to param
// ...
```

## 定制

MemFireCloud Auth 使用 [Go 模板](https://pkg.go.dev/text/template). 这意味着可以根据模板属性有条件地呈现信息。您可能希望查看 Hugo 的本指南，以获取有关模板语言的指南。

### 向抢先体验用户发送不同的电子邮件

向通过抢先体验域 (`https://www.earlyaccess.trial.com`)注册的用户发送不同的电子邮件。

```html
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
