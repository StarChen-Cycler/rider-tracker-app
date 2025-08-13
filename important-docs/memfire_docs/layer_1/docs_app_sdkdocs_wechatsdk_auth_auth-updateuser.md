# updateUser() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-updateuser/
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

# updateUser()

updateUser()用于更新用户信息，该方法用于更新已登录用户的用户数据。

使用 updateUser() 方法之前，用户必须先登录。默认情况下，如果对用户的电子邮箱进行更新，这将向用户当前的电子邮箱和新的电子邮箱发送确认链接。
若希望仅向用户的新电子邮箱发送确认链接，请在项目的[电子邮箱认证提供程序](https://cloud.memfiredb.com/db)设置中禁用 **Secure email change** 选项。这样可以避免同时向当前和新电子邮箱发送确认链接。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （更新已认证用户的电子邮件地址） [*link*](#%e6%a1%88%e4%be%8b1-%e6%9b%b4%e6%96%b0%e5%b7%b2%e8%ae%a4%e8%af%81%e7%94%a8%e6%88%b7%e7%9a%84%e7%94%b5%e5%ad%90%e9%82%ae%e4%bb%b6%e5%9c%b0%e5%9d%80)

```
const { data, error } = await supabase.auth.updateUser({email: 'new@email.com'})
```

发送一封“确认电子邮件更改”邮件至新的电子邮件地址。

### 案例2 （更新已认证用户的密码） [*link*](#%e6%a1%88%e4%be%8b2-%e6%9b%b4%e6%96%b0%e5%b7%b2%e8%ae%a4%e8%af%81%e7%94%a8%e6%88%b7%e7%9a%84%e5%af%86%e7%a0%81)

```
const { data, error } = await supabase.auth.updateUser({password: 'new password'})
```

如果密码超过72个字符，它将被截断为前72个字符。

### 案例3 （更新用户的元数据信息） [*link*](#%e6%a1%88%e4%be%8b3-%e6%9b%b4%e6%96%b0%e7%94%a8%e6%88%b7%e7%9a%84%e5%85%83%e6%95%b0%e6%8d%ae%e4%bf%a1%e6%81%af)

```
const { data, error } = await supabase.auth.updateUser({
data: { hello: 'world' }
})
```

### 案例4 （使用一次性随机码更新用户的密码） [*link*](#%e6%a1%88%e4%be%8b4-%e4%bd%bf%e7%94%a8%e4%b8%80%e6%ac%a1%e6%80%a7%e9%9a%8f%e6%9c%ba%e7%a0%81%e6%9b%b4%e6%96%b0%e7%94%a8%e6%88%b7%e7%9a%84%e5%af%86%e7%a0%81)

```
const { data, error } = await supabase.auth.updateUser({
password: 'new password',
nonce: '123456'
})
```

如果启用了"安全密码更改"功能，则更新用户密码将需要一个一次性随机码（nonce）。该一次性随机码会发送到用户的电子邮件或电话号码。

### 案例5 （设置微信用户昵称和头像） [*link*](#%e6%a1%88%e4%be%8b5-%e8%ae%be%e7%bd%ae%e5%be%ae%e4%bf%a1%e7%94%a8%e6%88%b7%e6%98%b5%e7%a7%b0%e5%92%8c%e5%a4%b4%e5%83%8f)

场景：配合[微信登录](/docs/app/development_guide/auth/mandateswechatAuth)一起使用

使用 SDK 操作如下：

```
const { data, error } = await supabase.auth.updateUser({"data": {"nickname": "张三", "arvatar": "url_of_arvatar"}})
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### attributes [必要参数] `UserAttributes类型`

  未提供说明。

  ##### 特性

  + #### 用户数据（data） [可选参数] `object类型`

    一个自定义的数据对象来存储用户的元数据。这映射到`auth.users.user_metadata`列。
    `data`应该是一个JSON对象，包括用户的具体信息，如他们的名字和姓氏。
  + #### 邮箱（email） [可选参数] `string类型`

    该用户的电子邮件。
  + #### 密码（password） [可选参数] `string类型`

    用户的密码。
  + #### 电话（phone） [可选参数] `string类型`

    用户的电话。
* #### 选项（option） [可选参数] `object类型`

  ##### 特性

  + #### emailRedirectTo [可选参数] `string类型`

---

[*navigate\_before* wechatBindAccount()](/docs/app/sdkdocs/wechatsdk/auth/auth-wechatbindaccount/)

[signUp() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-signup/)