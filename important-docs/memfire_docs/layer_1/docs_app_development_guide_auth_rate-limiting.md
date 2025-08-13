# 速率限制 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/rate-limiting/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

速率限制、资源分配和滥用预防

# 速率限制

## 速率限制、资源分配和滥用预防 [*link*](#%e9%80%9f%e7%8e%87%e9%99%90%e5%88%b6%e8%b5%84%e6%ba%90%e5%88%86%e9%85%8d%e5%92%8c%e6%bb%a5%e7%94%a8%e9%a2%84%e9%98%b2)

* MemFire Cloud采用了许多保护措施来防止传入流量的突发，以防止滥用，并帮助最大限度地提高整个平台的稳定性
  + 如果您预计会出现高负载事件，包括生产启动或重负载测试，或长时间的高资源使用率，请至少提前 2 周通知我们。

### 身份验证速率限制 [*link*](#%e8%ba%ab%e4%bb%bd%e9%aa%8c%e8%af%81%e9%80%9f%e7%8e%87%e9%99%90%e5%88%b6)

* 下表显示了以下身份验证终端节点上的速率限制配额。您可以在`用户认证`-> `Rate Limits`配置项目的身份验证速率限制。

| Endpoint | Path | Limited By | Rate Limit |
| --- | --- | --- | --- |
| 发送电子邮件的所有结点 | `/auth/v1/signup` `/auth/v1/recover` `/auth/v1/user` | 合并请求的总和 | 默认为每小时 30 封电子邮件。截至 2023 年 7 月 14 日，这已更新为每小时 4 封电子邮件。可通过自定义 SMTP 设置进行自定义。 |
| 发送一次性密码 （OTP） 的所有结点 | `/auth/v1/otp` | 合并请求的总和 | 默认为每小时 30 个 OTP。是可定制的。 |
| 发送 OTP 或魔术链接 | `/auth/v1/otp` | 上次请求 | 默认为允许新请求之前的 60 秒窗口。是可定制的。 |
| 注册确认请求 | `/auth/v1/signup` | 上次请求 | 默认为允许新请求之前的 60 秒窗口。是可定制的。 |
| 密码重置请求 | `/auth/v1/recover` | 上次请求 | 默认为允许新请求之前的 60 秒窗口。是可定制的。 |
| 验证请求 | `/auth/v1/verify` | IP地址 | 每小时 360 个请求（最多 30 个请求） |
| 令牌刷新请求 | `/auth/v1/token` | IP地址 | 每小时 1800 个请求（最多 30 个请求） |
| 创建或验证 MFA 质询 | `/auth/v1/factors/:id/challenge` `/auth/v1/factors/:id/verify` | IP地址 | 每分钟 15 个请求（最多 30 个请求） |

### 实时配额 [*link*](#%e5%ae%9e%e6%97%b6%e9%85%8d%e9%a2%9d)

* 查看[实时配额](/docs/app/development_guide/realtime/deep-dive/quotas/)。
* 如果您需要增加配额，可以随时[联系支持人员](/docs/contactus/).

### 预防滥用 [*link*](#%e9%a2%84%e9%98%b2%e6%bb%a5%e7%94%a8)

* MemFire Cloud在注册、登录和密码重置端点上提供验证码保护。请参阅[我们的指南](/docs/app/development_guide/auth/auth-captcha/)，了解如何使用此方法防止滥用。

---

[*navigate\_before* 启用Captcha保护](/docs/app/development_guide/auth/auth-captcha/)

[Next.js 设置微信扫码登录身份验证 *navigate\_next*](/docs/app/development_guide/auth/auth-getting-start/nextjs/)