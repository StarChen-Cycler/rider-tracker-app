# 别踩白块游戏小程序 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/example/wechat/notclickwhite/
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

# 别踩白块游戏小程序

“踩白块会输”是一个简单的微信小程序游戏，灵感来自当年火热的别踩白块游戏，程序内分成三个模块：手残模式、经典模式和极速模式，分别对应由易到难的三种玩法，可以查看游戏排名。动画效果采用JS实现，小程序后端服务使用了MemFire Cloud，其中使用到的MemFire Cloud功能包括：

* 云数据库：存储小程序数据表的信息。
* 用户验证：小程序使用MemFire Cloud提供的用户认证的API接口，快速完成用户注册登录操作。
* 即时API：创建数据表时会自动生成 API。

![](../../../img/样例-notClickWhite-1.gif)

## 创建应用 [*link*](#%e5%88%9b%e5%bb%ba%e5%ba%94%e7%94%a8)

目的：通过创建的一个MemFire Cloud应用来获得数据库、对象存储等一系列资源，并将获得该应用专属的API访问链接和访问密钥，用户可以轻松的调用API接口与以上资源进行交互。

登录https://cloud.MemFiredb.com/auth/login， 在“我的应用”页面创建一个新应用

![](../../../img/样例-discuss-1.png)

## 创建数据表 [*link*](#%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

点击进入应用详情页面，在“数据表”页面可视化建表。

### 1.创建gamer表 [*link*](#1%e5%88%9b%e5%bb%bagamer%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建gamer表。gamer表主要记录游戏玩家信息和各个游戏模式的最高分信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| user\_name | text | 用户名（唯一） |
| created\_at | timetamptz | 创建时间 |
| get\_started\_highscore | int8 | 手残模式最高分数（可空） |
| classic\_highscore | int8 | 经典模式最高分数（可空） |
| extreme\_speed\_highscore | int8 | 极速模式最高分数（可空） |

建表页面配置：![](../../../img/样例-notClickWhite-3.png)

sql操作如下:

```
CREATE TABLE "public"."gamer" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-16 15:23:36.89768+08'::timestamp with time zone ,
  "user_name" TEXT NOT NULL,
  "get_started_highscore" BIGINT NULL,
  "classic_highscore" BIGINT NULL,
  "extreme_speed_highscore" BIGINT NULL,
  CONSTRAINT "gamer_pkey" PRIMARY KEY ("id")
);
```

### 2.创建get\_started表 [*link*](#2%e5%88%9b%e5%bb%baget_started%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建get\_started表。get\_started表主要记录手残模式的游戏记录数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| user\_name | text | 用户名 |
| created\_at | timeatamptz | 创建时间 |
| score | int8 | 游戏分数 |

建表页面配置：![](../../../img/样例-notClickWhite-4.png)

sql操作如下

```
CREATE TABLE "public"."get_started" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-16 14:58:11.998301+08'::timestamp with time zone ,
  "user_name" TEXT NOT NULL,
  "score" BIGINT NOT NULL,
  CONSTRAINT "get_started_pkey" PRIMARY KEY ("id")
);
```

### 3.创建classic表 [*link*](#3%e5%88%9b%e5%bb%baclassic%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建classic表。classic表主要记录经典模式游戏的数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| user\_name | text | 用户名 |
| created\_at | timeatamptz | 创建时间 |
| score | int8 | 游戏分数 |

建表页面配置：![](../../../img/样例-notClickWhite-5.png)

sql操作如下

```
CREATE TABLE "public"."classic" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-16 14:59:40.159136+08'::timestamp with time zone ,
  "user_name" TEXT NOT NULL,
  "score" BIGINT NOT NULL,
  CONSTRAINT "classic_pkey" PRIMARY KEY ("id")
);
```

### 4.创建extreme\_speed表 [*link*](#4%e5%88%9b%e5%bb%baextreme_speed%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建extreme\_speed表，extreme\_speed表主要记录极速模式游戏数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| user\_name | text | 用户名 |
| created\_at | timeatamptz | 创建时间 |
| score | int8 | 游戏分数 |

建表页面配置：![](../../../img/样例-notClickWhite-6.png)

sql操作如下

```
CREATE TABLE "public"."extreme_speed" (
  "id" SERIAL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2022-09-16 15:01:07.838302+08'::timestamp with time zone ,
  "user_name" TEXT NOT NULL,
  "score" BIGINT NOT NULL,
  CONSTRAINT "extreme_speed_pkey" PRIMARY KEY ("id")
);
```

## 注册小程序 [*link*](#%e6%b3%a8%e5%86%8c%e5%b0%8f%e7%a8%8b%e5%ba%8f)

以上是我们在MemFire Cloud上配置的全部步骤，接下来是在微信开发者工具上操作了。

如果您还未注册过小程序，请参考[官方步骤](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html#%E7%94%B3%E8%AF%B7%E5%B8%90%E5%8F%B7)注册小程序(只需要通过您的邮箱注册一个小程序获得一个appid,然后下载一个微信开发工具即可)

## 下载代码 [*link*](#%e4%b8%8b%e8%bd%bd%e4%bb%a3%e7%a0%81)

模板代码：git@github.com:LucaRao/Don-t-step-on-the-white-demo.git

完整代码：https://github.com/LucaRao/Don-t-step-on-the-white.git

Node.js (>=14.x <=16.x) 。

## 开发环境配置 [*link*](#%e5%bc%80%e5%8f%91%e7%8e%af%e5%a2%83%e9%85%8d%e7%bd%ae)

选择目录是下载好的小程序项目的目录，AppID为您在微信公众平台注册小程序获得的专属appid。

![](../../../img/样例-notClickWhite-7.png)

## 构建npm [*link*](#%e6%9e%84%e5%bb%banpm)

在右侧详情里面的本地设置把“使用npm模块”和“不校验合法域名”勾上。

![](../../../img/样例-notClickWhite-8.png)

打开终端，在项目根目录下执行如下命令 。

```
npm init
npm install
```

![](../../../img/样例-notClickWhite-9.png)

接下来，下载小程序需要的MemFire Cloud的微信小程序SDK。

```
npm install supabase-wechat-stable-v2
```

点击开发者工具中的菜单栏：工具 /构建 npm

![](../../../img/sdk版本.png)

这一步npm就构建完成了，我们需要的依赖也已经下载好了,根目录下会多出两个文件，如下图。

![](../../../img/样例-notClickWhite-11.png)

## 获取 API密钥 [*link*](#%e8%8e%b7%e5%8f%96-api%e5%af%86%e9%92%a5)

接下来需要创建一个可以访问应用程序数据的客户端，小程序使用了Supabase 微信小程序SDK包，使用他生态里提供的功能（登录、注册、增删改查等）去进行交互。创建一个可以访问微信小程序数据的客户端需要接口的地址（URL）和一个数据权限的令牌（ANON\_KEY）,我们需要去应用的概览里面去获取这两个参数然后配置到lib/supabase.ts里面去。

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

## 编译小程序 [*link*](#%e7%bc%96%e8%af%91%e5%b0%8f%e7%a8%8b%e5%ba%8f)

先进行小程序注册，注册完成后就可以畅玩游戏并保存游戏数据，查看比赛排名

![](../../../img/样例-notClickWhite-13.png)

## 请扫码体验 [*link*](#%e8%af%b7%e6%89%ab%e7%a0%81%e4%bd%93%e9%aa%8c)

![](../../../img/样例-notClickWhite-14.png)

---

[*navigate\_before* BBS论坛小程序](/docs/app/example/wechat/hellobbs/)

[微信小程序聊天室 *navigate\_next*](/docs/app/example/wechat/wechatroom/)