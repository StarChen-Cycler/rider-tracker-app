# getUnlimitedQRCode() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-wechatbindphone/
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

# getUnlimitedQRCode()

微信小程序用户登录后，通过该接口绑定该用户授权的微信手机号。

## 使用 SDK 操作如下 [*link*](#%e4%bd%bf%e7%94%a8-sdk-%e6%93%8d%e4%bd%9c%e5%a6%82%e4%b8%8b)

```
const { data, error } = await supabase.auth.wechatBindPhone({
  code: '013fA51w3S8Ad03D0C3w31WiTT3fA51k',
})
```

## 参数 [*link*](#%e5%8f%82%e6%95%b0)

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| code | String | 是 | 需要将 button 组件 open-type 的值设置为 getPhoneNumber，当用户点击并同意之后，可以通过 bindgetphonenumber 事件回调获取到动态令牌code，然后把code传到开发者后台，并在开发者后台调用微信后台提供的 phonenumber.getPhoneNumber 接口，消费code来换取用户手机号。每个code有效期为5分钟，且只能消费一次。 |

## 返回参数 [*link*](#%e8%bf%94%e5%9b%9e%e5%8f%82%e6%95%b0)

```
//请求成功，返回用户信息
data: { user: User }; error: null
//请求出错，返回错误信息
data: { user: null }; error: AuthError
```

## 返回示例 [*link*](#%e8%bf%94%e5%9b%9e%e7%a4%ba%e4%be%8b)

### data结构如下： [*link*](#data%e7%bb%93%e6%9e%84%e5%a6%82%e4%b8%8b)

```
{
    "id":"e38801c5xxxxxx",
    "aud":"authenticated",
    "role":"authenticated",
    "email":"",
    "phone":"131xxxxxx",
    "wechat_id":"ok1s85Rxxxxxx",
    "wechat_unionid":"",
    "last_sign_in_at":"2023-03-13T08:37:51.308806Z",
    "app_metadata":{
        "provider":"wechat_mini",
        "providers":[
            "wechat_mini"
        ]
    },
    "user_metadata":{
        "arvatar":"http://tmp/z0dymKP81zu04f1fa14be668b52cd87aa12b759cf411.jpeg",
        "nickname":{
            "cursor":2,
            "keyCode":70,
            "value":"ff"
        }
    },
    "identities":[

    ],
    "created_at":"2023-03-13T06:23:34.596074Z",
    "updated_at":"2023-03-13T08:37:51.31062Z"
}
```

---

[*navigate\_before* signInWithWechat()](/docs/app/sdkdocs/wechatsdk/auth/auth-signinwithwechat/)

[signInWithWechat() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-getunlimitedqrcode/)