# Discussbase论坛 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/example/web/discussbaseforum/
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

Enable dark mode

Enable light mode

本页

Table of Contents

# Discussbase论坛 DRAFT

**Discussbase**是一个开源的简单论坛。使用“技术栈”（MemFire Cloud 、 Nextjs）构建和运行。

![](../../../img/样例-discuss-1.jpeg)

## 下载代码 [*link*](#%e4%b8%8b%e8%bd%bd%e4%bb%a3%e7%a0%81)

执行如下命令，获取Discussbase论坛应用的代码。

git clone <https://github.com/LucaRao/discussbase>

## 创建应用 [*link*](#%e5%88%9b%e5%bb%ba%e5%ba%94%e7%94%a8)

下载**Discussbase**代码后，登录[memfire cloud](https://memfiredb.com/),创建一个MemFire Cloud应用，为Discussbase提供后端服务，包括云数据库、对象存储、授权认证等。

![](../../../img/样例-discuss-1.png)

在应用->概括页面，获取服务地址以及token信息。

![](../../../img/样例-discuss-3.png)

Anon（公开）密钥是客户端API密钥。它允许“匿名访问”您的数据库，直到用户登录。登录后，密钥将切换到用户自己的登录令牌。这将为数据启用行级安全性。

注意：service\_role（秘密）密钥可以绕过任何安全策略完全访问您的数据。这些密钥必须保密，并且要在服务器环境中使用，决不能在客户端或浏览器上使用。 在后续示例代码中，需要提供supabaseUrl和supabaseKey。

## 配置访问密钥 [*link*](#%e9%85%8d%e7%bd%ae%e8%ae%bf%e9%97%ae%e5%af%86%e9%92%a5)

在根目录下创建新的 .env文件，在 .env 中添加您的 MemFire Cloud 配置；将上一步中获取的Anon（公开）密钥、service\_role和网址、以及JWT密钥分别设置到该文件中，如下图所示：

```
  NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
JWT_SECRET=
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=
```

如图样例所示。

![](../../../img/样例-discuss-4.png)

## 创建数据表 [*link*](#%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

接下来我们会创建三张表，包括

* profiles (用户信息表)
* posts (帖子)
* replies (回复信息表)

### 创建profiles表 [*link*](#%e5%88%9b%e5%bb%baprofiles%e8%a1%a8)

你可以在MemFire Cloud的Discussbase\_db的SQL编辑器运行如下SQL语法，涉及操作包括：

1、创建profiles表, 开启Profiles的RLS数据安全访问规则;

其中profiles表字段id和auth.users表中的uuid外键关联。

相关操作的SQL命令：

```
  -- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique not null,
  avatar_url text,
  website text,
  point INTEGER DEFAULT 0,
  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;
```

2、允许每个用户可以查看公共的个人信息资料, 仅允许用户增删改查本人的个人资料信息；

相关操作的SQL命令：

```
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
```

### 创建avatars存储桶 [*link*](#%e5%88%9b%e5%bb%baavatars%e5%ad%98%e5%82%a8%e6%a1%b6)

创建对象存储的存储桶，用来存储用户的头像图片，涉及操作包括：

1、创建一个存储桶avatars

在该应用的对象存储导航栏，点击“新建Bucket”按钮，创建存储桶avatars。

![](../../../img/样例-discuss-10.png)

2、允许每个用户可以查看、上传、更新存储桶avatars；

相关操作的SQL命令：

```
  -- Set up Storage!
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar are public accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Everyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Everyone can update an avatar."
  on storage.objects for update
  with check ( bucket_id = 'avatars' );
```

### 创建posts表 [*link*](#%e5%88%9b%e5%bb%baposts%e8%a1%a8)

你可以在MemFire Cloud的Discussbase\_db的SQL编辑器运行如下SQL语法，涉及操作包括：

1、 创建posts表，开启posts的RLS数据安全访问规则；

其中posts表字段user\_id和public.profiles表中的id外键关联。

```
  CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id uuid not null,
  title text not null,
  body text not null,
  slug text not null,
  tag text not null,
  vote INTEGER DEFAULT 0,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES profiles(id)
      ON DELETE SET NULL
);

alter table posts enable row level security;
```

2、允许每个用户增删改查帖子；允许所有的用户都可以查看全部的帖子；

相关操作的SQL命令：

```
create policy "Individuals can create posts." on posts for
    insert with check (auth.uid() = user_id);

create policy "Individuals can update their own posts." on posts for
    update using (auth.uid() = user_id);

create policy "Individuals can delete their own posts." on posts for
    delete using (auth.uid() = user_id);

create policy "Posts are public." on posts for
    select using (true);
```

### 创建replies表 [*link*](#%e5%88%9b%e5%bb%bareplies%e8%a1%a8)

你可以在MemFire Cloud的Discussbase\_db的SQL编辑器运行如下SQL语法，涉及操作包括：

1、创建replies表；开启replies的RLS数据安全访问规则；

其中replies表字段user\_id和public.profiles表中的id外键关联。

其中replies表字段post\_id和public.posts表中的id外键关联。

相关操作的SQL命令：

```
  CREATE TABLE replies (
  id SERIAL PRIMARY KEY,
  body text,
  user_id uuid not null,
  post_id int8,
  vote INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_post
      FOREIGN KEY(post_id) 
      REFERENCES posts(id)
      ON DELETE SET NULL,
        CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES profiles(id)
      ON DELETE SET NULL
);

alter table replies enable row level security;
```

2、允许每个用户增删改查回复信息；允许所有的用户都可以查看全部的帖子回复信息；

相关操作的SQL命令：

```
create policy "Individuals can create replies." on replies for
    insert with check (auth.uid() = user_id);

create policy "Individuals can update their own replies." on replies for
    update using (auth.uid() = user_id);

create policy "Individuals can delete their own replies." on replies for
    delete using (auth.uid() = user_id);

create policy "replies are public." on replies for
    select using (true);
```

## 运行程序 [*link*](#%e8%bf%90%e8%a1%8c%e7%a8%8b%e5%ba%8f)

```
  node -v  #v16.15.1
npm config set registry https://registry.npm.taobao.org
npm install
npm run dev
```

在浏览器中打开链接，即可查看如下页面。

![](../../../img/样例-discuss-28.png)

认证设置，使用本地的IP地址来替换认证设置中的网址。

![](../../../img/样例-discuss-29.png)

点击登录页面，如下图所示，输入注册邮箱，应用会发送确认注册邮件。登录注册邮箱后，打开最新收到的确认注册邮件，点击链接，完成注册操作，即可登录论坛。

![](../../../img/样例-discuss-30.png)

登录论坛后，完成个人资料的填写后，即可点击“新增+”，来发布不同类型的帖子。

![](../../../img/样例-discuss-31.png)

---

[*navigate\_before* Posts社交网络论坛](/docs/app/example/web/postsforum/)

[实时游戏场 *navigate\_next*](/docs/app/example/web/playground/)