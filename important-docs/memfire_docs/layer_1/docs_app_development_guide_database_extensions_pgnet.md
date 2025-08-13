# pg_net: 异步网络 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/pgnet/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

用法

# pg\_net: 异步网络

info

pg\_net的API还处于beta阶段。函数签名可能会改变。

[pg\_net](https://github.com/supabase/pg_net/)是一个PostgreSQL扩展，为异步网络暴露了一个SQL接口，重点是可扩展性和用户体验。

它与`http`扩展的不同之处在于，它默认是异步的。这使得它在阻塞函数（如触发器）中很有用。

## 用法 [*link*](#%e7%94%a8%e6%b3%95)

### 启用扩展功能 [*link*](#%e5%90%af%e7%94%a8%e6%89%a9%e5%b1%95%e5%8a%9f%e8%83%bd)

1. 进入仪表板中的**数据库**页面。
2. 点击侧边栏中的*扩展*.
3. 3. 搜索 “pg\_net “并启用该扩展。

```
-- Example: enable the "pg_net" extension
create schema if not exists net;
create extension pg_net with schema net;

-- Example: disable the "plv8" extension
drop extension if exists pg_net;
drop schema net;
```

尽管SQL代码是`create extension`，但这相当于 “启用扩展”。
要禁用一个扩展，请调用`drop extension`。

程序语言会自动安装在`pg_catalog`中，所以你不需要指定模式。

## `http_get` [*link*](#http_get)

创建一个HTTP GET请求，返回该请求的ID。在事务提交之前，HTTP请求不会被启动。

### 签名 [*link*](#%e7%ad%be%e5%90%8d)

info

这是一个Postgres安全定义函数。

```
net.http_get(
    -- url for the request
    url text,
    -- key/value pairs to be url encoded and appended to the `url`
    params jsonb default '{}'::jsonb,
    -- key/values to be included in request headers
    headers jsonb default '{}'::jsonb,
    -- WARNING: this is currently ignored, so there is no timeout
    -- the maximum number of milliseconds the request may take before being cancelled
    timeout_milliseconds int default 1000
)
    -- request_id reference
    returns bigint

    strict
    volatile
    parallel safe
    language plpgsql
```

### 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

```
select net.http_get('https://news.ycombinator.com') as request_id;
request_id
----------
         1
(1 row)
```

在触发了`http_get`之后，使用[`http_get_result`](/docs/app/development_guide/database/extensions/pgnet/#http_get_result)来获取请求的结果。

## `http_post` [*link*](#http_post)

创建一个带有JSON主体的HTTP POST请求，返回请求的ID。HTTP请求在事务提交之前不会被启动。

主体的字符集编码与数据库的`server_encoding`设置一致。

### 签名 [*link*](#%e7%ad%be%e5%90%8d-1)

info

这是一个Postgres安全定义函数。

```
net.http_post(
    -- url for the request
    url text,
    -- body of the POST request
    body jsonb default '{}'::jsonb,
    -- key/value pairs to be url encoded and appended to the `url`
    params jsonb default '{}'::jsonb,
    -- key/values to be included in request headers
    headers jsonb default '{"Content-Type": "application/json"}'::jsonb,
    -- WARNING: this is currently ignored, so there is no timeout
    -- the maximum number of milliseconds the request may take before being cancelled
    timeout_milliseconds int default 1000
)
    -- request_id reference
    returns bigint

    volatile
    parallel safe
    language plpgsql
```

### 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95-1)

```
select
    net.http_post(
        url:='https://httpbin.org/post',
        body:='{"hello": "world"}'::jsonb
    ) as request_id;
request_id
----------
         1
(1 row)
```

在触发了`http_post`之后，使用[`http_get_result`](/docs/app/development_guide/database/extensions/pgnet/#http_get_result)来获得请求的结果。

## `http_collect_response` [*link*](#http_collect_response)

给出一个`request_id`参考，检索响应。

当`async:=false`被设置时，建议将[statement\_timeout](https://www.postgresql.org/docs/13/runtime-config-client.html)设置为调用者愿意等待的最大时间，以防止响应填充缓慢。

### 签名 [*link*](#%e7%ad%be%e5%90%8d-2)

info

这是一个Postgres安全定义函数。

```
net.http_collect_response(
    -- request_id reference
    request_id bigint,
    -- when `true`, return immediately. when `false` wait for the request to complete before returning
    async bool default true
)
    -- http response composite wrapped in a result type
    returns net.http_response_result

    strict
    volatile
    parallel safe
```

### 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95-2)

info

`net.http_collect_response`必须在与调用`net.http_<method>`不同的事务中。

```
select
    net.http_post(
        url:='https://httpbin.org/post',
        body:='{"hello": "world"}'::jsonb
    ) as request_id;
request_id
----------
         1
(1 row)

select * from net.http_collect_response(1, async:=false);
status  | message | response
--------+---------+----------
SUCCESS        ok   (
                      status_code := 200,
                      headers     := '{"date": ...}',
                      body        := '{"args": ...}'
                    )::net.http_response_result

select
    (response).body::json
from
    net.http_collect_response(request_id:=1);
                               body
-------------------------------------------------------------------
 {
   "args": {},
   "data": "{\"hello\": \"world\"}",
   "files": {},
   "form": {},
   "headers": {
     "Accept": "*/*",
     "Content-Length": "18",
     "Content-Type": "application/json",
     "Host": "httpbin.org",
     "User-Agent": "pg_net/0.2",
     "X-Amzn-Trace-Id": "Root=1-61031a5c-7e1afeae69bffa8614d8e48e"
   },
   "json": {
     "hello": "world"
   },
   "origin": "135.63.38.488",
   "url": "https://httpbin.org/post"
 }
(1 row)
```

其中，`response`是一个组合：

```
status_code integer
headers jsonb
body text
```

`net.http_response_result.status的可能值是`(‘PENDING’, ‘SUCCESS’, ‘ERROR’)’。

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* 源代码: [github.com/supabase/pg\_net](https://github.com/supabase/pg_net/)
* 官方文档: [supabase.github.io/pg\_net](https://supabase.github.io/pg_net/)

---

[*navigate\_before* pgvector: 嵌入向量和向量相似性](/docs/app/development_guide/database/extensions/pgvector/)

[pgTAP:单元测试 *navigate\_next*](/docs/app/development_guide/database/extensions/pgtap/)