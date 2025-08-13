# Insert 数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/database/insert/
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

insert()用于在表(table)或视图(view)执行 INSERT 操作。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (创建记录) [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%9b%e5%bb%ba%e8%ae%b0%e5%bd%95)

```
await supabase
    .from('cities')
    .insert({'name': 'The Shire', 'country_id': 554});
```

### 案例2 (批量创建) [*link*](#%e6%a1%88%e4%be%8b2-%e6%89%b9%e9%87%8f%e5%88%9b%e5%bb%ba)

```
await supabase.from('cities').insert([
  {'name': 'The Shire', 'country_id': 554},
  {'name': 'Rohan', 'country_id': 555},
]);
```

### 案例3 (获取插入的记录) [*link*](#%e6%a1%88%e4%be%8b3-%e8%8e%b7%e5%8f%96%e6%8f%92%e5%85%a5%e7%9a%84%e8%ae%b0%e5%bd%95)

```
final List<Map<String, dynamic>> data =
        await supabase.from('cities').insert([
      {'name': 'The Shire', 'country_id': 554},
      {'name': 'Rohan', 'country_id': 555},
    ]).select();
```

---

[*navigate\_before* Select 查询](/docs/app/sdkdocs/dart/database/select/)

[Update 数据 *navigate\_next*](/docs/app/sdkdocs/dart/database/update/)