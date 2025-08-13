# 快速入门: SolidJS | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-solidjs/
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

# 快速入门: SolidJS

![](../../img/user-management-demo.png)

### GitHub [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/supabase/supabase/tree/master/examples/user-management/solid-user-management).

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们开始从头开始构建SolidJS应用程序。

### 初始化一个SolidJS应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aasolidjs%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用[Degit](https://github.com/Rich-Harris/degit)来初始化一个名为`supabase-solid`的应用程序。

```
npx degit solidjs/templates/ts supabase-solid
cd supabase-solid
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

还有一个可选的步骤是更新CSS文件`src/index.css`以使应用程序看起来漂亮。
你可以找到这个文件的全部内容[这里](https://raw.githubusercontent.com/supabase/supabase/master/examples/user-management/solid-user-management/src/index.css)

### 设置一个登录组件 [*link*](#%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%99%bb%e5%bd%95%e7%bb%84%e4%bb%b6)

让我们设置一个 SolidJS 组件来管理登录和注册。我们将使用Magic Links，因此用户可以用他们的电子邮件登录，而无需使用密码。

```
import { createSignal } from 'solid-js'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email: email() })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="row flex-center flex">
      <div class="col-6 form-widget" aria-live="polite">
        <h1 class="header">Supabase + SolidJS</h1>
        <p class="description">Sign in via magic link with your email below</p>
        <form class="form-widget" onSubmit={handleLogin}>
          <div>
            <label for="email">Email</label>
            <input
              id="email"
              class="inputField"
              type="email"
              placeholder="Your email"
              value={email()}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div>
            <button type="submit" class="button block" aria-live="polite">
              {loading() ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

### 账号页面 [*link*](#%e8%b4%a6%e5%8f%b7%e9%a1%b5%e9%9d%a2)

在用户登录后，我们可以让他们编辑他们的个人资料细节和管理他们的账户。

让我们为它创建一个新的组件，叫做`Account.tsx`。

```
import { AuthSession } from '@supabase/supabase-js'
import { Component, createEffect, createSignal } from 'solid-js'
import { supabase } from './supabaseClient'

interface Props {
  session: AuthSession;
}

const Account: Component<Props> = ({ session }) => {
  const [loading, setLoading] = createSignal(true)
  const [username, setUsername] = (createSignal < string) | (null > null)
  const [website, setWebsite] = (createSignal < string) | (null > null)
  const [avatarUrl, setAvatarUrl] = (createSignal < string) | (null > null)

  createEffect(() => {
    getProfile()
  })

  const getProfile = async () => {
    try {
      setLoading(true)
      const { user } = session

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: Event) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { user } = session

      const updates = {
        id: user.id,
        username: username(),
        website: website(),
        avatar_url: avatarUrl(),
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
      setLoading(false)
    }
  }

  return (
    <div aria-live="polite">
      <form onSubmit={updateProfile} class="form-widget">
        <div>Email: {session.user.email}</div>
        <div>
          <label for="username">Name</label>
          <input
            id="username"
            type="text"
            value={username() || ''}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </div>
        <div>
          <label for="website">Website</label>
          <input
            id="website"
            type="text"
            value={website() || ''}
            onChange={(e) => setWebsite(e.currentTarget.value)}
          />
        </div>
        <div>
          <button type="submit" class="button primary block" disabled={loading()}>
            {loading() ? 'Saving ...' : 'Update profile'}
          </button>
        </div>
        <button type="button" class="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </form>
    </div>
  )
}

export default Account
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们有了所有的组件，让我们更新`App.tsx`。

```
import { Component, createEffect, createSignal } from 'solid-js'
import { supabase } from './supabaseClient'
import { AuthSession } from '@supabase/supabase-js'
import Account from './Account'
import Auth from './Auth'

const App: Component = () => {
  const [session, setSession] = createSignal<AuthSession | null>(null)

  createEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  })

  return (
    <div class="container" style={{ padding: '50px 0 100px 0' }}>
      {!session() ? <Auth /> : <Account session={session()!} />}
    </div>
  )
}

export default App
```

一旦完成，在终端窗口运行这个程序。

```
npm start
```

然后打开浏览器到[localhost:3000](http://localhost:3000)，你应该看到完成的应用程序。

![](../../img/supabase-solidjs-demo.png)

## 个人照片 [*link*](#%e4%b8%aa%e4%ba%ba%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小组件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e7%bb%84%e4%bb%b6)

让我们为用户创建一个头像，以便他们可以上传个人资料照片。我们可以从创建一个新的组件开始。

```
import { Component, createEffect, createSignal, JSX } from 'solid-js'
import { supabase } from './supabaseClient'

interface Props {
  size: number
  url: string | null
  onUpload: (event: Event, filePath: string) => void
}

const Avatar: Component<Props> = (props) => {
  const [avatarUrl, setAvatarUrl] = createSignal<string | null>(null)
  const [uploading, setUploading] = createSignal(false)

  createEffect(() => {
    if (props.url) downloadImage(props.url)
  })

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  const uploadAvatar: JSX.EventHandler<HTMLInputElement, Event> = async (event) => {
    try {
      setUploading(true)

      const target = event.currentTarget
      if (!target?.files || target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      props.onUpload(event, filePath)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ width: props.size }} aria-live="polite">
      {avatarUrl() ? (
        <img
          src={avatarUrl()!}
          alt={avatarUrl() ? 'Avatar' : 'No image'}
          class="avatar image"
          style={{ height: `${props.size}px`, width: `${props.size}px` }}
        />
      ) : (
        <div
          class="avatar no-image"
          style={{ height: `${props.size}px`, width: `${props.size}px` }}
        />
      )}
      <div style={{ width: `${props.size}px` }}>
        <label class="button primary block" for="single">
          {uploading() ? 'Uploading ...' : 'Upload avatar'}
        </label>
        <span style="display:none">
          <input
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading()}
          />
        </span>
      </div>
    </div>
  )
}

export default Avatar
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们就可以把这个小部件添加到账号页面:

```
// Import the new component
import Avatar from './Avatar'

// ...

return (
  <form onSubmit={updateProfile} class="form-widget">
    {/* Add to the body */}
    <Avatar
      url={avatarUrl()}
      size={150}
      onUpload={(e: Event, url: string) => {
        setAvatarUrl(url)
        updateProfile(e)
      }}
    />
    {/* ... */}
  </div>
)
```

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 快速入门: RedwoodJS](/docs/app/quickstart/with-redwoodjs/)

[快速入门: SvelteKit *navigate\_next*](/docs/app/quickstart/with-sveltekit/)