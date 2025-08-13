# Select 查询 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/database/select/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# Select 查询

在表(table)或视图(view)上执行 SELECT 查询。

* 默认情况下，Supabase项目返回最多1,000行数据。你可以在项目的API设置中更改此设置。建议将其保持较低，以限制意外或恶意请求的负载大小。你可以使用`range()`查询来对数据进行分页处理。
* `select()`可以与过滤器(Filters)组合使用，用于过滤数据。
* `select()`可以与修饰器(Modifiers)组合使用，用于对数据进行修改。
* 如果你使用Supabase平台，`apikey`是一个保留关键字，[应避免将其用作列名](https://github.com/supabase/supabase/issues/5465)。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (获取数据) [*link*](#%e6%a1%88%e4%be%8b1-%e8%8e%b7%e5%8f%96%e6%95%b0%e6%8d%ae)

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
```

```
{
  "data": [
    {
      "id": 1,
      "name": "Afghanistan"
    },
    {
      "id": 2,
      "name": "Albania"
    },
    {
      "id": 3,
      "name": "Algeria"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

### 案例2 (选择特定列) [*link*](#%e6%a1%88%e4%be%8b2-%e9%80%89%e6%8b%a9%e7%89%b9%e5%ae%9a%e5%88%97)

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
```

```
{
  "data": [
    {
      "name": "Afghanistan"
    },
    {
      "name": "Albania"
    },
    {
      "name": "Algeria"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

### 案例3 (查询外键表) [*link*](#%e6%a1%88%e4%be%8b3-%e6%9f%a5%e8%af%a2%e5%a4%96%e9%94%ae%e8%a1%a8)

如需了解更多关于多表关联的信息，可以查阅此文档：[多表关联](/docs/app/development_guide/database/associated-query/)

如需了解更多关于数据表的信息，可以查阅此文档：[表格和数据](/docs/app/development_guide/database/tables/)

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
const { data, error } = await supabase
.from('countries')
.select(`
  name,
  cities (
    name
  )
`)
```

```
{
  "data": [
    {
      "name": "Germany",
      "cities": [
        {
          "name": "Munich"
        }
      ]
    },
    {
      "name": "Indonesia",
      "cities": [
        {
          "name": "Bali"
        }
      ]
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

如果你的数据库有外键关联，你也可以查询相关表。

### 案例4 (通过连接表查询外键表) [*link*](#%e6%a1%88%e4%be%8b4-%e9%80%9a%e8%bf%87%e8%bf%9e%e6%8e%a5%e8%a1%a8%e6%9f%a5%e8%af%a2%e5%a4%96%e9%94%ae%e8%a1%a8)

如需了解更多关于多表关联的信息，可以查阅此文档：[多表关联](/docs/app/development_guide/database/associated-query/)

如需了解更多关于数据表的信息，可以查阅此文档：[表格和数据](/docs/app/development_guide/database/tables/)

```
create table
  users (
    id int8 primary key,
    name text
  );
create table
  teams (
    id int8 primary key,
    name text
  );
-- join table
create table
  users_teams (
    user_id int8 not null references users,
    team_id int8 not null references teams,
    -- both foreign keys must be part of a composite primary key
    primary key (user_id, team_id)
  );

insert into
  users (id, name)
values
  (1, 'Kiran'),
  (2, 'Evan');
insert into
  teams (id, name)
values
  (1, 'Green'),
  (2, 'Blue');
insert into
  users_teams (user_id, team_id)
values
  (1, 1),
  (1, 2),
  (2, 2);
```

```
const { data, error } = await supabase
.from('users')
.select(`
  name,
  teams (
    name
  )
`)
```

```
{
  "data": [
    {
      "name": "Kiran",
      "teams": [
        {
          "name": "Green"
        },
        {
          "name": "Blue"
        }
      ]
    },
    {
      "name": "Evan",
      "teams": [
        {
          "name": "Blue"
        }
      ]
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

如果你的表格之间并 **非直接相关** ，而是通过一个连接表（join table）连接的情况下，你仍然可以使用`select()`方法来查询相关的数据。连接表需要将外键作为其复合主键的一部分。

### 案例5 (多次查询同一外键表) [*link*](#%e6%a1%88%e4%be%8b5-%e5%a4%9a%e6%ac%a1%e6%9f%a5%e8%af%a2%e5%90%8c%e4%b8%80%e5%a4%96%e9%94%ae%e8%a1%a8)

如需了解更多关于多表关联的信息，可以查阅此文档：[多表关联](/docs/app/development_guide/database/associated-query/)

如需了解更多关于数据表的信息，可以查阅此文档：[表格和数据](/docs/app/development_guide/database/tables/)

```
create table
users (id int8 primary key, name text);

create table
  messages (
    sender_id int8 not null references users,
    receiver_id int8 not null references users,
    content text
  );

insert into
  users (id, name)
values
  (1, 'Kiran'),
  (2, 'Evan');

insert into
  messages (sender_id, receiver_id, content)
values
  (1, 2, '👋');
```

```
const { data, error } = await supabase
.from('messages')
.select(`
  content,
  from:sender_id(name),
  to:receiver_id(name)
`)
```

```
{
  "data": [
    {
      "content": "👋",
      "from": {
        "name": "Kiran"
      },
      "to": {
        "name": "Evan"
      }
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

如果需要对同一外键表进行两次查询，可以使用连接列的名称来标识使用哪个连接。你还可以为每个列设置别名。

### 案例6 (通过外键表进行筛选) [*link*](#%e6%a1%88%e4%be%8b6-%e9%80%9a%e8%bf%87%e5%a4%96%e9%94%ae%e8%a1%a8%e8%bf%9b%e8%a1%8c%e7%ad%9b%e9%80%89)

如需了解更多关于多表关联的信息，可以查阅此文档：[多表关联](/docs/app/development_guide/database/associated-query/)

如需了解更多关于数据表的信息，可以查阅此文档：[表格和数据](/docs/app/development_guide/database/tables/)

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
const { data, error } = await supabase
.from('cities')
.select('name, countries(*)')
.eq('countries.name', 'Estonia')
```

```
{
  "data": [
    {
      "name": "Bali",
      "countries": null
    },
    {
      "name": "Munich",
      "countries": null
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

如果对外键表的列进行的过滤条件未满足，外键表将返回一个`空数组([])`或`null`，但父表不会被过滤掉。
如果您希望过滤掉父表的行，请使用`!inner`提示。

### 案例7 (使用COUNT对外键表进行查询) [*link*](#%e6%a1%88%e4%be%8b7-%e4%bd%bf%e7%94%a8count%e5%af%b9%e5%a4%96%e9%94%ae%e8%a1%a8%e8%bf%9b%e8%a1%8c%e6%9f%a5%e8%af%a2)

如需了解更多关于多表关联的信息，可以查阅此文档：[多表关联](/docs/app/development_guide/database/associated-query/)

如需了解更多关于数据表的信息，可以查阅此文档：[表格和数据](/docs/app/development_guide/database/tables/)

```
create table countries (
  "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
  "name" text
);

create table cities (
  "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,
  "name" text,
  "country_id" "uuid" references public.countries on delete cascade
);

with country as (
  insert into countries (name)
  values ('united kingdom') returning id
)
insert into cities (name, country_id) values
('London', (select id from country)),
('Manchester', (select id from country)),
('Liverpool', (select id from country)),
('Bristol', (select id from country));
```

```
const { data, error } = await supabase
.from('countries')
.select(`*, cities(count)`)
```

```
[
  {
    "id": "693694e7-d993-4360-a6d7-6294e325d9b6",
    "name": "United Kingdom",
    "cities": [
      {
        "count": 4
      }
    ]
  }
]
```

您可以通过使用 **count** 属性，您可以获取相关表中的行数

### 案例8 (使用COUNT选项进行查询) [*link*](#%e6%a1%88%e4%be%8b8-%e4%bd%bf%e7%94%a8count%e9%80%89%e9%a1%b9%e8%bf%9b%e8%a1%8c%e6%9f%a5%e8%af%a2)

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
const { count, error } = await supabase
.from('countries')
.select('*', { count: 'exact', head: true })
```

```
{
  "count": 3,
  "status": 200,
  "statusText": "OK"
}
```

您可以使用 **count** 选项来获取行数。

### 案例9 (查询JSON数据) [*link*](#%e6%a1%88%e4%be%8b9-%e6%9f%a5%e8%af%a2json%e6%95%b0%e6%8d%ae)

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
  (1, 'Avdotya', '{"city":"Saint Petersburg"}');
```

```
const { data, error } = await supabase
.from('users')
.select(`
  id, name,
  address->city
`)
```

```
{
  "data": [
    {
      "id": 1,
      "name": "Avdotya",
      "city": "Saint Petersburg"
    }
  ],
  "status": 200,
  "statusText": "OK"
}
```

您可以在 JSON 列内选择和过滤数据。Postgres 提供了一些用于查询 JSON 数据的操作符。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [可选参数] `query类型`

  要检索的列，用逗号分隔
* #### 选项（option） [必要参数] `object类型`

  命名的参数

  ##### 特性

  + #### count [可选参数] `exact` | `planned` | `estimated`

    用来计算表格或视图中的行数的算法。

    exact:可以精确计算行数，但执行速度较慢。执行 COUNT(\*) 操作。

    planned:可以快速计算行数，但是结果可能略有偏差。使用了Postgres
    的统计数据。

    estimated:对于较小的数值使用精确计数，对于较大的数值使用计划计数。根据行数的大小决定使用精确计数或计划计数的算法。
  + #### head [可选参数] `boolean类型`

    当设置为 true时，data将不被返回。
    如果你只需要计数，则很有用。

---

[*navigate\_before* 版本说明](/docs/app/sdkdocs/wechatsdk/start/release-notes/)

[Insert 数据 *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/insert/)