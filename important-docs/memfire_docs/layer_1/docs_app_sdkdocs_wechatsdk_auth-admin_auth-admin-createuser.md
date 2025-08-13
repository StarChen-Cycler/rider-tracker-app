# createUser() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-createuser/
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

# createUser()

createUser()用于创建一个新的用户。这个函数应该只在服务器上调用。不要在浏览器中暴露你的`service_role`密钥。

* 为了确认用户的电子邮件地址或电话号码，请将 `email_confirm` 或 `phone_confirm` 设置为 true。如果不进行设置，这两个参数的默认值为 false。
* `createUser()` 不会向用户发送确认电子邮件。如果你想发送邀请电子邮件，可以使用 `inviteUserByEmail()` 方法。
* 如果你确定所创建的用户的电子邮件或电话号码是合法且经过验证的，你可以将 `email_confirm` 或 `phone_confirm` 参数设置为 `true。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （带有自定义用户元数据） [*link*](#%e6%a1%88%e4%be%8b1-%e5%b8%a6%e6%9c%89%e8%87%aa%e5%ae%9a%e4%b9%89%e7%94%a8%e6%88%b7%e5%85%83%e6%95%b0%e6%8d%ae)

```
const { data, error } = await supabase.auth.admin.createUser({
email: 'user@email.com',
password: 'password',
user_metadata: { name: 'Yoda' }
})
```

如果密码超过了72个字符，它将被截断为前72个字符。

### 案例2 （自动确认用户的电子邮件） [*link*](#%e6%a1%88%e4%be%8b2-%e8%87%aa%e5%8a%a8%e7%a1%ae%e8%ae%a4%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6)

```
const { data, error } = await supabase.auth.admin.createUser({
email: 'user@email.com',
email_confirm: true
})
```

### 案例3 （自动确认用户的电话号码） [*link*](#%e6%a1%88%e4%be%8b3-%e8%87%aa%e5%8a%a8%e7%a1%ae%e8%ae%a4%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%b5%e8%af%9d%e5%8f%b7%e7%a0%81)

```
const { data, error } = await supabase.auth.admin.createUser({
phone: '1234567890',
phone_confirm: true
})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### attributes [必要参数] `AdminUserAttributes类型`

  ##### 特性

  + #### app\_metadata [可选参数] `object类型`

    用于存储用户特定应用程序元数据的自定义数据对象。这映射到 auth.users.app\_metadata 列。只有服务角色可以修改。app\_metadata 应该是一个 JSON 对象，其中包含应用程序特定的信息，例如身份提供者、角色和其他访问控制信息。
  + #### ban\_duration [可选参数] `string类型`

    决定一个用户被禁止多长时间。

    确定用户被封禁的持续时间。封禁持续时间的格式遵循严格的十进制数字和单位后缀的顺序。有效的时间单位包括 “ns”、“us”（或 “µs”）、“ms”、“s”、“m”、“h”。例如，一些可能的持续时间包括：‘300ms’、‘2h45m’。将封禁持续时间设置为 ’none’ 将解除对用户的封禁。
  + #### email [可选参数] `string类型`

    该用户的电子邮件。
  + #### email\_confirm [可选参数] `boolean类型`

    如果设置为 true，则确认用户的电子邮件地址。只有服务角色可以修改。
  + #### nonce [可选参数] `string类型`

    如果要更新用户的密码，则发送的重新认证的随机数。首先调用 reauthenticate() 来获取随机数。
  + #### password [可选参数] `string类型`

    用户的密码。
  + #### phone [可选参数] `string类型`

    用户的电话。
  + #### phone\_confirm [可选参数] `boolean类型`

    如果设置为 true，则确认用户的电话号码。只有服务角色可以修改。
  + #### user\_metadata [可选参数] `object类型`

    用于存储用户元数据的自定义数据对象。这映射到 auth.users.user\_metadata 列。user\_metadata 应该是一个 JSON 对象，其中包含用户特定的信息，例如他们的名字和姓氏。注意：在使用 GoTrueAdminApi 并想要修改用户的元数据时，将使用此属性代替 UserAttributes 数据。

---

[*navigate\_before* 概览](/docs/app/sdkdocs/wechatsdk/auth-admin/supabase-auth-admin-api/)

[deleteUser() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth-admin/auth-admin-deleteuser/)