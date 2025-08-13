# Passwords | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/setting/managing-passwords/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

改变你的项目密码

# Passwords

你的PostgreSQL数据库是你的Supabase项目的核心，所以在任何时候都有一个强大、安全的密码是很很重要的。

如果你在你的postgres密码中使用了特殊符号，你必须记得在以后使用postgres连接字符串时对你的密码进行[%-encode](https://en.wikipedia.org/wiki/Percent-encoding)，例如：`postgresql://postgres:p%3Dword@db.cvwawazfelidkloqmbma.supabase.co:5432/postgres`。

## 改变你的项目密码 [*link*](#%e6%94%b9%e5%8f%98%e4%bd%a0%e7%9a%84%e9%a1%b9%e7%9b%ae%e5%af%86%e7%a0%81)

当你创建你的项目时，你也被要求输入一个密码。这实际上是你的数据库的密码，特别是 “postgres"用户的密码。
你可以在Dashboard的数据库设置页面下更新它。

## 创建一个安全的密码 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e5%ae%89%e5%85%a8%e7%9a%84%e5%af%86%e7%a0%81)

安全地存储你的客户数据是绝对关键的。这里有一些创建安全密码的提示。

* 使用一个密码管理器来生成密码。
* 制作一个长密码（至少12个字符）。
* 不要使用任何常见的字典中的词汇。
* 同时使用大写和小写字符、数字和特殊符号。

## 资源库 [*link*](#%e8%b5%84%e6%ba%90%e5%ba%93)

* [PostgreSQL `ALTER USER`文档](https://www.postgresql.org/docs/12/sql-alteruser.html)

---

[*navigate\_before* 复制](/docs/app/development_guide/database/setting/replication/)

[时区 *navigate\_next*](/docs/app/development_guide/database/setting/managing-timezones/)