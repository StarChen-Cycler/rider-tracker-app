# 查询优化 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/setting/query-optimization/
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

# 查询优化

使用 Postgres 或任何关系数据库时，索引是提高查询性能的关键。将索引与常见查询模式对齐可以将数据检索速度提高一个数量级。

本指南旨在：

* 帮助识别查询中可能通过索引改进的部分
* 引入工具以帮助识别有用的索引

这不是一个全面的资源，而是优化之旅的有用起点。

如果您不熟悉查询优化，可能会对 [`index_advisor`](/docs/app/development_guide/database/extensions/index_advisor/) 感兴趣，这是我们用于自动检测可提高给定查询性能的索引的工具。

## 示例查询 [*link*](#%e7%a4%ba%e4%be%8b%e6%9f%a5%e8%af%a2)

请考虑以下示例查询，该查询从两个表中检索客户名称和购买日期：

```
select
  a.name,
  b.date_of_purchase
from
  customers a
  join orders b
    on a.id = b.customer_id
where
  a.sign_up_date > '2023-01-01'
  and b.status = 'shipped'
order by
  b.date_of_purchase;
limit 10
```

在此查询中，索引可能有助于优化性能的几个部分：

### `where` 子句: [*link*](#where-%e5%ad%90%e5%8f%a5)

`where` 子句根据某些条件筛选行，对所涉及的列编制索引可以改进此过程：

* `a.sign_up_date`: 如果按`sign_up_date`筛选很常见，则索引此列可以加快查询速度。
* `b.status`: 如果列具有不同的值，则对状态进行索引可能会有所帮助。

```
create index idx_customers_sign_up_date on customers (sign_up_date);

create index idx_orders_status on orders (status);
```

### 联接列 [*link*](#%e8%81%94%e6%8e%a5%e5%88%97)

用于联接表的列的索引可以帮助 Postgres 避免在连接表时扫描整个表。

* 索引和`b.customer_id`可能会提高此查询中联接的性能。
* 请注意，如果 `a.id` 是 `customers` 表的主键，则该表已编制索引

```
create index idx_orders_customer_id on orders (customer_id);
```

### `order by` Clause [*link*](#order-by-clause)

还可以通过索引来优化排序：

* `b.date_of_purchase`索引可以改进排序过程，当使用限制子句返回行的子集时，该索引特别有用。

```
create index idx_orders_date_of_purchase on orders (date_of_purchase);
```

## 关键概念 [*link*](#%e5%85%b3%e9%94%ae%e6%a6%82%e5%bf%b5)

以下是一些需要牢记的概念和工具，可帮助您确定作业的最佳索引，并衡量索引的影响：

### 分析查询计划 [*link*](#%e5%88%86%e6%9e%90%e6%9f%a5%e8%af%a2%e8%ae%a1%e5%88%92)

使用 `explain` 命令了解查询的执行情况。寻找速度较慢的部件，例如顺序扫描或高成本数字。如果创建索引不能降低查询计划的成本，请将其删除。

例如:

```
explain select * from customers where sign_up_date > 25;
```

### 使用适当的索引类型 [*link*](#%e4%bd%bf%e7%94%a8%e9%80%82%e5%bd%93%e7%9a%84%e7%b4%a2%e5%bc%95%e7%b1%bb%e5%9e%8b)

Postgres 提供各种索引类型，如 [B-tree, Hash, GIN, etc](https://www.postgresql.org/docs/current/indexes-types.html) 等。选择最适合您的数据和查询模式的类型。使用正确的索引类型可以产生重大影响。例如，对始终增加且位于不经常更新的表中的字段（如订单表上的`created_at`）使用 `BRIN` 索引通常会导致索引比等效的默认 B 树索引小 +10 倍。这意味着更好的可扩展性。

```
create index idx_orders_created_at ON customers using brin(created_at);
```

### 部分索引 [*link*](#%e9%83%a8%e5%88%86%e7%b4%a2%e5%bc%95)

对于经常以数据子集为目标的查询，部分索引可能比为整个列编制索引更快、更小。部分索引包含一个 `where` 子句，用于筛选索引中包含的值。请注意，查询的 where 子句必须与索引匹配才能使用。

```
create index idx_orders_status on orders (status)
where status = 'shipped';
```

### Composite indexes [*link*](#composite-indexes)

如果对多个列进行筛选或联接，则复合索引会阻止 Postgres 在标识相关行时引用多个索引。

```
create index idx_customers_sign_up_date_priority on customers (sign_up_date, priority);
```

### Over-Indexing [*link*](#over-indexing)

避免对不经常操作的列编制索引的冲动。虽然索引可以加快读取速度，但它们也会减慢写入速度，因此在做出索引决策时平衡这些因素非常重要。

### 统计学 [*link*](#%e7%bb%9f%e8%ae%a1%e5%ad%a6)

Postgres 维护一组有关表内容的统计信息。查询规划器使用这些统计信息来决定何时使用索引与扫描整个表更有效。如果收集的统计信息与实际情况相差太远，查询规划器可能会做出错误的决策。为了避免这种风险，您可以定期分析表。

```
analyze customers;
```

---

通过遵循本指南，您将能够辨别索引可以在哪些方面优化查询并增强 Postgres 性能。请记住，每个数据库都是唯一的，因此请始终考虑查询的特定上下文和用例。

---

[*navigate\_before* 时区](/docs/app/development_guide/database/setting/managing-timezones/)

[Airtable *navigate\_next*](/docs/app/development_guide/database/wrappers/airtable/)