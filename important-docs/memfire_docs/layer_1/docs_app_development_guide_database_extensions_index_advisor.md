# index-advisor: 查询优化 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/index_advisor/
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

# index-advisor: 查询优化

[index-advisor](https://database.dev/olirice/index_advisor)是一个 Postgres 扩展，用于推荐索引以提高查询性能。

例如:

```
select
    *
from
  index_advisor('select book.id from book where title = $1');

 startup_cost_before | startup_cost_after | total_cost_before | total_cost_after |                  index_statements                   | errors
---------------------+--------------------+-------------------+------------------+-----------------------------------------------------+--------
 0.00                | 1.17               | 25.88             | 6.40             | {"CREATE INDEX ON public.book USING btree (title)"},| {}
(1 row)
```

特征:

* 支持通用参数，例如 `$1`, `$2`
* 支持实例化视图
* 标识被视图模糊处理的表/列
* 跳过重复的索引

## 安装 [*link*](#%e5%ae%89%e8%a3%85)

index\_advisor 是受信任的语言扩展，这意味着用户可直接从 [database.dev](https://database.dev/) SQL 包存储库安装它。

首先，通过执行[安装程序SQL](https://database.dev/installer)脚本来启用 dbdev 客户端。

然后，index\_advisor通过运行

```
select dbdev.install('olirice-index_advisor');
create extension if not exists hypopg;
create extension "olirice-index_advisor";
```

## API [*link*](#api)

索引顾问公开一个函数index\_advisor（查询文本），该函数接受查询并搜索一组 SQL DDL 创建索引语句，以缩短查询的执行时间。

该函数的签名为：

```
index_advisor(query text)
returns
    table  (
        startup_cost_before jsonb,
        startup_cost_after jsonb,
        total_cost_before jsonb,
        total_cost_after jsonb,
        index_statements text[],
        errors text[]
    )
```

## 用法 [*link*](#%e7%94%a8%e6%b3%95)

作为一个最小的示例，可以为 index\_advisor 函数提供单个表查询，该查询具有对未编制索引的列的筛选器。

```
create extension if not exists index_advisor cascade;

create table book(
  id int primary key,
  title text not null
);

select
  *
from
  index_advisor('select book.id from book where title = $1');

 startup_cost_before | startup_cost_after | total_cost_before | total_cost_after |                  index_statements                   | errors
---------------------+--------------------+-------------------+------------------+-----------------------------------------------------+--------
 0.00                | 1.17               | 25.88             | 6.40             | {"CREATE INDEX ON public.book USING btree (title)"},| {}
(1 row)
```

并将返回一行，建议在未编制索引的列上建立索引。

更复杂的查询可能会生成其他建议的索引：

```
create extension if not exists index_advisor cascade;

create table author(
    id serial primary key,
    name text not null
);

create table publisher(
    id serial primary key,
    name text not null,
    corporate_address text
);

create table book(
    id serial primary key,
    author_id int not null references author(id),
    publisher_id int not null references publisher(id),
    title text
);

create table review(
    id serial primary key,
    book_id int references book(id),
    body text not null
);

select
    *
from
    index_advisor('
        select
            book.id,
            book.title,
            publisher.name as publisher_name,
            author.name as author_name,
            review.body review_body
        from
            book
            join publisher
                on book.publisher_id = publisher.id
            join author
                on book.author_id = author.id
            join review
                on book.id = review.book_id
        where
            author.id = $1
            and publisher.id = $2
    ');

 startup_cost_before | startup_cost_after | total_cost_before | total_cost_after |                  index_statements                         | errors
---------------------+--------------------+-------------------+------------------+-----------------------------------------------------------+--------
 27.26               | 12.77              | 68.48             | 42.37            | {"CREATE INDEX ON public.book USING btree (author_id)",   | {}
                                                                                    "CREATE INDEX ON public.book USING btree (publisher_id)",
                                                                                    "CREATE INDEX ON public.review USING btree (book_id)"}
(3 rows)
```

## 局限性 [*link*](#%e5%b1%80%e9%99%90%e6%80%a7)

* index\_advisor 只推荐单列 B 树索引。将来的版本将支持更复杂的索引。
* 当泛型参数的类型无法从上下文中辨别时，将在“错误”字段中返回错误。若要解决这些错误，请向参数添加显式类型转换。例如： `$1::int`.

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* dbdev [`index_advisor`](https://database.dev/olirice/index_advisor) docs

---

[*navigate\_before* pg\_cron: 作业调度](/docs/app/development_guide/database/extensions/pgcron/)

[pg\_graphql: 为PostgreSQL提供GraphQL功能 *navigate\_next*](/docs/app/development_guide/database/extensions/pg_graphql/)