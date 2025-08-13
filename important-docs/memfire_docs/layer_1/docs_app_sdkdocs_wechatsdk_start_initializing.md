# 初始化客户端 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/start/initializing/
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

# 初始化客户端

你可以使用 `createClient()` 方法初始化一个新的 Supabase 客户端。

Supabase 客户端是你访问 Supabase 其他功能的入口是与我们在 Supabase 生态系统中提供的所有功能进行交互的最简单方法。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （createClient()） [*link*](#%e6%a1%88%e4%be%8b1--createclient)

如果密码超过72个字符，它将被截断为前72个字符。

```
import { createClient } from 'supabase-wechat-stable-v2'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
```

使用自定义域名：

```
import { createClient } from 'supabase-wechat-stable-v2'

// Use a custom domain as the supabase URL
const supabase = createClient('https://my-custom-domain.com', 'public-anon-key')
```

### 案例2 （带附加参数的情况） [*link*](#%e6%a1%88%e4%be%8b2-%e5%b8%a6%e9%99%84%e5%8a%a0%e5%8f%82%e6%95%b0%e7%9a%84%e6%83%85%e5%86%b5)

```
import { createClient } from 'supabase-wechat-stable-v2'

const options = {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
}
const supabase = createClient("https://xyzcompany.supabase.co", "public-anon-key", options)
```

### 案例3 （API模式） [*link*](#%e6%a1%88%e4%be%8b3--api%e6%a8%a1%e5%bc%8f)

```
import { createClient } from 'supabase-wechat-stable-v2'

// Provide a custom schema. Defaults to "public".
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key', {
  db: { schema: 'other_schema' }
})
```

默认情况下，API服务器指向public模式。您可以在控制台中启用其他数据库模式。
前往 `“设置”>“API”>“public模式”`，然后添加您想要暴露给API的模式。

注意：每个客户端连接只能访问一个模式，因此上述代码可以访问`other_schema`模式，但无法访问`public`模式。

### 案例4 （自定义fetch实现） [*link*](#%e6%a1%88%e4%be%8b4--%e8%87%aa%e5%ae%9a%e4%b9%89fetch%e5%ae%9e%e7%8e%b0)

```
import { createClient } from 'supabase-wechat-stable-v2'

const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key', {
  global: { fetch: fetch.bind(globalThis) }
})
```

`supabase-js`使用`cross-fetch`库进行HTTP请求，但是可以作为选项提供替代的`fetch`实现。
这在`cross-fetch`不兼容的环境中特别有用（例如Cloudflare Workers）。

### 案例5 （React Native选项） [*link*](#%e6%a1%88%e4%be%8b5--react-native%e9%80%89%e9%a1%b9)

```
import { createClient } from 'supabase-wechat-stable-v2'
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabase = createClient("https://xyzcompany.supabase.co", "public-anon-key", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

对于React Native，我们推荐使用`AsyncStorage`作为Supabase Auth的存储实现。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### supabaseUrl [必要参数] `string类型`

  唯一的Supabase URL，当你在项目控制台上创建一个新项目时提供。

  点击控制台左侧菜单栏的“应用设置”，然后找到“API”，此时的页面可以找到应用的URL。
* #### supabaseKey [必要参数] `string类型`

  唯一的Supabase密钥，当你在你的项目控制台上创建一个新项目时提供。

  点击控制台左侧菜单栏的“应用设置”，然后找到“API”，此时的页面可以找到应用的API密钥。
* #### SupabaseClientOptions [必要参数] `object类型`

  ##### 特性

  + #### auth [可选参数] `object类型`

    ##### 特性

    - #### autoRefreshToken [可选参数] `boolean类型`

      自动刷新登录用户的令牌。
    - #### detectSessionInUrl [可选参数] `boolean类型`

      从URL中检测一个会话。用于OAuth登录的回调。
    - #### flowType [可选参数] `object类型`

      要使用的OAuth流程 - 默认为隐式流程。推荐在移动端和服务器端应用中使用PKCE流程。
    - #### persistSession [可选参数] `boolean类型`

      是否将登录的会话持久化到存储中。
    - #### storage [可选参数] `object类型`

      一个存储提供者。用来存储登录的会话。
    - #### storageKey [可选参数] `string类型`

      可选的密钥名称，用于在本地存储中存储令牌
  + #### db [可选参数] `object类型`

    你的表所属的Postgres模式。必须在Supabase中公开的模式列表中。默认为 “public”。

    ##### 特性

    - #### schema [可选参数] `SchemaName类型`
  + #### global [可选参数] `object类型`

    ##### 特性

    - #### fetch [可选参数] `Fetch类型`

      一个自定义的 fetch 实现。
    - #### headers [可选参数] `Record类型`

      用于初始化客户端的可选头文件。
  + #### 实时数据库 [可选参数] `RealtimeClientOptions类型`

    传递给realtime-js实例的选项

---

[*navigate\_before* 安装](/docs/app/sdkdocs/wechatsdk/start/installing/)

[支持Typescript *navigate\_next*](/docs/app/sdkdocs/wechatsdk/start/typescript-support/)