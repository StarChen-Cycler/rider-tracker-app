# 实时协议 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/realtime/deep-dive/protocol/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

连接

# 实时协议

实时协议是一组消息格式，用于在实时客户端和服务器之间通过 WebSocket 连接进行通信。这些消息用于启动连接、更新访问令牌、接收系统状态更新以及从 Postgres 数据库接收实时更新。

## 连接 [*link*](#%e8%bf%9e%e6%8e%a5)

在初始消息中，客户端发送一条消息，指定他们想要使用的功能（广播、状态、Postgres 更改）。

```
{
   "event": "phx_join",
   "topic": string,
   "payload": {
      "config": {
         "broadcast": {
            "self": boolean
         },
         "presence": {
            "key": string
         },
         "postgres_changes": [
            {
               "event": "*" | "INSERT" | "UPDATE" | "DELETE",
               "schema": string,
               "table": string,
               "filter": string + '=' + "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" +  '.' + string
            }
         ]
      }
   },
   "ref": string
}
```

info

in 筛选器的格式为 `COLUMN_NAME=in.(value1,value2,value3)`。但是，其他筛选器使用 COLUMN\_NAME=FILTER\_NAME.value 格式。

作为响应，服务器发送具有唯一 ID 的 Postgres 配置。使用此 ID，客户端应将传入的更改路由到相应的回调。

```
{
   "event": "phx_reply",
   "topic": string,
   "payload": {
      "response": {
         "postgres_changes": [
            {
               "id": number,
               "event": "*" | "INSERT" | "UPDATE" | "DELETE",
               "schema": string,
               "table": string,
               "filter": string + '=' + "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" +  '.' + string
            }
         ]
      },
      "status": "ok" | "error"
   },
   "ref": string
}
```

## 系统消息 [*link*](#%e7%b3%bb%e7%bb%9f%e6%b6%88%e6%81%af)

系统消息用于通知客户端 Postgres 订阅的状态。`payload.status`指示订阅是否成功。
payload.message 的正文可以是“订阅 PostgreSQL”或“订阅 PostgreSQL 失败”，并带有订阅参数。

```
{
   "event": "system",
   "topic": string,
   "payload":{
      "channel": string,
      "extension": "postgres_changes",
      "message": "Subscribed to PostgreSQL" | "Subscribing to PostgreSQL failed",
      "status": "ok" | "error"
   },
   "ref": null,
}
```

## 心跳 [*link*](#%e5%bf%83%e8%b7%b3)

检测信号消息应每 30 秒发送一次，以避免连接超时。

```
{
   "event": "heartbeat",
   "topic": "phoenix",
   "payload": {},
   "ref": string
}
```

## 访问令牌 [*link*](#%e8%ae%bf%e9%97%ae%e4%bb%a4%e7%89%8c)

若要更新访问令牌，需要向服务器发送一条消息，在payload.access\_token值中指定新令牌。

```
{
   "event": "access_token",
   "topic": string,
   "payload":{
      "access_token": string
   },
   "ref": string
}
```

## Postgres CDC 消息 [*link*](#postgres-cdc-%e6%b6%88%e6%81%af)

Realtime 发送具有以下结构的消息

```
{
   "event": "postgres_changes",
   "topic": string,
   "payload": {
      "data": {
         "columns": Array<{name: string, type: string}>,
         "commit_timestamp": string,
         "errors": null | string,
         "old_record": {"id": number | string},
         "record": {[key: string]: boolean | number | string | null},
         "type": "*" | "INSERT" | "UPDATE" | "DELETE",
         "schema": string,
         "table": string
      },
      "ids": Array<number>
   },
   "ref": null
}
```

## 广播消息 [*link*](#%e5%b9%bf%e6%92%ad%e6%b6%88%e6%81%af)

广播事件的结构

```
{
   "event": "broadcast",
   "topic": string,
   "payload": {
      "event": string,
      "payload": {[key: string]: boolean | number | string | null | undefined},
      "type": "broadcast"
   },
   "ref": null
}
```

## 状态消息 [*link*](#%e7%8a%b6%e6%80%81%e6%b6%88%e6%81%af)

状态事件允许客户端实时监控其他客户端的联机状态。

### 状态更新 [*link*](#%e7%8a%b6%e6%80%81%e6%9b%b4%e6%96%b0)

加入后，服务器会向客户端发送一条包含状态信息的`presence_state`消息。payload 字段包含 UUID 格式的密钥，其中每个密钥表示一个客户端，其值是一个 JSON 对象，其中包含有关该客户端的信息。

```
{
   "event": "presence_state",
   "topic": string,
   "payload": {
      [key: string]: {metas: Array<{phx_ref: string, name: string, t: float}>}
   },
   "ref": null
}
```

### 差异更新 [*link*](#%e5%b7%ae%e5%bc%82%e6%9b%b4%e6%96%b0)

更改状态（例如客户端加入或离开）后，服务器会发送一条presence\_diff消息以更新客户端的状态视图。payload 字段包含两个键，即 `join` 和 `leaves`，它们分别表示已加入和离开的客户端。与每个键关联的值是客户端的 UUID。

```
{
   "event": "presence_diff",
   "topic": string,
   "payload": {
      "joins": {metas: Array<{phx_ref: string, name: string, t: float}>},
      "leaves": {metas: Array<{phx_ref: string, name: string, t: float}>}
   },
   "ref": null
}
```

---

[*navigate\_before* 自带数据库](/docs/app/development_guide/realtime/deep-dive/bring-your-own-database/)

[实时配额 *navigate\_next*](/docs/app/development_guide/realtime/deep-dive/quotas/)