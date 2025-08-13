# from.upload() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-upload/
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

# from.upload()

将一个文件上传到一个现有的桶。

```
final avatarFile = File('path/to/file');
final String path = await supabase.storage.from('avatars').upload(
      'public/avatar1.png',
      avatarFile,
      fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
    );
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`权限: 无
  + `objects`的权限: `insert`

## Examples [*link*](#examples)

### 上传文件 [*link*](#%e4%b8%8a%e4%bc%a0%e6%96%87%e4%bb%b6)

```
final avatarFile = File('path/to/file');
final String path = await supabase.storage.from('avatars').upload(
      'public/avatar1.png',
      avatarFile,
      fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
    );
```

---

[*navigate\_before* emptyBucket()](/docs/app/sdkdocs/dart/storage/storage-emptybucket/)

[from.download() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-download/)