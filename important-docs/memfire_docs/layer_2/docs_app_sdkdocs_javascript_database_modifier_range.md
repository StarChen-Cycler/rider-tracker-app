# range() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/modifier/range/
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

# range()

通过 `from`和 `to`来限制查询结果。

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
.select('name')
.range(0, 1)
```

```
{
"data": [
  {
    "name": "Afghanistan"
  },
  {
    "name": "Albania"
  }
],
"status": 200,
"statusText": "OK"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### from [必要参数] `number类型`

  用于限制结果的起始索引
* #### to [必要参数] `number类型`

  限制结果的最后一个索引
* #### 选项（option） [可选参数] `object类型`

  命名的参数

  ##### 特性

  + #### foreignTable [可选参数] `string类型`

    设置此选项以限制外键表的行数而不是当前的表

---

[*navigate\_before* limit()](/docs/app/sdkdocs/javascript/database/modifier/limit/)

[abortSignal() *navigate\_next*](/docs/app/sdkdocs/javascript/database/modifier/db-abortsignal/)