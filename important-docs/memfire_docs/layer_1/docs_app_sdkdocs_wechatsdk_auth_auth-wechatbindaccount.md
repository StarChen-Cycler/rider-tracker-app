# wechatBindAccount() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-wechatbindaccount/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

使用 SDK 操作如下

# wechatBindAccount()

该接口接受一个wx.login返回的code参数，通过code兑换openid等信息，并判断用户是否存在，已经存在会报错，不存在，则将该openid绑定到当前登录的账号上。
应用场景：小程序对应的web/app端先使用手机号+短信的方式注册的用户，在小程序端需要关联微信小程序账号，后续用户通过小程序或者短信方式都能登录到同一个账号下。使用条件，使用此接口之前，用户必须已经在小程序用手机号+短信的方式登录。

## 使用 SDK 操作如下 [*link*](#%e4%bd%bf%e7%94%a8-sdk-%e6%93%8d%e4%bd%9c%e5%a6%82%e4%b8%8b)

```
wx.login({
  success: async res => {
    const { data, error } = await supabase.auth.wechatBindAccount({code:res.code})
  },
})
```

## 参数 [*link*](#%e5%8f%82%e6%95%b0)

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| code | String | 是 | 使用wx.login成功后返回的code |

## 返回参数 [*link*](#%e8%bf%94%e5%9b%9e%e5%8f%82%e6%95%b0)

```
//请求成功返回正常用户信息
data: { session: Session | null; user: User | null }; error: null
//请求出错，返回错误信息
data: { session: null; user: null }; error: AuthError
```

## 返回示例 [*link*](#%e8%bf%94%e5%9b%9e%e7%a4%ba%e4%be%8b)

### data结构如下： [*link*](#data%e7%bb%93%e6%9e%84%e5%a6%82%e4%b8%8b)

```
{
    "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9xxxxxxxxxxxxxxxxxxxxxxxx",
    "token_type":"bearer",
    "expires_in":3600,
    "refresh_token":"xxxxxxxxxxx",
        "user":{
        "id":"2411981dxxxx",
        "aud":"authenticated",
        "role":"authenticated",
        "email":"",
        "phone":"131xxxx",
        "phone_confirmed_at":"2023-03-13T02:53:37.632761Z",
        "wechat_id":"",
        "wechat_unionid":"",
        "confirmation_sent_at":"2023-03-13T02:52:54.255934Z",
        "confirmed_at":"2023-03-13T02:53:37.632761Z",
        "last_sign_in_at":"2023-03-13T02:53:37.655352Z",
        "app_metadata":{
            "provider":"phone",
            "providers":[
                "phone"
            ]
        },
        "user_metadata":{
            "arvatar":"../../avatar.jpg",
            "nickname":"卢卡饶"
        },
        "identities":[
            {
                "id":"2411981d-xxxx",
                "user_id":"2411981d-xxxx",
                "identity_data":{
                    "sub":"2411981d-xxxx"
                },
                "provider":"phone",
                "last_sign_in_at":"2023-03-13T02:52:53.794404Z",
                "created_at":"2023-03-13T02:52:53.794445Z",
                "updated_at":"2023-03-13T02:52:53.794449Z"
            }
        ],
        "created_at":"2023-03-13T02:52:53.790532Z",
        "updated_at":"2023-03-13T03:01:26.13795Z"
    }
}
```

---

[*navigate\_before* signInWithWechat()](/docs/app/sdkdocs/wechatsdk/auth/auth-getunlimitedqrcode/)

[updateUser() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-updateuser/)