# from.update() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-update/
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

# from.update()

用一个新的文件替换指定路径下的一个现有文件。

```
final avatarFile = File('path/to/local/file');
final String path = await supabase.storage.from('avatars').update(
      'public/avatar1.png',
      avatarFile,
      fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
    );
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`权限: 无
  + `objects` 的权限: `update` and `select`

## Examples [*link*](#examples)

### 更新文件 [*link*](#%e6%9b%b4%e6%96%b0%e6%96%87%e4%bb%b6)

```
final avatarFile = File('path/to/local/file');
final String path = await supabase.storage.from('avatars').update(
      'public/avatar1.png',
      avatarFile,
      fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
    );
```

---

[*navigate\_before* from.list()](/docs/app/sdkdocs/dart/storage/storage-from-list/)

[from.move() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-move/)