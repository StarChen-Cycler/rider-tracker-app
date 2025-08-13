# gt() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/gt/
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

# gt()

gt()用于查找所有在所述`列（column）`上的值大于指定`值（value）`的记录。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （使用select） [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8select)

```
create table
countries (id int8 primary key, name text);

insert into
countries (id, name)
values
(1, 'Afghanistan'),
(2, 'Albania'),
(3, 'Algeria');
```

```
const { data, error } = await supabase
.from('countries')
.select()
.gt('id', 2)
```

```
{
"data": [
  {
    "id": 3,
    "name": "Algeria"
  }
],
"status": 200,
"statusText": "OK"
}
```

当使用[保留字](https://www.postgresql.org/docs/current/sql-keywords-appendix.html)作为列名时，需要添加双引号，例如：`.gt('"order"', 2)`

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的列
* #### 值（value） [必要参数] `任意类型`

  用来过滤的值

---

[*navigate\_before* neq()](/docs/app/sdkdocs/javascript/database/filter/neq/)

[gte() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/gte/)