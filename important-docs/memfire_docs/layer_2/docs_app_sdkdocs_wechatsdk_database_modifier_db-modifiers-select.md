# select() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/modifier/db-modifiers-select/
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

# select()

对查询结果执行SELECT。

默认情况下，`.insert()`, `.update()`, `.upsert()`, 和 `.delete()`不会返回修改过的记录。通过调用这个方法，修改过的行会返回到`data`。

```
const { data, error } = await supabase
.from('countries')
.upsert({ id: 1, name: 'Algeria' })
.select()
```

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 [*link*](#%e6%a1%88%e4%be%8b1)

```
create table
  countries (id int8 primary key, name text);

insert into
  countries (id, name)
values
  (1, 'Afghanistan');
```

```
const { data, error } = await supabase
.from('countries')
.upsert({ id: 1, name: 'Algeria' })
.select()
```

```
{
  "data": [
    {
      "id": 1,
      "name": "Algeria"
    }
  ],
  "status": 201,
  "statusText": "Created"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [可选参数] `query类型`

  要检索的列，用逗号分隔

---

[*navigate\_before* 使用修改器](/docs/app/sdkdocs/wechatsdk/database/modifier/using-modifiers/)

[order() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/modifier/order/)