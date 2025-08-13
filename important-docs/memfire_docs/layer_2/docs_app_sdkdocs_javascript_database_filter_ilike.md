# ilike() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/filter/ilike/
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

# ilike()

ilike()用于查找所有在所述`列（column）`上的值与提供的 `模板（pattern）`相符的记录（不区分大小写）。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (使用select) [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8select)

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
.ilike('name', '%Alba%')
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 列（column） [必要参数] `string类型`

  要过滤的列
* #### 模式（pattern） [必要参数] `string类型`

  与之匹配的模式

---

[*navigate\_before* like()](/docs/app/sdkdocs/javascript/database/filter/like/)

[is() *navigate\_next*](/docs/app/sdkdocs/javascript/database/filter/is/)