# updateBucket() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-updatebucket/
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

# updateBucket()

更新一个新的存储桶

```
final res = await supabase
.storage
.updateBucket('avatars', const BucketOptions(public: false));
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`的权限。`update`的权限
  + `objects` 的权限: 没有

## Examples [*link*](#examples)

### 更新桶 [*link*](#%e6%9b%b4%e6%96%b0%e6%a1%b6)

```
final res = await supabase
.storage
.updateBucket('avatars', const BucketOptions(public: false));
```

---

[*navigate\_before* listBuckets()](/docs/app/sdkdocs/dart/storage/storage-listbuckets/)

[deleteBucket() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-deletebucket/)