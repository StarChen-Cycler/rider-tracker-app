# match() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/filter/match/
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

# match()

仅匹配每个`查询(query)`键中的列与其关联值相等的行。相当于多个 `.eq()` 的简写。

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
.match({ id: 2, name: 'Albania' })
```

```
{
  "data": [
    {
      "name": "Albania"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 查询（query） [必要参数] `Record类型`

  用于筛选的对象，其中列名作为键映射到它们的筛选值。

---

[*navigate\_before* textSearch()](/docs/app/sdkdocs/wechatsdk/database/filter/textsearch/)

[not() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/filter/not/)