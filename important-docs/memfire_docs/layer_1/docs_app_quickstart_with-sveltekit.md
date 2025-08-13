# 快速入门: SvelteKit | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-sveltekit/
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

# 快速入门: SvelteKit

![](../../img/user-management-demo.png)

### GitHub [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/supabase/supabase/tree/master/examples/user-management/sveltekit-user-management)。

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们从头开始构建Svelte应用程序。

### 初始化一个Svelte应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aasvelte%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用[SvelteKit骨架项目](https://kit.svelte.dev/docs)来初始化
一个名为 `supabase-sveltekit`的应用程序（本教程中你不需要TypeScript、ESLint、Prettier或Playwright）。

```
npm init svelte@next supabase-sveltekit
cd supabase-sveltekit
npm install
```

然后让我们安装唯一的额外依赖：[supabase-js](https://github.com/supabase/supabase-js)

```
npm install @supabase/supabase-js
```

最后，我们要把环境变量保存在`.env`中。
我们所需要的是`SUPABASE_URL`和你[早些时候]复制的`SUPABASE_KEY`键(#get-the-api-keys)。

```
PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_KEY"
```

现在我们已经有了API凭证，让我们创建一个辅助文件来初始化Supabase客户端。这些变量将被暴露在
在浏览器上，这完全没有问题，因为我们的数据库已经启用了[行级安全](/docs/app/development_guide/auth/auth/#row-level-security)。

```
import { createClient } from '@supabase/auth-helpers-sveltekit'
import { env } from '$env/dynamic/public'

export const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)
```

还有一个可选的步骤是更新CSS文件`public/global.css`以使应用程序看起来漂亮。
你可以找到这个文件的全部内容[这里](https://raw.githubusercontent.com/supabase/supabase/master/examples/user-management/svelte-user-management/src/app.css)。

### Supabase 认证帮助程序 [*link*](#supabase-%e8%ae%a4%e8%af%81%e5%b8%ae%e5%8a%a9%e7%a8%8b%e5%ba%8f)

SvelteKit是一个高度通用的框架，在构建时提供预渲染（SSG），在请求时提供服务器端渲染（SSR），API路由等。

在所有这些不同的环境中对你的用户进行认证是很有挑战性的，这就是为什么我们创建了Supabase Auth Helpers来使SvelteKit内的用户管理和数据获取尽可能简单。

安装SvelteKit的Auth助手。

```
npm install @supabase/auth-helpers-sveltekit
```

更新你的`src/routes/+layout.svelte`。

```
<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import './styles.css'

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth')
    })

    return () => {
      subscription.unsubscribe()
    }
  })
</script>

<div class="container" style="padding: 50px 0 100px 0">
  <slot />
</div>
```

创建一个新的`src/routes/+layout.ts`文件，在客户端处理会话。

```
import type { LayoutLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load: LayoutLoad = async (event) => {
  const { session } = await getSupabase(event)
  return { session }
}
```

创建一个新的`src/routes/+layout.server.ts`文件，在服务器端处理会话。

```
import type { LayoutServerLoad } from './$types'
import { getServerSession } from '@supabase/auth-helpers-sveltekit'

export const load: LayoutServerLoad = async (event) => {
  return {
    session: await getServerSession(event),
  }
}
```

请确保创建`src/hooks.client.ts`和`src/hooks.server.ts`，以便在客户端和服务器端启动auth帮助器。

```
import '$lib/supabaseClient'
```

```
import '$lib/supabaseClient'
```

### 设置一个登录组件 [*link*](#%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%99%bb%e5%bd%95%e7%bb%84%e4%bb%b6)

让我们建立一个Svelte组件来管理登录和注册。我们将使用Magic Links，这样用户就可以用他们的电子邮件登录，而无需使用密码。

```
<script lang="ts">
  import { supabase } from '$lib/supabaseClient'

  let loading = false
  let email: string

  const handleLogin = async () => {
    try {
      loading = true
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }
</script>

<form class="row flex-center flex" on:submit|preventDefault="{handleLogin}">
  <div class="col-6 form-widget">
    <h1 class="header">Supabase + SvelteKit</h1>
    <p class="description">Sign in via magic link with your email below</p>
    <div>
      <input class="inputField" type="email" placeholder="Your email" bind:value="{email}" />
    </div>
    <div>
      <input type="submit" class="button block" value={loading ? 'Loading' : 'Send magic link'}
      disabled={loading} />
    </div>
  </div>
</form>
```

### 账户组件 [*link*](#%e8%b4%a6%e6%88%b7%e7%bb%84%e4%bb%b6)

在用户登录后，他们需要能够编辑他们的个人资料细节和管理他们的账户。
创建一个新的`Account.svelte`组件来处理这个功能。

```
<script lang="ts">
  import { onMount } from 'svelte'
  import type { AuthSession } from '@supabase/supabase-js'
  import { supabase } from '$lib/supabaseClient'

  export let session: AuthSession

  let loading = false
  let username: string | null = null
  let website: string | null = null
  let avatarUrl: string | null = null

  onMount(() => {
    getProfile()
  })

  const getProfile = async () => {
    try {
      loading = true
      const { user } = session

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (data) {
        username = data.username
        website = data.website
        avatarUrl = data.avatar_url
      }

      if (error && status !== 406) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }

  async function updateProfile() {
    try {
      loading = true
      const { user } = session

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }

  async function signOut() {
    try {
      loading = true
      let { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }
</script>

<form class="form-widget" on:submit|preventDefault="{updateProfile}">
  <div>
    <label for="email">Email</label>
    <input id="email" type="text" value="{session.user.email}" disabled />
  </div>
  <div>
    <label for="username">Name</label>
    <input id="username" type="text" bind:value="{username}" />
  </div>
  <div>
    <label for="website">Website</label>
    <input id="website" type="website" bind:value="{website}" />
  </div>

  <div>
    <input type="submit" class="button block primary" value={loading ? 'Loading...' : 'Update'}
    disabled={loading} />
  </div>

  <div>
    <button class="button block" on:click="{signOut}" disabled="{loading}">Sign Out</button>
  </div>
</form>
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们有了所有的组件，让我们更新`src/routes/+page.svelte`。

```
<script>
  import { page } from '$app/stores'
  import Account from './Account.svelte'
  import Auth from './Auth.svelte'
</script>

<svelte:head>
  <title>Supabase + SvelteKit</title>
  <meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
<Auth />
{:else}
<Account session="{$page.data.session}" />
{/if}
```

一旦完成，在终端窗口运行这个程序。

```
npm run dev
```

然后打开浏览器到[localhost:5173](http://localhost:5173)，你应该看到完成的应用程序。

![](../../img/supabase-svelte-demo.png)

## 个人照片 [*link*](#%e4%b8%aa%e4%ba%ba%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小组件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e7%bb%84%e4%bb%b6)

让我们为用户创建一个头像，以便他们可以上传个人资料照片。我们可以从创建一个新的组件开始。

```
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { supabase } from '$lib/supabaseClient'

  export let size = 10
  export let url: string

  let avatarUrl: string | null = null
  let uploading = false
  let files: FileList

  const dispatch = createEventDispatcher()

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const url = URL.createObjectURL(data)
      avatarUrl = url
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  const uploadAvatar = async () => {
    try {
      uploading = true

      if (!files || files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      let { error } = await supabase.storage.from('avatars').upload(filePath, file)

      if (error) {
        throw error
      }

      url = filePath
      dispatch('upload')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      uploading = false
    }
  }

  $: if (url) downloadImage(url)
</script>

<div>
  {#if avatarUrl} <img src={avatarUrl} alt={avatarUrl ? 'Avatar' : 'No image'} class="avatar image"
  style="height: {size}em; width: {size}em;" /> {:else}
  <div class="avatar no-image" style="height: {size}em; width: {size}em;" />
  {/if}

  <div style="width: {size}em;">
    <label class="button primary block" for="single">
      {uploading ? 'Uploading ...' : 'Upload'}
    </label>
    <input
      style="visibility: hidden; position:absolute;"
      type="file"
      id="single"
      accept="image/*"
      bind:files
      on:change="{uploadAvatar}"
      disabled="{uploading}"
    />
  </div>
</div>
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们就可以把这个小部件添加到账号页面:

```
<script>
  // Import the new component
  import Avatar from './Avatar.svelte'
</script>

<form use:getProfile class="form-widget" on:submit|preventDefault="{updateProfile}">
  <!-- Add to body -->
  <Avatar bind:url="{avatarUrl}" size="{10}" on:upload="{updateProfile}" />

  <!-- Other form elements -->
</form>
```

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 快速入门: SolidJS](/docs/app/quickstart/with-solidjs/)

[概述 *navigate\_next*](/docs/app/development_guide/auth/auth/)