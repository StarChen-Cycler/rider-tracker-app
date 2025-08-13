# 快速入门: Nuxt 3 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-nuxt-3/
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

# 快速入门: Nuxt 3

![](../../img/user-management-demo.png)

### Github [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/supabase/supabase/tree/master/examples/user-management/nuxt3-user-management)。

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们开始从头开始构建Vue 3应用程序。

### 初始化一个Nuxt 3应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aanuxt-3%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用[`nuxi init`](https://v3.nuxtjs.org/getting-started/quick-start/)来创建一个名为`nuxt-user-management`的应用程序。

```
npx nuxi init nuxt-user-management

cd nuxt-user-management
```

然后让我们安装唯一的额外依赖：[NuxtSupabase](https://supabase.nuxtjs.org/)。我们只需要将NuxtSupabase作为一个开发依赖项导入。

```
npm install @nuxtjs/supabase --save-dev
```

最后，我们要把环境变量保存在`.env`中。
我们所需要的是API URL和你[早些时候]复制的`anon`密钥（#get-theapi-keys）。

```
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
```

这些变量将暴露在浏览器上，这完全没有问题，因为我们的数据库已经启用了[行级安全](/docs/app/development_guide/auth/auth/#row-level-security)。
关于[NuxtSupabase](https://supabase.nuxtjs.org/)的神奇之处在于，为了开始使用Supabase，我们只需要设置环境变量即可。
不需要初始化Supabase。该库将自动处理它。

还有一个可选的步骤是更新CSS文件`assets/main.css`以使应用程序看起来漂亮。
你可以找到这个文件的全部内容[这里](https://github.com/supabase-community/nuxt3-quickstarter/blob/main/assets/main.css)。

```
import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  css: ['@/assets/main.css'],
})
```

### 设置Auth组件 [*link*](#%e8%ae%be%e7%bd%aeauth%e7%bb%84%e4%bb%b6)

让我们建立一个Vue组件来管理登录和注册。我们将使用Magic Links，所以用户可以用他们的电子邮件登录，而不需要使用密码。

```
<template>
  <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Nuxt 3</h1>
      <p class="description">Sign in via magic link with your email below</p>
      <div>
        <input class="inputField" type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading' : 'Send magic link'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
  const supabase = useSupabaseClient()

  const loading = ref(false)
  const email = ref('')
  const handleLogin = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signInWithOtp({ email: email.value })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      loading.value = false
    }
  }
</script>
```

### 用户状态 [*link*](#%e7%94%a8%e6%88%b7%e7%8a%b6%e6%80%81)

要访问用户信息，请使用Supabase Nuxt模块提供的可组合的[useSupabaseUser](https://supabase.nuxtjs.org/usage/composables/use-supabase-user)。

### 账号组件 [*link*](#%e8%b4%a6%e5%8f%b7%e7%bb%84%e4%bb%b6)

在用户登录后，我们可以让他们编辑他们的个人资料细节和管理他们的账户。
让我们为其创建一个新的组件，名为`Account.vue`。

```
<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="user.email" disabled />
    </div>
    <div>
      <label for="username">Username</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="website" v-model="website" />
    </div>

    <div>
      <input
        type="submit"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </form>
</template>

<script setup>
  const supabase = useSupabaseClient()

  const loading = ref(true)
  const username = ref('')
  const website = ref('')
  const avatar_path = ref('')

  loading.value = true
  const user = useSupabaseUser();
  let { data } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.value.id)
      .single()
  if (data) {
      username.value = data.username
      website.value = data.website
      avatar_path.value = data.avatar_url
  }
  loading.value = false

  async function updateProfile() {
      try {
          loading.value = true
          const user = useSupabaseUser();
          const updates = {
              id: user.value.id,
              username: username.value,
              website: website.value,
              avatar_url: avatar_path.value,
              updated_at: new Date(),
          }
          let { error } = await supabase.from('profiles').upsert(updates, {
              returning: 'minimal', // Don't return the value after inserting
          })
          if (error) throw error
      } catch (error) {
          alert(error.message)
      } finally {
          loading.value = false
      }
  }

  async function signOut() {
      try {
          loading.value = true
          let { error } = await supabase.auth.signOut()
          if (error) throw error
          user.value = null
      } catch (error) {
          alert(error.message)
      } finally {
          loading.value = false
      }
  }
</script>
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们已经有了所有的组件，让我们来更新`app.vue`。

```
<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <Account v-if="user" />
    <Auth v-else />
  </div>
</template>

<script setup>
  const user = useSupabaseUser()
</script>
```

一旦完成，在终端窗口运行这个程序。

```
npm run dev
```

然后打开浏览器到[localhost:3000](http://localhost:3000)，你应该看到完成的应用程序。

![](../../img/supabase-vue-3-demo.png)

## 个人照片 [*link*](#%e4%b8%aa%e4%ba%ba%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小组件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e7%bb%84%e4%bb%b6)

让我们为用户创建一个头像，以便他们可以上传个人资料照片。我们可以从创建一个新的组件开始。

```
<template>
  <div>
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="avatar image"
      style="width: 10em; height: 10em;"
    />
    <div v-else class="avatar no-image" :style="{ height: size, width: size }" />

    <div style="width: 10em; position: relative;">
      <label class="button primary block" for="single">
        {{ uploading ? "Uploading ..." : "Upload" }}
      </label>
      <input
        style="position: absolute; visibility: hidden;"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['path'])
  const { path } = toRefs(props)

  const emit = defineEmits(['update:path', 'upload'])

  const supabase = useSupabaseClient()

  const uploading = ref(false)
  const src = ref('')
  const files = ref()
  const downloadImage = async () => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path.value)
      if (error) throw error
      src.value = URL.createObjectURL(data)
    } catch (error) {
      console.error('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (evt) => {
    files.value = evt.target.files
    try {
      uploading.value = true
      if (!files.value || files.value.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = files.value[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) throw uploadError
      emit('update:path', filePath)
      emit('upload')
    } catch (error) {
      alert(error.message)
    } finally {
      uploading.value = false
    }
  }

  downloadImage()

  watch(path, () => {
    if (path.value) {
      downloadImage()
    }
  })
</script>
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们就可以把这个小部件添加到账号页面:

```
<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <Avatar v-model:path="avatar_path" @upload="updateProfile" />
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" :value="user.email" disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input id="username" type="text" v-model="username" />
    </div>
    <div>
      <label for="website">Website</label>
      <input id="website" type="website" v-model="website" />
    </div>

    <div>
      <input
        type="submit"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div>
      <button class="button block" @click="signOut" :disabled="loading">Sign Out</button>
    </div>
  </form>
</template>

<script setup>
  const supabase = useSupabaseClient()

  const loading = ref(true)
  const username = ref('')
  const website = ref('')
  const avatar_path = ref('')

  loading.value = true
  const user = useSupabaseUser();
  let { data } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.value.id)
      .single()
  if (data) {
      username.value = data.username
      website.value = data.website
      avatar_path.value = data.avatar_url
  }
  loading.value = false

  async function updateProfile() {
      try {
          loading.value = true
          const user = useSupabaseUser();
          const updates = {
              id: user.value.id,
              username: username.value,
              website: website.value,
              avatar_url: avatar_path.value,
              updated_at: new Date(),
          }
          let { error } = await supabase.from('profiles').upsert(updates, {
              returning: 'minimal', // Don't return the value after inserting
          })
          if (error) throw error
      } catch (error) {
          alert(error.message)
      } finally {
          loading.value = false
      }
  }

  async function signOut() {
      try {
          loading.value = true
          let { error } = await supabase.auth.signOut()
          if (error) throw error
      } catch (error) {
          alert(error.message)
      } finally {
          loading.value = false
      }
  }
</script>
```

你现在应该可以向Supabase Storage上传一张个人照片。

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 快速入门: Android Kotlin](/docs/app/quickstart/with-kotlin/)

[快速入门: Svelte *navigate\_next*](/docs/app/quickstart/with-svelte/)