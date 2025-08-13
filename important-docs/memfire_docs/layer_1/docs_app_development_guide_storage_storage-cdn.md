# 存储CDN | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/storage/storage-cdn/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

CDN 基础知识

# 存储CDN

## CDN 基础知识 [*link*](#cdn-%e5%9f%ba%e7%a1%80%e7%9f%a5%e8%af%86)

上传到存储空间的所有资产都缓存在内容分发网络（CDN）上。

为了改善世界各地用户的延迟，Supabase 使用了 CDN。CDN 是一组地理分布广泛的服务器或**节点，用于缓存来自**源服务器的内容。对于 Supabase 存储来说，原服务器就是运行在[与项目所在地区相同](https://app.supabase.com/project/_/settings/general)的存储服务器。

让我们举例说明 CDN 如何帮助提高性能。为一个在新加坡启动的 Supabase 项目创建了一个新的存储桶。对 Supabase 存储 API 的所有请求都会首先进入 CDN。来自美国的用户请求一个对象，并被路由到美国 CDN。此时，该 CDN 节点的缓存中没有该对象，因此会 ping 新加坡的源服务器。另一个同样在美国的用户请求同一对象，并直接从美国的 CDN 缓存中获得服务，而不是将请求路由回新加坡。

除性能外，CDN 还能减轻分布式拒绝服务和其他应用程序攻击，从而提高安全性和可用性。

## 缓存持续时间 [*link*](#%e7%bc%93%e5%ad%98%e6%8c%81%e7%bb%ad%e6%97%b6%e9%97%b4)

默认情况下，资产在 CDN 和用户浏览器中的缓存时间为 1 小时。之后，CDN 节点会 ping 存储服务器，查看对象是否已更新。

在[上传](/docs/reference/javascript/storage-from-upload)或[更新](/docs/reference/javascript/storage-from-update)对象时，您可以通过修改 “cacheControl “参数来修改缓存时间。

如果希望对象不会在给定 URL 上发生变化，最好设置较长的缓存持续时间。

如果需要更新存储在 CDN 中的对象版本，可以使用各种缓存破坏技术。最常见的方法是在 URL 中添加版本查询参数。例如，您可以在应用程序中使用类似 `/storage/v1/object/sign/profile-pictures/cat.jpg?token=eyJh...&version=1`这样的 URL，并设置 1 年的长时间缓存。当您想更新猫图片时，可以增加 URL 中的版本查询参数。CDN 会将 `/storage/v1/object/sign/profile-pictures/cat.jpg?token=eyJh...&version=2`视为一个新对象，并 ping 到原点以获取更新版本。

请注意，如果某个特定地区有一段时间没有请求您的对象，CDN 仍可能会将其从缓存中驱逐。例如，如果没有来自美国的用户请求您的对象，即使您设置了很长的缓存控制持续时间，它也会从 CDN 缓存中移除。

特定请求的缓存状态会在 `cf-cache-status` 头中发送。缓存状态为 “MISS “表示 CDN 节点的缓存中没有该对象，必须通过 ping 才能获取该对象。缓存状态为 “HIT “表示对象是直接从 CDN 发送的。

### 公共与私有存储桶 [*link*](#%e5%85%ac%e5%85%b1%e4%b8%8e%e7%a7%81%e6%9c%89%e5%ad%98%e5%82%a8%e6%a1%b6)

公共存储桶中的对象无需任何授权即可访问。因此，缓存命中率要比私有存储桶高。对于私有资料库，访问每个对象的权限都是按用户级别检查的。例如，如果两个不同的用户从同一个区域访问私有存储桶中的同一个对象，就会导致这两个用户的缓存缺失，因为他们可能有不同的安全策略。另一方面，如果两个不同的用户从同一区域访问公共存储桶中的同一对象，则会导致第二个用户的缓存命中。

---

[*navigate\_before* 概述](/docs/app/development_guide/storage/storage/)

[限制消息 *navigate\_next*](/docs/app/development_guide/realtime/guides/client-side-throttling/)