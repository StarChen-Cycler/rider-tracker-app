# 快速入门: Svelte | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-svelte
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# 快速入门: Svelte

![](../../img/user-management-demo.png)

### GitHub [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/supabase/supabase/tree/master/examples/user-management/svelte-user-management)。

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们从头开始构建Svelte应用程序。

### 初始化一个Svelte应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aasvelte%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用Vite Svelte TypeScript模板来初始化一个名为`supabase-svelte`的应用程序。

```
npm create vite@latest supabase-svelte -- --template svelte-ts
cd supabase-svelte
npm install
```

然后让我们安装唯一的额外依赖：[supabase-js](https://github.com/supabase/supabase-js)

```
npm install @supabase/supabase-js
```

最后，我们要把环境变量保存在`.env`中。
我们所需要的是API URL和你[早些时候]复制的`anon`密钥（#get-theapi-keys）。

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

现在我们已经有了API凭证，让我们创建一个辅助文件来初始化Supabase客户端。这些变量将被暴露在
在浏览器上，这完全没有问题，因为我们的数据库已经启用了[行级安全](/docs/app/development_guide/auth/auth/#row-level-security)。

```
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

还有一个可选的步骤是更新CSS文件`src/app.css`以使应用程序看起来漂亮。
你可以找到这个文件的全部内容[这里](https://raw.githubusercontent.com/supabase/supabase/master/examples/user-management/svelte-user-management/src/app.css)。

### 设置一个登录组件 [*link*](#%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%99%bb%e5%bd%95%e7%bb%84%e4%bb%b6)

让我们建立一个Svelte组件来管理登录和注册。我们将使用Magic Links，这样用户就可以用他们的电子邮件登录，而无需使用密码。

```
<script lang="ts">
  import { supabase } from 'src/supabaseClient'

  let loading = false
  let email = ''

  const handleLogin = async () => {
    try {
      loading = true
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert('Check your email for login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }
</script>

<div class="row flex-center flex">
  <div class="col-6 form-widget" aria-live="polite">
    <h1 class="header">Supabase + Svelte</h1>
    <p class="description">Sign in via magic link with your email below</p>
    <form class="form-widget" on:submit|preventDefault="{handleLogin}">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          class="inputField"
          type="email"
          placeholder="Your email"
          bind:value="{email}"
        />
      </div>
      <div>
        <button type="submit" class="button block" aria-live="polite" disabled="{loading}">
          <span>{loading ? 'Loading' : 'Send magic link'}</span>
        </button>
      </div>
    </form>
  </div>
</div>
```

### 账号页面 [*link*](#%e8%b4%a6%e5%8f%b7%e9%a1%b5%e9%9d%a2)

在用户登录后，我们可以让他们编辑他们的个人资料细节和管理他们的账户。
让我们为其创建一个新的组件，名为`Account.svelte`。

```
<script lang="ts">
  import { onMount } from "svelte";
  import type { AuthSession } from "@supabase/supabase-js";
  import { supabase } from "../supabaseClient";

  export let session: AuthSession;

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
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        username = data.username
        website = data.website
        avatarUrl = data.avatar_url
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }

  const updateProfile = async () => {
    try {
      loading = true
      const { user } = session

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }
</script>

<form on:submit|preventDefault={updateProfile} class="form-widget">
  <div>Email: {session.user.email}</div>
  <div>
    <label for="username">Name</label>
    <input id="username" type="text" bind:value={username} />
  </div>
  <div>
    <label for="website">Website</label>
    <input id="website" type="text" bind:value={website} />
  </div>
  <div>
    <button type="submit" class="button primary block" disabled={loading}>
      {loading ? 'Saving ...' : 'Update profile'}
    </button>
  </div>
  <button type="button" class="button block" on:click={() => supabase.auth.signOut()}>
    Sign Out
  </button>
</form>
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们已经有了所有的组件，让我们来更新`App.svelte`。

```
<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from './supabaseClient'
  import type { AuthSession } from '@supabase/supabase-js'
  import Account from './lib/Account.svelte'
  import Auth from './lib/Auth.svelte'

  let session: AuthSession

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      session = data.session
    })

    supabase.auth.onAuthStateChange((_event, _session) => {
      session = _session
    })
  })
</script>

<div class="container" style="padding: 50px 0 100px 0">
  {#if !session}
  <Auth />
  {:else}
  <Account {session} />
  {/if}
</div>
```

一旦完成，在终端窗口运行这个程序。

```
npm run dev
```

然后打开浏览器到[localhost:5173](http://localhost:5173)，你应该看到完成的应用程序。

> ⚠️ 警告：Svelte使用Vite，默认端口为`5173`，Supabase使用`端口3000`。要改变supabase的重定向端口，请进入。`认证 > 设置`并将`网站网址`改为`localhost:5173`。

![](../../img/supabase-svelte-demo.png)

## 个人照片 [*link*](#%e4%b8%aa%e4%ba%ba%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小组件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e7%bb%84%e4%bb%b6)

让我们为用户创建一个头像，以便他们可以上传个人资料照片。我们可以从创建一个新的组件开始。

```
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { supabase } from '../supabaseClient'

  export let size: number
  export let url: string

  let avatarUrl: string = null
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

<div style="width: {size}px" aria-live="polite">
  {#if avatarUrl} <img src={avatarUrl} alt={avatarUrl ? 'Avatar' : 'No image'} class="avatar image"
  style="height: {size}px, width: {size}px" /> {:else}
  <div class="avatar no-image" style="height: {size}px, width: {size}px" />
  {/if}
  <div style="width: {size}px">
    <label class="button primary block" for="single">
      {uploading ? 'Uploading ...' : 'Upload avatar'}
    </label>
    <span style="display:none">
      <input
        type="file"
        id="single"
        accept="image/*"
        bind:files
        on:change="{uploadAvatar}"
        disabled="{uploading}"
      />
    </span>
  </div>
</div>
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们就可以把这个小部件添加到账号页面:

```
<script lang="ts">
  // Import the new component
  import Avatar from './Avatar.svelte'
</script>

<form on:submit|preventDefault="{updateProfile}" class="form-widget">
  <!-- Add to body -->
  <Avatar bind:url="{avatarUrl}" size="{150}" on:upload="{updateProfile}" />

  <!-- Other form elements -->
</form>
```

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 快速入门: Nuxt 3](/docs/app/quickstart/with-nuxt-3/)

[快速入门: Ionic Vue *navigate\_next*](/docs/app/quickstart/with-ionic-vue/)