# from.getPublicUrl() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/storage/storage-from-getpublicurl/
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

检索公共资源库中资产的URL

```
final String publicUrl = supabase
.storage
.from('public-bucket')
.getPublicUrl('avatar1.png');
```

## Notes [*link*](#notes)

* 水桶需要被设置为公开，可以通过[updateBucket()](/docs/app/SDKdocs/JavaScript/storage/storag-updatebucket)或通过进入[app.supabase.com](https://app.supabase.com)的存储，点击水桶上的溢出菜单并选择 “Make public”
* 需要的策略权限。
  + `buckets`权限: 无
  + `objects`权限: 无

## Examples [*link*](#examples)

### 返回公共桶中资产的URL。 [*link*](#%e8%bf%94%e5%9b%9e%e5%85%ac%e5%85%b1%e6%a1%b6%e4%b8%ad%e8%b5%84%e4%ba%a7%e7%9a%84url)

```
final String publicUrl = supabase
.storage
.from('public-bucket')
.getPublicUrl('avatar1.png');
```

---

[*navigate\_before* from.createSignedUrls()](/docs/app/sdkdocs/dart/storage/storage-from-createsignedurls/)

[微信小程序客户端 *navigate\_next*](/docs/app/sdkdocs/wechatsdk/start/wechat/)