# updateUserById() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth-admin/auth-admin-updateuserbyid/
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

# updateUserById()

updateUserById()用于更新用户数据。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （更新用户的电子邮件地址） [*link*](#%e6%a1%88%e4%be%8b1-%e6%9b%b4%e6%96%b0%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%9c%b0%e5%9d%80)

```
const { data: user, error } = await supabase.auth.admin.updateUserById(
'6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
{ email: 'new@email.com' }
)
```

### 案例2 （更新用户的密码） [*link*](#%e6%a1%88%e4%be%8b2-%e6%9b%b4%e6%96%b0%e7%94%a8%e6%88%b7%e7%9a%84%e5%af%86%e7%a0%81)

```
const { data: user, error } = await supabase.auth.admin.updateUserById(
'6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
{ password: 'new_password' }
)
```

### 案例3 （更新用户的元数据） [*link*](#%e6%a1%88%e4%be%8b3-%e6%9b%b4%e6%96%b0%e7%94%a8%e6%88%b7%e7%9a%84%e5%85%83%e6%95%b0%e6%8d%ae)

```
const { data: user, error } = await supabase.auth.admin.updateUserById(
'6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
{ user_metadata: { hello: 'world' } }
)
```

### 案例4 （更新用户的应用程序元数据） [*link*](#%e6%a1%88%e4%be%8b4-%e6%9b%b4%e6%96%b0%e7%94%a8%e6%88%b7%e7%9a%84%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f%e5%85%83%e6%95%b0%e6%8d%ae)

```
const { data: user, error } = await supabase.auth.admin.updateUserById(
'6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
{ app_metadata: { plan: 'trial' } }
)
```

### 案例5 （确认用户的电子邮件地址） [*link*](#%e6%a1%88%e4%be%8b5-%e7%a1%ae%e8%ae%a4%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%9c%b0%e5%9d%80)

```
const { data: user, error } = await supabase.auth.admin.updateUserById(
'6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
{ email_confirm: true }
)
```

### 案例6 （确认用户的电话号码） [*link*](#%e6%a1%88%e4%be%8b6-%e7%a1%ae%e8%ae%a4%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%b5%e8%af%9d%e5%8f%b7%e7%a0%81)

```
const { data: user, error } = await supabase.auth.admin.updateUserById(
'6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',
{ phone_confirm: true }
)
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### uid [必要参数] `string类型`

  用户的唯一标识符。
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

[*navigate\_before* generateLink()](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-generatelink/)

[invoke() *navigate\_next*](/docs/app/sdkdocs/javascript/function/invoke/)