# from.createSignedUrls() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/storage/storage-from-createsignedurls/
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

# from.createSignedUrls()

from.createSignedUrls()用于创建多个签名的URL。使用签名的URL在固定的时间内分享一个文件。

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：`select`权限

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （创建多个带有签名的URL） [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%9b%e5%bb%ba%e5%a4%9a%e4%b8%aa%e5%b8%a6%e6%9c%89%e7%ad%be%e5%90%8d%e7%9a%84url)

```
const { data, error } = await supabase
.storage
.from('avatars')
.createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 路径（path） [必要参数] `string[]类型（字符串数组）`

  要下载的文件路径，包括当前文件名。例如：[‘folder/image.png’, ‘folder2/image2.png’]。
* #### expiresIn [必要参数] `数字类型`

  签名URL的过期时间，以秒为单位。例如，对于有效期为一分钟的URL，可以设置为 60。
* #### 选项（option） [可选参数] `object类型`

  ##### 特性

  + #### download [可选参数] `string` | `boolean`

    如果设置为 true，将触发文件下载。如果您希望使用不同的文件名触发下载，请将此参数设置为所需的文件名。

---

[*navigate\_before* from.createSignedUrl()](/docs/app/sdkdocs/wechatsdk/storage/storage-from-createsignedurl/)

[from.getPublicUrl() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/storage/storage-from-getpublicurl/)