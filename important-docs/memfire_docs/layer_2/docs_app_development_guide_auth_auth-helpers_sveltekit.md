# 使用SveltKit进行Supabase认证 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/auth-helpers/sveltekit
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

安装

# 使用SveltKit进行Supabase认证

该子模块提供了在[SvelteKit](https://kit.svelte.dev/)中实现用户身份验证的方便助手应用程序。

## 安装 [*link*](#%e5%ae%89%e8%a3%85)

此库支持Node.js`^16.15.0`。

```
npm install @supabase/auth-helpers-sveltekit
```

```
yarn add @supabase/auth-helpers-sveltekit
```

## 入门 [*link*](#%e5%85%a5%e9%97%a8)

### 配置 [*link*](#%e9%85%8d%e7%bd%ae)

设置填充环境变量。对于本地开发，您可以将其设置为`.env`文件。参见[示例](https://github.com/supabase/auth-helpers/blob/main/examples/sveltekit/.env.example).

```
# Find these in your Supabase project settings > API
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 设置Suabase客户端 [*link*](#%e8%ae%be%e7%bd%aesuabase%e5%ae%a2%e6%88%b7%e7%ab%af)

首先创建一个`db.ts`文件，并实例化 `supabaseClient`。

```
import { createClient } from '@supabase/auth-helpers-sveltekit'
import { env } from '$env/dynamic/public'
// or use the static env
// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)
```

要确保在服务器和客户端上初始化了客户端，请在`src/hooks.server.js`中包含此文件。js`和`src/hooks.client.js`：

```
import '$lib/db'
```

### 同步页面存储 [*link*](#%e5%90%8c%e6%ad%a5%e9%a1%b5%e9%9d%a2%e5%ad%98%e5%82%a8)

编辑`+layout.svelte`文件并设置客户端。

```
<script>
  import { supabaseClient } from '$lib/db'
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'

  onMount(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidate('supabase:auth')
    })

    return () => {
      subscription.unsubscribe()
    }
  })
</script>

<slot />
```

调用 `invalidate('supabase:auth')`时，使用`getSupabase()` 的每个`PageLoad`或 `LayoutLoad`都将更新。

如果某些数据在登录/注销时未更新，则可以返回到 `invalidateAll()`。

### 向客户端发送会话 [*link*](#%e5%90%91%e5%ae%a2%e6%88%b7%e7%ab%af%e5%8f%91%e9%80%81%e4%bc%9a%e8%af%9d)

要使会话对UI（页面、布局）可用，请在根布局服务器加载函数中传递会话：

```
import type { LayoutServerLoad } from './$types'
import { getServerSession } from '@supabase/auth-helpers-sveltekit'

export const load: LayoutServerLoad = async (event) => {
  return {
    session: await getServerSession(event),
  }
}
```

此外，如果使用`invalidate('supabase:auth')`，则可以创建布局加载函数：

```
import type { LayoutLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load: LayoutLoad = async (event) => {
  const { session } = await getSupabase(event)
  return { session }
}
```

这会减少服务器调用，因为客户端自己管理会话。

### 键入 [*link*](#%e9%94%ae%e5%85%a5)

为了充分利用TypeScript及其智能感知，您应该将我们的类型导入到SveltKit项目附带的`app.d.ts`类型定义文件中。

```
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Supabase {
    Database: import('./DatabaseDefinitions').Database
    SchemaName: 'public'
  }

  // interface Locals {}
  interface PageData {
    session: import('@supabase/supabase-js').Session | null
  }
  // interface Error {}
  // interface Platform {}
}
```

### 基本设置 [*link*](#%e5%9f%ba%e6%9c%ac%e8%ae%be%e7%bd%ae)

现在，您可以通过检查 `$page.data`中的`session`对象来确定用户是否在客户端进行了身份验证。

```
<script>
  import { page } from '$app/stores'
</script>

{#if !$page.data.session}
<h1>I am not logged in</h1>
{:else}
<h1>Welcome {$page.data.session.user.email}</h1>
<p>I am logged in!</p>
{/if}
```

## 使用RLS获取客户端数据 [*link*](#%e4%bd%bf%e7%94%a8rls%e8%8e%b7%e5%8f%96%e5%ae%a2%e6%88%b7%e7%ab%af%e6%95%b0%e6%8d%ae)

为了使[行级别安全](/docs/learn/auth-deep-dive/auth-row-level-security)在客户端获取数据时正常工作，您需要确保从 `$lib/db`导入 `{ supabaseClient }`，并仅在 `$page.data`中定义了客户端会话后才运行查询：

```
<script>
  import { supabaseClient } from '$lib/db'
  import { page } from '$app/stores'

  let loadedData = []
  async function loadData() {
    const { data } = await supabaseClient.from('test').select('*').limit(20)
    loadedData = data
  }

  $: if ($page.data.session) {
    loadData()
  }
</script>

{#if $page.data.session}
<p>client-side data fetching with RLS</p>
<pre>{JSON.stringify(loadedData, null, 2)}</pre>
{/if}
```

## 使用RLS获取服务器端数据 [*link*](#%e4%bd%bf%e7%94%a8rls%e8%8e%b7%e5%8f%96%e6%9c%8d%e5%8a%a1%e5%99%a8%e7%ab%af%e6%95%b0%e6%8d%ae)

```
<script>
  /** @type {import('./$types').PageData} */
  export let data
  $: ({ user, tableData } = data)
</script>

<div>Protected content for {user.email}</div>
<pre>{JSON.stringify(tableData, null, 2)}</pre>
<pre>{JSON.stringify(user, null, 2)}</pre>
```

要使[row-level security](/docs/learn/auth-deep-dive/auth-row-level-security)在服务器环境中工作，您需要使用 `getSupabase`帮助器来检查用户是否经过身份验证。助手需要 `event` 并返回 `session` 和 `supabaseClient`：

```
import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async (event) => {
  const { session, supabaseClient } = await getSupabase(event)
  if (!session) {
    throw redirect(303, '/')
  }
  const { data: tableData } = await supabaseClient.from('test').select('*')

  return {
    user: session.user,
    tableData,
  }
}
```

## 保护API路由 [*link*](#%e4%bf%9d%e6%8a%a4api%e8%b7%af%e7%94%b1)

包装API路由以检查用户是否具有有效会话。如果他们未登录，则会话为 `null`。

```
import type { RequestHandler } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { json, redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
  const { session, supabaseClient } = await getSupabase(event)
  if (!session) {
    throw redirect(303, '/')
  }
  const { data } = await supabaseClient.from('test').select('*')

  return json({ data })
}
```

如果您在没有有效会话cookie的情况下访问`/api/protected-route`，将得到303响应。

## 保护措施 [*link*](#%e4%bf%9d%e6%8a%a4%e6%8e%aa%e6%96%bd)

包装操作以检查用户是否具有有效会话。如果他们未登录，则会话为 `null`。

```
import type { Actions } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, invalid } from '@sveltejs/kit'

export const actions: Actions = {
  createPost: async (event) => {
    const { request } = event
    const { session, supabaseClient } = await getSupabase(event)
    if (!session) {
      // the user is not signed in
      throw error(403, { message: 'Unauthorized' })
    }
    // we are save, let the user create the post
    const formData = await request.formData()
    const content = formData.get('content')

    const { error: createPostError, data: newPost } = await supabaseClient
      .from('posts')
      .insert({ content })

    if (createPostError) {
      return invalid(500, {
        supabaseErrorMessage: createPostError.message,
      })
    }
    return {
      newPost,
    }
  },
}
```

如果您尝试提交带有操作的表单 `?/createPost`如果没有有效的会话cookie，您将得到403错误响应。

## 保存和删除会话 [*link*](#%e4%bf%9d%e5%ad%98%e5%92%8c%e5%88%a0%e9%99%a4%e4%bc%9a%e8%af%9d)

```
import type { Actions } from './$types'
import { invalid, redirect } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const actions: Actions = {
  signin: async (event) => {
    const { request, cookies, url } = event
    const { session, supabaseClient } = await getSupabase(event)
    const formData = await request.formData()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return invalid(400, {
          error: 'Invalid credentials.',
          values: {
            email,
          },
        })
      }
      return invalid(500, {
        error: 'Server error. Try again later.',
        values: {
          email,
        },
      })
    }

    throw redirect(303, '/dashboard')
  },

  signout: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    await supabaseClient.auth.signOut()
    throw redirect(303, '/')
  },
}
```

## 保护多条路线 [*link*](#%e4%bf%9d%e6%8a%a4%e5%a4%9a%e6%9d%a1%e8%b7%af%e7%ba%bf)

为了避免在每条路由中写入相同的身份验证逻辑，可以使用句柄钩子同时保护多条路由。

```
import type { RequestHandler } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect, error } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // protect requests to all routes that start with /protected-routes
  if (event.url.pathname.startsWith('/protected-routes')) {
    const { session, supabaseClient } = await getSupabase(event)

    if (!session) {
      throw redirect(303, '/')
    }
  }

  // protect POST requests to all routes that start with /protected-posts
  if (event.url.pathname.startsWith('/protected-posts') && event.request.method === 'POST') {
    const { session, supabaseClient } = await getSupabase(event)

    if (!session) {
      throw error(303, '/')
    }
  }

  return resolve(event)
}
```

## 从0.7.x迁移到0.8 [*link*](#migration)

### 设置Supabase客户端 [*link*](#migration-set-up-supabase-client)

```
import { createClient } from '@supabase/supabase-js'
import { setupSupabaseHelpers } from '@supabase/auth-helpers-sveltekit'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'
// or use the static env

// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
  persistSession: false,
  autoRefreshToken: false,
})

setupSupabaseHelpers({
  supabaseClient,
  cookieOptions: {
    secure: !dev,
  },
})
```

```
import { createClient } from '@supabase/auth-helpers-sveltekit'
import { env } from '$env/dynamic/public'
// or use the static env

// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)
```

### 初始化客户端 [*link*](#migration-initialize-client)

```
<script lang="ts">
  // make sure the supabase instance is initialized on the client
  import '$lib/db'
  import { startSupabaseSessionSync } from '@supabase/auth-helpers-sveltekit'
  import { page } from '$app/stores'
  import { invalidateAll } from '$app/navigation'

  // this sets up automatic token refreshing
  startSupabaseSessionSync({
    page,
    handleRefresh: () => invalidateAll(),
  })
</script>

<slot />
```

```
<script>
  import { supabaseClient } from '$lib/db'
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'

  onMount(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidate('supabase:auth')
    })

    return () => {
      subscription.unsubscribe()
    }
  })
</script>

<slot />
```

### 设置挂钩 [*link*](#migration-set-up-hooks)

```
// make sure the supabase instance is initialized on the server
import '$lib/db'
import { dev } from '$app/environment'
import { auth } from '@supabase/auth-helpers-sveltekit/server'

export const handle = auth()
```

**使用其他句柄方法的可选***if*

```
// make sure the supabase instance is initialized on the server
import '$lib/db'
import { dev } from '$app/environment'
import { auth } from '@supabase/auth-helpers-sveltekit/server'
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(auth(), yourHandler)
```

```
// make sure the supabase instance is initialized on the server
import '$lib/db'
```

```
// make sure the supabase instance is initialized on the client
import '$lib/db'
```

### 键入 [*link*](#migration-typings)

```
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    session: import('@supabase/auth-helpers-sveltekit').SupabaseSession
  }

  interface PageData {
    session: import('@supabase/auth-helpers-sveltekit').SupabaseSession
  }

  // interface Error {}
  // interface Platform {}
}
```

```
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Supabase {
    Database: import('./DatabaseDefinitions').Database
    SchemaName: 'public'
  }

  // interface Locals {}
  interface PageData {
    session: import('@supabase/auth-helpers-sveltekit').SupabaseSession
  }
  // interface Error {}
  // interface Platform {}
}
```

### withPageAuth [*link*](#migration-with-page-auth)

```
<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ tableData, user } = data)
</script>

<div>Protected content for {user.email}</div>
<p>server-side fetched data with RLS:</p>
<pre>{JSON.stringify(tableData, null, 2)}</pre>
<p>user:</p>
<pre>{JSON.stringify(user, null, 2)}</pre>
```

```
import { withAuth } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = withAuth(async ({ session, getSupabaseClient }) => {
  if (!session.user) {
    throw redirect(303, '/')
  }

  const { data: tableData } = await getSupabaseClient().from('test').select('*')
  return { tableData, user: session.user }
})
```

```
<script>
  /** @type {import('./$types').PageData} */
  export let data
  $: ({ user, tableData } = data)
</script>

<div>Protected content for {user.email}</div>
<pre>{JSON.stringify(tableData, null, 2)}</pre>
<pre>{JSON.stringify(user, null, 2)}</pre>
```

```
// src/routes/profile/+page.ts
import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async (event) => {
  const { session, supabaseClient } = await getSupabase(event)
  if (!session) {
    throw redirect(303, '/')
  }
  const { data: tableData } = await supabaseClient.from('test').select('*')

  return {
    user: session.user,
    tableData,
  }
}
```

### withApiAuth [*link*](#migration-with-api-auth)

```
import type { RequestHandler } from './$types'
import { withAuth } from '@supabase/auth-helpers-sveltekit'
import { json, redirect } from '@sveltejs/kit'

interface TestTable {
  id: string
  created_at: string
}

export const GET: RequestHandler = withAuth(async ({ session, getSupabaseClient }) => {
  if (!session.user) {
    throw redirect(303, '/')
  }

  const { data } = await getSupabaseClient().from<TestTable>('test').select('*')

  return json({ data })
})
```

```
import type { RequestHandler } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { json, redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
  const { session, supabaseClient } = await getSupabase(event)
  if (!session) {
    throw redirect(303, '/')
  }
  const { data } = await supabaseClient.from('test').select('*')

  return json({ data })
}
```

## 从0.6.11及以下迁移到0.7.0 [*link*](#migration-0-7)

此库的最新0.7.0版本中有许多突破性的更改。

### 环境变量前缀 [*link*](#%e7%8e%af%e5%a2%83%e5%8f%98%e9%87%8f%e5%89%8d%e7%bc%80)

环境变量前缀现在是`PUBLIC_`而不是`VITE_`（例如，`VITE_SUPABASE_URL`现在是`BUBLIC_SUPABASE_URL`）。

### 设置Supabase客户端 [*link*](#migration-set-up-supabase-client-0-7)

```
import { createSupabaseClient } from '@supabase/auth-helpers-sveltekit';

const { supabaseClient } = createSupabaseClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export { supabaseClient };
```

```
import { createClient } from '@supabase/supabase-js'
import { setupSupabaseHelpers } from '@supabase/auth-helpers-sveltekit'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'
// or use the static env

// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
  persistSession: false,
  autoRefreshToken: false,
})

setupSupabaseHelpers({
  supabaseClient,
  cookieOptions: {
    secure: !dev,
  },
})
```

### 初始化客户端 [*link*](#migration-initialize-client-0-7)

```
<script>
  import { session } from '$app/stores'
  import { supabaseClient } from '$lib/db'
  import { SupaAuthHelper } from '@supabase/auth-helpers-svelte'
</script>

<SupaAuthHelper {supabaseClient} {session}>
  <slot />
</SupaAuthHelper>
```

不再需要`@supabase/auth-helpers-svelte`库，因为 `@supabase/auth-helpers-sveltekit` 库处理所有客户端代码。

```
<script lang="ts">
  // make sure the supabase instance is initialized on the client
  import '$lib/db'
  import { startSupabaseSessionSync } from '@supabase/auth-helpers-sveltekit'
  import { page } from '$app/stores'
  import { invalidateAll } from '$app/navigation'

  // this sets up automatic token refreshing
  startSupabaseSessionSync({
    page,
    handleRefresh: () => invalidateAll(),
  })
</script>

<slot />
```

### 设置挂钩 [*link*](#migration-set-up-hooks-0-7)

```
import { handleAuth } from '@supabase/auth-helpers-sveltekit'
import type { GetSession, Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

export const handle: Handle = sequence(...handleAuth())

export const getSession: GetSession = async (event) => {
  const { user, accessToken, error } = event.locals
  return {
    user,
    accessToken,
    error,
  }
}
```

```
// make sure the supabase instance is initialized on the server
import '$lib/db'
import { dev } from '$app/environment'
import { auth } from '@supabase/auth-helpers-sveltekit/server'

export const handle = auth()
```

**使用其他句柄方法的可选***if*

```
// make sure the supabase instance is initialized on the server
import '$lib/db'
import { dev } from '$app/environment'
import { auth } from '@supabase/auth-helpers-sveltekit/server'
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(auth(), yourHandler)
```

### 键入 [*link*](#migration-typings-0-7)

```
/// <reference types="@sveltejs/kit" />
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  interface UserSession {
    user: import('@supabase/supabase-js').User
    accessToken?: string
  }

  interface Locals extends UserSession {
    error: import('@supabase/supabase-js').ApiError
  }

  interface Session extends UserSession {}

  // interface Platform {}
  // interface Stuff {}
}
```

```
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    session: import('@supabase/auth-helpers-sveltekit').SupabaseSession
  }

  interface PageData {
    session: import('@supabase/auth-helpers-sveltekit').SupabaseSession
  }

  // interface Error {}
  // interface Platform {}
}
```

### 检查客户端上的用户 [*link*](#%e6%a3%80%e6%9f%a5%e5%ae%a2%e6%88%b7%e7%ab%af%e4%b8%8a%e7%9a%84%e7%94%a8%e6%88%b7)

```
<script>
  import { session } from '$app/stores'
</script>

{#if !$session.user}
<h1>I am not logged in</h1>
{:else}
<h1>Welcome {$session.user.email}</h1>
<p>I am logged in!</p>
{/if}
```

```
<script>
  import { page } from '$app/stores'
</script>

{#if !$page.data.session.user}
<h1>I am not logged in</h1>
{:else}
<h1>Welcome {$page.data.session.user.email}</h1>
<p>I am logged in!</p>
{/if}
```

### withPageAuth [*link*](#withpageauth)

```
<script lang="ts" context="module">
  import { supabaseServerClient, withPageAuth } from '@supabase/auth-helpers-sveltekit'
  import type { Load } from './__types/protected-page'

  export const load: Load = async ({ session }) =>
    withPageAuth(
      {
        redirectTo: '/',
        user: session.user,
      },
      async () => {
        const { data } = await supabaseServerClient(session.accessToken).from('test').select('*')
        return { props: { data, user: session.user } }
      }
    )
</script>

<script>
  export let data
  export let user
</script>

<div>Protected content for {user.email}</div>
<p>server-side fetched data with RLS:</p>
<pre>{JSON.stringify(data, null, 2)}</pre>
<p>user:</p>
<pre>{JSON.stringify(user, null, 2)}</pre>
```

```
<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  $: ({ tableData, user } = data)
</script>

<div>Protected content for {user.email}</div>
<p>server-side fetched data with RLS:</p>
<pre>{JSON.stringify(tableData, null, 2)}</pre>
<p>user:</p>
<pre>{JSON.stringify(user, null, 2)}</pre>
```

```
import { withAuth } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = withAuth(async ({ session, getSupabaseClient }) => {
  if (!session.user) {
    throw redirect(303, '/')
  }

  const { data: tableData } = await getSupabaseClient().from('test').select('*')
  return { tableData, user: session.user }
})
```

### withApiAuth [*link*](#withapiauth)

```
import { supabaseServerClient, withApiAuth } from '@supabase/auth-helpers-sveltekit'
import type { RequestHandler } from './__types/protected-route'

interface TestTable {
  id: string
  created_at: string
}

interface GetOutput {
  data: TestTable[]
}

export const GET: RequestHandler<GetOutput> = async ({ locals, request }) =>
  withApiAuth({ user: locals.user }, async () => {
    // Run queries with RLS on the server
    const { data } = await supabaseServerClient(request).from('test').select('*')

    return {
      status: 200,
      body: { data },
    }
  })
```

```
import type { RequestHandler } from './$types';
import { withAuth } from '@supabase/auth-helpers-sveltekit';
import { json, redirect } from '@sveltejs/kit';

interface TestTable {
  id: string;
  created_at: string;
}

export const GET: RequestHandler = withAuth(async ({ session, getSupabaseClient }) => {
  if (!session.user) {
    throw redirect(303, '/');
  }

  const { data } = await getSupabaseClient()
    .from<TestTable>('test')
    .select('*');

  return json({ data });
);
```

## 其他链接 [*link*](#%e5%85%b6%e4%bb%96%e9%93%be%e6%8e%a5)

* [身份验证帮助程序源代码](https://github.com/supabase/auth-helpers)
* [SveltKit示例](https://github.com/supabase/auth-helpers/tree/main/examples/sveltekit)
* [SveltKit电子邮件/密码示例](https://github.com/supabase/auth-helpers/tree/main/examples/sveltekit-email-password)
* [SveltKit Magiclink示例](https://github.com/supabase/auth-helpers/tree/main/examples/sveltekit-magic-link)

---

[*navigate\_before* 使用Next.js进行Supabase认证](/docs/app/development_guide/auth/auth-helpers/nextjs/)

[Supabase Remix认证 *navigate\_next*](/docs/app/development_guide/auth/auth-helpers/remix/)