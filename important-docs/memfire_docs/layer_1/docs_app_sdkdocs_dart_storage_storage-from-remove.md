# from.remove() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-remove/
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

# from.remove()

删除同一桶内的文件

```
final List<FileObject> objects = await supabase
.storage
.from('avatars')
.remove(['avatar1.png']);
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`权限: 无
  + `objects`的权限: `delete`和 `select`权限

## Examples [*link*](#examples)

### 删除文件 [*link*](#%e5%88%a0%e9%99%a4%e6%96%87%e4%bb%b6)

```
final List<FileObject> objects = await supabase
.storage
.from('avatars')
.remove(['avatar1.png']);
```

---

[*navigate\_before* from.move()](/docs/app/sdkdocs/dart/storage/storage-from-move/)

[from.createSignedUrl() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-createsignedurl/)