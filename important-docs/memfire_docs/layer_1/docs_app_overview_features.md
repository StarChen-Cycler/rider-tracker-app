# 功能 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/overview/features/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

数据库

# 功能

这是MemFire Cloud为每个项目提供的功能的非详尽列表。

## 数据库 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93)

### Postgres数据库 [*link*](#postgres%e6%95%b0%e6%8d%ae%e5%ba%93)

每个项目都是一个完整的Postgres数据库. [文档](/docs/app/development_guide/database/database/).

### 数据库扩展 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93%e6%89%a9%e5%b1%95)

每个数据库都有一整套Postgres扩展. [文档](/docs/app/development_guide/database/extensions/extensions/).

### 数据库函数 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93%e5%87%bd%e6%95%b0)

创建可以从浏览器调用的自定义数据库函数. [文档](/docs/app/development_guide/database/functions/).

### 数据库触发器 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93%e8%a7%a6%e5%8f%91%e5%99%a8)

将触发器附加到表以处理数据库更改.

### 数据库备份 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93%e5%a4%87%e4%bb%bd)

每天准时备份项目，可恢复，保证数据的可靠性.

### 搜索 [*link*](#%e6%90%9c%e7%b4%a2)

使用Postgres全文搜索构建搜索功能. [文档](/docs/app/development_guide/database/full-text-search).

### 密钥和加密 [*link*](#%e5%af%86%e9%92%a5%e5%92%8c%e5%8a%a0%e5%af%86)

使用我们的Postgres扩展MemFire Cloud Vault加密敏感数据并存储机密.[链接](https://supabase.com/blog/supabase-vault)

## 身份验证 [*link*](#%e8%ba%ab%e4%bb%bd%e9%aa%8c%e8%af%81)

### 电子邮件和密码登录 [*link*](#%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%92%8c%e5%af%86%e7%a0%81%e7%99%bb%e5%bd%95)

为您的应用程序或网站建立电子邮件登录. [文档](/docs/app/development_guide/auth/authentication/auth-email/).

### 魔法链接 [*link*](#%e9%ad%94%e6%b3%95%e9%93%be%e6%8e%a5)

为应用程序或网站建立无密码登录.[文档](/docs/app/development_guide/auth/authentication/auth-magic-link/).

### 社交登录 [*link*](#%e7%a4%be%e4%ba%a4%e7%99%bb%e5%bd%95)

提供社交登录-从苹果到GitHub，再到Slack. [文档](/docs/app/development_guide/auth/authentication/auth-apple/).

### 行级别安全性 [*link*](#%e8%a1%8c%e7%ba%a7%e5%88%ab%e5%ae%89%e5%85%a8%e6%80%a7)

使用Postgres策略控制每个用户可以访问的数据. [文档](/docs/app/development_guide/auth/mandates/row-level-security/).

## API和客户端库 [*link*](#api%e5%92%8c%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%93)

### 自动生成的REST API [*link*](#%e8%87%aa%e5%8a%a8%e7%94%9f%e6%88%90%e7%9a%84rest-api)

RESTful API是从数据库自动生成的，无需一行代码. [文档](/docs/app/development_guide/api/api/#rest-api-overview).

### 自动生成的GraphQL API [*link*](#%e8%87%aa%e5%8a%a8%e7%94%9f%e6%88%90%e7%9a%84graphql-api)

使用我们的自定义PostgresGraphQL扩展的快速GraphQL API. [文档](/docs/app/development_guide/api/api/#graphql-api-overview).

### 实时数据库变更 [*link*](#%e5%ae%9e%e6%97%b6%e6%95%b0%e6%8d%ae%e5%ba%93%e5%8f%98%e6%9b%b4)

通过websockets接收数据库更改. [文档](/docs/app/development_guide/realtime/postgres-cdc/).

### 用户广播 [*link*](#%e7%94%a8%e6%88%b7%e5%b9%bf%e6%92%ad)

通过websocket在连接的用户之间发送消息. [文档](/docs/app/development_guide/realtime/realtime/#broadcast).

### 用户状态 [*link*](#%e7%94%a8%e6%88%b7%e7%8a%b6%e6%80%81)

跨用户同步共享状态，包括联机状态和键入指示符. [文档](/docs/app/development_guide/realtime/realtime/#presence).

### 客户端库 [*link*](#%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%93)

官方客户端库[JavaScript](/docs/app/sdkdocs/javascript/start/installing/)和非官方客户端库[Dart](/docs/app/sdkdocs/dart/)，[由社区支持](https://github.com/supabase-community#client-libraries)。

## 文件存储 [*link*](#%e6%96%87%e4%bb%b6%e5%ad%98%e5%82%a8)

### 大文件存储 [*link*](#%e5%a4%a7%e6%96%87%e4%bb%b6%e5%ad%98%e5%82%a8)

MemFire Cloud 存储使存储和服务大文件变得简单. [文档](/docs/app/development_guide/storage/storage/).

### 存储CDN [*link*](#%e5%ad%98%e5%82%a8cdn)

使用MemFire Cloud CDN缓存大文件. [文档](/docs/app/development_guide/storage/storage-cdn/).

## 功能状态 [*link*](#%e5%8a%9f%e8%83%bd%e7%8a%b6%e6%80%81)

Postgres和MemFire Cloud平台都已做好生产准备。我们在Postgres之上提供的一些工具仍在开发中。

| 产品 | 功能 | 阶段 |
| --- | --- | --- |
| Database | Postgres | `GA` |
| Database | Triggers | `GA` |
| Database | Functions | `GA` |
| Database | Extensions | `GA` |
| Database | Full Text Search | `GA` |
| Database | Webhooks | `alpha` |
| Database | Poipnt-in-Time Recovery | `alpha` |
| Database | Vault | `alpha` |
| Studio |  | `GA` |
| Realtime | Postgres CDC | `GA` |
| Realtime | Broadcast | `beta` |
| Realtime | Presence | `beta` |
| Storage | Backend (S3) | `GA` |
| Storage | API | `beta` |
| Storage | CDN | `beta` |
| Edge Functions |  | `beta` |
| Auth | OAuth Providers | `beta` |
| Auth | Passwordless | `beta` |
| Auth | Next.js Auth Helpers | `alpha` |
| Auth | SvelteKit Auth Helpers | `alpha` |
| Auth | Remix Auth Helpers | `alpha` |
| Management API |  | `beta` |
| CLI |  | `beta` |
| Client Library: JavaScript |  | `GA` |
| Client Library: Dart |  | `beta` |

---

[*navigate\_before* 介绍](/docs/app/overview/overview/)

[架构 *navigate\_next*](/docs/app/overview/architecture/)