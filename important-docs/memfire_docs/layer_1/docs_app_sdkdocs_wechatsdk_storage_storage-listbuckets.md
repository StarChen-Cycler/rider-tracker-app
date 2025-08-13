# listBuckets() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/storage/storage-listbuckets/
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

# listBuckets()

listBuckets()用于获取现有项目中所有存储桶的详细信息。

需要RLS策略权限:

* `buckets`表的权限: `select`
* `objects`表的权限：无

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （获取所有存储桶信息） [*link*](#%e6%a1%88%e4%be%8b1-%e8%8e%b7%e5%8f%96%e6%89%80%e6%9c%89%e5%ad%98%e5%82%a8%e6%a1%b6%e4%bf%a1%e6%81%af)

```
const { data, error } = await supabase
.storage
.listBuckets()
```

---

[*navigate\_before* getBucket()](/docs/app/sdkdocs/wechatsdk/storage/storage-getbucket/)

[updateBucket() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/storage/storage-updatebucket/)