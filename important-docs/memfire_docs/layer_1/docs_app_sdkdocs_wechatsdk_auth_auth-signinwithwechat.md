# signInWithWechat() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-signinwithwechat/
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

# signInWithWechat()

微信注册

## 使用 SDK 操作如下 [*link*](#%e4%bd%bf%e7%94%a8-sdk-%e6%93%8d%e4%bd%9c%e5%a6%82%e4%b8%8b)

```
wx.login({
  success: async res => {
    const { data, error } = await supabase.auth.signInWithWechat({code:res.code})
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
        "id":"xxxxxxxxxxxxx",
        "aud":"authenticated",
        "role":"authenticated",
        "email":"",
        "phone":"",
        "wechat_id":"xxxxxxxxxxxxx",
        "wechat_unionid":"",
        "last_sign_in_at":"2023-03-13T02:47:38.729272028Z",
        "app_metadata":{
            "provider":"wechat_mini",
            "providers":[
                "wechat_mini"
            ]
        },
        "user_metadata":{

        },
        "identities":[

        ],
        "created_at":"2023-03-13T02:47:38.681877Z",
        "updated_at":"2023-03-13T02:47:38.740396Z"
    }
}
```

---

[*navigate\_before* csv()](/docs/app/sdkdocs/wechatsdk/database/modifier/db-csv/)

[getUnlimitedQRCode() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-wechatbindphone/)