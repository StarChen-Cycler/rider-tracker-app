# from.copy() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/storage/storage-from-copy/
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

# from.copy()

from.copy()用于将一个现有的文件复制到存储桶中的新路径。

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：`insert`和`select`权限

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （复制文件） [*link*](#%e6%a1%88%e4%be%8b1-%e5%a4%8d%e5%88%b6%e6%96%87%e4%bb%b6)

```
const { data, error } = await supabase
.storage
.from('avatars')
.copy('public/avatar1.png', 'private/avatar2.png')
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### fromPath [必要参数] `string类型`

  文件路径，包括文件名。应该采用folder/subfolder/filename.png的格式。在尝试上传之前，必须确保存储桶已经存在。
* #### toPath [必要参数] `string类型`

  新的文件路径，包括新的文件名。例如`folder/image-copy.png`。

---

[*navigate\_before* from.move()](/docs/app/sdkdocs/wechatsdk/storage/storage-from-move/)

[from.remove() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/storage/storage-from-remove/)