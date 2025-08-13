# signInWithWechat() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/auth/auth-getunlimitedqrcode/
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

生成指定小程序某页面的二维码，扫码后可以跳转到该小程序页面。

## 使用 SDK 操作如下 [*link*](#%e4%bd%bf%e7%94%a8-sdk-%e6%93%8d%e4%bd%9c%e5%a6%82%e4%b8%8b)

```
const { data, error } = await supabase.auth.getUnlimitedQRCode({
  page: "pages/index/index", // pageUrl，不能带参数，不能带最开始的 /
  scene: "root=123", // 页面参数，字符串最大长度32字节，字符约束参考微信官方文档
  check_path: true,
  env_version: "trial",
  width: 430,
  auto_color: false,
  line_color: {"r":0,"g":0,"b":0},
  is_hyaline: false
})
```

## 参数 [*link*](#%e5%8f%82%e6%95%b0)

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| scene | String | 是 | 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&’()\*+,/:;=?@-.\_~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式） |
| page | String | 否 | 默认是主页，页面 page，例如 pages/index/index，根路径前不要填加 /，不能携带参数（参数请放在 scene 字段里），如果不填写这个字段，默认跳主页面。 |
| check\_path | boolean | 否 | 默认是true，检查page 是否存在，为 true 时 page 必须是已经发布的小程序存在的页面（否则报错）；为 false 时允许小程序未发布或者 page 不存在， 但page 有数量上限（60000个）请勿滥用。 |
| env\_version | String | 否 | 要打开的小程序版本。正式版为 “release”，体验版为 “trial”，开发版为 “develop”。默认是正式版。 |
| width | number | 否 | 默认430，二维码的宽度，单位 px，最小 280px，最大 1280px |
| auto\_color | boolean | 否 | 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false |
| line\_color | object | 否 | 默认是{“r”:0,“g”:0,“b”:0} 。auto\_color 为 false 时生效，使用 rgb 设置颜色 例如 {“r”:“xxx”,“g”:“xxx”,“b”:“xxx”} 十进制表示 |
| is\_hyaline | boolean | 否 | 默认是false，是否需要透明底色，为 true 时，生成透明底色的小程序 |

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

[*navigate\_before* getUnlimitedQRCode()](/docs/app/sdkdocs/wechatsdk/auth/auth-wechatbindphone/)

[wechatBindAccount() *navigate\_next*](/docs/app/sdkdocs/wechatsdk/auth/auth-wechatbindaccount/)