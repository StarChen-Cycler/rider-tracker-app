# BBS论坛小程序 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/example/wechat/hellobbs/
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

# BBS论坛小程序

helloBBS是一个发布个人心情，查看别人发表的论坛，可以评论回复点赞的论坛小程序。论坛小程序后端服务使用了MemFire Cloud，其中使用到的MemFire Cloud功能包括：

* 云数据库：存储论坛小程序数据表的信息。
* 用户验证：论坛小程序使用MemFire Cloud提供的用户认证的API接口，快速完成用户注册登录操作。
* 即时API：创建数据表时会自动生成 API。
* 对象存储：存储用户发布帖子中的图片。

![](../../../img/样例-helloBBS-1.gif)

## 创建应用 [*link*](#%e5%88%9b%e5%bb%ba%e5%ba%94%e7%94%a8)

目的：通过创建的一个MemFire Cloud应用来获得数据库、对象存储等一系列资源，并将获得该应用专属的API访问链接和访问密钥，用户可以轻松的调用API接口与以上资源进行交互。

登录https://cloud.MemFiredb.com/auth/login， 在“我的应用”页面创建一个新应用

![](../../../img/样例-discuss-1.png)

## 创建数据表 [*link*](#%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

第一种：点击进入应用详情页面，在“数据表”页面可视化建表。

第二种：在首页的数据库管理找到该应用的数据库的"SQL查询"，用MemFire Cloud 自带的sql编辑器进行建表。

### 1.创建post\_list表 [*link*](#1%e5%88%9b%e5%bb%bapost_list%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建post\_list表。post\_list表主要记录发表的帖子的列表，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| userName | text | 用户名 |
| times | timetamptz | 创建时间 |
| content | text | 内容 |
| avatar | text | 头像资料 |
| content\_imgs | text | 发表的图片资源 |
| tag\_val | text | 帖子类型 |

建表页面配置：![](../../../img/样例-helloBBS-4.png)

sql操作如下:

```
CREATE TABLE "public"."post_list" (
  "id" SERIAL,
  "times" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-20 11:10:55.482198+08'::timestamp with time zone ,
  "userName" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "avatar" TEXT NULL,
  "content_imgs" TEXT NULL,
  "tag_val" TEXT NULL,
  CONSTRAINT "post_list_pkey" PRIMARY KEY ("id")
);
```

### 2.创建comment表 [*link*](#2%e5%88%9b%e5%bb%bacomment%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建comment表。comment表主要记录评论的数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| commentator | text | 评论者 |
| created\_at | timetamptz | 创建时间 |
| responder | text | 回复者（可空） |
| comment\_content | text | 评论内容 |
| reply\_content | text | 回复内容（可空） |
| post\_id | int8 | 帖子id |

建表页面配置：![](../../../img/样例-helloBBS-5.png)

sql操作如下

```
CREATE TABLE "public"."comment" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-20 11:22:08.683506+08'::timestamp with time zone ,
  "commentator" TEXT NOT NULL,
  "responder" TEXT NOT NULL,
  "comment_content" TEXT NOT NULL,
  "reply_content" TEXT NULL,
  "post_id" BIGINT NULL,
  "comment_id" BIGINT NULL,
  CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);
```

### 3.创建reply表 [*link*](#3%e5%88%9b%e5%bb%bareply%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建reply表，reply表主要记录回复的数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| post\_id | int8 | 帖子id |
| created\_at | timeatamptz | 创建时间 |
| commentator | text | 评论者 |
| responder | text | 回复者 |
| reply\_content | text | 回复内容 |
| comment\_id | int8 | 评论的id |

建表页面配置：![](../../../img/样例-helloBBS-6.png)

sql操作如下

```
CREATE TABLE "public"."reply" (
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-21 17:35:18.564232+08'::timestamp with time zone ,
  "reply_content" TEXT NOT NULL,
  "commentator" TEXT NOT NULL,
  "post_id" BIGINT NOT NULL,
  "id" SERIAL,
  "comment_id" BIGINT NOT NULL,
  "responder" TEXT NULL,
  CONSTRAINT "reply_pkey" PRIMARY KEY ("id")
);
```

### 4.创建like表 [*link*](#4%e5%88%9b%e5%bb%balike%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建like表，like表主要记录点赞的数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| like\_val | int8 | 点赞的个数 |
| created\_at | timeatamptz | 创建时间 |
| likers | text | 点赞的人 |
| post\_id | int8 | 帖子的id |

建表页面配置：![](../../../img/样例-helloBBS-7.png)

sql操作如下

```
CREATE TABLE "public"."like" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-20 11:25:30.462556+08'::timestamp with time zone ,
  "like_val" BIGINT NOT NULL,
  "likers" TEXT NOT NULL,
  "post_id" BIGINT NULL,
  CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);
```

### 5.创建page\_views表 [*link*](#5%e5%88%9b%e5%bb%bapage_views%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建page\_views表，page\_views表主要记录浏览量的数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| views | int8 | 浏览的次数 |
| created\_at | timeatamptz | 创建时间 |
| post\_id | int8 | 帖子的id，外键关联post\_list的id |

建表页面配置：![](../../../img/样例-helloBBS-8.png)

sql操作如下

```
CREATE TABLE "public"."page_views" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-20 17:16:09.362364+08'::timestamp with time zone ,
  "views" BIGINT NOT NULL,
  "post_id" BIGINT NULL,
  CONSTRAINT "page_views_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "page_views_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."post_list" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
```

## 创建avatar存储桶 [*link*](#%e5%88%9b%e5%bb%baavatar%e5%ad%98%e5%82%a8%e6%a1%b6)

创建对象存储的存储桶，用来存储用户发布帖子中的图片，涉及操作包括：

1.创建一个存储桶avatar

在该应用的对象存储导航栏，点击“新建Bucket”按钮，创建存储桶avatar，并选为公开。

![](../../../img/样例-helloBBS-9.png)

2.允许每个用户可以下载发布帖子里的图片

点击**配置**下的策略，选中avatar右侧的**新建策略**，选择**完全定制**如下图所示：

![](../../../img/样例-helloBBS-10.png)

选择SELECT操作，输入策略名称，点击“回看”并点击保存策略按钮

3.允许用户发布帖子时可以上传图片到存储桶；

点击**配置**下的策略，选中avatar右侧的**新建策略**，选择**完全定制**如下图所示：

![](../../../img/样例-helloBBS-12.png)

选择INSERT操作，输入策略名称，点击“回看”并点击保存策略按钮。

查看结果：

![](../../../img/样例-helloBBS-14.png)

## 注册论坛小程序 [*link*](#%e6%b3%a8%e5%86%8c%e8%ae%ba%e5%9d%9b%e5%b0%8f%e7%a8%8b%e5%ba%8f)

以上是我们在MemFire Cloud上配置的全部步骤，接下来是在微信开发者工具上操作了。

如果您还未注册过论坛小程序，请参考[官方步骤](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html#%E7%94%B3%E8%AF%B7%E5%B8%90%E5%8F%B7)注册论坛小程序(只需要通过您的邮箱注册一个论坛小程序获得一个appid,然后下载一个微信开发工具即可)

## 下载代码 [*link*](#%e4%b8%8b%e8%bd%bd%e4%bb%a3%e7%a0%81)

<https://github.com/LucaRao/helloBBS.git>

Node.js (>=14.x <=16.x) 。

## 开发环境配置 [*link*](#%e5%bc%80%e5%8f%91%e7%8e%af%e5%a2%83%e9%85%8d%e7%bd%ae)

选择目录是下载好的论坛小程序项目的目录，AppID为您在微信公众平台注册论坛小程序获得的专属appid。

![](../../../img/样例-helloBBS-15.png)

在右侧详情里面的本地设置把“使用npm模块”和“不校验合法域名”勾上。

![](../../../img/样例-helloBBS-16.png)

打开终端，在项目根目录下执行如下命令 。

```
npm init
npm install
```

![](../../../img/样例-helloBBS-17.png)

接下来，下载论坛小程序需要的MemFire Cloud的微信论坛小程序SDK。

```
npm install supabase-wechat-stable-v2
```

点击开发者工具中的菜单栏：工具 /构建 npm

![](../../../img/sdk版本.png)

这一步npm就构建完成了，我们需要的依赖也已经下载好了,根目录下会多出两个文件，如下图。

![](../../../img/样例-helloBBS-19.png)

## 获取 API密钥 [*link*](#%e8%8e%b7%e5%8f%96-api%e5%af%86%e9%92%a5)

接下来需要创建一个可以访问应用程序数据的客户端，论坛小程序使用了Supabase 微信小程序SDK包，使用他生态里提供的功能（登录、注册、增删改查等）去进行交互。创建一个可以访问微信小程序数据的客户端需要接口的地址（URL）和一个数据权限的令牌（ANON\_KEY）,我们需要去应用的概览里面去获取这两个参数然后配置到lib/supabase.ts里面去。

lib/supabase.js

```
import { createClient } from 'supabase-wechat-stable'
const url = ""
const key = ""

export const supabase = createClient(url, key)
```

回到MemFire Cloud首页，在应用/概括页面，获取服务地址以及token信息，只需要从总览中获取URL接口地址和anon的密钥。

![](../../../img/样例-discuss-3.png)

Anon（公开）密钥是客户端API密钥。它允许“匿名访问”您的数据库，直到用户登录。登录后，密钥将切换到用户自己的登录令牌。这将为数据启用行级安全性。

注意：service\_role密钥可以绕过任何安全策略完全访问您的数据。这些密钥必须保密，并且要在服务器环境中使用，绝不能在客户端或浏览器上使用。 在后续示例代码中，需要提供supabaseUrl和supabaseKey。

## 编译论坛小程序 [*link*](#%e7%bc%96%e8%af%91%e8%ae%ba%e5%9d%9b%e5%b0%8f%e7%a8%8b%e5%ba%8f)

![](../../../img/样例-helloBBS-21.png)

以上就是使用**微信小程序**和 **MemFire Cloud** 构建的一个完整论坛小程序的具体流程。一起来试试吧

---

[*navigate\_before* Super课表小程序](/docs/app/example/wechat/timetable/)

[别踩白块游戏小程序 *navigate\_next*](/docs/app/example/wechat/notclickwhite/)