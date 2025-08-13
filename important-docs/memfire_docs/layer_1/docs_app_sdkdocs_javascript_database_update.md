# Update 数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/update/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# Update 数据

在表（table）或视图（view）执行 UPDATE 更新数据操作。

* `update()` 应该始终与筛选器 (Filters) 结合使用，以便定位您希望更新的项目。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （更新数据） [*link*](#%e6%a1%88%e4%be%8b1-%e6%9b%b4%e6%96%b0%e6%95%b0%e6%8d%ae)

```
create table
countries (id int8 primary key, name text);

insert into
countries (id, name)
values
(1, 'Taiwan');
```

```
const { error } = await supabase
.from('countries')
.update({ name: 'Australia' })
.eq('id', 1)
```

```
{
"status": 204,
"statusText": "No Content"
}
```

### 案例2 （更新一个记录并返回） [*link*](#%e6%a1%88%e4%be%8b2-%e6%9b%b4%e6%96%b0%e4%b8%80%e4%b8%aa%e8%ae%b0%e5%bd%95%e5%b9%b6%e8%bf%94%e5%9b%9e)

```
create table
countries (id int8 primary key, name text);

insert into
countries (id, name)
values
(1, 'Singapore');
```

```
const { data, error } = await supabase
.from('countries')
.update({ name: 'Australia' })
.eq('id', 1)
.select()
```

```
{
"data": [
  {
    "id": 1,
    "name": "Australia"
  }
],
"status": 200,
"statusText": "OK"
}
```

### 案例3 （更新JSON数据） [*link*](#%e6%a1%88%e4%be%8b3-%e6%9b%b4%e6%96%b0json%e6%95%b0%e6%8d%ae)

```
create table
users (
  id int8 primary key,
  name text,
  address jsonb
);

insert into
users (id, name, address)
values
(1, 'Michael', '{ "postcode": 90210 }');
```

```
const { data, error } = await supabase
.from('users')
.update({
  address: {
    street: 'Melrose Place',
    postcode: 90210
  }
})
.eq('address->postcode', 90210)
.select()
```

```
{
"data": [
  {
    "id": 1,
    "name": "Michael",
    "address": {
      "street": "Melrose Place",
      "postcode": 90210
    }
  }
],
"status": 200,
"statusText": "OK"
}
```

Postgres 提供了一些用于处理 JSON 数据的操作符。目前，只有更新整个 JSON 文档的功能。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 值（value） [必要参数] `行类型`

  要更新的值
* #### 选项（option） [可选参数] `object类型`

  命名的参数

  ##### 特性

  + #### count [可选参数] `exact` | `planned` | `estimated`

    用来计算更新行的计数算法。

    exact:可以精确计算行数，但执行速度较慢。执行 “COUNT(\*)“操作。

    planned:可以快速计算行数，但是结果可能略有偏差。使用了Postgres的统计数据。

    estimated:对于较小的数值使用精确计数，对于较大的数值使用计划计数。根据行数的大小决定使用精确计数或计划计数的算法。

---

[*navigate\_before* Insert 数据](/docs/app/sdkdocs/javascript/database/insert/)

[Upsert 数据 *navigate\_next*](/docs/app/sdkdocs/javascript/database/upsert/)