# from.update() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/storage/storage-from-update/
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

from.update()用于实现一个新文件替换指定路径下的现有文件。.

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：`update`和`select`权限

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

对于使用 React Native 进行开发的情况，直接使用 Blob、File 或 FormData 对象来进行文件操作可能会无法达到预期的效果。
相反，建议使用来自 base64 文件数据的 ArrayBuffer 来更新文件。可以参考提供的示例代码来了解如何以此方式进行文件更新操作。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （更新文件） [*link*](#%e6%a1%88%e4%be%8b1-%e6%9b%b4%e6%96%b0%e6%96%87%e4%bb%b6)

```
const avatarFile = event.target.files[0]
const { data, error } = await supabase
.storage
.from('avatars')
.update('public/avatar1.png', avatarFile, {
  cacheControl: '3600',
  upsert: true
})
```

### 案例2 （使用ArrayBuffer从base64文件数据更新文件） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8arraybuffer%e4%bb%8ebase64%e6%96%87%e4%bb%b6%e6%95%b0%e6%8d%ae%e6%9b%b4%e6%96%b0%e6%96%87%e4%bb%b6)

```
import {decode} from 'base64-arraybuffer'

const { data, error } = await supabase
.storage
.from('avatars')
.update('public/avatar1.png', decode('base64FileData'), {
  contentType: 'image/png'
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 路径（path） [必要参数] `string类型`

  文件路径，包括文件名。应该采用folder/subfolder/filename.png的格式。在尝试上传之前，必须确保存储桶已经存在。
* #### fileBody [必要参数] `object类型`

  要存储在桶中的文件的主体。
* #### fileOptions [可选参数] `FileOptions类型`

  ##### 特性

  + #### cacheControl [可选参数] `string类型`

    资源在浏览器和Supabase CDN中被缓存的秒数。这是在`Cache-Control: max-age=<seconds>`标头中设置的。默认为3600秒。
  + #### contentType [可选参数] `string类型`

    `Content-Type`头的值（header value），如果使用的 `fileBody` 不是 `Blob`、`File` 或 `FormData`，则应明确指定该值；否则，默认为 `text/plain;charset=UTF-8`。
  + #### duplex [可选参数] `string类型`

    `duplex` 是一个可选的字符串参数，用于启用或禁用双工流，允许在同一流中读取和写入数据。它可以作为 `fetch()` 方法的选项进行传递。

    双工流（duplex streaming）是一种数据流传输模式，在该模式下，可以同时进行读取和写入操作，并且这些操作可以在同一个数据流中进行。

    当 `duplex` 参数被设置为启用时，可以在请求过程中不间断地读取和写入数据。这对于需要实时交互、传输大量数据或需要同时进行读写操作的情况非常有用。
  + #### upsert [可选参数] `boolean类型`

    当 upsert 设置为 true 时，如果文件已经存在，则覆盖该文件。当设置为 false 时，如果对象已经存在，则抛出错误。默认为 false。

---

[*navigate\_before* from.list()](/docs/app/sdkdocs/wechatsdk/storage/storage-from-list/)

[from.move() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/storage/storage-from-move/)