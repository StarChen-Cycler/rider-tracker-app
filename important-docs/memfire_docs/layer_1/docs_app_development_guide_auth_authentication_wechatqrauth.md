# 微信网站应用扫码登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/wechatqrauth/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

前言

# 微信网站应用扫码登录

### 前言 [*link*](#%e5%89%8d%e8%a8%80)

为了满足国内用户日益增长的操作习惯需求，并进一步提升用户体验，MemFire Cloud认证服务已集成微信扫码登录功能。微信，作为国内广受欢迎的社交平台，其扫码登录功能以其便捷性和快速性赢得了广大用户的青睐。现在，通过MemFire Cloud，开发者可以轻松地为WEB应用添加微信扫码登录功能，为用户提供更加流畅、安全的登录体验。

### 前提条件 [*link*](#%e5%89%8d%e6%8f%90%e6%9d%a1%e4%bb%b6)

1. 您已成功注册MemFire Cloud平台的账号，并创建了一个应用。
2. 您已成功注册微信开放平台账号。
3. 您拥有一个正确的网站应用官网，用于在微信开放平台上创建网站应用时提交审核。

### 配置步骤 [*link*](#%e9%85%8d%e7%bd%ae%e6%ad%a5%e9%aa%a4)

#### 1、在微信开放平台上“创建网站应用” [*link*](#1%e5%9c%a8%e5%be%ae%e4%bf%a1%e5%bc%80%e6%94%be%e5%b9%b3%e5%8f%b0%e4%b8%8a%e5%88%9b%e5%bb%ba%e7%bd%91%e7%ab%99%e5%ba%94%e7%94%a8)

info

首先，需要您在微信开放平台创建一个“网站应用”，待审核通过后即可获得该“网站应用”对应的AppID、AppSecret。

![](../../../../img/wechatqr1.png)

#### 2、在MemFire Cloud应用界面启用微信扫码认证 [*link*](#2%e5%9c%a8memfire-cloud%e5%ba%94%e7%94%a8%e7%95%8c%e9%9d%a2%e5%90%af%e7%94%a8%e5%be%ae%e4%bf%a1%e6%89%ab%e7%a0%81%e8%ae%a4%e8%af%81)

![](../../../../img/wechatqr2.png)

#### 3、在微信开放平台上对审核通过的网站应用配置其授权回调域 [*link*](#3%e5%9c%a8%e5%be%ae%e4%bf%a1%e5%bc%80%e6%94%be%e5%b9%b3%e5%8f%b0%e4%b8%8a%e5%af%b9%e5%ae%a1%e6%a0%b8%e9%80%9a%e8%bf%87%e7%9a%84%e7%bd%91%e7%ab%99%e5%ba%94%e7%94%a8%e9%85%8d%e7%bd%ae%e5%85%b6%e6%8e%88%e6%9d%83%e5%9b%9e%e8%b0%83%e5%9f%9f)

info

在微信开放平台，进入到第1步审核通过的“网站应用”中进行“授权回调域”的配置，配置的值为上一步中微信扫码认证服务商的重定向URL的cpa09na5g6h7mlpvrehg.baseapi.memfiredb.com这一部分。此处注意，不要在“授权回调域”的前面加上“https://”，也不需要在其之后加上具体的路径。

正确填写格式如下：
![](../../../../img/wechatqr3.png)

#### 4、在MemFire Cloud应用界面进行重定向URL配置 [*link*](#4%e5%9c%a8memfire-cloud%e5%ba%94%e7%94%a8%e7%95%8c%e9%9d%a2%e8%bf%9b%e8%a1%8c%e9%87%8d%e5%ae%9a%e5%90%91url%e9%85%8d%e7%bd%ae)

info

将审核通过的网站应用界面里的“应用官网”填写到Memfire Cloud中 认证>URL配置>网站URL中即可，也可以配置“重定向URL列表”。这样，当完成微信扫码登录后，将会默认重定向到“网站URL”或是“重定向URL列表”的其中一个指定网址。

![](../../../../img/wechatqr4.png)

### SDK使用教程 [*link*](#sdk%e4%bd%bf%e7%94%a8%e6%95%99%e7%a8%8b)

#### 1、SDK安装 [*link*](#1sdk%e5%ae%89%e8%a3%85)

```
npm install @supabase/supabase-js
```

#### 2、当您的用户进行登录时，调用signInWithOAuth()接口，将wechat\_qr作为provider即可。 [*link*](#2%e5%bd%93%e6%82%a8%e7%9a%84%e7%94%a8%e6%88%b7%e8%bf%9b%e8%a1%8c%e7%99%bb%e5%bd%95%e6%97%b6%e8%b0%83%e7%94%a8signinwithoauth%e6%8e%a5%e5%8f%a3%e5%b0%86wechat_qr%e4%bd%9c%e4%b8%baprovider%e5%8d%b3%e5%8f%af)

```
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

#### 3、当用户注销时，调用signOut()接口将其从浏览器会话和localStorage中删除： [*link*](#3%e5%bd%93%e7%94%a8%e6%88%b7%e6%b3%a8%e9%94%80%e6%97%b6%e8%b0%83%e7%94%a8signout%e6%8e%a5%e5%8f%a3%e5%b0%86%e5%85%b6%e4%bb%8e%e6%b5%8f%e8%a7%88%e5%99%a8%e4%bc%9a%e8%af%9d%e5%92%8clocalstorage%e4%b8%ad%e5%88%a0%e9%99%a4)

```
async function signout() {
  const { error } = await supabase.auth.signOut()
}
```

---

[*navigate\_before* 微信移动应用授权登录](/docs/app/development_guide/auth/authentication/wechatappauth/)

[使用Magic Link登录 *navigate\_next*](/docs/app/development_guide/auth/authentication/auth-magic-link/)