# 全文搜索 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/full-text-search
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

Enable dark mode

Enable light mode

本页

准备工作

# 全文搜索

Postgres有内置的功能来处理 `全文搜索`查询。这就像Postgres中的一个 `搜索引擎`。

## 准备工作 [*link*](#%e5%87%86%e5%a4%87%e5%b7%a5%e4%bd%9c)

在本指南中，我们将使用以下示例数据：

| id | title | author | description |
| --- | --- | --- | --- |
| 1 | The Poky Little Puppy | Janette Sebring Lowrey | Puppy is slower than other, bigger animals. |
| 2 | The Tale of Peter Rabbit | Beatrix Potter | Rabbit eats some vegetables. |
| 3 | Tootle | Gertrude Crampton | Little toy train has big dreams. |
| 4 | Green Eggs and Ham | Dr. Seuss | Sam has changing food preferences and eats unusually colored food. |
| 5 | Harry Potter and the Goblet of Fire | J.K. Rowling | Fourth year of school starts, big drama ensues. |

```
create table books (
  id serial primary key,
  title text,
  author text,
  description text
);

insert into books (title, author, description)
values
  ('The Poky Little Puppy','Janette Sebring Lowrey','Puppy is slower than other, bigger animals.'),
  ('The Tale of Peter Rabbit','Beatrix Potter','Rabbit eats some vegetables.'),
  ('Tootle','Gertrude Crampton','Little toy train has big dreams.'),
  ('Green Eggs and Ham','Dr. Seuss','Sam has changing food preferences and eats unusually colored food.'),
  ('Harry Potter and the Goblet of Fire','J.K. Rowling','Fourth year of school starts, big drama ensues.');
```

## 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

我们在本指南中要介绍的函数是：

### `to_tsvector()` [*link*](#to-tsvector)

将你的数据转换为可搜索的 “标记”。`to_tsvector()`代表 `to text search vector`。例如：

```
select to_tsvector('green eggs and ham')

-- Returns 'egg':2 'green':1 'ham':4
```

这些令牌统称为 “文件”，Postgres可以用它来进行比较。

### `to_tsquery()` [*link*](#to-tsquery)

将查询字符串转换为 `令牌`来匹配。`to_tsquery()`代表 `to text search query`。

这个转换步骤很重要，因为我们要对关键词进行 “模糊匹配”。
例如，如果用户搜索 `eggs`，而某一列的值是 `eggs`，我们可能仍然希望返回一个匹配。

### Match: `@@` [*link*](#match)

`@@`符号是全文搜索的 “匹配 “符号。它返回`to_tsvector`结果和`to_tsquery`结果之间的任何匹配。

以下面的例子为例：

```
select *
from books
where title = 'Harry';
```

```
const { data, error } = await supabase.from('books').select().eq('title', 'Harry')
```

```
final result = await client
.from('books')
.select()
.eq('title', 'Harry')
.execute();
```

上面的等于符号（`=`）对其匹配的内容非常 `严格`。在全文搜索的情况下，我们可能想找到所有`Harry Potter`的书，所以我们可以重写上面的例子：

```
select *
from books
where to_tsvector(title) @@ to_tsquery('Harry');
```

```
const { data, error } = await supabase.from('books').select().textSearch('title', `'Harry'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('title', "'Harry'")
.execute();
```

## 基本的全文查询 [*link*](#%e5%9f%ba%e6%9c%ac%e7%9a%84%e5%85%a8%e6%96%87%e6%9f%a5%e8%af%a2)

### 查询一个单列 [*link*](#%e6%9f%a5%e8%af%a2%e4%b8%80%e4%b8%aa%e5%8d%95%e5%88%97)

查找所有 `description`中包含`big`单词的 `books`：

```
select
  *
from
  books
where
  to_tsvector(description)
  @@ to_tsquery('big');
```

```
const { data, error } = await supabase.from('books').select().textSearch('description', `'big'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('description', "'big'")
.execute();
```

| id | title | author | description |
| --- | --- | --- | --- |
| 3 | Tootle | Gertrude Crampton | Little toy train has big dreams. |
| 5 | Harry Potter and the Goblet of Fire | J.K. Rowling | Fourth year of school starts, big drama ensues. |

### 查询多列 [*link*](#%e6%9f%a5%e8%af%a2%e5%a4%9a%e5%88%97)

查找所有`description`或`title`包含`little`单词的`books`：

```
select
  *
from
  books
where
  to_tsvector(description || ' ' || title) -- concat columns, but be sure to include a space to separate them!
  @@ to_tsquery('little');
```

| id | title | author | description |
| --- | --- | --- | --- |
| 1 | The Poky Little Puppy | Janette Sebring Lowrey | Puppy is slower than other, bigger animals. |
| 3 | Tootle | Gertrude Crampton | Little toy train has big dreams. |

### 匹配所有搜索词 [*link*](#%e5%8c%b9%e9%85%8d%e6%89%80%e6%9c%89%e6%90%9c%e7%b4%a2%e8%af%8d)

为了找到所有`description`包含 `little` 和 `big`两个单词的 `books`，我们可以使用`&`符号：

```
select
  *
from
  books
where
  to_tsvector(description)
  @@ to_tsquery('little & big'); -- use & for AND in the search query
```

```
const { data, error } = await supabase
.from('books')
.select()
.textSearch('description', `'little' & 'big'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('description', "'little' & 'big'")
.execute();
```

| id | title | author | description |
| --- | --- | --- | --- |
| 3 | Tootle | Gertrude Crampton | Little toy train has big dreams. |

### 匹配任何搜索词 [*link*](#%e5%8c%b9%e9%85%8d%e4%bb%bb%e4%bd%95%e6%90%9c%e7%b4%a2%e8%af%8d)

查找所有`description`包含`little`或`big`中任何一个单词的`books`，使用`|`符号。

```
select
  *
from
  books
where
  to_tsvector(description)
  @@ to_tsquery('little | big'); -- use | for OR in the search query
```

```
const { data, error } = await supabase
.from('books')
.select()
.textSearch('description', `'little' | 'big'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('description', "'little' | 'big'")
.execute();
```

| id | title | author | description |
| --- | --- | --- | --- |
| 1 | The Poky Little Puppy | Janette Sebring Lowrey | Puppy is slower than other, bigger animals. |
| 3 | Tootle | Gertrude Crampton | Little toy train has big dreams. |

注意：搜索 `big`如何包括 `bigger`（或 `biggest`等等）的结果。

## 创建索引 [*link*](#%e5%88%9b%e5%bb%ba%e7%b4%a2%e5%bc%95)

现在我们有了全文搜索的功能，让我们来创建一个 `索引`。这将允许Postgres预先 `建立`文件，这样就不需要在我们执行查询的时候创建这些文件。这将使我们的查询速度大大加快。

### 可搜索列 [*link*](#%e5%8f%af%e6%90%9c%e7%b4%a2%e5%88%97)

我们在 `books`表内创建一个新的列`fts`来存储`title`和`description`列的可搜索索引。

我们可以使用Postgres的一个特殊功能，叫做[生成的列](https://www.postgresql.org/docs/current/ddl-generated-columns.html) 以确保当`title`和`description`列的值发生变化时，该索引会被更新。

```
alter table
  books
add column
  fts tsvector generated always as (to_tsvector('english', description || ' ' || title)) stored;

create index books_fts on books using gin (fts); -- generate the index

select id, fts
from books;
```

| id | fts |
| --- | --- |
| 1 | ‘anim’:7 ‘bigger’:6 ’littl’:10 ‘poki’:9 ‘puppi’:1,11 ‘slower’:3 |
| 2 | ’eat’:2 ‘peter’:8 ‘rabbit’:1,9 ’tale’:6 ‘veget’:4 |
| 3 | ‘big’:5 ‘dream’:6 ’littl’:1 ’tootl’:7 ’toy’:2 ’train’:3 |
| 4 | ‘chang’:3 ‘color’:9 ’eat’:7 ’egg’:12 ‘food’:4,10 ‘green’:11 ‘ham’:14 ‘prefer’:5 ‘sam’:1 ‘unus’:8 |
| 5 | ‘big’:6 ‘drama’:7 ’ensu’:8 ‘fire’:15 ‘fourth’:1 ‘goblet’:13 ‘harri’:9 ‘potter’:10 ‘school’:4 ‘start’:5 ‘year’:2 |

### 使用新列进行查询 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b0%e5%88%97%e8%bf%9b%e8%a1%8c%e6%9f%a5%e8%af%a2)

现在我们已经创建并填充了我们的索引，我们可以使用与之前相同的技术来查询：

```
select
  *
from
  books
where
  fts @@ to_tsquery('little & big');
```

```
const { data, error } = await supabase.from('books').select().textSearch('fts', `'little' & 'big'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('fts', "'little' & 'big'")
.execute();
```

| id | title | author | description | fts |
| --- | --- | --- | --- | --- |
| 3 | Tootle | Gertrude Crampton | Little toy train has big dreams. | ‘big’:5 ‘dream’:6 ’littl’:1 ’tootl’:7 ’toy’:2 ’train’:3 |

## 查询运算符 [*link*](#%e6%9f%a5%e8%af%a2%e8%bf%90%e7%ae%97%e7%ac%a6)

访问 [PostgreSQL: 文本搜索功能和操作符](https://www.postgresql.org/docs/current/functions-textsearch.html)来了解更多的查询运算符，你可以用它来做更高级的 `全文查询`，例如：

### 近似符: `<->` [*link*](#proximity)

近似符号对于搜索相隔一定 “距离 “的术语非常有用。
例如，要找到 `big dreams`这个短语，在 `big`的匹配后面紧跟着`dreams`的匹配。

```
select
  *
from
  books
where
  to_tsvector(description) @@ to_tsquery('big <-> dreams');
```

```
const { data, error } = await supabase
.from('books')
.select()
.textSearch('description', `'big' <-> 'dreams'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('description', "'big' <-> 'dreams'")
.execute();
```

我们还可以使用`<->`来查找彼此之间有一定距离的单词。例如，找到`year` 和`school`间隔2个词之间的距离。

```
select
  *
from
  books
where
  to_tsvector(description) @@ to_tsquery('year <2> school');
```

```
const { data, error } = await supabase
.from('books')
.select()
.textSearch('description', `'year' <2> 'school'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('description', "'year' <2> 'school'")
.execute();
```

### 否定: `!` [*link*](#negation)

否定符号可以用来查找不包含搜索词的短语。
例如，找到有`big`字但没有`little`字的记录：

```
select
  *
from
  books
where
  to_tsvector(description) @@ to_tsquery('big & !little');
```

```
const { data, error } = await supabase
.from('books')
.select()
.textSearch('description', `'big' & !'little'`)
```

```
final result = await client
.from('books')
.select()
.textSearch('description', "'big' & !'little'")
.execute();
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* [PostgreSQL: 文本搜索功能和操作符](https://www.postgresql.org/docs/12/functions-textsearch.html)

---

[*navigate\_before* 概述](/docs/app/development_guide/database/database/)

[数据库连接 *navigate\_next*](/docs/app/development_guide/database/connecting-to-postgres/)