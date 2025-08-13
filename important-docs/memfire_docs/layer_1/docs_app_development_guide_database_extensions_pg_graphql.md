# pg_graphql: 为PostgreSQL提供GraphQL功能 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/pg_graphql/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

概念

# pg\_graphql: 为PostgreSQL提供GraphQL功能

## 概念 [*link*](#%e6%a6%82%e5%bf%b5)

[pg\_graphql](https://supabase.github.io/pg_graphql/) 是一款用于 与数据库进行交互的 PostgreSQL 扩展，它使用的是 [GraphQL](https://graphql.org) 而非 SQL 。

该扩展通过现有的 SQL 模式反映出一个 GraphQL 模式，并通过一个 SQL 函数 `graphql.resolve(...)` 将其公开。这使得任何能够连接到 PostgreSQL 的编程语言都可以通过 GraphQL 查询数据库，而无需额外的服务器、进程或库。

`pg_graphql` 的解析方法被设计为与 [PostgREST](https://postgrest.org/en/stable/index.html) 相互操作，PostgREST 是支持 Supabase API 的工具，通过 RPC 调用 `graphql.resolve` 函数可以安全、高效地通过 HTTP/S 公开 GraphQL API。

有关如何将 SQL 模式反映到 GraphQL 模式的更多信息，请参阅 pg\_graphql 的 [API 文档](https://supabase.github.io/pg_graphql/api/)。

## 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

### 启用扩展 [*link*](#%e5%90%af%e7%94%a8%e6%89%a9%e5%b1%95)

1. 跳转到控制台的 **数据库** 。
2. 点击侧栏中的**扩展**。
3. 搜索"pg\_graphql"并启用扩展。

{/\* prettier-ignore \*/}

```
-- Enable the "pg_graphql" extension
create extension pg_graphql;

-- Disable the "pg_graphql" extension
drop extension if exists pg_graphql;
```

尽管 SQL 代码是 `create extension`，但它的等效操作是“启用扩展”。
要禁用扩展，您可以调用 `drop extension`。

### 创建一个表 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e8%a1%a8)

```
create table "Blog"(
  id serial primary key,
  name text not null,
  description text,
);

insert into "Blog"(name)
values ('My Blog');
```

相应的 GraphQL 模式可以立即进行查询：

```
select
graphql.resolve($$
  {
    blogCollection(first: 1) {
      edges {
        node {
          id,
          name
        }
      }
    }
  }
$$);
```

返回 JSON

```
{
  "data": {
    "blogCollection": {
      "edges": [
        {
          "node": {
            "id": 1
            "name": "My Blog"
          }
        }
      ]
    }
  }
}
```

请注意， `pg_graphql` 完全支持模式自省，因此您可以连接任何 GraphQL IDE 或模式检查工具，以查看 API 中可用的完整字段和参数集合。

## API [*link*](#api)

* [graphql.resolve](https://supabase.github.io/pg_graphql/sql_interface/): 用于执行 GraphQL 查询的 SQL 函数。

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* 官方 [pg\_graphql](https://github.com/supabase/pg_graphql) 文档

---

[*navigate\_before* index-advisor: 查询优化](/docs/app/development_guide/database/extensions/index_advisor/)

[pgvector: 嵌入向量和向量相似性 *navigate\_next*](/docs/app/development_guide/database/extensions/pgvector/)