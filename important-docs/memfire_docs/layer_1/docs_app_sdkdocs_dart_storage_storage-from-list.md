# from.list() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-list/
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

# from.list()

列出一个桶内的所有文件。

```
final List<FileObject> objects = await supabase
.storage
.from('avatars')
.list();
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`权限: 无
  + `objects`的权限: `select`

## Examples [*link*](#examples)

### 在一个桶中列出文件 [*link*](#%e5%9c%a8%e4%b8%80%e4%b8%aa%e6%a1%b6%e4%b8%ad%e5%88%97%e5%87%ba%e6%96%87%e4%bb%b6)

```
final List<FileObject> objects = await supabase
.storage
.from('avatars')
.list();
```

---

[*navigate\_before* from.download()](/docs/app/sdkdocs/dart/storage/storage-from-download/)

[from.update() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-update/)