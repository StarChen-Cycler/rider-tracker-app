# from.download() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-download/
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

# from.download()

下载文件

```
final Uint8List file = await supabase
.storage
.from('avatars')
.download('avatar1.png');
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`权限: 无
  + `objects`的权限: `select`

## Examples [*link*](#examples)

### 下载文件 [*link*](#%e4%b8%8b%e8%bd%bd%e6%96%87%e4%bb%b6)

```
final Uint8List file = await supabase
.storage
.from('avatars')
.download('avatar1.png');
```

---

[*navigate\_before* from.upload()](/docs/app/sdkdocs/dart/storage/storage-from-upload/)

[from.list() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-list/)