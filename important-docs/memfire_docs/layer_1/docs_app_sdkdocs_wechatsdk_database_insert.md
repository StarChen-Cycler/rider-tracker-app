# Insert 数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/insert/
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

# Insert 数据

在表（table）或视图（view）执行 INSERT 操作。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （创建一个记录） [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e8%ae%b0%e5%bd%95)

```
create table
countries (id int8 primary key, name text);
```

```
const { error } = await supabase
.from('countries')
.insert({ id: 1, name: 'Denmark' })
```

```
{
"status": 201,
"statusText": "Created"
}
```

### 案例2 （创建一个记录并返回） [*link*](#%e6%a1%88%e4%be%8b2-%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e8%ae%b0%e5%bd%95%e5%b9%b6%e8%bf%94%e5%9b%9e)

```
create table
countries (id int8 primary key, name text);
```

```
const { data, error } = await supabase
.from('countries')
.insert({ id: 1, name: 'Denmark' })
.select()
```

```
{
"data": [
  {
    "id": 1,
    "name": "Denmark"
  }
],
"status": 201,
"statusText": "Created"
}
```

### 案例3 （批量创建） [*link*](#%e6%a1%88%e4%be%8b3-%e6%89%b9%e9%87%8f%e5%88%9b%e5%bb%ba)

```
create table
countries (id int8 primary key, name text);
```

```
const { error } = await supabase
.from('countries')
.insert([
  { id: 1, name: 'Nepal' },
  { id: 1, name: 'Vietnam' },
])
```

```
{
"error": {
  "code": "23505",
  "details": "Key (id)=(1) already exists.",
  "hint": null,
  "message": "duplicate key value violates unique constraint \"countries_pkey\""
},
"status": 409,
"statusText": "Conflict"
}
```

批量创建操作在单个事务中进行处理。如果其中任何一条插入失败，所有的行都不会被插入。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 值（value） [必要参数] `object类型`

  要插入的值。传递一个对象来插入单一行或一个数组来插入多行。
* #### 选项（option） [可选参数] `object类型`

  命名的参数

  ##### 特性

  + #### count [可选参数] `exact` | `planned` | `estimated`

    用来计算插入行的计数算法。

    exact:可以精确计算行数，但执行速度较慢。执行 COUNT(\*) 操作。

    planned:可以快速计算行数，但是结果可能略有偏差。使用了Postgres
    的统计数据。

    estimated:对于较小的数值使用精确计数，对于较大的数值使用计划计数。根据行数的大小决定使用精确计数或计划计数的算法。
  + #### defaultToNull [可选参数] `boolean类型`

    将缺失的字段设置为null。否则使用列的默认值。

---

[*navigate\_before* Select 查询](/docs/app/sdkdocs/wechatsdk/database/select/)

[Update 数据 *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/update/)