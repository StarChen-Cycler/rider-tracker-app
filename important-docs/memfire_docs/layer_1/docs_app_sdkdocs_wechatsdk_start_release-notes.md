# 版本说明 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/wechatsdk/start/release-notes/
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

# 版本说明

supabase-wechat-stable-v2 v2发布说明。

## 2.0.0 [*link*](#200)

用`npm install supabase-wechat-stable-v2`安装最新版本。

### 明确的构造器选项 [*link*](#%e6%98%8e%e7%a1%ae%e7%9a%84%e6%9e%84%e9%80%a0%e5%99%a8%e9%80%89%e9%a1%b9)

构造函数中的所有客户端特定选项都是键入库的。

```
const supabase = createClient(apiURL, apiKey, {
  db: {
    schema: 'public',
  },
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    channels,
    endpoint,
  },
  global: {
    fetch: customFetch,
    headers: DEFAULT_HEADERS,
  },
})
```

### 支持typescript [*link*](#%e6%94%af%e6%8c%81typescript)

这些库现在支持typescript。

```
// v2 - definitions are injected in `createClient()`
import type { Database } from './DatabaseDefinitions'
const supabase = createClient<Database>(SUPABASE_URL, ANON_KEY)
const { data } = await supabase.from('messages').select().match({ id: 1 })

// v1 -- previously definitions were injected in the `from()` method
supabase.from<Definitions['Message']>('messages').select('*')
```

类型可以通过CLI生成。

```
supabase start
supabase gen types typescript --local > DatabaseDefinitions.ts
```

### 数据操作返回最小值 [*link*](#%e6%95%b0%e6%8d%ae%e6%93%8d%e4%bd%9c%e8%bf%94%e5%9b%9e%e6%9c%80%e5%b0%8f%e5%80%bc)

`.insert()` / `.upsert()` / `.update()` / `.delete()` 默认情况下不返回行:[PR](https://github.com/supabase/postgrest-js/pull/276).

以前，这些方法默认返回插入/更新/删除的行（这引起了[一些混乱](https://github.com/supabase/supabase/discussions/1548)），你可以通过指定 “returning: ‘minimal’“选择不返回它。现在的默认行为是不返回记录。要返回插入/更新/删除的行，请在最后添加一个`.select()`的调用，例如：

```
const { data, error } = await supabase
  .from('my_table')
  .delete()
  .eq('id', 1)
  .select()
```

### 新的排序默认值 [*link*](#%e6%96%b0%e7%9a%84%e6%8e%92%e5%ba%8f%e9%bb%98%e8%ae%a4%e5%80%bc)

`.order()`现在默认为Postgres的默认值：[PR](https://github.com/supabase/postgrest-js/pull/283)。

以前`nullsFirst`默认为`false`，这意味着`null`是最后排序的。这对性能是不利的，例如，如果该列使用`NULLS FIRST`的索引（这是索引的默认方向）。

### Cookies和localstorage命名空间 [*link*](#cookies%e5%92%8clocalstorage%e5%91%bd%e5%90%8d%e7%a9%ba%e9%97%b4)

Auth库中的存储密钥名称已经改变，包括项目参考，这意味着现有的网站如果将其JWT到期时间设置为较长的时间，可能会发现他们的用户在这次升级中被注销。

```
const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split('.')[0]}-auth-token`
```

### 新的授权类型 [*link*](#%e6%96%b0%e7%9a%84%e6%8e%88%e6%9d%83%e7%b1%bb%e5%9e%8b)

类型化已经被重新设计。`Session`接口现在保证它总是有`access_token`, `refresh_token`和`user`

```
interface Session {
    provider_token?: string | null
    access_token: string
    expires_in?: number
    expires_at?: number
    refresh_token: string
    token_type: string
    user: User
}
```

### 新的认证方法 [*link*](#%e6%96%b0%e7%9a%84%e8%ae%a4%e8%af%81%e6%96%b9%e6%b3%95)

我们将删除`signIn()`方法，改用更明确的函数签名。
`signInWithPassword()`, `signInWithOtp()`, 和 `signInWithOtp()`.

```
// v2
const { data } = await supabase.auth.signInWithPassword({
  email: 'hello@example',
  password: 'pass',
})
// v1
const { data } = await supabase.auth.signIn({
  email: 'hello@example',
  password: 'pass',
})
```

### 新的实时方法 [*link*](#%e6%96%b0%e7%9a%84%e5%ae%9e%e6%97%b6%e6%96%b9%e6%b3%95)

在Realtime库中有一个新的`channel()`方法，它将被用于我们的多人游戏更新。

```
supabase
  .channel('any_string_you_want')
  .on('presence', { event: 'track' }, (payload) => {
    console.log(payload)
  })
  .subscribe()

supabase
  .channel('any_string_you_want')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'movies',
    },
    (payload) => {
      console.log(payload)
    }
  )
  .subscribe()
```

我们将废弃以前用于监听postgres变化的`.from().on().subscribe()‘方法。

### 废弃的setAuth() [*link*](#%e5%ba%9f%e5%bc%83%e7%9a%84setauth)

废弃并删除了`setAuth()`。要设置一个自定义的`access_token` jwt，请将自定义的头信息传入提供的`createClient()`方法：([PR](https://github.com/supabase/gotrue-js/pull/340))

### 所有变化 [*link*](#%e6%89%80%e6%9c%89%e5%8f%98%e5%8c%96)

* `supabase-js`
  + `shouldThrowOnError`已被删除，直到所有客户端库都支持该选项（[PR](https://github.com/supabase/supabase-js/pull/490)）。
* `postgrest-js`
  + TypeScript的类型已被重新设计 [PR](https://github.com/supabase/postgrest-js/pull/279)
  + 对函数参数、类型等使用`undefined`而不是`null`(<https://github.com/supabase/postgrest-js/pull/278>)
  + 一些功能现在已经过时了：(<https://github.com/supabase/postgrest-js/pull/275>)
    - 过滤器缩写（例如：`cs`与`contains`）。
    - 响应中的 “body”（相对于 “data”）。
    - 通过”.insert() “方法进行 “上载”。
    - `PostgrestClient`上的`auth`方法
    - 客户端级别的`throwOnError’方法
* `Gotrue-js`
  + `supase-js`客户端允许传递一个`storageKey`参数，这将允许用户设置本地存储中用于存储会话的密钥。默认情况下，这将与supabase项目参考文献一起被命名为空间。([PR](https://github.com/supabase/supabase-js/pull/460))
  + `signIn`方法现在分为`signInWithPassword`, `signInWithOtp`, `signInWithOAuth` ([PR](https://github.com/supabase/gotrue-js/pull/304))
  + 弃用并删除了`session()`, `user()`，改用`getSession()`。如果用户已经登录，`getSession()`将总是返回一个有效的会话，这意味着不再有随机注销。([PR](https://github.com/supabase/gotrue-js/pull/299))
  + 废弃并删除了对`multitab'支持的设置，因为`getSession()`和gotrue的重用间隔设置已经处理了多个标签的会话管理([PR](https://github.com/supabase/gotrue-js/pull/366))
  + 不再抛出随机错误，gotrue-js v2总是返回一个自定义的错误类型：([PR](https://github.com/supabase/gotrue-js/pull/341))
    - `AuthSessionMissingError`(AuthSession错误)
      * 表示预期有一个会话，但没有。
    - `AuthNoCookieError`表示预期有cookie，但没有。
      * 表示期望有一个cookie，但没有。
    - `AuthInvalidCredentialsError`表示期望有一个cookie但没有。
      * 表示传递了不正确的凭证。
  + 将 “api “命名空间更名为 “admin”，“admin “命名空间将只包含只能在受信任的服务器端环境中使用的方法，并配有服务角色密钥
  + 将`resetPasswordForEmail`、`getUser`和`updateUser`移至`GoTrueClient`，这意味着它们可以从`supabase.auth`命名空间访问`supabase-js`，而不是通过`supabase.auth.api`来访问它们。
  + 删除了`sendMobileOTP`, `sendMagicLinkEmail`，改用`signInWithOtp`。
  + 删除了`signInWithEmail`, `signInWithPhone`，改为`signInWithPassword`。
  + 删除了 “用电子邮件签名”、“用电话签名”，改为 “签名”。
  + 用 “updateUser “代替了 “update”。
* `Storage-js`。
  + 返回类型更加严格。函数类型曾经表明，即使没有错误，返回的数据也可能是空的。现在我们使用联合类型，只有在出现错误时才将数据标记为空，反之亦然。([PR](https://github.com/supabase/storage-js/pull/60))
  + `upload`和`update`函数返回上传对象的路径作为`path`参数。以前的返回值是将桶的名称预置在路径上，这使得该值难以传递给其他storage-js方法，因为所有的方法都是单独获取桶的名称和路径。我们还选择将返回值称为`path`而不是`Key`([PR](https://github.com/supabase/storage-js/pull/75))
  + `getPublicURL`只返回数据对象中的公共URL。这与我们的其他方法保持一致，只在数据对象内返回。没有错误返回，因为这个方法不能抛出一个错误([PR](https://github.com/supabase/storage-js/pull/93))
  + 在`createSignedUrl'和`createSignedUrls’中，签名的URL将以`signedUrl'而不是`signedURL’返回([PR](https://github.com/supabase/storage-js/pull/94))
  + 对`createSignedUrl`、`createSignedUrls`和`getPublicUrl`返回的URL进行编码([PR](https://github.com/supabase/storage-js/pull/86))
  + `createsignedUrl`曾经直接返回一个URL，并在数据对象中。这是不一致的。现在我们在所有方法中都只返回数据对象中的值。([PR](https://www.notion.so/LW5-supabase-js-v2-7b0bfcdf571d4f20b9b7a9308883f24b))
  + `createBucket`返回一个数据对象，而不是直接返回桶的名字。([PR](https://github.com/supabase/storage-js/pull/89))
  + 固定了元数据的类型 ([PR](https://github.com/supabase/storage-js/pull/90))
  + 更好的错误类型使其更容易快速追踪到出错的原因。
  + `SupabaseStorageClient`不再被导出。使用 “StorageClient “代替。([PR](https://github.com/supabase/storage-js/pull/92))。
* `Realtime-js`。
  + `RealtimeSubscription`类不再存在，被`RealtimeChannel`取代。
  + `RealtimeClient`的`disconnect`方法现在返回类型为`void`。以前它返回的类型是`Promise<{ error: Error | null; data: boolean }`。
  + 从`SupabaseClient`类中删除了`removeAllSubscriptions`和`removeSubscription`方法。
  + 删除了 “SupabaseRealtimeClient “类。
  + 删除了 “SupabaseQueryBuilder “类。
  + 删除了 “SupabaseEventTypes “类型。
    - 考虑将其重命名为 “RealtimePostgresChangeEvents”，并将其移至 “realtime-js “版本。
  + 删除了`.from('table').on('INSERT', () ⇒ {}).subscribe()`，以支持新的实时客户端API。

---

[*navigate\_before* 支持Typescript](/docs/app/sdkdocs/wechatsdk/start/typescript-support/)

[Select 查询 *navigate\_next*](/docs/app/sdkdocs/wechatsdk/database/select/)