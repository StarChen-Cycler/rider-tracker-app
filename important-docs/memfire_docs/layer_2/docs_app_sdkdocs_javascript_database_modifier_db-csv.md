# csv() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/modifier/db-csv/
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

# csv()

以 CSV 格式将`数据（data）`作为字符串返回。

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
.csv()
```

```
{
"data": "id,name\n1,Afghanistan\n2,Albania\n3,Algeria",
"status": 200,
"statusText": "OK"
}
```

默认情况下，数据以 JSON 格式返回，但也可以选择返回 CSV 格式。

---

[*navigate\_before* maybeSingle()](/docs/app/sdkdocs/javascript/database/modifier/maybesingle/)

[returns() *navigate\_next*](/docs/app/sdkdocs/javascript/database/modifier/db-returns/)