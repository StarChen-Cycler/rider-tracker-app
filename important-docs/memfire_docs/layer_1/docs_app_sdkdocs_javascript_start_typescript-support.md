# 支持Typescript | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/start/typescript-support/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

生成类型

# 支持Typescript

`supabase-js`支持Typescript。

## 生成类型 [*link*](#%e7%94%9f%e6%88%90%e7%b1%bb%e5%9e%8b)

你可以在控制台的`api文档`->`表和视图`中下载类型。

![](../../../../img/types.png)

这些类型是直接从你的数据库中生成的。给定一个表`public.movies`，该定义将提供以下数据。

```
interface Database {
  public: {
    Tables: {
      movies: {
        Row: {} // The data expected to be returned from a "select" statement.
        Insert: {} // The data expected passed to an "insert" statement.
        Update: {} // The data expected passed to an "update" statement.
      }
    }
  }
}
```

在 “选择”、“插入 “和 “更新 “之间是有区别的，因为通常你会在数据库中为特定的列设置默认值。
有了默认值，你就不需要通过网络发送任何数据，即使该列是一个 “必填 “字段。我们的类型系统是精细的
足以处理这些情况。

## 注入类型定义 [*link*](#%e6%b3%a8%e5%85%a5%e7%b1%bb%e5%9e%8b%e5%ae%9a%e4%b9%89)

你可以用你用Supabase生成的类型来增强supabase客户端功能。

```
import { createClient } from 'supabase-wechat-stable-v2'
import { Database } from 'lib/database.types'

const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
```

## 类型提示 [*link*](#%e7%b1%bb%e5%9e%8b%e6%8f%90%e7%a4%ba)

`supase-js`总是返回一个`data`对象（代表成功），和一个`error`响应（代表不成功的请求）。
这提供了一个简单的接口来获取从任何函数返回的相关类型。

```
export async function getMovies() {
  return await supabase.from('movies').select(`id, title`)
}

type MoviesResponse = Awaited<ReturnType<typeof getMovies>>
export type MoviesResponseSuccess = MoviesResponse['data']
export type MoviesResponseError = MoviesResponse['error']
```

## 嵌套表 [*link*](#%e5%b5%8c%e5%a5%97%e8%a1%a8)

对于像嵌套表这样的高级查询，你可能想构建自己的类型。

```
import supabase from '~/lib/supabase'
import type { Database } from '~/lib/database.types'

async function getMovies() {
  return await supabase.from('movies').select('id, title, actors(*)')
}

type Actors = Database['public']['Tables']['actors']['Row']
type MoviesResponse = Awaited<ReturnType<typeof getMovies>>
type MoviesResponseSuccess = MoviesResponse['data'] & {
  actors: Actors[]
}
```

---

[*navigate\_before* 初始化客户端](/docs/app/sdkdocs/javascript/start/initializing/)

[版本说明 *navigate\_next*](/docs/app/sdkdocs/javascript/start/release-notes/)