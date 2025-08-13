# from.upload() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/storage/storage-from-upload/
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

from.upload()用于将一个文件上传到一个现有的桶。

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：仅在上传新文件时需要`插入insert`权限，以及在更新文件时需要`选择select`、`插入insert`和`更新updata`权限

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

对于 React Native，使用 `Blob`、`File` 或 `FormData` 并不能按预期工作。相反，应该使用来自 base64 文件数据的 `ArrayBuffer` 来上传文件，参见下面的示例。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （上传文件） [*link*](#%e6%a1%88%e4%be%8b1-%e4%b8%8a%e4%bc%a0%e6%96%87%e4%bb%b6)

```
const avatarFile = event.target.files[0]
const { data, error } = await supabase
.storage
.from('avatars')
.upload('public/avatar1.png', avatarFile, {
  cacheControl: '3600',
  upsert: false
})
```

### 案例2 （使用来自 base64 文件数据的 ArrayBuffer 来上传文件） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8%e6%9d%a5%e8%87%aa-base64-%e6%96%87%e4%bb%b6%e6%95%b0%e6%8d%ae%e7%9a%84-arraybuffer-%e6%9d%a5%e4%b8%8a%e4%bc%a0%e6%96%87%e4%bb%b6)

```
const avatarFile = event.target.files[0]
const { data, error } = await supabase
.storage
.from('avatars')
.upload('public/avatar1.png', avatarFile, {
  cacheControl: '3600',
  upsert: false
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 路径（path） [必要参数] `string类型`

  文件路径，包括文件名。应该采用folder/subfolder/filename.png的格式。在尝试上传之前，必须确保存储桶已经存在。
* #### fileBody [必要参数] `FileBody类型`

  要存储在存储桶中的文件内容。
* #### 文件选项（fileOptions） [可选参数] `FileOptions类型`

  ##### 特性

  + #### cacheControl [可选参数] `string类型`

    资源在浏览器和Supabase CDN中缓存的秒数。这是通过设置`Cache-Control: max-age=<seconds>`头来实现的。默认为3600秒。
  + #### contentType [可选参数] `string类型`

    `Content-Type`头的值。如果使用的是既不是`Blob`、`File`也不是`FormData`的`fileBody`，则应指定此值；否则，默认为`text/plain;charset=UTF-8`。
  + #### duplex [可选参数] `string类型`

    duplex选项是一个字符串参数，用于启用或禁用双工流式传输，在同一个流中允许读取和写入数据。它可以作为fetch()方法的选项传递。
  + #### upsert [可选参数] `boolean类型`

    当upsert设置为true时，如果文件已存在，则会覆盖该文件。当设置为false时，如果对象已存在，则会抛出错误。默认为false。

---

[*navigate\_before* emptyBucket()](/docs/app/sdkdocs/wechatsdk/storage/storage-emptybucket/)

[from.download() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/storage/storage-from-download/)