# generateLink() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth-admin/auth-admin-generatelink/
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

# generateLink()

generateLink() 函数用于生成电子邮件链接和一次性密码（OTP），这些链接和密码将通过自定义的电子邮件服务商发送。

* generateLink() 函数可以接受以下类型的参数：signup、magiclink、invite、recovery、email\_change\_current、email\_change\_new、phone\_change。
  根据传入的类型不同，生成的链接和密码可能有所不同，用于不同的场景，比如用户注册、魔术链接登录、邀请用户、找回密码等。
* 对于 email\_change\_email 类型的参数，generateLink() 函数只会生成电子邮件链接，前提是在你的 Supabase 项目的 “Email” 提供商中启用了 “Secure email change” 设置。这个功能用于确保用户更改电子邮件地址时的安全性。
* generateLink() 函数处理了注册、邀请和魔术链接场景下的用户创建。这意味着在这些场景中，函数会在生成链接和密码的同时，也会创建用户账号，使得用户可以使用相应的链接和密码进行注册、登录或邀请操作。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （生成注册链接） [*link*](#%e6%a1%88%e4%be%8b1-%e7%94%9f%e6%88%90%e6%b3%a8%e5%86%8c%e9%93%be%e6%8e%a5)

```
const { data, error } = await supabase.auth.admin.generateLink({
type: 'signup',
email: 'email@example.com',
password: 'secret'
})
```

### 案例2 （生成邀请链接） [*link*](#%e6%a1%88%e4%be%8b2-%e7%94%9f%e6%88%90%e9%82%80%e8%af%b7%e9%93%be%e6%8e%a5)

```
const { data, error } = await supabase.auth.admin.generateLink({
type: 'invite',
email: 'email@example.com'
})
```

### 案例3 （生成魔术链接） [*link*](#%e6%a1%88%e4%be%8b3-%e7%94%9f%e6%88%90%e9%ad%94%e6%9c%af%e9%93%be%e6%8e%a5)

```
const { data, error } = await supabase.auth.admin.generateLink({
type: 'magiclink',
email: 'email@example.com'
})
```

### 案例4 （生成恢复链接） [*link*](#%e6%a1%88%e4%be%8b4-%e7%94%9f%e6%88%90%e6%81%a2%e5%a4%8d%e9%93%be%e6%8e%a5)

```
const { data, error } = await supabase.auth.admin.generateLink({
type: 'recovery',
email: 'email@example.com'
})
```

### 案例5 （生成用于更改当前电子邮件地址的链接） [*link*](#%e6%a1%88%e4%be%8b5-%e7%94%9f%e6%88%90%e7%94%a8%e4%ba%8e%e6%9b%b4%e6%94%b9%e5%bd%93%e5%89%8d%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%9c%b0%e5%9d%80%e7%9a%84%e9%93%be%e6%8e%a5)

```
// generate an email change link to be sent to the current email address
const { data, error } = await supabase.auth.admin.generateLink({
type: 'email_change_current',
email: 'current.email@example.com',
newEmail: 'new.email@example.com'
})

// generate an email change link to be sent to the new email address
const { data, error } = await supabase.auth.admin.generateLink({
type: 'email_change_new',
email: 'current.email@example.com',
newEmail: 'new.email@example.com'
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### params [必要参数] `GenerateLinkParams`

---

[*navigate\_before* inviteUserByEmail()](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-inviteuserbyemail/)

[updateUserById() *navigate\_next*](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-updateuserbyid/)