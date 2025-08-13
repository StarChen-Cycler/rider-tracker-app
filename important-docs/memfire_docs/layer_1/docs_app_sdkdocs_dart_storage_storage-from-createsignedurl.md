# from.createSignedUrl() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-createsignedurl/
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

# from.createSignedUrl()

创建签名的网址，下载文件而不需要权限。这个URL可以在设定的秒数内有效。

```
final String signedUrl = await supabase
.storage
.from('avatars')
.createSignedUrl('avatar1.png', 60);
```

## Notes [*link*](#notes)

* 需要的政策权限。
  + `buckets`权限: 无
  + `objects`的权限: `select`

## Examples [*link*](#examples)

### 创建签名的URL [*link*](#%e5%88%9b%e5%bb%ba%e7%ad%be%e5%90%8d%e7%9a%84url)

```
final String signedUrl = await supabase
.storage
.from('avatars')
.createSignedUrl('avatar1.png', 60);
```

---

[*navigate\_before* from.remove()](/docs/app/sdkdocs/dart/storage/storage-from-remove/)

[from.createSignedUrls() *navigate\_next*](/docs/app/sdkdocs/dart/storage/storage-from-createsignedurls/)