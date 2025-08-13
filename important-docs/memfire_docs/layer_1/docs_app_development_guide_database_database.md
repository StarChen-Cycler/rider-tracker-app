# 概述 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/database/
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

# 概述

## 数据库 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93)

每个Supabase项目都带有一个完整的[Postgres](https://www.postgresql.org/)数据库，这是一个免费的开源数据库，被认为是世界上最稳定的和先进的数据库之一。

## Postgres 或 PostgreSQL? [*link*](#postgres-%e6%88%96-postgresql)

PostgreSQL数据库来自于POSTGRES项目，这是一个1986年在加州大学伯克利分校编写的软件包。
这个软件包包括一种叫做 “PostQUEL “的查询语言。

1994年，Postgres95建立在POSTGRES代码之上，增加了一个SQL语言解释器作为PostQUEL的替代。
最终，Postgres95被重新命名为PostgreSQL，以反映SQL查询能力。

在这之后，许多人把它称为Postgres，因为这样不容易混淆。Supabase的宗旨是简单，所以我们也把它称为Postgres。

## 功能 [*link*](#%e5%8a%9f%e8%83%bd)

### 表视图 [*link*](#%e8%a1%a8%e8%a7%86%e5%9b%be)

你不必是一个数据库专家就可以开始使用Supabase。我们的表视图使Postgres像电子表格一样容易使用。

![](../../../img/table-view.png)

### 关系 [*link*](#%e5%85%b3%e7%b3%bb)

挖掘你的数据中的关系.

[

](../../videos/relational-drilldown-zoom.mp4)

### 克隆表 [*link*](#%e5%85%8b%e9%9a%86%e8%a1%a8)

你可以复制你的表格，就像你在电子表格里面一样。

[

](../../videos/duplicate-tables.mp4)

### SQL编辑器 [*link*](#sql%e7%bc%96%e8%be%91%e5%99%a8)

Supabase自带一个SQL编辑器。你还可以保存你最喜欢的查询，以便以后运行!

[

](../../videos/favorites.mp4)

### 附加功能 [*link*](#%e9%99%84%e5%8a%a0%e5%8a%9f%e8%83%bd)

* Supabase使用我们的[Realtime Server](https://github.com/supabase/realtime)对Postgres进行实时功能的扩展。
* 每个项目都是一个完整的Postgres数据库，具有`postgres`级别的访问权限。
* Supabase负责管理你的数据库备份。
* 直接从CSV或EXCEL电子表格中导入数据。

info

数据库备份**不**包括通过存储API存储的对象，因为数据库只包括关于这些对象的元数据。恢复一个旧的备份并不能恢复在那之后被删除的对象。

### 扩展 [*link*](#%e6%89%a9%e5%b1%95)

为了扩展你的Postgres数据库的功能，你可以使用扩展。
你可以通过点击Supabase仪表板上的一个按钮来启用Postgres扩展。

[

](../../videos/toggle-extensions.mp4)

[了解更多](/docs/app/development_guide/database/extensions/extensions/)关于Supabase上提供的所有扩展。

## 提示 [*link*](#%e6%8f%90%e7%a4%ba)

阅读关于重设数据库密码[这里](/docs/app/development_guide/database/setting/managing-passwords/)和改变服务器时区[这里](/docs/app/development_guide/database/setting/managing-timezones/)。

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

* 阅读更多关于[Postgres](/docs/postgres/server/about)
* 登录: [MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 第五部分: Google Oauth](/docs/app/development_guide/auth/auth-deep-dive/auth-google-oauth/)

[数据库连接 *navigate\_next*](/docs/app/development_guide/database/connecting-to-postgres/)