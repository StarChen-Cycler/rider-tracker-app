# Using Modifiers | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/modifier/using-modifiers/
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# Using Modifiers

过滤器在行的层面上工作–它们允许你返回只符合某些条件的行，而不改变行的形状。
只符合某些条件的行，而不改变行的形状。
修改器是不符合该定义的一切，允许你
改变响应的格式（例如，返回一个CSV字符串）。

修改器必须在过滤器之后指定。有些修改器只适用于
一些修改器只适用于返回行的查询（例如，`select()`或`rpc()`在一个返回表的函数上
返回表格响应的函数）。

---

[*navigate\_before* .filter()](/docs/app/sdkdocs/dart/database/filter/filter/)

[order() *navigate\_next*](/docs/app/sdkdocs/dart/database/modifier/order/)