# limit() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/modifier/limit/
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

# limit()

通过`count`限制查询结果。

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
.limit(1)
```

```
{
"data": [
  {
    "name": "Afghanistan"
  }
],
"status": 200,
"statusText": "OK"
}
```

### 案例2 （在外键表中） [*link*](#%e6%a1%88%e4%be%8b2-%e5%9c%a8%e5%a4%96%e9%94%ae%e8%a1%a8%e4%b8%ad)

```
create table
countries (id int8 primary key, name text);
create table
cities (
  id int8 primary key,
  country_id int8 not null references countries,
  name text
);

insert into
countries (id, name)
values
(1, 'United States');
insert into
cities (id, country_id, name)
values
(1, 1, 'Atlanta'),
(2, 1, 'New York City');
```

```
const { data, error } = await supabase
.from('countries')
.select(`
  name,
  cities (
    name
  )
`)
.limit(1, { foreignTable: 'cities' })
```

```
{
"data": [
  {
    "name": "United States",
    "cities": [
      {
        "name": "Atlanta"
      }
    ]
  }
],
"status": 200,
"statusText": "OK"
}
```

---

[*navigate\_before* returns()](/docs/app/sdkdocs/wechatsdk/database/modifier/db-returns/)

[range() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/modifier/range/)