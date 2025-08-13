# getUserById() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-getuserbyid/
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

# getUserById()

getUserById()可以根据用户的 ID 获取用户信息。

* 它将根据用户提供的用户 ID，在数据库中查找并获取相应的用户对象（user object）。用户对象包含了有关该用户的各种信息，比如用户名、电子邮件地址、角色等。
* 执行这个操作需要使用 getUserById() 方法，并且这个方法需要提供用户的 ID 作为参数。这个 ID 映射到数据库中的 auth.users.id 列，用于唯一标识一个用户。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （使用 access\_token jwt 获取用户对象） [*link*](#%e6%a1%88%e4%be%8b1-%e4%bd%bf%e7%94%a8-access_token-jwt-%e8%8e%b7%e5%8f%96%e7%94%a8%e6%88%b7%e5%af%b9%e8%b1%a1)

```
const { data, error } = await supabase.auth.admin.getUserById(1)
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### uid [必要参数] `string类型`

  用户的唯一标识符。此函数应该只在服务器上调用。绝对不要在浏览器中暴露你的 service\_role 密钥。

---

[*navigate\_before* inviteUserByEmail()](/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-inviteuserbyemail/)

[updateUserById() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-updateuserbyid/)