# deleteBucket() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-deletebucket/
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

# deleteBucket()

删除一个现有的桶。一个桶不能在其内部存在对象的情况下被删除。你必须首先`empty()`该桶。

```
final String result = await supabase
.storage
.deleteBucket('avatars');
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`的权限。`select` and `delete`。
  + `objects`的权限: 没有

## Examples [*link*](#examples)

### 删除桶 [*link*](#%e5%88%a0%e9%99%a4%e6%a1%b6)

```
final String result = await supabase
.storage
.deleteBucket('avatars');
```

---

[*navigate\_before* updateBucket()](/docs/app/sdkdocs/dart/storage/storage-updatebucket/)

[emptyBucket() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-emptybucket/)