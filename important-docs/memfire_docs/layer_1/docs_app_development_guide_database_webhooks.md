# 数据库 Webhooks | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/webhooks/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# 数据库 Webhooks

数据库 Webhooks 允许您在数据库发生表事件时将实时数据发送到另一个系统。

你可以绑定三个事件: `插入`、`更新`、 和 `删除`。 所有事件在数据库行更改后触发。

数据库 Webhooks 非常类似于触发器，因为数据库Webhooks使用了[pg\_net](/docs/app/development_guide/database/extensions/pgnet/) 扩展，这使得它看上去更像是对触发器的便捷地封装。这个扩展是异步的，因此不会阻塞数据库更改以进行长时间运行的网络请求。

该视频演示了每次向`profiles`表插入一行时，如何在Stripe中创建一个新客户：

info

数据库 Webhooks 以前叫做函数 Hooks。

## 创建 webhook [*link*](#%e5%88%9b%e5%bb%ba-webhook)

1. 在控制台新建一个[数据库 Webhook](https://memfiredb.com)。
2. 给新建的 Webhook 命名。
3. 选择一个你想绑定的数据表。
4. 选择一个或多个您想要连接到的事件(表的插入、更新、删除) 。

我们目前支持 HTTP webhooks。它们以带有 JSON 载荷的 POST 请求的形式发送。

## 载荷 [*link*](#%e8%bd%bd%e8%8d%b7)

载荷是从底层表记录自动生成的:

```
type InsertPayload = {
  type: 'INSERT'
  table: string
  schema: string
  record: TableRecord<T>
  old_record: null
}
type UpdatePayload = {
  type: 'UPDATE'
  table: string
  schema: string
  record: TableRecord<T>
  old_record: TableRecord<T>
}
type DeletePayload = {
  type: 'DELETE'
  table: string
  schema: string
  record: null
  old_record: TableRecord<T>
}
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* [pg\_net](/docs/app/development_guide/database/extensions/pgnet/): 用于 PostgreSQL 的异步网络扩展。

---

[*navigate\_before* 表格和数据](/docs/app/development_guide/database/tables/)

[计算附加组件 *navigate\_next*](/docs/app/development_guide/database/compute-add-ons/)