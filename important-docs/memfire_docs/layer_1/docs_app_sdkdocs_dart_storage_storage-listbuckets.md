# listBuckets() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-listbuckets/
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

检索一个现有产品中所有存储桶的详细信息。

```
final List<Bucket> buckets = await supabase
.storage
.listBuckets();
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`的权限。`select`的权限
  + `objects`权限: 无

## Examples [*link*](#examples)

### 列表中的桶 [*link*](#%e5%88%97%e8%a1%a8%e4%b8%ad%e7%9a%84%e6%a1%b6)

```
final List<Bucket> buckets = await supabase
.storage
.listBuckets();
```

---

[*navigate\_before* getBucket()](/docs/app/sdkdocs/dart/storage/storage-getbucket/)

[updateBucket() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-updatebucket/)