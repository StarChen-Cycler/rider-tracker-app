# deleteUser() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth-admin/auth-admin-deleteuser/
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

# deleteUser()

deleteUser()用于删除用户。这个过程需要使用 service\_role 密钥。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （移除一个用户） [*link*](#%e6%a1%88%e4%be%8b1-%e7%a7%bb%e9%99%a4%e4%b8%80%e4%b8%aa%e7%94%a8%e6%88%b7)

```
const { data, error } = await supabase.auth.admin.deleteUser(
'715ed5db-f090-4b8c-a067-640ecee36aa0'
)
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### id [必要参数] `string类型`

  你想删除的用户ID。
* #### shouldSoftDelete [可选参数] `boolean类型`

  + 当设置为 true 时，将对用户进行软删除操作（“软删除” 是一种在数据库中标记数据为已删除但不立即物理删除的操作方式。），即在认证模式（auth schema）中进行软删除。而当设置为 false 时，用户将被物理删除。
  + 默认情况下，“shouldSoftDelete” 参数的值为 false，这是为了保持向后兼容性。这意味着如果在调用删除用户的函数时不显式指定 “shouldSoftDelete” 参数，那么默认情况下用户将会被物理删除，而不是软删除。
  + 需要特别注意的是绝对不能将这个参数暴露给客户端浏览器。这是因为这个参数涉及到对数据进行软删除或物理删除的决定，是一个敏感的操作。确保在服务器端安全地处理这个参数，并且绝不要在客户端浏览器中传递敏感的 service\_role 密钥。

---

[*navigate\_before* createUser()](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-createuser/)

[inviteUserByEmail() *navigate\_next*](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-inviteuserbyemail/)