# eq() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/eq/
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

# eq()

eq()用于匹配`列`值等于`指定值`的行。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 [*link*](#%e6%a1%88%e4%be%8b1)

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
  .eq('name', 'Albania')
```

```
{
  "data": [
    {
      "id": 2,
      "name": "Albania"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

要检查`column`的值是否为NULL，你应该使用`.is()`来代替。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的列
* #### 值（value） [必要参数] `任意类型`

  用来过滤的值

---

[*navigate\_before* 使用过滤器](/docs/app/sdkdocs/javascript/database/filter/using-filters/)

[neq() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/neq/)