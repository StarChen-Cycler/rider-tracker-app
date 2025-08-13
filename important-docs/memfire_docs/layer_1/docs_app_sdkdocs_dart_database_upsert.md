# Upsert 数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/upsert/
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

# Upsert 数据

upsert()用于对表（table）或视图（view）执行 UPSERT 操作。

在关系型数据库中，Upsert是一种结合了"插入（Insert）“和"更新（Update）“的操作,它允许我们在表或视图上执行插入或更新操作。
通常情况下，当我们想要向数据库中插入一行数据时，我们会使用INSERT语句。
但是，如果该行数据已经存在（通常通过主键来判断），我们可能希望更新该行数据而不是插入重复的数据。

Upsert通过传递列到`onConflict`方法，我们可以使用`.upsert()`来实现以下功能：

1. 如果不存在具有相应`onConflict`列的行，则执行等效于`.insert()`的插入操作。
2. 如果存在具有相应`onConflict`列的行，则根据`ignoreDuplicates`的设置执行另一种操作。

需要注意的是，为了使用upsert，必须在`values`中包含主键。主键是用于唯一标识表中每一行的一列或一组列，确保数据的唯一性和完整性。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (Upsert数据) [*link*](#%e6%a1%88%e4%be%8b1-upsert%e6%95%b0%e6%8d%ae)

```
await supabase
  .from('messages')
  .upsert({ 'id': 3, 'message': 'foo', 'username': 'supabot' });
```

### 案例2 (将数据Upsert到带有约束的表中) [*link*](#%e6%a1%88%e4%be%8b2-%e5%b0%86%e6%95%b0%e6%8d%aeupsert%e5%88%b0%e5%b8%a6%e6%9c%89%e7%ba%a6%e6%9d%9f%e7%9a%84%e8%a1%a8%e4%b8%ad)

```
await supabase
  .from('users')
  .upsert({ 'username': 'supabot' }, { 'onConflict': 'username' });
```

运行以下代码将使 Supabase 进行数据的 UPSERT 操作到 “users” 表中。如果用户名 ‘supabot’ 已经存在，onConflict 参数会告诉 Supabase 根据传递给 onConflict 的列来覆盖那一行的数据。

### 案例3 (返回确切的行数) [*link*](#%e6%a1%88%e4%be%8b3-%e8%bf%94%e5%9b%9e%e7%a1%ae%e5%88%87%e7%9a%84%e8%a1%8c%e6%95%b0)

```
final res = await supabase.from('users').upsert(
  {'id': 3, 'message': 'foo', 'username': 'supabot'},
  options: const FetchOptions(count: CountOption.exact),
);

final data = res.data;
final count = res.count;
```

`count` 选项的允许取值为：exact、planned 和 estimated。

---

[*navigate\_before* Update 数据](/docs/app/sdkdocs/dart/database/update/)

[Delete 数据 *navigate\_next*](/docs/app/sdkdocs/dart/database/delete/)