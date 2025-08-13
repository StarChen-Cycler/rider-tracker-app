# http: RESTful客户端 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/http/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

快速演示

# http: RESTful客户端

`http`扩展允许你在Postgres中调用RESTful端点。

## 快速演示 [*link*](#%e5%bf%ab%e9%80%9f%e6%bc%94%e7%a4%ba)

## 概述 [*link*](#%e6%a6%82%e8%bf%b0)

让我们来介绍一些基本概念：

* REST：是REpresentational State Transfer的缩写。它是一种从外部服务请求数据的简单方法。
* RESTful APIs是接受HTTP “调用"的服务器。这些调用通常是：
  + `GET` - 只读访问一个资源。
  + `POST` - 创建一个新的资源。
  + `DELETE` - 移除一个资源。
  + `PUT` - 更新一个现有的资源或创建一个新的资源。

你可以使用`http`扩展来从Postgres进行这些网络请求。

## 用法 [*link*](#%e7%94%a8%e6%b3%95)

### 启用扩展功能 [*link*](#%e5%90%af%e7%94%a8%e6%89%a9%e5%b1%95%e5%8a%9f%e8%83%bd)

1. 进入仪表板中的**数据库**页面。
2. 点击侧边栏中的*扩展*。
3. 搜索 “http “并启用该扩展。

```
-- Example: enable the "http" extension
create extension http with schema extensions;

-- Example: disable the "http" extension
drop extension if exists http;
```

尽管SQL代码是`create extension`，但这相当于 “启用扩展”。
要禁用一个扩展，请调用`drop extension`。

好的做法是在一个单独的模式（如 `extensions`）中创建扩展，以保持你的数据库干净。

### 可用的函数 [*link*](#%e5%8f%af%e7%94%a8%e7%9a%84%e5%87%bd%e6%95%b0)

虽然主要用法是简单的`http('http_request')`，但有5个封装函数用于特定功能：

* `http_get()`
* `http_post()`
* `http_put()`
* `http_delete()`
* `http_head()`

### 返回值 [*link*](#%e8%bf%94%e5%9b%9e%e5%80%bc)

从`http`扩展中成功调用一个网络URL，会返回一个包含以下字段的记录:

* `status`: integer
* `content_type`: character varying
* `headers`: http\_header[]
* `content`: character varying. 通常情况下，你希望使用`content::jsonb`的格式将其转换为`jsonb`。

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

### 简单的“GET”示例 [*link*](#%e7%ae%80%e5%8d%95%e7%9a%84get%e7%a4%ba%e4%be%8b)

```
select
  "status", "content"::jsonb
from
  http_get('https://jsonplaceholder.typicode.com/todos/1');
```

### 简单的“POST”示例 [*link*](#%e7%ae%80%e5%8d%95%e7%9a%84post%e7%a4%ba%e4%be%8b)

```
select
  "status", "content"::jsonb
from
  http_post(
    'https://jsonplaceholder.typicode.com/posts',
    '{ "title": "foo", "body": "bar", "userId": 1 }',
    'application/json'
  );
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* 官方 [`http` GitHub库](https://github.com/pramsey/pgsql-http)

---

[*navigate\_before* 总览](/docs/app/development_guide/database/extensions/extensions/)

[pg\_cron: 作业调度 *navigate\_next*](/docs/app/development_guide/database/extensions/pgcron/)