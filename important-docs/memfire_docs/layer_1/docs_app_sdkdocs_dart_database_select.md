# Select 查询 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/select/
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

select()用于对表格或视图执行SELECT查询。

* 默认情况下，Supabase项目将返回最多1,000行。这个设置可以在项目API设置中更改。建议将其保持较低，以限制意外或恶意请求的有效负载大小。您可以使用range()查询来分页处理数据。
* `select()`可以与过滤器[Filter](/docs/app/SDKdocs/dartdatabase/using-filters)组合使用
* `select()`可以与修改器[Modifier](/docs/app/SDKdocs/dartdatabase/using-modifiers)组合使用
* 如果您正在使用Supabase平台，`apikey`是一个保留关键字，[应避免将其作为列名](https://github.com/supabase/supabase/issues/5465)。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (获取您的数据) [*link*](#%e6%a1%88%e4%be%8b1-%e8%8e%b7%e5%8f%96%e6%82%a8%e7%9a%84%e6%95%b0%e6%8d%ae)

```
final data = await supabase
  .from('cities')
  .select('name');
```

### 案例2 (选择特定的列) [*link*](#%e6%a1%88%e4%be%8b2-%e9%80%89%e6%8b%a9%e7%89%b9%e5%ae%9a%e7%9a%84%e5%88%97)

```
final data = await supabase
  .from('countries')
  .select('''
    name,
    cities (
      name
    )
  ''');
```

你可以从你的表中选择特定的字段。

### 案例3 (查询外键表) [*link*](#%e6%a1%88%e4%be%8b3-%e6%9f%a5%e8%af%a2%e5%a4%96%e9%94%ae%e8%a1%a8)

```
final data = await supabase
  .from('countries')
  .select('''
    name,
    cities (
      name
    )
  ''');
```

如果您的数据库有关联关系，您也可以查询相关的表。

### 案例4 (多次查询同一个外键表) [*link*](#%e6%a1%88%e4%be%8b4-%e5%a4%9a%e6%ac%a1%e6%9f%a5%e8%af%a2%e5%90%8c%e4%b8%80%e4%b8%aa%e5%a4%96%e9%94%ae%e8%a1%a8)

```
final data = await supabase
  .from('messages')
  .select('*, users!inner(*)')
  .eq('users.username', 'Jane');
```

有时您需要对同一个外部表进行两次查询。在这种情况下，您可以使用连接列的名称来标识您打算使用的连接。
为了方便起见，您还可以为每个列提供一个别名。例如，如果我们有一个产品商店，并且我们想同时获取供应商和购买者（都在 users 表中）的信息：

### 案例5 (使用内连接进行筛选) [*link*](#%e6%a1%88%e4%be%8b5-%e4%bd%bf%e7%94%a8%e5%86%85%e8%bf%9e%e6%8e%a5%e8%bf%9b%e8%a1%8c%e7%ad%9b%e9%80%89)

```
final data = await supabase
  .from('messages')
  .select('*, users!inner(*)')
  .eq('users.username', 'Jane');
```

如果您想根据子表的值来筛选一个表，可以使用 `!inner()` 函数。例如，如果您想选择所有属于用户名为 “Jane” 的用户的消息表中的行：

### 案例6 (使用计数选项进行查询) [*link*](#%e6%a1%88%e4%be%8b6-%e4%bd%bf%e7%94%a8%e8%ae%a1%e6%95%b0%e9%80%89%e9%a1%b9%e8%bf%9b%e8%a1%8c%e6%9f%a5%e8%af%a2)

```
final res = await supabase.from('cities').select(
      'name',
      const FetchOptions(
        count: CountOption.exact,
      ),
    );

final count = res.count;
```

你可以通过使用count选项来获得行的数量。
count选项的允许值是[exact](https://postgrest.org/en/stable/api.html#exact-count)，[planned](https://postgrest.org/en/stable/api.html#planned-count)和[estimated](https://postgrest.org/en/stable/api.html#estimated-count)。

### 案例7 (查询JSON数据) [*link*](#%e6%a1%88%e4%be%8b7-%e6%9f%a5%e8%af%a2json%e6%95%b0%e6%8d%ae)

```
final data = await supabase
  .from('users')
  .select('''
    id, name,
    address->street
  ''')
  .eq('address->postcode', 90210);
```

如果你有一个JSONB列内的数据，你可以对数据值应用选择
和查询过滤器到数据值。Postgres提供了一个
[操作数](https://www.postgresql.org/docs/current/functions-json.html)
用于查询JSON数据。还可以看到
[PostgREST docs](http://postgrest.org/en/v7.0.0/api.html#json-columns) 了解更多细节。

### 案例8 (以CSV格式返回数据) [*link*](#%e6%a1%88%e4%be%8b8-%e4%bb%a5csv%e6%a0%bc%e5%bc%8f%e8%bf%94%e5%9b%9e%e6%95%b0%e6%8d%ae)

```
final data = await supabase
  .from('users')
  .select()
  .csv();
```

默认情况下，数据以JSON格式返回，但你也可以要求以逗号分隔值的形式返回。

---

[*navigate\_before* 更新](/docs/app/sdkdocs/dart/start/upgrade-guide/)

[Insert 数据 *navigate\_next*](/docs/app/sdkdocs/dart/database/insert/)