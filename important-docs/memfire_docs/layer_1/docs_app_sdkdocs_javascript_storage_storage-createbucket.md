# createBucket() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/storage/storage-createbucket/
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

# createBucket()

createBucket()用于创建一个新的存储桶

需要RLS策略权限:

* `buckets`表的权限: `insert`表权限
* `objects`表的权限：无

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （创建一个存储桶） [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e5%ad%98%e5%82%a8%e6%a1%b6)

```
const { data, error } = await supabase
.storage
.createBucket('avatars', {
  public: false,
  allowedMimeTypes: ['image/png'],
  fileSizeLimit: 1024
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### id [必要参数] `string类型`

  这是你创建存储桶的唯一标识符。
* #### 选项（option） [必要参数] `object类型`

  ##### 特性

  + #### public [必要参数] `boolean类型`

    存储桶的可见性。公开桶不需要授权令牌来下载对象，但对于所有其他操作仍需要有效的令牌。默认情况下，存储桶是私有的。
  + #### allowedMimeTypes [可选参数] `object类型`

    指定此存储桶在上传过程中允许接受的 MIME 类型。默认值为 null，允许上传具有所有 MIME 类型的文件。每个指定的 MIME 类型可以是通配符，例如 image/\*，也可以是特定的 MIME 类型，例如 image/png。
  + #### fileSizeLimit [可选参数] `null | 字符串 | 数字`

    指定可以上传到此存储桶的最大文件大小（以字节为单位）。全局文件大小限制优先于此值。默认值为 null，表示不设置每个存储桶的文件大小限制。

---

[*navigate\_before* 实名认证](/docs/app/development_guide/hosting/real-name-authentication/)

[deleteBucket() *navigate\_next*](/docs/app/sdkdocs/javascript/storage/storage-deletebucket/)