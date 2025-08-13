# 总览 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/extensions/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

启用和停用扩展功能

# 总览

扩展和它们的名字一样 - 它们用不属于Postgres核心的功能来 “扩展 “数据库。
Supabase已经预装了一些最有用的开源扩展。

### 启用和停用扩展功能 [*link*](#%e5%90%af%e7%94%a8%e5%92%8c%e5%81%9c%e7%94%a8%e6%89%a9%e5%b1%95%e5%8a%9f%e8%83%bd)

1. 进入仪表板中的**数据库**页面。
2. 单击侧边栏中的**扩展程序**。
3. 启用或停用一个扩展。

[

](../../../videos/toggle-extensions.mp4)

```
-- Example: enable the "pgtap" extension and ensure it is installed
create extension pgtap with schema extensions;

-- Example: disable the "pgtap" extension
drop extension pgtap;
```

尽管SQL代码是 `create extension`，但它相当于"启用该扩展"。要禁用一个扩展，请调用 `drop extension`。

info

使用 `create extension <extension-name> with schema extensions` 启用某些扩展功能可能会导致权限问题（例如：`dblink`，`http`，`pg_cron`）。

### 完整的扩展列表 [*link*](#%e5%ae%8c%e6%95%b4%e7%9a%84%e6%89%a9%e5%b1%95%e5%88%97%e8%a1%a8)

Supabase预先配置了50多个扩展。你也可以通过SQL编辑器在数据库中直接安装所需的SQL扩展。

---

[*navigate\_before* 计算附加组件](/docs/app/development_guide/database/compute-add-ons/)

[http: RESTful客户端 *navigate\_next*](/docs/app/development_guide/database/extensions/http/)