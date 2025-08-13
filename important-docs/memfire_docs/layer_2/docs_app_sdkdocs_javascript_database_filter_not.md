# not() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/not/
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# not()

仅匹配不满足筛选条件的行。

`not()`函数要求您使用原始的PostgREST语法来表示筛选条件的值。

```
.not('id', 'in', '(5,6,7)')  // Use `()` for `in` filter
.not('arraycol', 'cs', '{"a","b"}')  // Use `cs` for `contains()`, `{}` for array values
```

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 [*link*](#%e6%a1%88%e4%be%8b1)

```
create table
  countries (id int8 primary key, name text);

insert into
  countries (id, name)
values
  (1, 'null'),
  (2, null);
```

```
const { data, error } = await supabase
.from('countries')
.select()
.not('name', 'is', null)
```

```
{
  "data": [
    {
      "id": 1,
      "name": "null"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的列
* #### 运算符（operator） [必要参数] `string类型`

  要否定进行筛选的运算符，遵循PostgREST的语法规则。
* #### 值（value） [必要参数] `任意类型`

  用来过滤的值，遵循PostgREST的语法

---

[*navigate\_before* match()](/docs/app/sdkdocs/javascript/database/filter/match/)

[or() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/or/)