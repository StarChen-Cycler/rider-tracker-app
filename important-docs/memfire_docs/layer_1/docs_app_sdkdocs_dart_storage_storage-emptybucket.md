# emptyBucket() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-emptybucket/
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

删除单个桶内的所有对象。

```
final String result = await supabase
.storage
.emptyBucket('avatars');
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`的权限。 `select` 的权限
  + `objects`的权限: `select`和`delete`的权限

## Examples [*link*](#examples)

### 清空存储桶 [*link*](#%e6%b8%85%e7%a9%ba%e5%ad%98%e5%82%a8%e6%a1%b6)

```
final String result = await supabase
.storage
.emptyBucket('avatars');
```

---

[*navigate\_before* deleteBucket()](/docs/app/sdkdocs/dart/storage/storage-deletebucket/)

[from.upload() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-upload/)