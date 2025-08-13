# 实时游戏场 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/example/web/playground/
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

# 实时游戏场

Realtime 游戏场是一个可以多人互动，鼠标位置共享并且可以实时聊天的小应用。应用的前端采用vue3框架，应用后端服务使用了MemFire Cloud，其中使用到的MemFire Cloud功能包括：

* 云数据库：存储小程序数据表的信息。
* 用户验证：小程序使用MemFire Cloud提供的用户认证的API接口，快速完成用户注册登录操作。
* 即时API：创建数据表时会自动生成 API。
* Realtime：轻松构建任何类型的实时应用程序

![](../../../img/样例-游戏场-1.gif)

## 创建应用 [*link*](#%e5%88%9b%e5%bb%ba%e5%ba%94%e7%94%a8)

目的：通过创建的一个MemFire Cloud应用来获得数据库、对象存储等一系列资源，并将获得该应用专属的API访问链接和访问密钥，用户可以轻松的调用API接口与以上资源进行交互。

登录[MemFire Cloud](https://cloud.memfiredb.com)， 在“我的应用”页面创建一个新应用

![](../../../img/样例-discuss-1.png)

## 创建数据表 [*link*](#%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

点击进入应用详情页面，在“表编辑器”页面可视化建表。

### 1.创建realtime\_user表 [*link*](#1%e5%88%9b%e5%bb%barealtime_user%e8%a1%a8)

在“SQL执行器”/“创建表”，创建realtime\_user表。realtime\_user表主要记录用户的资料，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | uuid | 主键，唯一标识ID |
| name | text | 用户名 |
| x | real | 用户光标的横坐标 |
| y | real | 用户光标的纵坐标 |
| message | text | 用户发送的消息 |
| online | boolean | 用户是否在线 |
| color | text | 用户头像颜色 |
| mobile | boolean | 是否手机在线 |
| last\_active | timestamp | 最后在线时间 |

sql建表语句

```
create table realtime_user (
  id uuid default uuid_generate_v4() primary key,
  name text,
  x real,
  y real,
  message text,
  online boolean,
  color text,
  mobile boolean,
  last_active timestamp default now()
);
```

### 2.创建realtime\_chat表 [*link*](#2%e5%88%9b%e5%bb%barealtime_chat%e8%a1%a8)

在“SQL执行器”/“创建表”，创建realtime\_chat表。realtime\_chat表主要记录聊天消息数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | uuid | 主键，唯一标识ID |
| name\_id | uuid | 用户id,关联realtime\_user的id |
| created\_at | timeatamptz | 创建时间 |
| message | text | 聊天信息 |

sql建表语句

```
create table realtime_chat (
  id uuid default uuid_generate_v4() primary key,
  name_id uuid references realtime_user on delete cascade,
  created_at timestamp default now(),
  message text
);
```

### 3.创建realtime\_playbutton表 [*link*](#3%e5%88%9b%e5%bb%barealtime_playbutton%e8%a1%a8)

在“SQL执行器”/“创建表”，创建realtime\_playbutton表。realtime\_playbutton表主要记录点击按钮的数据，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| name | text | 按钮名称，唯一，不为空 |
| count | int8 | 点击按钮次数 |

sql建表语句

```
create table realtime_playbutton (
  name text not null primary key,
  count integer
);
INSERT INTO realtime_playbutton VALUES ('love',0);
INSERT INTO realtime_playbutton VALUES ('wow',0);
INSERT INTO realtime_playbutton VALUES ('unique',0);
```

## 创建策略 [*link*](#%e5%88%9b%e5%bb%ba%e7%ad%96%e7%95%a5)

接下来，需要给realtime\_user表创建三条策略，分别是允许所有用户查询、插入、修改realtime\_user表数据。在“SQL执行器”页面，点击“新查询”按钮，新建一个SQL Query，执行以下操作：

```
alter table public.realtime_user enable row level security;

-- 启用对所有用户的查询数据访问
create policy "Enable access to all users" on public.realtime_user for
select using (true);

-- 启用对所有用户的插入数据访问
create policy "Enable insert for all users" on public.realtime_user for
insert with check (true);

-- 启用对所有用户的修改数据访问
create policy "Enable update for all users" on public.realtime_user for
update using (true) with check (true);
```

给realtime\_chat表创建两条策略，分别是允许所有用户查询、插入realtime\_chat表数据。

```
alter table public.realtime_chat enable row level security;

-- 启用对所有用户的查询数据访问
create policy "Enable access to all users" on public.realtime_chat for
select using (true);

-- 启用对所有用户的插入数据访问
create policy "Enable insert for all users" on public.realtime_chat for
insert with check (true);
```

给realtime\_playbutton表创建两条策略，分别是允许所有用户查询、插入realtime\_playbutton表数据。

```
alter table public.realtime_playbutton enable row level security;

-- 启用对所有用户的查询数据访问
create policy "Enable access to all users" on public.realtime_playbutton for
select using (true);

-- 启用对所有用户的插入数据访问
create policy "Enable update for all users" on public.realtime_playbutton for
update using (true) with check (true);
```

## 启用Realtime [*link*](#%e5%90%af%e7%94%a8realtime)

* **1.Realtime是什么？**
* Realtime是MemFire Cloud推出的服务，可以通过侦听、广播和共享来自其他客户端/数据库的更改，来创建多人互动应用。主要特性包括：
* + 侦听数据库变更：侦听数据库插入、更新、删除以及其他变更操作；
  + 保存：在各客户之间一致地存储和同步在线用户状态；
  + 广播：以低延时将任务消息数据发送到订阅同一频道的任何客户端；

**2.为什么要启用Realtime？**

本项目是一个可以多人互动、实时聊天的应用程序，传统的实时聊天应用程序需要后端将客户端发来的信息用服务器发送给聊天室中其他用户，但是只要启用Realtime的功能，Realtime就可以充当后端的角色了，他可以监听客户端对数据库的‘插入’、‘更新’、‘删除’等操作，从而在监听的函数中获取最新信息返回给客户端。

在“数据库->Replication”页面，启用Realtime，可以选择Realtime监听数据表的‘插入’、‘更新’、‘删除’、‘截断’操作，可以根据业务自身需求勾选，这里我们需要启用全部操作。点击‘1张表’按钮后，进入数据表列表，点击realtime\_user、realtime\_chat、realtime\_playbutton表的开关按钮，启用Realtime功能。

![](../../../img/样例-游戏场-3.gif)

## 开启扩展 [*link*](#%e5%bc%80%e5%90%af%e6%89%a9%e5%b1%95)

接下来，需要创建一个cron定时任务，每隔一段时间判断用户是否超过1分钟未响应，从而判断是否下线。

```
create extension if not exists pg_cron;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select
  cron.schedule(
    'make-inactive-user-offline',
    '* * * * *', -- every minute
    $$
      update public.realtime_user
        set online = false
        where online = true and now() - INTERVAL '1 min' > last_active
    $$
  );
```

## 创建函数 [*link*](#%e5%88%9b%e5%bb%ba%e5%87%bd%e6%95%b0)

接下来，需要创建一个函数，从而统计用户对聊天室的喜爱程度。

```
-- 按钮增量
create or replace function realtime_playbutton_addon(a text)
returns void as
  $$
  begin
    update public.realtime_playbutton
    set count = count + 1 where name = a;
  end;
  $$
language plpgsql;
```

## 下载代码 [*link*](#%e4%b8%8b%e8%bd%bd%e4%bb%a3%e7%a0%81)

```
git clone git@github.com:LucaRao/realtimeChat.git
```

Node.js (>=14.x <=16.x) 。

## 安装全局依赖插件 [*link*](#%e5%ae%89%e8%a3%85%e5%85%a8%e5%b1%80%e4%be%9d%e8%b5%96%e6%8f%92%e4%bb%b6)

```
yarn install
```

## 获取 API密钥 [*link*](#%e8%8e%b7%e5%8f%96-api%e5%af%86%e9%92%a5)

接下来需要创建一个可以访问应用程序数据的客户端，创建一个可以访问应用程序数据的客户端需要接口的地址（URL）和一个数据权限的令牌（ANON\_KEY）,我们需要去应用的概览里面去获取这两个参数然后配置到lib/supabase.ts里面去。

src/supabase.ts

```
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "",
  ""
)
```

回到MemFire Cloud首页，在应用/首页页面，获取服务地址以及token信息，只需要从首页中获取URL接口地址和anon的密钥。

![](../../../img/样例-discuss-3.png)

Anon（公开）密钥是客户端API密钥。它允许“匿名访问”您的数据库，直到用户登录。登录后，密钥将切换到用户自己的登录令牌。这将为数据启用行级安全性。

## 启动项目 [*link*](#%e5%90%af%e5%8a%a8%e9%a1%b9%e7%9b%ae)

```
yarn dev
```

然后打开浏览器到[http://localhost:3000](http://localhost:3000/)，你应该会看到完整的应用程序。

![](../../../img/样例-游戏场-5.png)

---

[*navigate\_before* Posts社交网络论坛](/docs/app/example/web/postsforum/)

[介绍 *navigate\_next*](/docs/db/db-introduction/)