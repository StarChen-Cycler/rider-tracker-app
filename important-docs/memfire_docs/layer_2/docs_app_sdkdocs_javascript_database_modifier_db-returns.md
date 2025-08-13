# returns() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/modifier/db-returns/
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

# returns()

覆盖返回`数据（data）`的类型。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 (覆盖成功响应的类型) [*link*](#%e6%a1%88%e4%be%8b1--%e8%a6%86%e7%9b%96%e6%88%90%e5%8a%9f%e5%93%8d%e5%ba%94%e7%9a%84%e7%b1%bb%e5%9e%8b)

```
const { data } = await supabase
.from('countries')
.select()
.returns<MyType>()
```

```
let x: typeof data // MyType | null
```

---

[*navigate\_before* csv()](/docs/app/sdkdocs/javascript/database/modifier/db-csv/)

[概述 *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-api/)