# maybeSingle() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/modifier/maybesingle/
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

# maybeSingle()

将`数据(data)`作为单个对象返回，而不是返回一个对象数组。

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
.eq('name', 'Singapore')
.maybeSingle()
```

```
{
"status": 200,
"statusText": "OK"
}
```

---

[*navigate\_before* single()](/docs/app/sdkdocs/wechatsdk/database/modifier/single/)

[csv() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/modifier/db-csv/)