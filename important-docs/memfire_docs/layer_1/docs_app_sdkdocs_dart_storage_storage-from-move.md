# from.move() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-move/
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

# from.move()

移动一个现有的文件，同时也可以选择重命名。

```
final String result = await supabase
.storage
.from('avatars')
.move('public/avatar1.png', 'private/avatar2.png');
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`权限: 无
  + `objects`的权限: `update`和 `select`的权限

## Examples [*link*](#examples)

### 移动文件 [*link*](#%e7%a7%bb%e5%8a%a8%e6%96%87%e4%bb%b6)

```
final String result = await supabase
.storage
.from('avatars')
.move('public/avatar1.png', 'private/avatar2.png');
```

---

[*navigate\_before* from.update()](/docs/app/sdkdocs/dart/storage/storage-from-update/)

[from.remove() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-remove/)