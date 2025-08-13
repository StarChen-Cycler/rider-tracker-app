# 使用GitHub登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-github/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

概述

# 使用GitHub登录

要为项目启用GitHub Auth，您需要设置一个GitHub OAuth应用程序，并将应用程序凭据添加到Supabase Dashboard。

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

为应用程序设置GitHub登录由三部分组成:

* 在[GitHub](https://github.com)上创建和配置GitHub OAuth应用程序
* 将GitHub OAuth密钥添加到[MemFire Cloud项目](https://cloud.memfiredb.com)
* 将登录代码添加到[JS客户端应用程序](https://github.com/supabase/supabase-js)

## 访问您的GitHub帐户 [*link*](#%e8%ae%bf%e9%97%ae%e6%82%a8%e7%9a%84github%e5%b8%90%e6%88%b7)

* 进入 [github.com](https://github.com).
* 单击右上角的`登录`以登录。

![](../../../../img/guides/auth-github/github-portal.png)

## 创建GitHub Oauth应用程序 [*link*](#%e5%88%9b%e5%bb%bagithub-oauth%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

转到[GitHub开发者设置页面](https://github.com/settings/developers):

* 单击右上方的个人资料照片
* 单击菜单底部附近的设置
* 在左侧边栏中，单击`开发人员设置`（靠近底部）
* 在左侧边栏中，单击`OAuth Apps`

## 查找回调URL [*link*](#%e6%9f%a5%e6%89%be%e5%9b%9e%e8%b0%83url)

下一步需要回调URL，如下所示：

`https://<project-ref>.supabase.co/auth/v1/callback`

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com).
* 单击左侧边栏底部的`设置`图标。
* 单击列表中的`API`。
* 在Config/URL下，您将找到您的API URL，您可以单击`复制`将其复制到剪贴板。
* 现在只需在末尾添加`/auth/v1/callback`即可获得完整的`OAuth重定向URI`。

[

](../../../../../videos/api/api-url-and-key.mp4)

## 注册新的OAuth应用程序 [*link*](#%e6%b3%a8%e5%86%8c%e6%96%b0%e7%9a%84oauth%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

* 单击`注册新应用程序`。如果您以前创建过应用程序，请单击此处的`新建OAuth应用程序`。
* 在`应用程序名称`中，键入应用程序的名称。
* 在`主页URL`中，键入应用程序网站的完整URL。
* 在`授权回调URL`中，键入应用的回调URL。
* 在`有效OAuth重定向URI`框中输入URL。
* 单击右下角的`保存更改`。
* 单击`注册应用程序`。

复制新的OAuth凭据

* 复制并保存`客户端ID`。
* 单击`生成新客户端密钥`。
* 复制并保存`客户端密码`。

## 将您的GitHub凭据输入到Supabase项目中 [*link*](#%e5%b0%86%e6%82%a8%e7%9a%84github%e5%87%ad%e6%8d%ae%e8%be%93%e5%85%a5%e5%88%b0supabase%e9%a1%b9%e7%9b%ae%e4%b8%ad)

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com)
* 在左侧边栏中，单击`身份验证`图标（靠近顶部）
* 单击列表中的`设置`以转到`身份验证设置`页面
* 在`站点URL`下输入应用程序的最终（托管）URL（这很重要）
* 在`外部OAuth提供程序`下，将`已启用GitHub`设置为ON
* 输入上一步中保存的`GitHub客户端ID` 和`GitHubClient Secret`
* 单击`保存`

## 将登录代码添加到客户端应用程序 [*link*](#%e5%b0%86%e7%99%bb%e5%bd%95%e4%bb%a3%e7%a0%81%e6%b7%bb%e5%8a%a0%e5%88%b0%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

当您的用户登录时,调用[signInWithOAuth()](/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/),将`github`作为`provider`:

```
async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}
```

当用户注销时，调用[signOut()](/docs/app/sdkdocs/javascript/auth/auth-signout/)将其从浏览器会话和localStorage中删除：

```
async function signout() {
  const { error } = await supabase.auth.signOut()
}
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* [MemFire Cloud](https://cloud.memfiredb.com)
* [JS客户端](https://github.com/supabase/supabase-js)
* [Flutter客户端](https://github.com/supabase/supabase-flutter)

---

[*navigate\_before* 使用Apple登录](/docs/app/development_guide/auth/authentication/auth-apple/)

[使用GitLab登录 *navigate\_next*](/docs/app/development_guide/auth/authentication/auth-gitlab/)