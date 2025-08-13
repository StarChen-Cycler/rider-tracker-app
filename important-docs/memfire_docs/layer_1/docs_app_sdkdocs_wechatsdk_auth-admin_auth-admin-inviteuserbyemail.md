# inviteUserByEmail() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-inviteuserbyemail/
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

# inviteUserByEmail()

inviteUserByEmail()函数用于向一个用户电子邮件地址发送邀请链接。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （邀请一个用户） [*link*](#%e6%a1%88%e4%be%8b1-%e9%82%80%e8%af%b7%e4%b8%80%e4%b8%aa%e7%94%a8%e6%88%b7)

```
const { data, error } = await supabase.auth.admin.inviteUserByEmail('email@example.com')
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### email [必要参数] `string类型`

  用户的电子邮件地址。
* #### 选项（option） [必要参数] `object类型`

  用于指定在邀请时包含的额外选项。

  ##### 特性

  + #### data [可选参数] `object类型`

    用于存储关于用户的其他元数据。这个数据对象映射到 auth.users.user\_metadata 列，可以用于存储一些用户特定的信息。
  + #### redirectTo [可选参数] `string类型`

    它会附加在发送给用户电子邮件地址的邀请链接的 URL 后面。用户点击链接后将跳转到这个指定的 URL。

---

[*navigate\_before* generateLink()](/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-generatelink/)

[getUserById() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-getuserbyid/)