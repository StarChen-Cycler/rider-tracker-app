# pgvector: 嵌入向量和向量相似性 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/pgvector/
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

# pgvector: 嵌入向量和向量相似性

[pgvector](https://github.com/pgvector/pgvector/) 是一款用于向量相似性搜索的 PostgreSQL 扩展。它还可以用于存储 [嵌入向量](https://supabase.com/blog/openai-embeddings-postgres-vector) 。

了解更多关于 Supabase 的 [AI & Vector](/docs/app/development_guide/ai/ai/) 服务的信息。

## 概念 [*link*](#%e6%a6%82%e5%bf%b5)

### 向量相似性 [*link*](#%e5%90%91%e9%87%8f%e7%9b%b8%e4%bc%bc%e6%80%a7)

向量相似性是指衡量两个相关项之间相似程度的度量方式。例如，如果你有一组产品列表，你可以使用向量相似性来寻找相似的产品。为了实现这个目标，你需要使用数学模型将每个产品转换为由数字组成的"向量"。对于文本、图像和其他类型的数据，你可以使用类似的模型。一旦所有这些向量都存储在数据库中，你就可以使用向量相似性来查找相似的项。

## 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

### 启用扩展 [*link*](#%e5%90%af%e7%94%a8%e6%89%a9%e5%b1%95)

1. 跳转控制台的 **数据库** 页面。
2. 点击侧栏中的 **扩展** 。
3. 搜索 “vector” 并启用扩展。

```
-- Example: enable the "vector" extension.
create extension vector
with
  schema extensions;

-- Example: disable the "vector" extension
drop
  extension if exists vector;
```

尽管 SQL 代码是 `create extension`，但它的等效操作是“启用扩展”。
要禁用扩展，您可以调用 `drop extension`。

### 创建一个表来存储向量 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e8%a1%a8%e6%9d%a5%e5%ad%98%e5%82%a8%e5%90%91%e9%87%8f)

```
create table posts (
  id serial primary key,
  title text not null,
  body text not null,
  embedding vector(1536)
);
```

### 存储一个向量 [*link*](#%e5%ad%98%e5%82%a8%e4%b8%80%e4%b8%aa%e5%90%91%e9%87%8f)

在这个示例中，我们将使用OpenAI API客户端生成一个向量，然后使用Supabase客户端将其存储在数据库中。

```
const title = 'First post!'
const body = 'Hello world!'

// Generate a vector using OpenAI
const embeddingResponse = await openai.createEmbedding({
  model: 'text-embedding-ada-002',
  input: body,
})

const [{ embedding }] = embeddingResponse.data.data

// Store the vector in Postgres
const { data, error } = await supabase.from('posts').insert({
  title,
  body,
  embedding,
})
```

## 更多关于pgvector和Supabase资源的信息。 [*link*](#%e6%9b%b4%e5%a4%9a%e5%85%b3%e4%ba%8epgvector%e5%92%8csupabase%e8%b5%84%e6%ba%90%e7%9a%84%e4%bf%a1%e6%81%af)

* [Supabase Clippy：用于Supabase文档的ChatGPT](https://supabase.com/blog/chatgpt-supabase-docs)
* [使用pgvector在Postgres中存储OpenAI嵌入](https://supabase.com/blog/openai-embeddings-postgres-vector)
* [使用Supabase Edge Runtime构建的ChatGPT插件模板](https://supabase.com/blog/building-chatgpt-plugins-template)
* [构建自定义ChatGPT风格文档搜索的模板](https://github.com/supabase-community/nextjs-openai-doc-search)

---

[*navigate\_before* pg\_graphql: 为PostgreSQL提供GraphQL功能](/docs/app/development_guide/database/extensions/pg_graphql/)

[pg\_net: 异步网络 *navigate\_next*](/docs/app/development_guide/database/extensions/pgnet/)