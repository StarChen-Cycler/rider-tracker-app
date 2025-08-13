# textSearch() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/filter/textsearch/
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# textSearch()

textSearch()作用是找到所有在指定列上的 tsvector 值与给定的 to\_tsquery 查询条件匹配的记录。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (文本搜索) [*link*](#%e6%a1%88%e4%be%8b1-%e6%96%87%e6%9c%ac%e6%90%9c%e7%b4%a2)

```
final data = await supabase
  .from('quotes')
  .select('catchphrase')
  .textSearch('catchphrase', "'fat' & 'cat'",
    config: 'english'
  );
```

### 案例2 (基本归一化) [*link*](#%e6%a1%88%e4%be%8b2-%e5%9f%ba%e6%9c%ac%e5%bd%92%e4%b8%80%e5%8c%96)

```
final data = await supabase
  .from('quotes')
  .select('catchphrase')
  .textSearch('catchphrase', "'fat' & 'cat'",
    type: TextSearchType.plain,
    config: 'english'
  );
```

使用 PostgreSQL 的 `plainto_tsquery` 函数。

### 案例3 (全面归一化) [*link*](#%e6%a1%88%e4%be%8b3-%e5%85%a8%e9%9d%a2%e5%bd%92%e4%b8%80%e5%8c%96)

```
final data = await supabase
  .from('quotes')
  .select('catchphrase')
  .textSearch('catchphrase', "'fat' & 'cat'",
    type: TextSearchType.phrase,
    config: 'english'
  );
```

使用 PostgreSQL 的 `plainto_tsquery` 函数。

### 案例4 (Websearch) [*link*](#%e6%a1%88%e4%be%8b4-websearch)

```
final data = await supabase
  .from('quotes')
  .select('catchphrase')
  .textSearch('catchphrase', "'fat or cat'",
    type: TextSearchType.websearch,
    config: 'english'
  );
```

使用PostgreSQL的websearch\_to\_tsquery函数。 这个函数不会引发语法错误，这使得使用用户提供的原始输入进行搜索成为可能，并且可以使用 与高级运算符一起使用。

* `未加引号的文本`：不在引号内的文本将被转换为由&运算符分隔的术语，就像由plainto\_tsquery处理一样。
* `带引号的文本`：带引号的文本将被转换为由<->运算符分隔的术语，就像由phraseto\_tsquery处理的那样。
* `OR`:“or”字将被转换为 | 操作符。
* `—`：破折号将被转换为操作符！。

---

[*navigate\_before* overlaps()](/docs/app/sdkdocs/dart/database/filter/overlaps/)

[match() *navigate\_next*](/docs/app/sdkdocs/dart/database/filter/match/)