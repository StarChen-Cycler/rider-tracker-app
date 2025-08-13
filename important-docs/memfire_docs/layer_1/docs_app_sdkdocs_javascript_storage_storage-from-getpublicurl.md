# from.getPublicUrl() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/storage/storage-from-getpublicurl/
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

# from.getPublicUrl()

from.getPublicUrl()是用于获取公开存储桶中资源URL的函数。如果你不想使用这个函数，也可以通过将存储桶URL与资源路径拼接在一起来构建公开（public）URL。

这个函数不会验证存储桶是否为公开（public）。如果为非公开的存储桶创建了公开（public）URL，你将无法下载资源。

需要将存储桶设置为公开（public）状态，可以通过 [updateBucket()](/docs/app/sdkdocs/javascript/storage/storage-updatebucket/) 方法或者在 [MemFireCloud应用控制台](https://cloud.memfiredb.com/project)的`存储`页面中，选择你需要操作的存储桶，点击该存储桶的扩展按钮。选择`编辑存储桶`，然后选择`公开存储桶`按钮即可完成。

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：无

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （返回公开存储桶中资源的URL） [*link*](#%e6%a1%88%e4%be%8b1-%e8%bf%94%e5%9b%9e%e5%85%ac%e5%bc%80%e5%ad%98%e5%82%a8%e6%a1%b6%e4%b8%ad%e8%b5%84%e6%ba%90%e7%9a%84url)

```
const { data } = supabase
.storage
.from('public-bucket')
.getPublicUrl('folder/avatar1.png')
```

### 案例2 （返回公开存储桶中带有转换的资源的URL） [*link*](#%e6%a1%88%e4%be%8b2-%e8%bf%94%e5%9b%9e%e5%85%ac%e5%bc%80%e5%ad%98%e5%82%a8%e6%a1%b6%e4%b8%ad%e5%b8%a6%e6%9c%89%e8%bd%ac%e6%8d%a2%e7%9a%84%e8%b5%84%e6%ba%90%e7%9a%84url)

```
const { data } = supabase
.storage
.from('public-bucket')
.getPublicUrl('folder/avatar1.png', {
  transform: {
    width: 100,
    height: 100,
  }
})
```

### 案例3 （返回触发公开存储桶中资源下载的URL） [*link*](#%e6%a1%88%e4%be%8b3-%e8%bf%94%e5%9b%9e%e8%a7%a6%e5%8f%91%e5%85%ac%e5%bc%80%e5%ad%98%e5%82%a8%e6%a1%b6%e4%b8%ad%e8%b5%84%e6%ba%90%e4%b8%8b%e8%bd%bd%e7%9a%84url)

```
const { data } = supabase
.storage
.from('public-bucket')
.getPublicUrl('folder/avatar1.png', {
  download: true,
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 路径（path） [必要参数] `string类型`

  文件路径，包括当前文件名。例如 folder/image.png。
* #### 选项（option） [可选参数] `object类型`

  ##### 特性

  + #### download [可选参数] `string` | `boolean`

    如果设置为 “true”，就会触发该文件的下载。如果你想用不同的文件名来触发下载，将此参数设置为文件名。
  + #### transform [可选参数] `TransformOptions类型`

    将资源提供给客户端之前对其进行转换。

    ##### 特性

    - #### format [必要参数] `"origin"`

      指定所请求图像的格式。当使用 ‘origin’ 时，我们强制格式与原始图像相同。当未传入此选项时，图像将被优化为现代图像格式，如 Webp。
    - #### height [可选参数] `数字类型`

      图像的高度（以像素为单位）。
    - #### quality [可选参数] `数字类型`

      设置返回图像的质量。取值范围为 20 到 100，其中 100 表示最高质量。默认为 80。
    - #### resize [可选参数] `"cover" | "contain" | "fill"`

      调整大小模式可以是 cover、contain 或 fill。默认为 cover。Cover 模式会根据原始图像的宽高比来调整图像的大小，并填充整个宽度和高度。
      Contain 模式会根据原始图像的宽高比来调整图像的大小，并使整个图像适应指定的宽度和高度。Fill 模式会调整图像的大小以填充整个宽度和高度。如果对象的宽高比与指定的宽度和高度不匹配，图像将被拉伸以适应。
    - #### width [可选参数] `数字类型`

      图像的宽度（以像素为单位）。

---

[*navigate\_before* from.createSignedUrls()](/docs/app/sdkdocs/javascript/storage/storage-from-createsignedurls/)

[emptyBucket() *navigate\_next*](/docs/app/sdkdocs/javascript/storage/storage-emptybucket/)