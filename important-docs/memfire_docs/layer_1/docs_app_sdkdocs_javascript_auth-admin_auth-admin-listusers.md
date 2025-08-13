# listUsers() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth-admin/auth-admin-listusers/
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

# listUsers()

listUsers()用于获取用户列表，默认每页返回50个用户。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （获取用户的一页数据） [*link*](#%e6%a1%88%e4%be%8b1-%e8%8e%b7%e5%8f%96%e7%94%a8%e6%88%b7%e7%9a%84%e4%b8%80%e9%a1%b5%e6%95%b0%e6%8d%ae)

```
const { data: { users }, error } = await supabase.auth.admin.listUsers()
```

### 案例2 （用户的分页列表） [*link*](#%e6%a1%88%e4%be%8b2-%e7%94%a8%e6%88%b7%e7%9a%84%e5%88%86%e9%a1%b5%e5%88%97%e8%a1%a8)

```
const { data: { users }, error } = await supabase.auth.admin.listUsers({
page: 1,
perPage: 1000
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### params [可选参数] `PageParams`

  一个对象，支持 `page` 和 `perPage` 作为数字，用于更改分页结果。

  ##### 特性

  + #### page [可选参数] `数字类型`

    页数
  + #### perPage [可选参数] `数字类型`

    每一页返回项目的个数

---

[*navigate\_before* getUserById()](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-getuserbyid/)

[createUser() *navigate\_next*](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-createuser/)