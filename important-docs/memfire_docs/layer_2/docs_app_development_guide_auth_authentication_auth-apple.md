# 使用Apple登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-apple
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

# 使用Apple登录

要为项目启用Apple Auth，您需要设置Apple OAuth应用程序，并将应用程序凭据添加到MemFire Cloud项目仪表板。

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

Apple OAuth包括六大步骤：

* 获取具有 `使用Apple登录` 功能的 `App Id`。
* 获取`Services Id` - 这将用作 `client_id`。
* 获取用于获取 `client_secret`的`secret key`。
* 使用 `secret key`生成`client_secret`。
* 将您的 `client id`和 `client secret` 密钥添加到[MemFire Clpud Project](https://cloud.memfiredb.com/)。
* 将登录代码添加到[JS客户端应用程序](https://github.com/supabase/supabase-js)。

## 访问您的Apple Developer帐户 [*link*](#%e8%ae%bf%e9%97%ae%e6%82%a8%e7%9a%84apple-developer%e5%b8%90%e6%88%b7)

* 进入[developer.apple.com](https://developer.apple.com).
* 点击右上方的 `账户`来登录。

![](../../../../img/guides/auth-apple/apple-developer-portal.png)

## 获取应用程序ID [*link*](#%e8%8e%b7%e5%8f%96%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8fid)

* 跳转到`Certificates, Identifiers & Profiles`文件.
* 单击左侧的`Identifiers`。
* 单击左上角`Identifiers`旁边的`+`符号。
* 选择 `App IDs`并单击 `继续`。
* 选择 `App` 类型，然后单击`继续`。
* 填写应用程序信息：
  + 应用程序描述。
  + 绑定ID (苹果推荐反向域名风格，所以如果你的域名是acme.com，而您的应用程序称为roadrunner，请使用：`com.acme.roadrunner`)。
  + 向下滚动并选中`使用Apple登录`。
  + 单击右上角的`继续`。
  + 单击右上角的`注册`。

## 获取服务ID [*link*](#%e8%8e%b7%e5%8f%96%e6%9c%8d%e5%8a%a1id)

当您进行API调用以验证用户时，这将用作`client_id`。

* 跳转到`Certificates, Identifiers & Profiles`文件.
* 单击左侧的`Identifiers`。
* 单击左上角`Identifiers`旁边的`+`符号。
* 选择 `Services IDs` 并单击“继续”。
* 填写应用程序信息：
  + 应用程序描述。
  + 绑定ID (您不能使用上一步中的同一绑定的ID，但可以在开头添加一些内容，例如`app.`，使其成为app.com.acme.roadrunner).
  + 保存此ID – 此ID稍后将成为您的 `client_id` 。
  + 单击右上角的`继续`。
  + 单击右上角的`注册`。

## 查找您的回调URL [*link*](#%e6%9f%a5%e6%89%be%e6%82%a8%e7%9a%84%e5%9b%9e%e8%b0%83url)

下一步需要回调URL，如下所示：

`https://<project-ref>.supabase.co/auth/v1/callback`

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com).
* 单击左侧边栏底部的 `设置` 图标。
* 单击列表中的 `API` 。
* 在 Config / URL下，您将找到您的API URL，您可以单击`复制`将其复制到剪贴板。
* 现在只需在末尾添加 `/auth/v1/callback` 即可获得完整的`OAuth重定向URI`。

[

](../../../../videos/api/api-url-and-key.mp4)

## 配置服务ID [*link*](#%e9%85%8d%e7%bd%ae%e6%9c%8d%e5%8a%a1id)

* 在 `Identifiers`下，单击新创建的服务ID。
* 选中`使用Apple登录`旁边的复选框以启用它。
* 单击右侧的`配置`。
* 确保在`Primary App ID`下选择了新创建的绑定ID`
* 将域添加到`域和子域`框中（不要添加`https://`，只添加域）。
* 在 `Return URLs` 框中，键入在上一步中找到的应用程序的回调URL，然后单击右下角的`下一步`。
* 单击底部的`完成`。
* 单击右上角的`继续`。
* 单击右上角的`保存`。

## 下载密钥 [*link*](#%e4%b8%8b%e8%bd%bd%e5%af%86%e9%92%a5)

现在，您需要从Apple下载一个 `secret key`文件，用于生成 `client_secret`。

* 跳转到`Certificates, Identifiers & Profiles`文件.
* 单击左侧的`Keys`。
* 单击左上角`Keys`旁边的`+`符号。
* 输入`Key Name`。
* 选中`使用Apple登录`。
* 单击右上角的`保存`。
* 从下拉选择器中选择新创建的服务ID。
* 单击右上角的`保存`。
* 单击右上角的`继续`。
* 单击右上角的`注册`。
* 单击右上角的`下载`。
* 保存下载的文件——其中包含用于生成 `client_secret`的 `secret key`。
* 单击右上角的`完成`。

## 生成`client_secret` [*link*](#%e7%94%9f%e6%88%90client_secret)

您下载的 `secret key` 用于创建验证用户所需的 `client_secret` 字符串。

根据[Apple Docs](https://developer.apple.com/documentation/signinwithapplerestapi/generate_and_validate_tokens)它必须是JWT，使用具有P-256曲线和SHA-256哈希算法的椭圆曲线数字签名算法（ECDSA）加密的令牌。

此时，生成此JWT令牌的最简单方法是使用[Ruby](https://www.ruby-lang.org/en/)。
如果您没有安装Ruby，可以在此处[下载Ruby](https://www.ruby-lang.org/en/downloads)。

* 安装Ruby（或检查以确保它已安装在您的系统上）。
* 安装 [ruby-jwt](https://github.com/jwt/ruby-jwt).
* 从命令行运行：`sudo gem install jwt`。

使用文本编辑器创建以下脚本：`secret_gen.rb`

```
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
* `client_id` = `您创建的服务的服务id`。这是您在上述步骤`获取服务ID`中创建的`服务ID`。如果您丢失了此ID，可以在Apple开发者网站中找到：
  + 跳转到`Certificates, Identifiers & Profiles`文件.
  + 单击左侧的`Identifiers`。
  + 在右上角的下拉列表中，选择`服务ID`。
  + 在列表中查找您的Identifier（即app.com.acme.roadrunner）。
* `key_id` = `私钥的密钥id`。这可以在下载的机密文件的名称中找到（对于名为`AuthKey_XXXXXXXX.p8`的文件，您的key\_id为`XXXXXXXX`）。如果您丢失了此ID，可以在Apple开发者网站中找到：
  + 跳转到`Certificates, Identifiers & Profiles`文件.
  + 单击左侧的`Keys`。
  + 单击列表中新创建的密钥。
  + 在 `Key ID` 下查找Key\_ID。

2. 从命令行运行：`ruby secret_gen.rb>client_secret.txt`。
3. 您的 `client_secret` 现在存储在此 `client_secret.txt`文件。

## 将OAuth凭据添加到Supabase [*link*](#%e5%b0%86oauth%e5%87%ad%e6%8d%ae%e6%b7%bb%e5%8a%a0%e5%88%b0supabase)

* 跳转到[MemFire Cloud 项目仪表](https://cloud.memfiredb.com).
* 在左侧边栏中，单击“身份验证”图标（靠近顶部）。
* 单击列表中的`设置`以转到`身份验证设置`页面。
* 在`站点URL`下输入应用程序的最终（托管）URL（这很重要）。
* 在`外部OAuth提供程序`下，将`Apple Enabled`设置为 ON。
* 输入前面步骤中保存的 `client_id` 和 `client_secret` 。
* 单击`保存`。

## 将登录代码添加到客户端应用程序 [*link*](#%e5%b0%86%e7%99%bb%e5%bd%95%e4%bb%a3%e7%a0%81%e6%b7%bb%e5%8a%a0%e5%88%b0%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

当您的用户登录时，调用[signInWithOAuth()](/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/)，并将`apple`作为`provider`：

```
async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  })
}
```

当用户注销时，调用[signOut()](/docs/app/sdkdocs/javascript/auth/auth-signout/) 将其从浏览器会话和localStorage中删除：

```
async function signout() {
  const { error } = await supabase.auth.signOut()
}
```

## 资料 [*link*](#%e8%b5%84%e6%96%99)

* [Apple开发者帐户](https://developer.apple.com).
* [Ruby](https://www.ruby-lang.org/en/) Docs.
* [ruby-jwt](https://github.com/jwt/ruby-jwt) library.
* 感谢 [Janak Amarasena](https://medium.com/@janakda) 在[如何配置Apple登录](https://medium.com/identity-beyond-borders/how-to-configure-sign-in-with-apple-77c61e336003)中承担了所有繁重的工作。

---

[*navigate\_before* 使用Magic Link登录](/docs/app/development_guide/auth/authentication/auth-magic-link/)

[使用GitHub登录 *navigate\_next*](/docs/app/development_guide/auth/authentication/auth-github/)