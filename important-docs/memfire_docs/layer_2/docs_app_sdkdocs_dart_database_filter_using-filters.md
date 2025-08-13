# 使用过滤器 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/filter/using-filters/
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

# 使用过滤器

过滤器允许你只返回符合某些条件的记录。

过滤器可以用于`select()`、`update()`和`delete()`查询。

如果一个数据库函数返回一个表的响应，你也可以应用过滤器。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (使用过滤器) [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8%e8%bf%87%e6%bb%a4%e5%99%a8)

```
final data = await supabase
  .from('cities')
  .select('name, country_id')
  .eq('name', 'The Shire');  // Correct

final data = await supabase
  .from('cities')
  .eq('name', 'The Shire')  // Incorrect
  .select('name, country_id');
```

过滤器必须在`select()`, `update()`、`upsert()`、`delete()`和`rpc()`之后，并在[修改器](/docs/app/SDKdocs/dartdatabase/using-modifiers)之前应用。

### 案例2 (链式过滤) [*link*](#%e6%a1%88%e4%be%8b2-%e9%93%be%e5%bc%8f%e8%bf%87%e6%bb%a4)

```
final data = await supabase
  .from('cities')
  .select('name, country_id')
  .gte('population', 1000)
  .lt('population', 10000)
```

过滤器必须在`select()`, `update()`、`upsert()`、`delete()`和`rpc()`之后，并在[修改器](/docs/app/SDKdocs/dartdatabase/using-modifiers)之前应用。

### 案例3 (条件链式) [*link*](#%e6%a1%88%e4%be%8b3-%e6%9d%a1%e4%bb%b6%e9%93%be%e5%bc%8f)

```
final filterByName = null;
final filterPopLow = 1000;
final filterPopHigh = 10000;

var query = supabase
  .from('cities')
  .select('name, country_id');

if (filterByName != null)  { query = query.eq('name', filterByName); }
if (filterPopLow != null)  { query = query.gte('population', filterPopLow); }
if (filterPopHigh != null) { query = query.lt('population', filterPopHigh); }

final data = await query;
```

过滤器可以一步步建立起来，然后执行。这个例子就可以很好地说明。

### 案例4 (按JSON列中的值过滤) [*link*](#%e6%a1%88%e4%be%8b4-%e6%8c%89json%e5%88%97%e4%b8%ad%e7%9a%84%e5%80%bc%e8%bf%87%e6%bb%a4)

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
  (1, 'Michael', '{ "postcode": 90210 }'),
  (2, 'Jane', null);
```

```
final data = await supabase
  .from('users')
  .select()
  .eq('address->postcode', 90210);
```

```
{
  "data": [
    {
      "id": 1,
      "name": "Michael",
      "address": {
        "postcode": 90210
      }
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

过滤器可以一步步建立起来，然后执行。这个例子就可以很好地说明。

### 案例5 (过滤外键表) [*link*](#%e6%a1%88%e4%be%8b5-%e8%bf%87%e6%bb%a4%e5%a4%96%e9%94%ae%e8%a1%a8)

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
  (1, 'Germany'),
  (2, 'Indonesia');
insert into
  cities (id, country_id, name)
values
  (1, 2, 'Bali'),
  (2, 1, 'Munich');
```

```
final data = await supabase
  .from('countries')
  .select('''
    name,
    cities!inner (
      name
    )
  ''')
  .eq('cities.name', 'Bali');
```

---

[*navigate\_before* 存储程序: rpc()](/docs/app/sdkdocs/dart/database/rpc/)

[eq() *navigate\_next*](/docs/app/sdkdocs/dart/database/filter/eq/)