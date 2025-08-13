# from.download() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/storage/storage-from-download/
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

from.download()的作用是从私有存储桶下载文件。对于公共存储桶，从 getPublicUrl 返回的 URL 发起请求。

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：`select`权限

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （下载文件） [*link*](#%e6%a1%88%e4%be%8b1-%e4%b8%8b%e8%bd%bd%e6%96%87%e4%bb%b6)

```
const { data, error } = await supabase
.storage
.from('avatars')
.download('folder/avatar1.png')
```

### 案例2 （带transform参数的下载文件） [*link*](#%e6%a1%88%e4%be%8b2-%e5%b8%a6transform%e5%8f%82%e6%95%b0%e7%9a%84%e4%b8%8b%e8%bd%bd%e6%96%87%e4%bb%b6)

```
const { data, error } = await supabase
.storage
.from('avatars')
.download('folder/avatar1.png', {
  transform: {
    width: 100,
    height: 100,
    quality: 80
  }
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 路径（path） [必要参数] `string类型`

  文件路径，包括文件名。应该采用folder/subfolder/filename.png的格式。在尝试上传之前，必须确保存储桶已经存在。
* #### 选项（option） [可选参数] `object类型`

  ##### 特性

  + #### transform [可选参数] `TransformOptions类型`

    在向客户端提供资源之前对资源进行转换。

    ##### 特性

    - #### format [可选参数] `"origin"`

      指定请求的图像格式。当使用 ‘origin’ 时，我们强制格式与原始图像相同。如果未传递此选项，则将图像优化为现代图像格式，如 Webp。
    - #### height [可选参数] `数字类型`

      图像的高度（以像素为单位）。
    - #### quality [可选参数] `数字类型`

      设置返回图像的质量。取值范围从20到100，其中100是最高质量。默认为80。
    - #### resize [可选参数] `"cover" | "contain" | "fill"`

      调整大小模式可以是 cover、contain 或 fill。默认为 cover。Cover 将图像调整到保持其宽高比的同时填充整个宽度和高度。
      Contain 将图像调整到保持其宽高比的同时将整个图像放入宽度和高度内。Fill 将图像调整为填充整个宽度和高度。如果对象的宽高比不匹配宽度和高度，则图像将被拉伸以适应。
    - #### width [可选参数] `数字类型`

      图像的宽度（以像素为单位）。

---

[*navigate\_before* deleteBucket()](/docs/app/sdkdocs/javascript/storage/storage-deletebucket/)

[from.upload() *navigate\_next*](/docs/app/sdkdocs/javascript/storage/storage-from-upload/)