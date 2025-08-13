# is() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/is/
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

# is()

仅匹配`列`值与`指定值`相等的行。

对于非boolean型列，这只与检查`column`的值是否为NULL有关。
`column`的值是NULL，通过设置`value`为`null`。

对于boolean型列，你也可以将`value`设置为`true`或`false`，它的行为与
它的行为与`.eq()`相同。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (检查是否为 null) [*link*](#%e6%a1%88%e4%be%8b1--%e6%a3%80%e6%9f%a5%e6%98%af%e5%90%a6%e4%b8%ba-null)

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
.is('name', null)
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

使用`eq()`筛选器在过滤`null`时不起作用。相反，您需要使用`is()`。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的列
* #### 值（value） [必要参数] `null或者boolean类型`

  用来过滤的值

---

[*navigate\_before* ilike()](/docs/app/sdkdocs/javascript/database/filter/ilike/)

[in() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/in/)