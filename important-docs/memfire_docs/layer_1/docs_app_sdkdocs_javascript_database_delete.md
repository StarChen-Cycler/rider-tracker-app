# Delete 数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/delete/
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

# Delete 数据

delete()用于在表（table）或视图（view）执行 DELETE 操作。

* `delete()` 应始终与[过滤器（filter）](/docs/app/SDKdocs/JavaScript/database/using-filters)结合使用，以便定位要删除的项。
* 如果你在使用 `delete()` 时带有过滤器，并且启用了RLS（行级安全性），则只会删除通过 `SELECT` 策略可见的行。请注意，默认情况下没有行可见，因此你需要至少有一个 `SELECT`/`ALL` 策略来使行可见。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （删除记录） [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%a0%e9%99%a4%e8%ae%b0%e5%bd%95)

```
create table
countries (id int8 primary key, name text);

insert into
countries (id, name)
values
(1, 'Spain');
```

```
const { error } = await supabase
.from('countries')
.delete()
.eq('id', 1)
```

```
{
"status": 204,
"statusText": "No Content"
}
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 选项（option） [必要参数] `object类型`

  命名的参数

  ##### 特性

  + #### count optional `exact` | `planned` | `estimated`

    用来计算更新行的计数算法。

    exact:可以精确计算行数，但执行速度较慢。执行 “COUNT(\*)“操作。

    planned:可以快速计算行数，但是结果可能略有偏差。使用了Postgres的统计数据。

    estimated:对于较小的数值使用精确计数，对于较大的数值使用计划计数。根据行数的大小决定使用精确计数或计划计数的算法。

---

[*navigate\_before* Upsert 数据](/docs/app/sdkdocs/javascript/database/upsert/)

[调用Postgres函数 *navigate\_next*](/docs/app/sdkdocs/javascript/database/rpc/)