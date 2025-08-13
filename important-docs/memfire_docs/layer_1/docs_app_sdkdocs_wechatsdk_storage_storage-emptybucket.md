# emptyBucket() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/storage/storage-emptybucket/
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

# emptyBucket()

emptyBucket()用于移除单个桶内的所有对象。

需要RLS策略权限:

* `buckets`表的权限: `select`
* `objects`表的权限：`select`和`delet`

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （清空一个存储桶） [*link*](#%e6%a1%88%e4%be%8b1-%e6%b8%85%e7%a9%ba%e4%b8%80%e4%b8%aa%e5%ad%98%e5%82%a8%e6%a1%b6)

```
const { data, error } = await supabase
.storage
.emptyBucket('avatars')
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### id [必要参数] `string类型`

  这是你创建存储桶的唯一标识符。

---

[*navigate\_before* deleteBucket()](/docs/app/sdkdocs/wechatsdk/storage/storage-deletebucket/)

[from.upload() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/storage/storage-from-upload/)