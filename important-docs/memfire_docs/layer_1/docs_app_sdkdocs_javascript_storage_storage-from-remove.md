# from.remove() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/storage/storage-from-remove/
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

from.remove()用于删除存储桶中的文件

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：`delete`和`select`权限

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （删除文件） [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%a0%e9%99%a4%e6%96%87%e4%bb%b6)

```
const { data, error } = await supabase
.storage
.from('avatars')
.remove(['folder/avatar1.png'])
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### paths [必要参数] `string[]类型（字符串数组）`

  一个要删除的文件数组，包括路径和文件名。例如[`folder/image.png`]。

---

[*navigate\_before* from.update()](/docs/app/sdkdocs/javascript/storage/storage-from-update/)

[from.list() *navigate\_next*](/docs/app/sdkdocs/javascript/storage/storage-from-list/)