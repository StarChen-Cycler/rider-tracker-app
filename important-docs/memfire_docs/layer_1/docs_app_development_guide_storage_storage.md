# 概述 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/storage/storage/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

文件

# 概述

Supabase存储使存储和服务大文件变得简单.

## 文件 [*link*](#%e6%96%87%e4%bb%b6)

文件可以是任何类型的媒体文件。这包括图像、GIF和视频。由于文件的大小，最好将其存储在数据库之外。为了安全起见，HTML文件以纯文本形式返回。

## 文件夹 [*link*](#%e6%96%87%e4%bb%b6%e5%a4%b9)

文件夹是组织文件的一种方式（就像在计算机上一样）。
组织文件没有正确或错误的方法。您可以将它们存储在适合项目的任何文件夹结构中。

## 存储桶 [*link*](#%e5%ad%98%e5%82%a8%e6%a1%b6)

Bucket是文件和文件夹的不同容器。你可以把它们想象成“超级文件夹”。
通常，您会为不同的安全和访问规则创建不同的存储桶。例如，您可以将所有视频文件保存在"video" 桶中，并将个人资料图片保存在"avatar"桶中。

## 开始使用 [*link*](#%e5%bc%80%e5%a7%8b%e4%bd%bf%e7%94%a8)

这是一个快速指南，介绍了Supabase Storage的基本功能。查找完整的[GitHub中的示例应用程序](https://github.com/supabase/supabase/tree/master/examples/user-management/nextjs-ts-user-management), 您可以自行部署。

info

文件、文件夹和Bucket名称**必须遵循**[AWS对象密钥命名指南](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html)并避免使用任何其他字符。

### 创建一个存储桶 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e5%ad%98%e5%82%a8%e6%a1%b6)

你可以使用Supabase仪表板创建一个存储桶。 由于存储可与Postgres数据库互操作，您还可以使用SQL或我们的客户端库。这里我们创建一个叫做 “avatars “的桶。

1.进入存储页面。

2.单击**新建Bucket**并输入Bucket的名称。

3.单击**创建Bucket**。

```
-- Use Postgres to create a bucket.

insert into storage.buckets (id, name)
values ('avatars', 'avatars');
```

```
// Use the JS library to create a bucket.

const { data, error } = await supabase.storage.createBucket('avatars')
```

[Reference.](/docs/app/sdkdocs/javascript/storage/storage-createbucket/)

```
void main() async {
  final supabase = SupabaseClient('supabaseUrl', 'supabaseKey');

  final storageResponse = await supabase
      .storage
      .createBucket('avatars');
}
```

[Reference.](https://pub.dev/documentation/storage_client/latest/storage_client/SupabaseStorageClient/createBucket.html)

### 上传一个文件 [*link*](#%e4%b8%8a%e4%bc%a0%e4%b8%80%e4%b8%aa%e6%96%87%e4%bb%b6)

你可以从仪表板上传文件，或在浏览器中使用我们的JS库上传文件.

1.进入存储页面。

2.选择要上传文件的存储桶。

3.单击**上传文件**。

4.选择你期望上传的文件，等待文件上传完成。

```
const avatarFile = event.target.files[0]
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar1.png', avatarFile)
```

[Reference.](/docs/app/sdkdocs/javascript/storage/storage-from-upload/)

```
void main() async {
  final supabase = SupabaseClient('supabaseUrl', 'supabaseKey');

  // Create file `example.txt` and upload it in `public` bucket
  final file = File('example.txt');
  file.writeAsStringSync('File content');
  final storageResponse = await supabase
      .storage
      .from('public')
      .upload('example.txt', file);
}
```

[Reference.](https://pub.dev/documentation/storage_client/latest/storage_client/SupabaseStorageClient/createBucket.html)

### 下载文件 [*link*](#%e4%b8%8b%e8%bd%bd%e6%96%87%e4%bb%b6)

您可以从仪表盘下载文件，或使用我们的JS库在浏览器中下载文件.

1.进入存储页面。

2.选择包含待下载文件的存储桶。

3.选择要下载的文件。

4.单击\*\*下载\*。

```
// Use the JS library to download a file.

const { data, error } = await supabase.storage.from('avatars').download('public/avatar1.png')
```

[Reference.](/docs/app/sdkdocs/javascript/storage/storage-from-download/)

```
void main() async {
  final supabase = SupabaseClient('supabaseUrl', 'supabaseKey');

  final storageResponse = await supabase
      .storage
      .from('public')
      .download('example.txt');
}
```

[Reference.](/docs/app/SDKdocs/dartstorage/storage-from-download)

### 添加安全规则 [*link*](#%e6%b7%bb%e5%8a%a0%e5%ae%89%e5%85%a8%e8%a7%84%e5%88%99)

要限制对文件的访问，可以使用仪表板或SQL.

1.进入存储页面。

2.单击侧边栏中的**策略**。

3.单击“对象”表中的**添加策略**，为文件添加策略。您还可以为Buckets创建策略。

4.选择要将策略应用于下载（SELECT）、上载（INSERT）、更新（UPDATE）还是删除（DELETE）。

5.为您的策略指定一个唯一的名称。

6.使用SQL编写策略。

```
-- Use SQL to create a policy.

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'public' );
```

## 共有桶和私有桶 [*link*](#%e5%85%b1%e6%9c%89%e6%a1%b6%e5%92%8c%e7%a7%81%e6%9c%89%e6%a1%b6)

默认情况下，存储桶是私有的。

对于私有存储桶，您可以通过[下载](/docs/app/sdkdocs/javascript/storage/storage-from-download/) 方法访问对象。这对应于`/object/auth/`API端点。
或者，您可以使用 [createSignedUrl](/docs/app/sdkdocs/javascript/storage/storage-from-createsignedurl/)方法创建一个具有到期日期的公共共享URL，它调用`/object/sign/`API。

对于公共存储桶，您可以在没有令牌或Authorization标头的情况下直接访问资产。
[getPublicUrl](/docs/app/sdkdocs/javascript/storage/storage-from-getpublicurl/) 帮助方法返回资产的完整公共URL。
这将在内部调用`/object/public/`API端点。虽然访问公共存储桶中的对象不需要授权，但其他操作（如上载、从公共存储桶删除对象）也需要适当的[access control](/docs/app/development_guide/storage/storage/#access-control) 。
公共存储桶也往往具有[更好的性能]（/docs/app/development\_guide/storage/storage cdn#Public与private存储桶）。

高级：反向代理

返回的URL通过API代理进行代理。它们的前缀是`/storage/v1`.

例如，在托管平台上是

`https://[project_ref].supabase.co/storage/v1/object/public/[id]`

您可以使用同一端点直接访问存储API。参见 [API文档](https://supabase.github.io/storage-api)了解可用操作的完整列表。

---

## 访问控制 [*link*](#%e8%ae%bf%e9%97%ae%e6%8e%a7%e5%88%b6)

Supabase存储与[Postgres数据库](/docs/app/database)集成。

这意味着您可以使用相同的[行级别安全策略](/docs/app/development_guide/auth/auth/#policies)用于管理对文件的访问。Supabase存储将元数据存储在存储架构中的 `objects` 和`buckets` 表中。为了允许对文件的读取访问，RLS策略必须允许用户 `SELECT` `objects`表，
并且为了上载新对象，RLS政策必须允许用户访问`INSERT`到`objects` 表格等。不同API调用与所需数据库权限之间的映射记录在[参见文档](/docs/app/sdkdocs/javascript/storage/storage-createbucket/)中。

info

存储的访问控制通过RLS策略映射到`buckets` 和`objects`表上的CRUD操作。

## 助手 [*link*](#%e5%8a%a9%e6%89%8b)

Supabase存储提供了SQL辅助功能，你可以在你的数据库查询和策略中使用这些功能.

---

#### `storage.filename()` [*link*](#storagefilename)

返回文件名.

```
select storage.filename(name)
from storage.objects;
```

例如，如果文件存储在`public/subfolder/avatar.png`中。它将返回：

`'avatar.png'`

---

#### `storage.foldername()` [*link*](#storagefoldername)

返回一个数组路径，其中包含文件所属的所有子文件夹。

```
select storage.foldername(name)
from storage.objects;
```

例如，如果你的文件存储在 `public/subfolder/avatar.png`，它将返回：

`[ 'public', 'subfolder' ]`

---

#### `storage.extension()` [*link*](#storageextension)

返回一个文件的扩展名.

```
select storage.extension(name)
from storage.objects;
```

例如，如果你的文件存储在 `public/subfolder/avatar.png`，它将返回：

`'png'`

---

## 策略样例 [*link*](#%e7%ad%96%e7%95%a5%e6%a0%b7%e4%be%8b)

下面是一些存储策略的示例.

### 允许公众访问一个存储桶 [*link*](#%e5%85%81%e8%ae%b8%e5%85%ac%e4%bc%97%e8%ae%bf%e9%97%ae%e4%b8%80%e4%b8%aa%e5%ad%98%e5%82%a8%e6%a1%b6)

```
-- 1. Allow public access to any files in the "public" bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'public' );
```

### 允许登录用户访问存储桶 [*link*](#%e5%85%81%e8%ae%b8%e7%99%bb%e5%bd%95%e7%94%a8%e6%88%b7%e8%ae%bf%e9%97%ae%e5%ad%98%e5%82%a8%e6%a1%b6)

```
-- 1. Allow logged-in access to any files in the "restricted" bucket
create policy "Restricted Access"
on storage.objects for select
using (
  bucket_id = 'restricted'
  and auth.role() = 'authenticated'
);
```

### 允许个人访问文件 [*link*](#%e5%85%81%e8%ae%b8%e4%b8%aa%e4%ba%ba%e8%ae%bf%e9%97%ae%e6%96%87%e4%bb%b6)

```
-- 1. Allow a user to access their own files
create policy "Individual user Access"
on storage.objects for select
using ( auth.uid() = owner );
```

## 参考资源 [*link*](#%e5%8f%82%e8%80%83%e8%b5%84%e6%ba%90)

* 在[博客文章](https://supabase.com/blog/supabase-storage)中阅读有关Suabase Storage的更多信息
* [GitHu上的Supabase存储](https://github.com/supabase/storage-api)
* [Swagger API文档](https://supabase.github.io/storage-api)
* 官方[JavaScript](/docs/app/sdkdocs/javascript/storage/storage-createbucket/)和[Dart](/docs/app/SDKdocs/dartstorage/storage-createbucket)文档
* [社区图书馆](https://github.com/supabase-community)

---

[*navigate\_before* Presence](/docs/app/development_guide/realtime/usage/presence/)

[存储CDN *navigate\_next*](/docs/app/development_guide/storage/storage-cdn/)