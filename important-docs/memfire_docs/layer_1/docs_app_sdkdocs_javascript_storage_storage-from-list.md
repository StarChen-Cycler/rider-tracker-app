# from.list() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/storage/storage-from-list/
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

# from.list()

from.list()用于列出存储桶内的所有文件。

需要RLS策略权限:

* `buckets`表的权限: 无
* `objects`表的权限：`select`权限

请参考[存储指南](/docs/app/development_guide/storage/storage/#access-control)中关于访问控制的工作方式。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （在存储桶中列出文件） [*link*](#%e6%a1%88%e4%be%8b1-%e5%9c%a8%e5%ad%98%e5%82%a8%e6%a1%b6%e4%b8%ad%e5%88%97%e5%87%ba%e6%96%87%e4%bb%b6)

```
const { data, error } = await supabase
.storage
.from('avatars')
.list('folder', {
  limit: 100,
  offset: 0,
  sortBy: { column: 'name', order: 'asc' },
})
```

### 案例2 （在存储桶中搜索文件） [*link*](#%e6%a1%88%e4%be%8b2-%e5%9c%a8%e5%ad%98%e5%82%a8%e6%a1%b6%e4%b8%ad%e6%90%9c%e7%b4%a2%e6%96%87%e4%bb%b6)

```
const { data, error } = await supabase
.storage
.from('avatars')
.list('folder', {
  limit: 100,
  offset: 0,
  sortBy: { column: 'name', order: 'asc' },
  search: 'jon'
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 路径（path） [可选参数] `string类型`

  文件夹路径。
* #### 选项（option） [可选参数] `SearchOptions类型`

  ##### 特性

  + #### limit [可选参数] `数字类型`

    你希望返回的文件数量。
  + #### offset [可选参数] `数字类型`

    起始位置。
  + #### search [可选参数] `string类型`

    按照搜索字符串筛选文件的条件。
  + #### sortBy [可选参数] `SortBy类型`

    要排序的列。可以是FileObject中的任何列。

    ##### 特性

    - #### 列（column） [可选参数] `string类型`
    - #### order [可选参数] `string类型`
* #### parameters [可选参数] `FetchParameters类型`

  ##### 特性

  + #### signal [可选参数] `AbortSignal类型`

    传入一个AbortController的信号来取消请求。

---

[*navigate\_before* from.remove()](/docs/app/sdkdocs/javascript/storage/storage-from-remove/)

[from.move() *navigate\_next*](/docs/app/sdkdocs/javascript/storage/storage-from-move/)