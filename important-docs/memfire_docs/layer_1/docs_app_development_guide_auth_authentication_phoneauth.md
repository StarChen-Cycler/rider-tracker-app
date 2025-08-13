# 手机登录认证 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/phoneauth/
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

# 手机登录认证

### 前言 [*link*](#%e5%89%8d%e8%a8%80)

为了顺应国内用户的使用习惯，MemFire Cloud提供了手机号码验证的登录方式，可以兼容国内的阿里云服务商，用户可以采用手机号+短信的放式进行用户身份认证。

### 使用步骤 [*link*](#%e4%bd%bf%e7%94%a8%e6%ad%a5%e9%aa%a4)

### 1.开启手机验证 [*link*](#1%e5%bc%80%e5%90%af%e6%89%8b%e6%9c%ba%e9%aa%8c%e8%af%81)

进入“用户认证”->“服务商”页面，启用手机号码验证，短信（SMS）服务商选择“阿里云”，依次填写好阿里云配置后点击保存。

![](../../../../img/phoneauth1.png)

当启用“短信验证”时，说明您需要发送短信验证码来进行手机认证，您需要填写正确的阿里云短信签名名称和短信模板CODE

### 2.示例教程 [*link*](#2%e7%a4%ba%e4%be%8b%e6%95%99%e7%a8%8b)

MemFire Cloud 提供两种手机登录认证方式，分别如下：

### ① 手机号+验证码登录认证 [*link*](#-%e6%89%8b%e6%9c%ba%e5%8f%b7%e9%aa%8c%e8%af%81%e7%a0%81%e7%99%bb%e5%bd%95%e8%ae%a4%e8%af%81)

用户使用手机号获取验证码。

![](../../../../img/phoneauth2.png)
![](../../../../img/phoneauth3.png)

![](../../../../img/phoneauth4.png)

SDK的使用教程

```
//获取验证码
async function getQRcode(){
    let { data, error } = await _supabase.auth.signInWithOtp({
            phone: phone,
        })
        if(error){
          alert(error)
        }
        alert('短信已发送至您的手机中，请注意查收。')
 }
 //登录
async function sigin(){
    let { data, error } = await _supabase.auth.verifyOtp({
        phone: phone,
        token: QRcode,
        type: 'sms',
    })
    if(error){
        alert(error)
        return;
    }
       alert('登录成功！')
 }
```

### ② 手机号+密码+验证码认证 [*link*](#-%e6%89%8b%e6%9c%ba%e5%8f%b7%e5%af%86%e7%a0%81%e9%aa%8c%e8%af%81%e7%a0%81%e8%ae%a4%e8%af%81)

#### 图示 [*link*](#%e5%9b%be%e7%a4%ba)

先用手机号+密码获取验证码进行注册

![](../../../../img/phoneauth5.png)

随后会在用户列表里刚刚那条等待验证的用户信息

![](../../../../img/phoneauth6.png)

输入验证码，点击注册，会发现用户列表的用户已经认证成功。

![](../../../../img/phoneauth7.png)
![](../../../../img/phoneauth8.png)

SDK的使用教程

1.用户使用手机号+密码先来获取验证码进行注册。

```
//获取验证码（注册）
async function getQRcode(){
 let { data, error } = await _supabase.auth.signUp({
        phone: phone,
        password: passowrd
    })
    if(data){
        alert('短信已发送至您的手机中，请注意查收。')
    }
 }
 //使用验证码方式进行一次性登录
async function sigin(){
    let { data, error } = await _supabase.auth.verifyOtp({
        phone: phone,
        token: QRcode,
        type: 'sms',
    })
    if(data){
        alert('登录成功')
    }else if(error){
        alert('登录失败')
    }
}
```

2.手机号+密码登录（第一步相当于注册，这一步是登录）

```
//使用验证码方式登录
async function sigin(){
    let { data, error } = await _supabase.auth.signInWithPassword({
        phone: phone,
        password: passowrd
    })
    if(data){
        alert('登录成功')
    }else if(error){
        alert('登录失败')
    }
}
```

---

[*navigate\_before* 使用电子邮件登录](/docs/app/development_guide/auth/authentication/auth-email/)

[微信小程序登录认证 *navigate\_next*](/docs/app/development_guide/auth/authentication/wechatauth/)