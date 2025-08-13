# abortSignal() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/database/modifier/db-abortsignal/
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# abortSignal()

设置获取请求的AbortSignal。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 [*link*](#%e6%a1%88%e4%be%8b1)

```
const ac = new AbortController()
ac.abort()

const { data, error } = await supabase
.from('very_big_table')
.select()
.abortSignal(ac.signal)
```

```
{
  "error": {
    "message": "FetchError: The user aborted a request.",
    "details": "",
    "hint": "",
    "code": ""

  },
  "status": 400,
  "statusText": "Bad Request"
}
```

你可以使用 [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 来中止请求。
请注意，对于被中止的请求，`状态 (status)` 和`状态文本 (statusText)` 并不具有实际意义，因为请求未能完成。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### signal [必要参数] `AbortSignal类型`

  用于获取请求的AbortSignal

---

[*navigate\_before* range()](/docs/app/sdkdocs/javascript/database/modifier/range/)

[single() *navigate\_next*](/docs/app/sdkdocs/javascript/database/modifier/single/)