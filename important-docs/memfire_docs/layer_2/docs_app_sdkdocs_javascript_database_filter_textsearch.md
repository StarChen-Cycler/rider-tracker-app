# textSearch() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/textsearch/
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

仅适用于文本和 tsvector 列。

textSearch()作用是找到所有在指定列上的 tsvector 值与给定的 to\_tsquery 查询条件匹配的记录。

* 更多信息，请参见[Postgres全文搜索](/docs/app/development_guide/database/full-text-search)。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （文本搜索） [*link*](#%e6%a1%88%e4%be%8b1--%e6%96%87%e6%9c%ac%e6%90%9c%e7%b4%a2)

```
const { data, error } = await supabase
.from('quotes')
.select('catchphrase')
.textSearch('catchphrase', `'fat' & 'cat'`, {
  config: 'english'
})
```

### 案例2 （基本归一化） [*link*](#%e6%a1%88%e4%be%8b2--%e5%9f%ba%e6%9c%ac%e5%bd%92%e4%b8%80%e5%8c%96)

```
const { data, error } = await supabase
.from('quotes')
.select('catchphrase')
.textSearch('catchphrase', `'fat' & 'cat'`, {
  type: 'plain',
  config: 'english'
})
```

使用PostgreSQL的`plainto_tsquery`函数。

### 案例3 （全面归一化） [*link*](#%e6%a1%88%e4%be%8b3--%e5%85%a8%e9%9d%a2%e5%bd%92%e4%b8%80%e5%8c%96)

```
const { data, error } = await supabase
.from('quotes')
.select('catchphrase')
.textSearch('catchphrase', `'fat' & 'cat'`, {
  type: 'phrase',
  config: 'english'
})
```

使用PostgreSQL的`phraseto_tsquery`功能。

### 案例4 （Websearch） [*link*](#%e6%a1%88%e4%be%8b4--websearch)

```
const { data, error } = await supabase
.from('quotes')
.select('catchphrase')
.textSearch('catchphrase', `'fat or cat'`, {
  type: 'websearch',
  config: 'english'
})
```

使用PostgreSQL的websearch\_to\_tsquery函数。 这个函数不会引发语法错误，这使得使用用户提供的原始输入进行搜索成为可能，并且可以使用 与高级运算符一起使用。

* `未加引号的文本`：不在引号内的文本将被转换为由&运算符分隔的术语，就像由plainto\_tsquery处理一样。
* `带引号的文本`：带引号的文本将被转换为由<->运算符分隔的术语，就像由phraseto\_tsquery处理的那样。
* `OR`:“or”字将被转换为 | 操作符。
* `—`：破折号将被转换为操作符！。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的文本或tsvector列
* #### 查询（query） [必要参数] `string类型`

  要与之匹配的查询文本
* #### 选项（option） [可选参数] `object类型`

  命名的参数

  ##### 特性

  + #### config [可选参数] `string类型`

    要使用的文本搜索配置
  + #### type [可选参数] `plain` | `phrase` | `websearch`

    改变 “查询 “文本的解释方式

---

[*navigate\_before* overlaps()](/docs/app/sdkdocs/javascript/database/filter/overlaps/)

[match() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/match/)