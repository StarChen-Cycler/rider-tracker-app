# 复制 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/setting/replication/
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

# 复制

复制是一种将数据从一个数据库复制到另一个数据库的技术。Supabase使用复制功能来提供一个实时的API。复制在以下方面很有用：

* 分散 “负载”。例如，如果你的数据库有大量的读数，你可能想把它分成两个数据库。
* 减少延时。例如，您可能希望伦敦有一个数据库为您的欧洲客户服务，而纽约有一个为美国服务。

复制是通过发布来完成的，这是一种选择将哪些变化发送到其他系统（通常是另一个Postgres数据库）的方法。发布可以在仪表板中管理，也可以用SQL来管理。

## 在仪表板中管理发布 [*link*](#%e5%9c%a8%e4%bb%aa%e8%a1%a8%e6%9d%bf%e4%b8%ad%e7%ae%a1%e7%90%86%e5%8f%91%e5%b8%83)

1. 进入仪表板中的**数据库**页面。
2. 点击侧边栏中的**复制**。
3. 通过切换**插入**、**更新**和**删除**来控制哪些数据库事件被发送。
4. 通过选择**源**和切换每个表来控制哪些表被发送变化。

[

](../../../../videos/api/api-realtime.mp4)

## 创建一个发布 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e5%8f%91%e5%b8%83)

这个发布包含对所有表格的修改

```
create publication publication_name
for all tables;
```

## 创建发布以侦听各个表 [*link*](#%e5%88%9b%e5%bb%ba%e5%8f%91%e5%b8%83%e4%bb%a5%e4%be%a6%e5%90%ac%e5%90%84%e4%b8%aa%e8%a1%a8)

```
create publication publication_name
for table table_one, table_two;
```

## 添加表到现有发布中 [*link*](#%e6%b7%bb%e5%8a%a0%e8%a1%a8%e5%88%b0%e7%8e%b0%e6%9c%89%e5%8f%91%e5%b8%83%e4%b8%ad)

```
alter publication publication_name
add table table_name;
```

## 监听插入操作 [*link*](#%e7%9b%91%e5%90%ac%e6%8f%92%e5%85%a5%e6%93%8d%e4%bd%9c)

```
create publication publication_name
for all tables
with (publish = 'insert');
```

## 监听更新操作 [*link*](#%e7%9b%91%e5%90%ac%e6%9b%b4%e6%96%b0%e6%93%8d%e4%bd%9c)

```
create publication publication_name
for all tables
with (publish = 'update');
```

## 监听删除操作 [*link*](#%e7%9b%91%e5%90%ac%e5%88%a0%e9%99%a4%e6%93%8d%e4%bd%9c)

```
create publication publication_name
for all tables
with (publish = 'delete');
```

## 删除一个发布 [*link*](#%e5%88%a0%e9%99%a4%e4%b8%80%e4%b8%aa%e5%8f%91%e5%b8%83)

```
drop publication if exists publication_name;
```

## 重新创建发布 [*link*](#%e9%87%8d%e6%96%b0%e5%88%9b%e5%bb%ba%e5%8f%91%e5%b8%83)

如果要重新创建发布，最好在事务中执行，以确保操作成功。

```
begin;
  -- remove the realtime publication
  drop publication if exists publication_name;

  -- re-create the publication but don't enable it for any tables
  create publication publication_name;
commit;
```

---

[*navigate\_before* 超时](/docs/app/development_guide/database/setting/timeouts/)

[Passwords *navigate\_next*](/docs/app/development_guide/database/setting/managing-passwords/)