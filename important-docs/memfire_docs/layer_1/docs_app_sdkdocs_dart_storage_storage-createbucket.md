# createBucket() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-createbucket/
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

# createBucket()

创建一个新的存储桶

```
final String bucketId = await supabase
.storage
.createBucket('avatars');
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`的权限。`insert`的权限
  + `objects`的权限: 没有

## Examples [*link*](#examples)

### 创建桶 [*link*](#%e5%88%9b%e5%bb%ba%e6%a1%b6)

```
final String bucketId = await supabase
.storage
.createBucket('avatars');
```

---

[*navigate\_before* getChannels()](/docs/app/sdkdocs/dart/realtime/getchannels/)

[getBucket() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-getbucket/)