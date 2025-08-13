# resetPasswordForEmail() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-resetpasswordforemail/
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

# resetPasswordForEmail()

resetPasswordForEmail() 方法会向一个电子邮件地址发送密码重置请求。

* 密码重置流程包含两个主要步骤：1. 允许用户通过密码重置链接登录。2. 更新用户的密码。
* `resetPasswordForEmail()` 方法仅会向用户的电子邮件发送密码重置链接。若要更新用户的密码，请参阅 `updateUser()` 方法。
* 当密码恢复链接被点击时，会触发一个 `SIGNED_IN` 和 `PASSWORD_RECOVERY` 事件。你可以使用 `onAuthStateChange()` 方法来监听这些事件，并在其上调用一个回调函数。
* 当用户点击邮件中的重置链接后，他们将被重定向回您的应用程序。您可以通过 `redirectTo` 参数配置用户重定向的URL。请参阅[重定向URL和通配符](/docs/app/development_guide/auth/auth/)，以添加其他重定向URL到您的项目中。
* 成功重定向用户后，提示他们输入一个新密码并调用 `updateUser()` ，使用方法如下：

```
const { data, error } = await supabase.auth.updateUser({
  password: new_password
})
```

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （重置密码） [*link*](#%e6%a1%88%e4%be%8b1-%e9%87%8d%e7%bd%ae%e5%af%86%e7%a0%81)

```
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
redirectTo: 'https://example.com/update-password',
})
```

### 案例2 （重置密码（React）） [*link*](#%e6%a1%88%e4%be%8b2-%e9%87%8d%e7%bd%ae%e5%af%86%e7%a0%81react)

```
/**
* Step 1: Send the user an email to get a password reset token.
* This email contains a link which sends the user back to your application.
*/
const { data, error } = await supabase.auth
.resetPasswordForEmail('user@email.com')

/**
* Step 2: Once the user is redirected back to your application,
* ask the user to reset their password.
*/
useEffect(() => {
 supabase.auth.onAuthStateChange(async (event, session) => {
   if (event == "PASSWORD_RECOVERY") {
     const newPassword = prompt("What would you like your new password to be?");
     const { data, error } = await supabase.auth
       .updateUser({ password: newPassword })

     if (data) alert("Password updated successfully!")
     if (error) alert("There was an error updating your password.")
   }
 })
}, [])
```

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### 邮箱（email） [必要参数] `string类型`

  用户的电子邮件地址。
* #### 选项（option） [必要参数] `object类型`

  ##### 特性

  + #### captchaToken [可选参数] `string类型`

    当用户完成网站上的验证码时，收到的验证令牌。
  + #### redirectTo [可选参数] `string类型`

    点击密码重置链接后，这是将用户重定向的URL。

---

[*navigate\_before* signOut()](/docs/app/sdkdocs/javascript/auth/auth-signout/)

[通过 OTP 进行验证和登录 *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-verifyotp/)