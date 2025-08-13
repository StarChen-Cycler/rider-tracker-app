# 使用GitLab登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/auth-gitlab
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

# 使用GitLab登录

要为项目启用GitLab Auth，您需要设置一个GitLab OAuth应用程序，并将应用程序凭据添加到Supabase Dashboard。

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

为应用程序设置GitLab登录由三部分组成：

* 在[GitLab](https://gitlab.com)上创建和配置GitLab应用程序
* 将GitLab应用程序密钥添加到[MemFire Cloud项目](https://cloud.memfiredb.com)
* 将登录代码添加到[JS客户端应用程序](https://github.com/supabase/supabase-js)

## 访问您的GitLab帐户 [*link*](#%e8%ae%bf%e9%97%ae%e6%82%a8%e7%9a%84gitlab%e5%b8%90%e6%88%b7)

* 进入 [gitlab.com](https://gitlab.com).
* 单击右上角的`登录`以登录。

![](../../../../img/guides/auth-gitlab/gitlab-portal.png)

## 查找回调URL [*link*](#%e6%9f%a5%e6%89%be%e5%9b%9e%e8%b0%83url)

下一步需要回调URL，如下所示：

`https://<project-ref>.supabase.co/auth/v1/callback`

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com).
* 单击左侧边栏底部的`设置`图标。
* 单击列表中的`API`。
* 在Config/URL下，您将找到您的API URL，您可以单击`复制`将其复制到剪贴板。
* 现在只需在末尾添加`/auth/v1/callback`即可获得完整的`OAuth重定向URI`。

[

](../../../../videos/api/api-url-and-key.mp4)

## 创建GitLab应用程序 [*link*](#%e5%88%9b%e5%bb%bagitlab%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

* 单击右上角的`个人资料徽标`（头像）。
* 选择`编辑配置文件`。
* 在左侧边栏中，选择应用程序。
* 输入应用程序的名称。
* 在`重定向URI`框中，键入应用程序的回调URL。
* 选中`机密`旁边的复选框（确保选中）。
* 检查名为`read_user`的作用域（这是唯一需要的作用域）。
* 单击底部的`保存应用程序`。
* 复制并保存您稍后需要的`应用程序ID`（`client_ID`）和`机密`（`client _Secret`）。

## 将您的GitLab凭据添加到Suabase项目中 [*link*](#%e5%b0%86%e6%82%a8%e7%9a%84gitlab%e5%87%ad%e6%8d%ae%e6%b7%bb%e5%8a%a0%e5%88%b0suabase%e9%a1%b9%e7%9b%ae%e4%b8%ad)

* 转到[MemFire Cloud项目仪表板](https://cloud.memfiredb.com).
* 在左侧边栏中，单击`身份验证`图标（靠近顶部）。
* 单击列表中的`设置`以转到`身份验证设置`页面。
* 在`站点URL`下输入应用程序的最终（托管）URL（这很重要）。
* 在`外部OAuth提供程序`下，将`GitLab Enabled`设置为ON。
* 输入上一步中保存的`client_id`和`client_secret`。
* 单击`保存`。

## 将登录代码添加到客户端应用程序 [*link*](#%e5%b0%86%e7%99%bb%e5%bd%95%e4%bb%a3%e7%a0%81%e6%b7%bb%e5%8a%a0%e5%88%b0%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

当您的用户登录时，调用[signInWithOAuth()](/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/)，并将`gitlab`作为`provider`：

```
async function signInWithGitLab() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'gitlab',
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

[*navigate\_before* 使用GitHub登录](/docs/app/development_guide/auth/authentication/auth-github/)

[电子邮件模板 *navigate\_next*](/docs/app/development_guide/auth/authentication/auth-email-templates/)