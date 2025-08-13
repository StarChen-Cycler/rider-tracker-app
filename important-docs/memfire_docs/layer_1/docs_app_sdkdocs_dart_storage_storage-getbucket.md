# getBucket() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-getbucket/
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

# getBucket()

检索现有存储桶的详细信息。

```
final Bucket bucket = await supabase
.storage
.getBucket('avatars');
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`的权限。`select` 的权限
  + `objects`权限: 无

## Examples [*link*](#examples)

### 获取桶 [*link*](#%e8%8e%b7%e5%8f%96%e6%a1%b6)

```
final Bucket bucket = await supabase
.storage
.getBucket('avatars');
```

---

[*navigate\_before* createBucket()](/docs/app/sdkdocs/dart/storage/storage-createbucket/)

[listBuckets() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-listbuckets/)